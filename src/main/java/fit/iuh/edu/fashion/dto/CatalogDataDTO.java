package fit.iuh.edu.fashion.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * DTO chứa toàn bộ catalog data cho AI - CACHED in Redis
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatalogDataDTO implements Serializable {
    private List<BrandInfo> brands;
    private List<CategoryInfo> categories;
    private List<ColorInfo> colors;
    private List<SizeInfo> sizes;
    private long totalProducts;
    private long activeProducts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BrandInfo implements Serializable {
        private Long id;
        private String name;
        private String description;
        private long productCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CategoryInfo implements Serializable {
        private Long id;
        private String name;
        private String description;
        private Long parentId;
        private String parentName;
        private long productCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ColorInfo implements Serializable {
        private Long id;
        private String name;
        private String hex;
        private long productCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SizeInfo implements Serializable {
        private Long id;
        private String name;
        private String note;
        private long productCount;
    }

    /**
     * Tạo system prompt cho AI — compact cho 4096 token budget
     * Bao gồm RESPONSE FORMAT TEMPLATE chuẩn hóa
     */
    public String toSystemPrompt() {
        StringBuilder p = new StringBuilder();

        p.append("Ban la tro ly mua sam Fashion Shop. Tra loi tieng Viet, than thien, chuyen nghiep.\n\n");

        p.append("QUY TAC:\n");
        p.append("- CHI gioi thieu SP CO TRONG du lieu. KHONG tu sang tao ten/gia/link.\n");
        p.append("- SLUG lay tu truong 'Link:' trong du lieu. KHONG tu tao SLUG.\n");
        p.append("- LUON co DAU CACH giua cac tu tieng Viet.\n\n");

        // ===== RESPONSE FORMAT TEMPLATE =====
        p.append("=== FORMAT TRA LOI (BAT BUOC TUAN THU MOI LAN) ===\n\n");

        p.append("KHI GIOI THIEU SAN PHAM, moi SP PHAI theo dung format:\n");
        p.append("**[STT]. [Ten SP]**\n");
        p.append("- Gia: **[xxx,xxx VND]**\n");
        p.append("- Mau: [mau1], [mau2]\n");
        p.append("- Size: [S, M, L, XL...]\n");
        p.append("- [Xem chi tiet](/products/SLUG)\n\n");

        p.append("KHI TRA LOI CHINH SACH/THONG TIN:\n");
        p.append("- Mo dau bang 1 cau tom tat ngan\n");
        p.append("- Liet ke thong tin bang danh sach `-`\n");
        p.append("- Ket thuc bang cau hoi \"Ban can ho tro gi them?\"\n\n");

        p.append("KHI TRA LOI DON HANG:\n");
        p.append("- Ma don: **[ma]** | Trang thai: [emoji + trang thai]\n");
        p.append("- Liet ke SP trong don\n");
        p.append("- Tong tien: **[xxx,xxx VND]**\n\n");

        p.append("LUON KET THUC bang 1 cau hoi tiep noi (VD: \"Ban muon xem them SP nao?\", \"Can tu van gi them?\").\n");
        p.append("KHONG dung bang (table). CHI dung danh sach 1. 2. 3. hoac dau `-`.\n");
        p.append("=== HET FORMAT ===\n\n");

        p.append("CUA HANG: ").append(activeProducts).append(" SP dang ban\n");

        if (brands != null && !brands.isEmpty()) {
            p.append("BRAND: ");
            p.append(brands.stream()
                .filter(b -> b.productCount > 0)
                .map(b -> b.name + "(" + b.productCount + ")")
                .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }

        if (categories != null && !categories.isEmpty()) {
            p.append("DANH MUC: ");
            p.append(categories.stream()
                .filter(c -> c.productCount > 0)
                .map(c -> c.name + "(" + c.productCount + ")")
                .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }

        if (colors != null && !colors.isEmpty()) {
            p.append("MAU: ");
            p.append(colors.stream()
                .filter(c -> c.productCount > 0)
                .map(c -> c.name)
                .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }

        if (sizes != null && !sizes.isEmpty()) {
            p.append("SIZE: ");
            p.append(sizes.stream()
                .filter(s -> s.productCount > 0)
                .map(s -> s.name)
                .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }

        p.append("\nLINK: [Gio hang](/cart) | [Don hang](/orders) | [Dang nhap](/login) | [San pham](/products)\n");

        return p.toString();
    }

    /**
     * Compact metadata cho product system prompt — chỉ brand/category/color/size
     */
    public String toCompactMeta() {
        StringBuilder p = new StringBuilder();
        p.append("STORE: ").append(activeProducts).append(" products\n");

        if (brands != null && !brands.isEmpty()) {
            p.append("BRANDS: ");
            p.append(brands.stream().filter(b -> b.productCount > 0)
                    .map(b -> b.name + "(" + b.productCount + ")")
                    .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }
        if (categories != null && !categories.isEmpty()) {
            p.append("CATEGORIES: ");
            p.append(categories.stream().filter(c -> c.productCount > 0)
                    .map(c -> c.name + "(" + c.productCount + ")")
                    .collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }
        if (colors != null && !colors.isEmpty()) {
            p.append("COLORS: ");
            p.append(colors.stream().filter(c -> c.productCount > 0)
                    .map(c -> c.name).collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }
        if (sizes != null && !sizes.isEmpty()) {
            p.append("SIZES: ");
            p.append(sizes.stream().filter(s -> s.productCount > 0)
                    .map(s -> s.name).collect(java.util.stream.Collectors.joining(", ")));
            p.append("\n");
        }
        return p.toString();
    }
}
