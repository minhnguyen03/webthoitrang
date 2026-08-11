package fit.iuh.edu.fashion.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

/**
 * DTO chứa thông tin phân tích ý định người dùng
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserIntentDTO {

    // Câu hỏi gốc
    private String originalMessage;

    // Câu hỏi đã chuẩn hóa (bỏ dấu, lowercase)
    private String normalizedMessage;

    // Loại ý định chính
    private IntentType intentType;

    // Thông tin sản phẩm
    private String productType;      // Loại sản phẩm: áo, quần, váy, giày...
    private String category;         // Danh mục cụ thể
    private String brand;            // Thương hiệu

    // Thuộc tính sản phẩm
    private List<String> colors;     // Màu sắc
    private List<String> sizes;      // Kích thước
    private PriceRange priceRange;   // Khoảng giá
    private String gender;           // Giới tính: Nam/Nữ/Unisex
    private String style;            // Phong cách: Thể thao, Công sở, Dạo phố...

    // Từ khóa tìm kiếm tổng hợp
    private String searchKeywords;

    // Độ ưu tiên các tiêu chí (color, price, size...)
    private Map<String, Integer> priority;

    /**
     * Loại ý định
     */
    public enum IntentType {
        PRODUCT_SEARCH,          // Tìm kiếm sản phẩm
        PRODUCT_RECOMMENDATION,  // Xin tư vấn/gợi ý
        PRODUCT_COMPARE,         // So sánh sản phẩm
        INFORMATION_QUERY,       // Hỏi thông tin chung
        SIZE_GUIDE,              // Hỏi về size / hướng dẫn chọn size
        INVENTORY_CHECK,         // Kiểm tra tồn kho: "Còn hàng không?", "Có size M không?"
        ORDER_SUPPORT,           // Hỗ trợ đơn hàng: "Đơn hàng của tôi", "Mã đơn ORD-xxx"
        PROMOTION_QUERY,         // Hỏi khuyến mãi: "Có mã giảm giá không?", "Sale gì?"
        OUTFIT_RECOMMENDATION,   // Gợi ý outfit theo dịp: "Mặc gì đi tiệc?", "Outfit đi làm"
        CART_SUPPORT,            // Hỗ trợ giỏ hàng: "Giỏ hàng có gì?", "Tổng tiền giỏ hàng?"
        PAYMENT_SUPPORT,         // Hỗ trợ thanh toán: "Thanh toán bằng gì?", "VNPay?"
        REVIEW_QUERY,            // Hỏi đánh giá sản phẩm: "Review áo Nike?", "Rating sao?"
        LOYALTY_QUERY,           // Hỏi điểm thưởng: "Tôi có bao nhiêu điểm?", "Cách dùng điểm?"
        POLICY_QUERY,            // Hỏi chính sách: "Đổi trả?", "Ship bao lâu?", "Bảo hành?"
        GENERAL_CHAT             // Chat chung chung
    }

    // Thêm field cho ORDER_SUPPORT
    private String orderCode;       // Mã đơn hàng (ORD-xxx)

    /**
     * Khoảng giá
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class PriceRange {
        private Long min;
        private Long max;

        public boolean isInRange(Long price) {
            if (price == null) return false;
            return price >= min && price <= max;
        }
    }

    /**
     * Kiểm tra xem có đủ thông tin để tìm kiếm không
     */
    public boolean hasSearchCriteria() {
        return productType != null
            || category != null
            || brand != null
            || (colors != null && !colors.isEmpty())
            || priceRange != null
            || style != null;
    }

    /**
     * Tạo query string cho tìm kiếm
     */
    public String toQueryString() {
        StringBuilder query = new StringBuilder();

        if (productType != null) query.append(productType).append(" ");
        if (category != null) query.append(category).append(" ");
        if (brand != null) query.append(brand).append(" ");
        if (colors != null && !colors.isEmpty()) {
            query.append(String.join(" ", colors)).append(" ");
        }
        if (style != null) query.append(style).append(" ");
        if (gender != null) query.append(gender).append(" ");

        return query.toString().trim();
    }
}
