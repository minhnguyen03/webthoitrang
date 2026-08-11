package fit.iuh.edu.fashion.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.edu.fashion.dto.AiChatRequest;
import fit.iuh.edu.fashion.dto.AiChatResponse;
import fit.iuh.edu.fashion.dto.AiFeedbackRequest;
import fit.iuh.edu.fashion.models.AiFeedback;
import fit.iuh.edu.fashion.repositories.AiFeedbackRepository;
import fit.iuh.edu.fashion.security.CustomUserDetails;
import fit.iuh.edu.fashion.services.AiAssistantService;
import fit.iuh.edu.fashion.services.ai.AiModelService;
import fit.iuh.edu.fashion.services.ai.RagRetrievalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;
    private final AiModelService aiModelService;
    private final AiFeedbackRepository aiFeedbackRepository;
    private final RagRetrievalService ragRetrievalService;
    private final ObjectMapper objectMapper;

    /**
     * Endpoint chat đơn giản (blocking) — hỗ trợ conversation memory
     * POST /api/ai/chat?conversationId=...
     */
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @RequestBody(required = false) String body,
            @RequestParam(required = false) String conversationId) {
        AiChatRequest request = parseChatRequest(body, conversationId);
        String message = request.getMessage();
        if (message == null || message.isBlank() || message.length() > 2000) {
            return ResponseEntity.badRequest().body(
                    new AiChatResponse("Tin nhắn không hợp lệ (tối đa 2000 ký tự).", "error", System.currentTimeMillis()));
        }
        log.info("Received chat request: {} (conversation: {})", message.substring(0, Math.min(100, message.length())), conversationId);
        Long userId = getCurrentUserId();
        AiChatResponse response = aiAssistantService.chat(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint chat với ngữ cảnh sản phẩm
     * POST /api/ai/chat/product
     */
    @PostMapping("/chat/product")
    public ResponseEntity<AiChatResponse> chatProduct(@RequestBody String message) {
        log.info("Received product chat request: {}", message);
        AiChatResponse response = aiAssistantService.chatWithProductContext(message);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm và tư vấn sản phẩm
     * GET /api/ai/search?keyword=...&limit=10
     */
    @GetMapping("/search")
    public ResponseEntity<AiChatResponse> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Search request: keyword={}, limit={}", keyword, limit);
        AiChatResponse response = aiAssistantService.searchAndAdvise(keyword, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Tư vấn theo thương hiệu
     * GET /api/ai/brand/{brandId}?question=...&limit=10
     */
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<AiChatResponse> consultBrand(
            @PathVariable Long brandId,
            @RequestParam String question,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Brand consultation: brandId={}, question={}", brandId, question);
        AiChatResponse response = aiAssistantService.consultByBrand(brandId, question, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Tư vấn theo danh mục
     * GET /api/ai/category/{categoryId}?question=...&limit=10
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<AiChatResponse> consultCategory(
            @PathVariable Long categoryId,
            @RequestParam String question,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Category consultation: categoryId={}, question={}", categoryId, question);
        AiChatResponse response = aiAssistantService.consultByCategory(categoryId, question, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Health check cho AI service — lightweight ping, không gọi chat thật
     * GET /api/ai/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        boolean aiAvailable = aiModelService.isAvailable();
        boolean ragReady = ragRetrievalService.isVectorStoreReady();

        Map<String, Object> status = Map.of(
                "aiService", aiAvailable ? "running" : "unavailable",
                "model", aiModelService.getModelName(),
                "ragVectorStore", ragReady ? "ready" : "not_indexed",
                "indexedProducts", ragRetrievalService.getIndexedCount()
        );

        return aiAvailable
                ? ResponseEntity.ok(status)
                : ResponseEntity.status(503).body(status);
    }

    /**
     * RAG Vector Store status
     * GET /api/ai/rag/status
     */
    @GetMapping("/rag/status")
    public ResponseEntity<Map<String, Object>> ragStatus() {
        return ResponseEntity.ok(Map.of(
                "vectorStoreReady", ragRetrievalService.isVectorStoreReady(),
                "indexedProducts", ragRetrievalService.getIndexedCount(),
                "type", "SimpleVectorStore + ONNX Embedding"
        ));
    }

    /**
     * Test direct LM Studio - Bypass all caching and timeouts
     * GET /api/ai/test-direct?message=...
     */
    @GetMapping("/test-direct")
    public ResponseEntity<String> testDirect(@RequestParam(defaultValue = "Hello") String message) {
        log.info("Direct test to LM Studio: {}", message);
        long startTime = System.currentTimeMillis();
        
        try {
            AiChatResponse response = aiAssistantService.chatWithContext(
                AiChatRequest.builder().message(message).context(null).build()
            );
            
            long duration = System.currentTimeMillis() - startTime;
            
            return ResponseEntity.ok(String.format(
                "Response in %d ms:\n%s", 
                duration, 
                response.getResponse()
            ));
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Direct test failed after {} ms", duration, e);
            return ResponseEntity.status(500).body(
                String.format("Failed after %d ms: %s", duration, e.getMessage())
            );
        }
    }

    /**
     * Endpoint chat streaming (SSE) — response trả về từng chunk real-time.
     * Hỗ trợ tối đa 4096 tokens output với SSE keep-alive heartbeat.
     * GET /api/ai/chat/stream?message=...&conversationId=...
     */
    @GetMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStream(
            @RequestParam String message,
            @RequestParam(required = false) String conversationId) {
        if (message == null || message.isBlank() || message.length() > 2000) {
            return Flux.just(ServerSentEvent.<String>builder()
                    .event("error")
                    .data("Tin nhắn không hợp lệ (tối đa 2000 ký tự).")
                    .build());
        }
        log.info("Received streaming chat request: {} (conversation: {})",
                message.substring(0, Math.min(100, message.length())), conversationId);
        Long userId = getCurrentUserId();
        log.info("Streaming chat userId: {} (authenticated: {})", userId, userId != null);

        AiChatRequest request = AiChatRequest.builder()
                .message(message)
                .conversationId(conversationId)
                .stream(true)
                .build();

        Flux<ServerSentEvent<String>> responseStream = aiAssistantService
                .chatStream(request, userId)
                .map(event -> ServerSentEvent.<String>builder()
                        .event(event.event())
                        .data(encodeStreamData(event.event(), event.data()))
                        .build())
                .onErrorResume(e -> Flux.just(ServerSentEvent.<String>builder()
                        .event("error")
                        .data("Xin lỗi, AI đang gặp sự cố: " + e.getMessage())
                        .build()));

        // SSE keep-alive heartbeat mỗi 25 giây — giữ connection sống khi AI generate lâu
        Flux<ServerSentEvent<String>> heartbeat = Flux.interval(
                java.time.Duration.ofSeconds(25))
                .map(tick -> ServerSentEvent.<String>builder()
                        .comment("keep-alive")
                        .build());

        // Merge: heartbeat chạy song song, tự dừng khi responseStream complete
        return Flux.merge(responseStream, heartbeat)
                .takeUntil(sse -> "done".equals(sse.event()));
    }

    private String encodeStreamData(String event, String data) {
        if ("chunk".equals(event) || "error".equals(event)) {
            return encodeTextPayload(data);
        }
        return data;
    }

    private String encodeTextPayload(String text) {
        try {
            return objectMapper.writeValueAsString(Map.of("text", text == null ? "" : text));
        } catch (Exception e) {
            return "{\"text\":\"\"}";
        }
    }

    /**
     * Xóa conversation history
     * DELETE /api/ai/conversation/{conversationId}
     */
    @DeleteMapping("/conversation/{conversationId}")
    public ResponseEntity<String> clearConversation(@PathVariable String conversationId) {
        log.info("Clearing conversation: {}", conversationId);
        aiAssistantService.clearConversation(conversationId);
        return ResponseEntity.ok("Conversation cleared");
    }

    /**
     * Nhận feedback từ user cho AI response
     * POST /api/ai/feedback
     */
    @PostMapping("/feedback")
    public ResponseEntity<String> submitFeedback(@RequestBody AiFeedbackRequest request) {
        log.info("Received feedback: messageId={}, rating={}", request.getMessageId(), request.getRating());

        try {
            AiFeedback feedback = AiFeedback.builder()
                    .messageId(request.getMessageId())
                    .conversationId(request.getConversationId())
                    .userId(getCurrentUserId())
                    .rating(AiFeedback.Rating.valueOf(request.getRating()))
                    .comment(request.getComment())
                    .build();

            aiFeedbackRepository.save(feedback);
            return ResponseEntity.ok("Feedback saved");
        } catch (Exception e) {
            log.error("Error saving feedback: ", e);
            return ResponseEntity.badRequest().body("Invalid feedback: " + e.getMessage());
        }
    }

    /**
     * Thống kê feedback — cho admin dashboard
     * GET /api/ai/feedback/stats
     */
    @GetMapping("/feedback/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats() {
        long total = aiFeedbackRepository.countAll();
        long positive = aiFeedbackRepository.countPositive();
        long negative = aiFeedbackRepository.countNegative();
        double satisfactionRate = total > 0 ? (positive * 100.0 / total) : 0;

        return ResponseEntity.ok(Map.of(
                "total", total,
                "positive", positive,
                "negative", negative,
                "satisfactionRate", Math.round(satisfactionRate * 10) / 10.0
        ));
    }

    /**
     * Admin dashboard data for the Next AI operations page.
     * GET /api/ai/admin/dashboard
     */
    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        boolean aiAvailable = aiModelService.isAvailable();
        long total = aiFeedbackRepository.countAll();
        long positive = aiFeedbackRepository.countPositive();
        long negative = aiFeedbackRepository.countNegative();
        double satisfactionRate = total > 0 ? (positive * 100.0 / total) : 0;

        return ResponseEntity.ok(Map.of(
                "health", Map.of(
                        "aiService", aiAvailable ? "running" : "unavailable",
                        "model", aiModelService.getModelName(),
                        "ragVectorStore", ragRetrievalService.isVectorStoreReady() ? "ready" : "not_indexed",
                        "indexedProducts", ragRetrievalService.getIndexedCount()
                ),
                "feedback", Map.of(
                        "total", total,
                        "positive", positive,
                        "negative", negative,
                        "satisfactionRate", Math.round(satisfactionRate * 10) / 10.0,
                        "recentNegative", aiFeedbackRepository.findTop10ByRatingOrderByCreatedAtDesc(AiFeedback.Rating.NEGATIVE)
                ),
                "metrics", aiAssistantService.metricsSnapshot()
        ));
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Lấy userId từ SecurityContext (null nếu chưa login)
     */
    private Long getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
                return userDetails.getId();
            }
        } catch (Exception e) {
            log.debug("Could not get current user: {}", e.getMessage());
        }
        return null;
    }

    private AiChatRequest parseChatRequest(String body, String conversationId) {
        if (body == null || body.isBlank()) {
            return AiChatRequest.builder().message("").conversationId(conversationId).build();
        }
        try {
            String trimmed = body.trim();
            AiChatRequest request;
            if (trimmed.startsWith("{")) {
                request = objectMapper.readValue(trimmed, AiChatRequest.class);
            } else if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                request = AiChatRequest.builder().message(objectMapper.readValue(trimmed, String.class)).build();
            } else {
                request = AiChatRequest.builder().message(body).build();
            }
            if (conversationId != null && !conversationId.isBlank()) {
                request.setConversationId(conversationId);
            }
            return request;
        } catch (Exception e) {
            log.warn("Could not parse AI chat request as JSON, using raw body: {}", e.getMessage());
            return AiChatRequest.builder().message(body).conversationId(conversationId).build();
        }
    }
}
