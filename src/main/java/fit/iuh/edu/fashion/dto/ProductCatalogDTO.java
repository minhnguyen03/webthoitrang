package fit.iuh.edu.fashion.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * DTO tối ưu cho AI context - chỉ chứa thông tin cần thiết
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductCatalogDTO implements Serializable {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String brandName;
    private List<String> categories;
    private List<VariantInfo> variants;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String material;
    private String origin;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VariantInfo implements Serializable {
        private String color;
        private String size;
        private BigDecimal price;
        private Integer stock;
        private boolean available;
    }

    /**
     * Tạo mô tả đầy đủ cho AI — bao gồm danh mục, thương hiệu, giá, link, tồn kho
     */
    @JsonIgnore
    public String toAiDescription() {
        StringBuilder sb = new StringBuilder();
        sb.append(name);

        if (brandName != null) {
            sb.append(" - ").append(brandName);
        }

        // Danh mục sản phẩm
        if (categories != null && !categories.isEmpty()) {
            sb.append(" | Danh muc: ").append(String.join(", ", categories));
        }

        // Chất liệu
        if (material != null && !material.isBlank()) {
            sb.append(" | Chat lieu: ").append(material);
        }

        if (minPrice != null) {
            if (maxPrice != null && !minPrice.equals(maxPrice)) {
                sb.append(" | Gia: ").append(formatPrice(minPrice))
                  .append(" - ").append(formatPrice(maxPrice));
            } else {
                sb.append(" | Gia: ").append(formatPrice(minPrice));
            }
        }

        // Product link
        if (slug != null) {
            sb.append(" | Link: /products/").append(slug);
        }

        if (variants != null && !variants.isEmpty()) {
            // Màu sắc available
            String availColors = getColors();
            if (!availColors.isEmpty()) {
                sb.append(" | Mau: ").append(availColors);
            }

            // Size available
            String availSizes = getSizes();
            if (!availSizes.isEmpty()) {
                sb.append(" | Size: ").append(availSizes);
            }

            // Tồn kho tổng
            int totalStock = variants.stream()
                    .filter(v -> v.available && v.stock > 0)
                    .mapToInt(v -> v.stock)
                    .sum();
            if (totalStock > 0) {
                sb.append(" | Ton kho: ").append(totalStock).append(" sp");
            } else {
                sb.append(" | HET HANG");
            }
        }

        return sb.toString();
    }

    private String formatPrice(BigDecimal price) {
        return String.format("%,d₫", price.longValue());
    }

    /**
     * Lấy danh sách màu sắc có sẵn dưới dạng string
     */
    @JsonIgnore
    public String getColors() {
        if (variants == null || variants.isEmpty()) return "";

        Set<String> colors = new java.util.HashSet<>();
        for (VariantInfo v : variants) {
            if (v.available && v.stock > 0 && v.color != null) {
                colors.add(v.color);
            }
        }
        return String.join(", ", colors);
    }

    /**
     * Lấy danh sách size có sẵn dưới dạng string
     */
    @JsonIgnore
    public String getSizes() {
        if (variants == null || variants.isEmpty()) return "";

        Set<String> sizes = new java.util.HashSet<>();
        for (VariantInfo v : variants) {
            if (v.available && v.stock > 0 && v.size != null) {
                sizes.add(v.size);
            }
        }
        return String.join(", ", sizes);
    }

    /**
     * Lấy tên category đầu tiên
     */
    @JsonIgnore
    public String getCategoryName() {
        if (categories == null || categories.isEmpty()) return null;
        return categories.get(0);
    }

    /**
     * Kiểm tra xem giá có trong khoảng không
     */
    @JsonIgnore
    public boolean isPriceInRange(Long min, Long max) {
        if (minPrice == null) return false;
        long price = minPrice.longValue();
        return price >= min && price <= max;
    }
}

