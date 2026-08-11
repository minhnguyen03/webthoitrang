package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.CatalogDataDTO;
import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import fit.iuh.edu.fashion.services.CatalogCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static fit.iuh.edu.fashion.util.TextUtils.containsAny;

/**
 * Service xây dựng prompt cho AI từ intent, sản phẩm, và catalog context.
 * Mỗi intent type có system prompt riêng — ngắn gọn, rõ ràng, bằng tiếng Anh
 * để model nhỏ (2B) hiểu tốt hơn.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PromptBuilderService {

    private final CatalogCacheService catalogCacheService;

    // ===================== BASE PROMPT =====================

    private static final String BASE =
            "You are a Fashion Shop assistant. Reply in Vietnamese. Be friendly and professional.\n"
          + "ALWAYS add spaces between Vietnamese words. NEVER stick words together.\n";

    // ===================== INTENT-SPECIFIC SYSTEM PROMPTS =====================

    /**
     * System prompt cho PRODUCT_SEARCH / PRODUCT_RECOMMENDATION — dùng full catalog data.
     */
    public String getProductSystemPrompt() {
        CatalogDataDTO catalogData = catalogCacheService.getCatalogData();
        StringBuilder p = new StringBuilder(BASE);
        p.append("MODE: PRODUCT SEARCH\n");
        p.append("RULES:\n");
        p.append("- ONLY recommend products from the data provided (section 'SAN PHAM THUC')\n");
        p.append("- NEVER invent product names, prices, or links\n");
        p.append("- Each product MUST have: **Name**, Price, Colors, Sizes, [Xem chi tiết](/products/SLUG)\n");
        p.append("- Get SLUG from 'Link:' field in data. NEVER create your own SLUG\n");
        p.append("- Prefer 'VERIFIED_PRODUCTS_FOR_ANSWER' over raw RAG lines when both are present\n");
        p.append("- Do NOT copy raw pipe-separated context. Rewrite into clean Vietnamese sentences with spaces\n");
        p.append("- Recommend at most 4 products unless the customer asks for more\n");
        p.append("- Use numbered list 1. 2. 3. NO tables\n");
        p.append("- End with a follow-up question\n\n");
        // Append catalog metadata
        p.append(catalogData.toCompactMeta());
        return p.toString();
    }

    /** System prompt cho ORDER_SUPPORT */
    public String getOrderSystemPrompt() {
        return BASE
                + "MODE: ORDER SUPPORT\n"
                + "You are helping the customer check their orders.\n"
                + "RULES:\n"
                + "- ONLY talk about the order data provided below\n"
                + "- DO NOT recommend products or promotions\n"
                + "- Format: Order code, status, items, total price\n"
                + "- If no orders found, say so politely\n"
                + "- End with: \"Bạn cần hỗ trợ gì thêm về đơn hàng?\"\n";
    }

    /** System prompt cho PROMOTION_QUERY */
    public String getPromotionSystemPrompt() {
        return BASE
                + "MODE: PROMOTION / COUPON\n"
                + "Customer is asking about discount codes / promotions.\n"
                + "RULES:\n"
                + "- ONLY list coupons from the data provided below\n"
                + "- DO NOT recommend products\n"
                + "- Each coupon: **Code** - Discount amount - Min order - Expiry\n"
                + "- If no promotions, say: \"Hiện tại chưa có mã giảm giá nào.\"\n"
                + "- End with: \"Bạn muốn tìm sản phẩm để áp dụng mã giảm giá?\"\n";
    }

    /** System prompt cho INVENTORY_CHECK */
    public String getInventorySystemPrompt() {
        return BASE
                + "MODE: INVENTORY CHECK\n"
                + "Customer is checking product stock / availability.\n"
                + "RULES:\n"
                + "- ONLY report stock info from the data provided below\n"
                + "- For each item: Product name, Color, Size, Quantity in stock\n"
                + "- If out of stock, say so and suggest alternatives if provided\n"
                + "- End with: \"Bạn muốn kiểm tra sản phẩm nào khác?\"\n";
    }

    /** System prompt cho CART_SUPPORT */
    public String getCartSystemPrompt() {
        return BASE
                + "MODE: CART SUPPORT\n"
                + "Customer is asking about their shopping cart.\n"
                + "RULES:\n"
                + "- ONLY talk about the cart data provided below\n"
                + "- List items, quantities, prices, total\n"
                + "- End with: \"Bạn muốn tiếp tục mua sắm hay thanh toán?\"\n";
    }

    /** System prompt cho PAYMENT_SUPPORT */
    public String getPaymentSystemPrompt() {
        return BASE
                + "MODE: PAYMENT SUPPORT\n"
                + "Customer is asking about payment methods or payment issues.\n"
                + "RULES:\n"
                + "- ONLY provide payment info from the data below\n"
                + "- Be clear about supported payment methods\n"
                + "- End with: \"Bạn cần hỗ trợ gì thêm về thanh toán?\"\n";
    }

    /** System prompt cho REVIEW_QUERY */
    public String getReviewSystemPrompt() {
        return BASE
                + "MODE: PRODUCT REVIEWS\n"
                + "Customer is asking about product reviews / ratings.\n"
                + "RULES:\n"
                + "- Summarize reviews from the data provided\n"
                + "- Mention average rating, key pros/cons\n"
                + "- End with: \"Bạn muốn xem sản phẩm này không?\"\n";
    }

    /** System prompt cho LOYALTY_QUERY */
    public String getLoyaltySystemPrompt() {
        return BASE
                + "MODE: LOYALTY POINTS\n"
                + "Customer is asking about their loyalty points / rewards.\n"
                + "RULES:\n"
                + "- ONLY report loyalty data provided below\n"
                + "- End with: \"Bạn muốn biết thêm về chương trình tích điểm?\"\n";
    }

    /** System prompt cho POLICY_QUERY */
    public String getPolicySystemPrompt() {
        return BASE
                + "MODE: STORE POLICY\n"
                + "Customer is asking about store policies (return, shipping, etc).\n"
                + "RULES:\n"
                + "- ONLY provide policy info from the data below\n"
                + "- Be clear and concise with bullet points\n"
                + "- End with: \"Bạn cần hỗ trợ gì thêm?\"\n";
    }

    /** System prompt cho OUTFIT_RECOMMENDATION */
    public String getOutfitSystemPrompt() {
        return BASE
                + "MODE: OUTFIT / STYLING ADVICE\n"
                + "Customer wants outfit suggestions for an occasion.\n"
                + "RULES:\n"
                + "- Suggest specific items with colors and styles\n"
                + "- If product data is provided, reference real products with links\n"
                + "- Use numbered list, NO tables\n"
                + "- End with: \"Bạn muốn tư vấn thêm về phong cách nào?\"\n";
    }

    /** System prompt cho general chat (không rõ intent) */
    public String getGeneralSystemPrompt() {
        return BASE
                + "MODE: GENERAL CHAT\n"
                + "Answer the customer's question naturally.\n"
                + "If they ask about products, suggest they search specifically.\n"
                + "Keep answers short and helpful.\n"
                + "End with a follow-up question.\n";
    }

    /** Detect loại system prompt phù hợp cho general chat */
    public String detectSystemPrompt(String userMessage) {
        String lower = userMessage.toLowerCase();
        if (containsAny(lower, "phối đồ", "mix đồ", "kết hợp", "cách mặc", "outfit", "phong cách")) {
            return getOutfitSystemPrompt();
        }
        return getGeneralSystemPrompt();
    }

    // ===================== MESSAGE BUILDERS =====================

    public String buildCompareMessage(UserIntentDTO intent, List<ProductCatalogDTO> products) {
        StringBuilder msg = new StringBuilder();
        msg.append("Customer wants to compare: ").append(intent.getOriginalMessage()).append("\n\n");
        msg.append("Products to compare:\n");
        products.stream().limit(5)
                .forEach(p -> msg.append("- ").append(p.toAiDescription()).append("\n"));
        msg.append("\nCompare: Price, Material, Colors/Sizes, Pros/Cons. Recommend the best match.\n");
        return msg.toString();
    }

    public String buildKeywordSearchMessage(String keyword, List<ProductCatalogDTO> products) {
        StringBuilder msg = new StringBuilder();
        msg.append("Customer searches: \"").append(keyword).append("\"\n\n");
        msg.append("Found ").append(products.size()).append(" products:\n\n");
        int i = 1;
        for (ProductCatalogDTO p : products) {
            msg.append(i++).append(". ").append(p.toAiDescription()).append("\n");
        }
        msg.append("\nList ALL matching products with Name, Price, Colors, Sizes, Link.\n");
        return msg.toString();
    }

    public String buildConsultationMessage(String contextLabel, String contextName,
                                           String question, List<ProductCatalogDTO> products) {
        StringBuilder msg = new StringBuilder();
        msg.append("Customer asks about ").append(contextLabel).append(" ").append(contextName);
        msg.append(": ").append(question).append("\n\nAvailable products:\n");
        products.forEach(p -> msg.append("- ").append(p.toAiDescription()).append("\n"));
        return msg.toString();
    }

    public String buildEnhancedMessage(String userMessage, List<ProductCatalogDTO> relatedProducts) {
        StringBuilder enhanced = new StringBuilder();
        enhanced.append("Customer question: ").append(userMessage).append("\n\n");
        if (relatedProducts != null && !relatedProducts.isEmpty()) {
            enhanced.append("Related products:\n");
            relatedProducts.forEach(p -> enhanced.append("- ").append(p.toAiDescription()).append("\n"));
        }
        return enhanced.toString();
    }

    public String buildSuggestionMessage(String keyword, List<ProductCatalogDTO> alternatives) {
        StringBuilder msg = new StringBuilder();
        msg.append("Customer searched '").append(keyword).append("' but no exact match.\n");
        msg.append("Suggest alternatives:\n");
        alternatives.forEach(p -> msg.append("- ").append(p.toAiDescription()).append("\n"));
        msg.append("\nSuggest friendly alternatives from the list above.\n");
        return msg.toString();
    }

}

