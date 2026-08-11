package fit.iuh.edu.fashion.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.edu.fashion.dto.*;
import fit.iuh.edu.fashion.services.ai.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * AI Assistant Orchestrator — thin coordinator delegating to specialized services.
 * <p>
 * Delegates to:
 * - {@link AiModelService} — AI model interaction, health check, streaming
 * - {@link SizeGuideService} — Size guide tables
 * - {@link PromptBuilderService} — Prompt engineering
 * - {@link ProductSearchService} — Product search, filter, sort
 * - {@link UserIntentAnalyzer} — Intent classification
 * - {@link CatalogCacheService} — Catalog data caching
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AiAssistantService {

    private final AiModelService aiModelService;
    private final SizeGuideService sizeGuideService;
    private final PromptBuilderService promptBuilder;
    private final ProductSearchService productSearchService;
    private final UserIntentAnalyzer intentAnalyzer;
    private final CatalogCacheService catalogCacheService;
    private final ConversationMemoryService conversationMemory;
    private final UserContextService userContextService;
    private final InventoryRetrievalService inventoryRetrieval;
    private final OrderRetrievalService orderRetrieval;
    private final PromotionRetrievalService promotionRetrieval;
    private final OutfitRetrievalService outfitRetrieval;
    private final RagRetrievalService ragRetrieval;
    private final CartRetrievalService cartRetrieval;
    private final PaymentInfoService paymentInfo;
    private final ReviewRetrievalService reviewRetrieval;
    private final LoyaltyRetrievalService loyaltyRetrieval;
    private final PolicyInfoService policyInfo;
    private final ProductRetrievalGateway productRetrievalGateway;
    private final AiChatMetricsService metricsService;
    private final ObjectMapper objectMapper;

    private Map<UserIntentDTO.IntentType, IntentHandler> intentHandlers;

    @PostConstruct
    void initIntentHandlers() {
        intentHandlers = new EnumMap<>(UserIntentDTO.IntentType.class);
        intentHandlers.put(UserIntentDTO.IntentType.PRODUCT_SEARCH, this::handleProductIntent);
        intentHandlers.put(UserIntentDTO.IntentType.PRODUCT_RECOMMENDATION, this::handleProductIntent);
        intentHandlers.put(UserIntentDTO.IntentType.PRODUCT_COMPARE, this::handleCompareIntent);
        intentHandlers.put(UserIntentDTO.IntentType.SIZE_GUIDE, this::handleSizeGuideIntent);
        intentHandlers.put(UserIntentDTO.IntentType.INVENTORY_CHECK, this::handleInventoryIntent);
        intentHandlers.put(UserIntentDTO.IntentType.ORDER_SUPPORT, this::handleOrderIntent);
        intentHandlers.put(UserIntentDTO.IntentType.PROMOTION_QUERY, this::handlePromotionIntent);
        intentHandlers.put(UserIntentDTO.IntentType.OUTFIT_RECOMMENDATION, this::handleOutfitIntent);
        intentHandlers.put(UserIntentDTO.IntentType.CART_SUPPORT, this::handleCartIntent);
        intentHandlers.put(UserIntentDTO.IntentType.PAYMENT_SUPPORT, this::handlePaymentIntent);
        intentHandlers.put(UserIntentDTO.IntentType.REVIEW_QUERY, this::handleReviewIntent);
        intentHandlers.put(UserIntentDTO.IntentType.LOYALTY_QUERY, this::handleLoyaltyIntent);
        intentHandlers.put(UserIntentDTO.IntentType.POLICY_QUERY, this::handlePolicyIntent);
        intentHandlers.put(UserIntentDTO.IntentType.INFORMATION_QUERY, this::handleGeneralIntent);
        intentHandlers.put(UserIntentDTO.IntentType.GENERAL_CHAT, this::handleGeneralIntent);
    }

    // ==================== MAIN CHAT ENDPOINTS ====================

    /**
     * New local-first pipeline:
     * ChatRequest -> IntentResult -> RetrievalPlan -> RetrievedContext -> AnswerPlan -> ChatResponse.
     */
    public AiChatResponse chat(AiChatRequest request, Long userId) {
        long start = System.currentTimeMillis();
        PreparedChat prepared = prepareChat(request, userId);
        String answer;
        boolean error = false;

        try {
            if (prepared.plan.quickAnswer() != null) {
                answer = prepared.plan.quickAnswer();
            } else {
                answer = aiModelService.generate(prepared.plan.message(), prepared.plan.systemPrompt());
            }
        } catch (AiServiceUnavailableException e) {
            error = true;
            answer = prepared.plan.fallbackAnswer() != null ? prepared.plan.fallbackAnswer() : buildLmStudioErrorMessage();
        } catch (Exception e) {
            log.error("AI pipeline failed", e);
            error = true;
            answer = "Xin lỗi, tôi đang gặp sự cố kỹ thuật: " + safeError(e);
        }

        AiChatResponse response = buildResponse(prepared, answer, start, error);
        saveAssistantMessage(prepared.conversationId(), response);
        metricsService.record(response);
        return response;
    }

    public Flux<AiStreamEvent> chatStream(AiChatRequest request, Long userId) {
        long start = System.currentTimeMillis();
        PreparedChat prepared;
        try {
            prepared = prepareChat(request, userId);
        } catch (Exception e) {
            return Flux.just(
                    new AiStreamEvent("error", "Tin nhắn không hợp lệ."),
                    new AiStreamEvent("done", "[DONE]")
            );
        }

        AiStreamEvent meta = new AiStreamEvent("meta", buildStreamMeta(prepared));

        if (prepared.plan.quickAnswer() != null) {
            AiChatResponse response = buildResponse(prepared, prepared.plan.quickAnswer(), start, false);
            saveAssistantMessage(prepared.conversationId(), response);
            metricsService.record(response);
            return Flux.just(meta, new AiStreamEvent("chunk", response.getAnswer()), new AiStreamEvent("done", "[DONE]"));
        }

        StringBuilder full = new StringBuilder();
        return Flux.concat(
                Flux.just(meta),
                aiModelService.generateStream(prepared.plan.message(), prepared.plan.systemPrompt())
                        .map(chunk -> {
                            full.append(chunk);
                            return new AiStreamEvent("chunk", chunk);
                        })
                        .onErrorResume(e -> {
                            String fallback = prepared.plan.fallbackAnswer() != null ? prepared.plan.fallbackAnswer() : buildLmStudioErrorMessage();
                            full.setLength(0);
                            full.append(fallback);
                            return Flux.just(new AiStreamEvent("error", fallback));
                        }),
                Flux.defer(() -> {
                    AiChatResponse response = buildResponse(prepared, full.toString(), start, false);
                    saveAssistantMessage(prepared.conversationId(), response);
                    metricsService.record(response);
                    return Flux.just(new AiStreamEvent("done", "[DONE]"));
                })
        );
    }

    public Map<String, Object> metricsSnapshot() {
        return metricsService.snapshot();
    }

    private String buildStreamMeta(PreparedChat prepared) {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("messageId", prepared.messageId());
        meta.put("conversationId", prepared.conversationId());
        meta.put("intent", prepared.intent().getIntentType().name());
        meta.put("products", prepared.plan.products());
        meta.put("actions", prepared.plan.actions());
        meta.put("sources", prepared.plan.sources());
        return toJson(meta);
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    /**
     * Chat chính — phân tích intent rồi xử lý phù hợp (blocking, no memory)
     * NOTE: Không cache vì kết quả phụ thuộc tồn kho, khuyến mãi real-time
     */
    public AiChatResponse chat(String userMessage) {
        return chatWithMemory(userMessage, null);
    }

    /**
     * Chat với conversation memory (blocking) — hỗ trợ multi-turn context
     */
    public AiChatResponse chatWithMemory(String userMessage, String conversationId) {
        return chatWithMemory(userMessage, conversationId, null);
    }

    /**
     * Chat với conversation memory + user personalization (blocking)
     */
    public AiChatResponse chatWithMemory(String userMessage, String conversationId, Long userId) {
        log.info("Processing AI chat: {} (conversation: {}, user: {})", userMessage, conversationId, userId);

        try {
            if (conversationId != null) {
                conversationMemory.addMessage(conversationId, "user", userMessage);
            }

            UserIntentDTO intent = intentAnalyzer.analyzeIntent(userMessage);
            log.info("✓ Intent: type={}, product={}, brand={}",
                    intent.getIntentType(), intent.getProductType(), intent.getBrand());

            // SIZE_GUIDE trả static content, không cần gọi AI model
            if (intent.getIntentType() == UserIntentDTO.IntentType.SIZE_GUIDE) {
                AiChatResponse sizeGuide = sizeGuideService.provideSizeGuide(intent);
                saveAssistantMessage(conversationId, sizeGuide);
                return sizeGuide;
            }

            // Resolve intent → {systemPrompt, message}
            IntentContext ctx = resolveIntentContext(intent, userMessage, conversationId, userId);
            if (ctx == null) {
                // PRODUCT_COMPARE cần ít nhất 2 sản phẩm
                AiChatResponse resp = quickResponse("Xin lỗi, cần ít nhất 2 sản phẩm để so sánh.");
                saveAssistantMessage(conversationId, resp);
                return resp;
            }

            String response = aiModelService.generate(ctx.message, ctx.systemPrompt);
            AiChatResponse result = new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
            saveAssistantMessage(conversationId, result);
            return result;
        } catch (Exception e) {
            log.error("Error processing AI chat: ", e);
            return handleError(e);
        }
    }

    /**
     * Chat streaming với conversation memory — trả Flux<String> cho SSE endpoint
     */
    public Flux<String> chatStreamWithMemory(String userMessage, String conversationId) {
        return chatStreamWithMemory(userMessage, conversationId, null);
    }

    /**
     * Chat streaming với conversation memory + user personalization.
     * Dùng chung resolveIntentContext() với blocking path → DRY.
     */
    public Flux<String> chatStreamWithMemory(String userMessage, String conversationId, Long userId) {
        log.info("Processing streaming AI chat: {} (conversation: {}, user: {})", userMessage, conversationId, userId);

        try {
            if (conversationId != null) {
                conversationMemory.addMessage(conversationId, "user", userMessage);
            }

            UserIntentDTO intent = intentAnalyzer.analyzeIntent(userMessage);

            // SIZE_GUIDE trả static content — không cần streaming
            if (intent.getIntentType() == UserIntentDTO.IntentType.SIZE_GUIDE) {
                AiChatResponse sizeGuide = sizeGuideService.provideSizeGuide(intent);
                saveAssistantMessage(conversationId, sizeGuide);
                return Flux.just(sizeGuide.getResponse());
            }

            // Resolve intent → {systemPrompt, message}
            IntentContext ctx = resolveIntentContext(intent, userMessage, conversationId, userId);
            if (ctx == null) {
                String msg = "Xin lỗi, cần ít nhất 2 sản phẩm để so sánh.";
                if (conversationId != null) {
                    conversationMemory.addMessage(conversationId, "assistant", msg);
                }
                return Flux.just(msg);
            }

            // Stream response + thu thập full text để lưu memory
            final String convId = conversationId;
            StringBuilder fullResponse = new StringBuilder();

            return aiModelService.generateStream(ctx.message, ctx.systemPrompt)
                    .doOnNext(fullResponse::append)
                    .doOnComplete(() -> {
                        if (convId != null && !fullResponse.isEmpty()) {
                            conversationMemory.addMessage(convId, "assistant", fullResponse.toString());
                        }
                    });
        } catch (AiServiceUnavailableException e) {
            return Flux.just(buildLmStudioErrorMessage());
        } catch (Exception e) {
            log.error("Error in streaming chat: ", e);
            return Flux.just("Xin lỗi, đã xảy ra lỗi: " + e.getMessage());
        }
    }

    /**
     * Chat streaming (backward compatible — no memory).
     * @deprecated Sử dụng {@link #chatStreamWithMemory(String, String)} thay thế.
     */
    @Deprecated(since = "2.0", forRemoval = true)
    public Flux<String> chatStream(String userMessage) {
        return chatStreamWithMemory(userMessage, null);
    }

    /**
     * Xóa conversation
     */
    public void clearConversation(String conversationId) {
        conversationMemory.clearConversation(conversationId);
    }

    /**
     * Chat với ngữ cảnh sản phẩm
     */
    public AiChatResponse chatWithProductContext(String userMessage) {
        log.info("Processing product consultation: {}", userMessage);

        try {
            String systemPrompt = promptBuilder.getProductSystemPrompt();

            List<ProductCatalogDTO> related = null;
            if (productSearchService.containsProductKeyword(userMessage)) {
                related = productSearchService.findRelevantProducts(userMessage, 5);
            }

            String message = promptBuilder.buildEnhancedMessage(userMessage, related);
            String response = aiModelService.generate(message, systemPrompt);

            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error in product consultation: ", e);
            return handleError(e);
        }
    }

    /**
     * Chat với ngữ cảnh tùy chỉnh
     */
    public AiChatResponse chatWithContext(AiChatRequest request) {
        log.info("Processing AI chat with context: {}", request.getMessage());
        try {
            String response = aiModelService.generate(request.getMessage(), request.getContext());
            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error processing AI chat with context: ", e);
            return handleError(e);
        }
    }

    // ==================== SEARCH & CONSULTATION ====================

    /**
     * Tìm kiếm theo từ khóa
     */
    public AiChatResponse searchAndAdvise(String keyword, int limit) {
        log.info("Searching and advising for: {}", keyword);

        try {
            List<ProductCatalogDTO> products = catalogCacheService.searchProducts(keyword, limit);

            if (products.isEmpty()) {
                return suggestAlternatives(keyword);
            }

            String systemPrompt = promptBuilder.getProductSystemPrompt();
            String message = promptBuilder.buildKeywordSearchMessage(keyword, products);
            String response = aiModelService.generate(message, systemPrompt);

            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error in search and advise: ", e);
            return handleError(e);
        }
    }

    /**
     * Tư vấn theo thương hiệu
     */
    public AiChatResponse consultByBrand(Long brandId, String question, int limit) {
        log.info("Consulting for brand ID: {}", brandId);

        try {
            List<ProductCatalogDTO> products = catalogCacheService.getProductsByBrand(brandId, limit);
            if (products.isEmpty()) {
                return quickResponse("Xin lỗi, hiện tại thương hiệu này chưa có sản phẩm nào.");
            }

            String brandName = resolveBrandName(brandId);
            String systemPrompt = promptBuilder.getProductSystemPrompt();
            String message = promptBuilder.buildConsultationMessage("thương hiệu", brandName, question, products);
            String response = aiModelService.generate(message, systemPrompt);

            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error in brand consultation: ", e);
            return handleError(e);
        }
    }

    /**
     * Tư vấn theo danh mục
     */
    public AiChatResponse consultByCategory(Long categoryId, String question, int limit) {
        log.info("Consulting for category ID: {}", categoryId);

        try {
            List<ProductCatalogDTO> products = catalogCacheService.getProductsByCategory(categoryId, limit);
            if (products.isEmpty()) {
                return quickResponse("Xin lỗi, danh mục này hiện chưa có sản phẩm nào.");
            }

            String categoryName = resolveCategoryName(categoryId);
            String systemPrompt = promptBuilder.getProductSystemPrompt();
            String message = promptBuilder.buildConsultationMessage("danh mục", categoryName, question, products);
            String response = aiModelService.generate(message, systemPrompt);

            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            log.error("Error in category consultation: ", e);
            return handleError(e);
        }
    }

    // ==================== INTENT CONTEXT RESOLUTION (SHARED) ====================

    /**
     * Record chứa systemPrompt + message đã build từ intent.
     * Dùng chung cho cả blocking và streaming path.
     */
    private record IntentContext(String systemPrompt, String message) {}

    private interface IntentHandler {
        AnswerPlan resolve(UserIntentDTO intent, String userMessage, String conversationId, Long userId);
    }

    private record PreparedChat(
            String messageId,
            String conversationId,
            String userMessage,
            UserIntentDTO intent,
            AnswerPlan plan
    ) {}

    private record AnswerPlan(
            String systemPrompt,
            String message,
            String quickAnswer,
            String fallbackAnswer,
            List<ProductCardDTO> products,
            List<AiChatResponse.Source> sources,
            List<AiChatResponse.QuickAction> actions
    ) {}

    public record AiStreamEvent(String event, String data) {}

    /**
     * Phân giải intent → context (systemPrompt + message).
     * Mỗi intent dùng system prompt RIÊNG — model nhỏ cần hướng dẫn rõ ràng.
     * Trả null nếu PRODUCT_COMPARE mà < 2 sản phẩm.
     */
    private IntentContext resolveIntentContext(UserIntentDTO intent, String userMessage,
                                               String conversationId, Long userId) {
        String systemPrompt;
        String message;

        switch (intent.getIntentType()) {
            case PRODUCT_SEARCH, PRODUCT_RECOMMENDATION -> {
                String ragCtx = ragRetrieval.hybridSearch(userMessage, intent, 8);
                systemPrompt = promptBuilder.getProductSystemPrompt();
                message = ragCtx + "\n\nCustomer question: " + userMessage;
            }
            case PRODUCT_COMPARE -> {
                List<ProductCatalogDTO> products = productSearchService.searchByIntent(intent);
                if (products.size() < 2) return null;
                systemPrompt = promptBuilder.getProductSystemPrompt();
                message = promptBuilder.buildCompareMessage(intent, products);
            }
            case INVENTORY_CHECK -> {
                String inventoryCtx = inventoryRetrieval.retrieveInventoryContext(intent);
                systemPrompt = promptBuilder.getInventorySystemPrompt();
                message = inventoryCtx + "\n\nCustomer question: " + userMessage;
            }
            case ORDER_SUPPORT -> {
                String orderCtx = intent.getOrderCode() != null
                        ? orderRetrieval.retrieveOrderByCode(intent.getOrderCode(), userId)
                        : orderRetrieval.retrieveRecentOrders(userId);
                systemPrompt = promptBuilder.getOrderSystemPrompt();
                message = orderCtx + "\n\nCustomer question: " + userMessage;
            }
            case PROMOTION_QUERY -> {
                String promoCtx = promotionRetrieval.retrieveActivePromotions();
                systemPrompt = promptBuilder.getPromotionSystemPrompt();
                message = promoCtx + "\n\nCustomer question: " + userMessage;
            }
            case OUTFIT_RECOMMENDATION -> {
                String outfitCtx = outfitRetrieval.retrieveOutfitSuggestion(intent);
                systemPrompt = promptBuilder.getOutfitSystemPrompt();
                message = outfitCtx + "\n\nCustomer question: " + userMessage;
            }
            case CART_SUPPORT -> {
                String cartCtx = cartRetrieval.retrieveCartContext(userId);
                systemPrompt = promptBuilder.getCartSystemPrompt();
                message = cartCtx + "\n\nCustomer question: " + userMessage;
            }
            case PAYMENT_SUPPORT -> {
                String paymentCtx = paymentInfo.retrievePaymentInfoForTopic(userMessage);
                systemPrompt = promptBuilder.getPaymentSystemPrompt();
                message = paymentCtx + "\n\nCustomer question: " + userMessage;
            }
            case REVIEW_QUERY -> {
                String reviewCtx = reviewRetrieval.retrieveReviewsByProductName(
                        intent.getSearchKeywords() != null && !intent.getSearchKeywords().isEmpty()
                                ? intent.getSearchKeywords() : userMessage);
                systemPrompt = promptBuilder.getReviewSystemPrompt();
                message = reviewCtx + "\n\nCustomer question: " + userMessage;
            }
            case LOYALTY_QUERY -> {
                String loyaltyCtx = loyaltyRetrieval.retrieveLoyaltyContext(userId);
                systemPrompt = promptBuilder.getLoyaltySystemPrompt();
                message = loyaltyCtx + "\n\nCustomer question: " + userMessage;
            }
            case POLICY_QUERY -> {
                String policyCtx = policyInfo.retrievePolicy(userMessage);
                systemPrompt = promptBuilder.getPolicySystemPrompt();
                message = policyCtx + "\n\nCustomer question: " + userMessage;
            }
            default -> {
                if (productSearchService.containsProductKeyword(userMessage.toLowerCase())) {
                    String ragCtx = ragRetrieval.hybridSearch(userMessage, intent, 8);
                    systemPrompt = promptBuilder.getProductSystemPrompt();
                    message = ragCtx + "\n\nCustomer question: " + userMessage;
                } else {
                    systemPrompt = promptBuilder.detectSystemPrompt(userMessage);
                    message = buildGeneralChatMessage(userMessage);
                }
            }
        }

        // Prepend conversation context + user context
        message = prependContext(message, conversationId, userId);
        return new IntentContext(systemPrompt, message);
    }

    // ==================== PRIVATE HELPERS ====================

    private void saveAssistantMessage(String conversationId, AiChatResponse response) {
        if (conversationId != null && response != null && !"error".equals(response.getModel())) {
            conversationMemory.addMessage(conversationId, "assistant", response.getAnswer());
        }
    }

    private PreparedChat prepareChat(AiChatRequest request, Long userId) {
        String userMessage = normalizeMessage(request);
        if (userMessage.isBlank() || userMessage.length() > 2000) {
            throw new IllegalArgumentException("Invalid chat message");
        }

        String conversationId = request != null && request.getConversationId() != null && !request.getConversationId().isBlank()
                ? request.getConversationId().trim()
                : "conv_" + UUID.randomUUID();
        String messageId = "msg_" + UUID.randomUUID();

        conversationMemory.addMessage(conversationId, "user", userMessage);
        UserIntentDTO intent = intentAnalyzer.analyzeIntent(userMessage);
        IntentHandler handler = intentHandlers.getOrDefault(intent.getIntentType(), this::handleGeneralIntent);
        AnswerPlan plan = handler.resolve(intent, userMessage, conversationId, userId);
        return new PreparedChat(messageId, conversationId, userMessage, intent, plan);
    }

    private String normalizeMessage(AiChatRequest request) {
        if (request == null || request.getMessage() == null) return "";
        return unwrapJsonString(request.getMessage()).trim();
    }

    private AiChatResponse buildResponse(PreparedChat prepared, String answer, long start, boolean error) {
        long now = System.currentTimeMillis();
        return AiChatResponse.builder()
                .response(answer)
                .answer(answer)
                .model(error ? "error" : aiModelService.getModelName())
                .timestamp(now)
                .messageId(prepared.messageId())
                .conversationId(prepared.conversationId())
                .intent(prepared.intent().getIntentType().name())
                .sources(prepared.plan.sources())
                .products(prepared.plan.products())
                .actions(prepared.plan.actions())
                .latencyMs(now - start)
                .error(error)
                .build();
    }

    private AnswerPlan handleProductIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        ProductRetrievalGateway.RetrievedProducts retrieved = productRetrievalGateway.retrieve(userMessage, intent, 6);
        return generativePlan(
                promptBuilder.getProductSystemPrompt(),
                retrieved.context() + "\n\nCustomer question: " + userMessage,
                "Hiện chưa thể kết nối mô hình AI. Bạn vẫn có thể xem các sản phẩm phù hợp bên dưới.",
                retrieved.productCards(),
                List.of(source("rag", "Sản phẩm từ catalog", "/products")),
                productActions()
        );
    }

    private AnswerPlan handleCompareIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        List<ProductCatalogDTO> products = productRetrievalGateway.searchByIntent(intent, 5);
        if (products.size() < 2) {
            return quickPlan("Bạn vui lòng nêu ít nhất 2 sản phẩm hoặc tiêu chí cụ thể để mình so sánh chính xác hơn.", "PRODUCT_COMPARE");
        }
        return generativePlan(
                promptBuilder.getProductSystemPrompt(),
                promptBuilder.buildCompareMessage(intent, products),
                "Mình đã tìm thấy sản phẩm liên quan nhưng hiện chưa kết nối được mô hình AI để so sánh chi tiết.",
                List.of(),
                List.of(source("catalog", "Sản phẩm so sánh", "/products")),
                productActions()
        );
    }

    private AnswerPlan handleSizeGuideIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        return quickPlan(sizeGuideService.provideSizeGuide(intent).getResponse(), "SIZE_GUIDE");
    }

    private AnswerPlan handleInventoryIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String ctx = inventoryRetrieval.retrieveInventoryContext(intent);
        return generativePlan(promptBuilder.getInventorySystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("inventory", "Tồn kho", "/products")), productActions());
    }

    private AnswerPlan handleOrderIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        if (userId == null) return loginRequiredPlan("Bạn cần đăng nhập để mình tra cứu đơn hàng của bạn.", "/login");
        String ctx = intent.getOrderCode() != null
                ? orderRetrieval.retrieveOrderByCode(intent.getOrderCode(), userId)
                : orderRetrieval.retrieveRecentOrders(userId);
        return generativePlan(promptBuilder.getOrderSystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("orders", "Đơn hàng của bạn", "/orders")), List.of(action("orders", "Xem đơn hàng", "Xem đơn hàng của tôi", "/orders")));
    }

    private AnswerPlan handlePromotionIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String answer = promotionRetrieval.retrieveActivePromotionAnswer();
        return new AnswerPlan(null, null, answer, answer, List.of(),
                List.of(source("promotions", "Khuy\u1ebfn m\u00e3i", "/products")), productActions());
    }

    private AnswerPlan handleOutfitIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String ctx = outfitRetrieval.retrieveOutfitSuggestion(intent);
        return generativePlan(promptBuilder.getOutfitSystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("outfit", "Gợi ý phối đồ", "/products")), productActions());
    }

    private AnswerPlan handleCartIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        if (userId == null) return loginRequiredPlan("Bạn cần đăng nhập để mình xem giỏ hàng của bạn.", "/login");
        String ctx = cartRetrieval.retrieveCartContext(userId);
        return generativePlan(promptBuilder.getCartSystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("cart", "Giỏ hàng", "/cart")), List.of(action("cart", "Mở giỏ hàng", "Xem giỏ hàng", "/cart")));
    }

    private AnswerPlan handlePaymentIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String ctx = paymentInfo.retrievePaymentInfoForTopic(userMessage);
        return generativePlan(promptBuilder.getPaymentSystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("payment", "Thanh toán", "/info/payment")), List.of(action("checkout", "Đi tới giỏ hàng", "Tôi muốn thanh toán", "/cart")));
    }

    private AnswerPlan handleReviewIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String query = intent.getSearchKeywords() != null && !intent.getSearchKeywords().isEmpty()
                ? intent.getSearchKeywords() : userMessage;
        String ctx = reviewRetrieval.retrieveReviewsByProductName(query);
        return generativePlan(promptBuilder.getReviewSystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("reviews", "Đánh giá sản phẩm", "/products")), productActions());
    }

    private AnswerPlan handleLoyaltyIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        if (userId == null) return loginRequiredPlan("Bạn cần đăng nhập để mình xem điểm thưởng của bạn.", "/login");
        String ctx = loyaltyRetrieval.retrieveLoyaltyContext(userId);
        return generativePlan(promptBuilder.getLoyaltySystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("loyalty", "Điểm thưởng", "/profile")), List.of(action("profile", "Xem hồ sơ", "Xem điểm thưởng", "/profile")));
    }

    private AnswerPlan handlePolicyIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        String ctx = policyInfo.retrievePolicy(userMessage);
        return generativePlan(promptBuilder.getPolicySystemPrompt(), ctx + "\n\nCustomer question: " + userMessage,
                ctx, List.of(), List.of(source("policy", "Chính sách cửa hàng", "/info/returns")), List.of(action("policy", "Xem chính sách", "Chính sách đổi trả", "/info/returns")));
    }

    private AnswerPlan handleGeneralIntent(UserIntentDTO intent, String userMessage, String conversationId, Long userId) {
        if (productSearchService.containsProductKeyword(userMessage.toLowerCase())) {
            return handleProductIntent(intent, userMessage, conversationId, userId);
        }
        return generativePlan(promptBuilder.detectSystemPrompt(userMessage), prependContext(userMessage, conversationId, userId),
                "Mình đang chưa kết nối được mô hình AI. Bạn có thể hỏi mình về sản phẩm, đơn hàng, thanh toán hoặc chính sách cửa hàng.",
                List.of(), List.of(source("assistant", "Fashion AI", "/ai-chatbot")), defaultActions());
    }

    private AnswerPlan generativePlan(String systemPrompt, String message, String fallback,
                                      List<ProductCardDTO> products,
                                      List<AiChatResponse.Source> sources,
                                      List<AiChatResponse.QuickAction> actions) {
        return new AnswerPlan(systemPrompt, message, null, fallback, products, sources, actions);
    }

    private AnswerPlan quickPlan(String answer, String sourceLabel) {
        return new AnswerPlan(null, null, answer, answer, List.of(), List.of(source("static", sourceLabel, "/ai-chatbot")), defaultActions());
    }

    private AnswerPlan loginRequiredPlan(String answer, String href) {
        return new AnswerPlan(null, null, answer, answer, List.of(), List.of(source("auth", "Yêu cầu đăng nhập", href)),
                List.of(action("login", "Đăng nhập", "Tôi muốn đăng nhập", href)));
    }

    private AiChatResponse.Source source(String type, String label, String href) {
        return AiChatResponse.Source.builder().type(type).label(label).href(href).build();
    }

    private AiChatResponse.QuickAction action(String id, String label, String message, String href) {
        return AiChatResponse.QuickAction.builder().id(id).label(label).message(message).href(href).build();
    }

    private List<AiChatResponse.QuickAction> productActions() {
        return List.of(
                action("products", "Xem sản phẩm", "Tìm sản phẩm bán chạy", "/products"),
                action("size", "Tư vấn size", "Tư vấn chọn size", null),
                action("promo", "Mã giảm giá", "Có mã giảm giá nào không?", null)
        );
    }

    private List<AiChatResponse.QuickAction> defaultActions() {
        return List.of(
                action("recommend", "Gợi ý sản phẩm", "Gợi ý sản phẩm phù hợp cho tôi", null),
                action("order", "Tra đơn hàng", "Xem đơn hàng của tôi", "/orders"),
                action("policy", "Chính sách", "Chính sách đổi trả như thế nào?", null)
        );
    }

    private String unwrapJsonString(String message) {
        String trimmed = message.trim();
        if (trimmed.length() >= 2 && trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            return trimmed.substring(1, trimmed.length() - 1)
                    .replace("\\\"", "\"")
                    .replace("\\n", "\n")
                    .replace("\\r", "\r");
        }
        return message;
    }

    private String safeError(Exception e) {
        return e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
    }

    /**
     * Prepend user context + conversation history vào message
     */
    private String prependContext(String message, String conversationId, Long userId) {
        StringBuilder prefix = new StringBuilder();

        if (userId != null) {
            try {
                String userCtx = userContextService.buildUserContext(userId);
                if (!userCtx.isEmpty()) {
                    prefix.append(userCtx);
                }
            } catch (Exception e) {
                log.warn("Failed to build user context: {}", e.getMessage());
            }
        }

        if (conversationId != null) {
            String convCtx = conversationMemory.buildContextString(conversationId);
            if (!convCtx.isEmpty()) {
                prefix.append(convCtx);
            }
        }

        if (prefix.isEmpty()) return message;
        return prefix + message;
    }

    private String buildGeneralChatMessage(String userMessage) {
        if (productSearchService.containsProductKeyword(userMessage.toLowerCase())) {
            List<ProductCatalogDTO> related = productSearchService.findRelevantProducts(userMessage, 8);
            return promptBuilder.buildEnhancedMessage(userMessage, related);
        }
        return userMessage;
    }

    private AiChatResponse suggestAlternatives(String keyword) {
        try {
            List<ProductCatalogDTO> alternatives = catalogCacheService.getTopProducts(5);
            String systemPrompt = promptBuilder.getProductSystemPrompt();
            String message = promptBuilder.buildSuggestionMessage(keyword, alternatives);
            String response = aiModelService.generate(message, systemPrompt);

            return new AiChatResponse(response, aiModelService.getModelName(), System.currentTimeMillis());
        } catch (Exception e) {
            return quickResponse("Xin lỗi, tôi không tìm thấy sản phẩm phù hợp với '" + keyword
                    + "'. Bạn có thể mô tả chi tiết hơn hoặc thử từ khóa khác không?");
        }
    }

    private String resolveBrandName(Long brandId) {
        return catalogCacheService.getCatalogData().getBrands().stream()
                .filter(b -> b.getId().equals(brandId))
                .findFirst()
                .map(CatalogDataDTO.BrandInfo::getName)
                .orElse("Unknown");
    }

    private String resolveCategoryName(Long categoryId) {
        return catalogCacheService.getCatalogData().getCategories().stream()
                .filter(c -> c.getId().equals(categoryId))
                .findFirst()
                .map(CatalogDataDTO.CategoryInfo::getName)
                .orElse("Unknown");
    }

    private AiChatResponse quickResponse(String message) {
        return new AiChatResponse(message, aiModelService.getModelName(), System.currentTimeMillis());
    }


    private AiChatResponse handleError(Exception e) {
        String errorMsg = e.getMessage() != null ? e.getMessage() : "";

        if (e instanceof AiServiceUnavailableException
                || errorMsg.contains("Connection refused")
                || errorMsg.contains("connect")) {
            return new AiChatResponse(buildLmStudioErrorMessage(), "error", System.currentTimeMillis());
        }

        return new AiChatResponse(
                "Xin lỗi, tôi đang gặp sự cố kỹ thuật: " + errorMsg,
                "error",
                System.currentTimeMillis()
        );
    }

    private String buildLmStudioErrorMessage() {
        return "❌ Không thể kết nối tới LM Studio!\n\n"
                + "Hướng dẫn khắc phục:\n"
                + "1. Mở LM Studio\n"
                + "2. Vào tab 'Local Server'\n"
                + "3. Chọn model: " + aiModelService.getModelName() + "\n"
                + "4. Click 'START SERVER'\n"
                + "5. Đảm bảo port là 1234\n\n"
                + "Sau đó thử lại!";
    }
}
