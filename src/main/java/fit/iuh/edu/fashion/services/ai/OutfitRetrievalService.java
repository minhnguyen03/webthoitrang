package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import fit.iuh.edu.fashion.services.CatalogCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static fit.iuh.edu.fashion.util.TextUtils.containsAny;

@Service
@Slf4j
@RequiredArgsConstructor
public class OutfitRetrievalService {

    private final CatalogCacheService catalogCacheService;

    private static final Map<String, List<String>> OCCASION_CATEGORIES = Map.of(
            "di lam", List.of("ao so mi", "quan tay", "giay tay", "blazer"),
            "di choi", List.of("ao thun", "quan jean", "giay sneaker", "vay"),
            "di tiec", List.of("dam", "ao vest", "giay cao got"),
            "hen ho", List.of("dam", "ao so mi", "quan tay", "giay"),
            "tet", List.of("ao dai", "dam", "ao so mi"),
            "du lich", List.of("ao thun", "quan short", "giay sneaker"),
            "the thao", List.of("ao thun", "quan short", "giay sneaker")
    );

    public String retrieveOutfitSuggestion(UserIntentDTO intent) {
        String message = intent.getNormalizedMessage();
        String occasion = detectOccasion(message);
        log.info("RAG: Outfit for occasion: {}", occasion);

        List<String> categories = OCCASION_CATEGORIES.getOrDefault(occasion, List.of("ao thun", "quan jean"));
        StringBuilder ctx = new StringBuilder();
        ctx.append("GOI Y OUTFIT THEO DIP: ").append(occasion.toUpperCase()).append("\n");
        ctx.append("(DU LIEU SAN PHAM THUC TU CUA HANG)\n\n");

        boolean hasAny = false;
        for (String cat : categories) {
            List<ProductCatalogDTO> products = catalogCacheService.searchProducts(cat, 3);
            if (!products.isEmpty()) {
                hasAny = true;
                ctx.append(">> ").append(cat.toUpperCase()).append(":\n");
                for (ProductCatalogDTO p : products) {
                    ctx.append("  - ").append(p.getName());
                    if (p.getBrandName() != null) ctx.append(" (").append(p.getBrandName()).append(")");
                    if (p.getMinPrice() != null) ctx.append(" - ").append(String.format("%,d VND", p.getMinPrice().longValue()));
                    if (p.getSlug() != null) ctx.append(" [Xem](/products/").append(p.getSlug()).append(")");
                    ctx.append("\n");
                }
                ctx.append("\n");
            }
        }
        if (!hasAny) {
            ctx.append("Hien tai chua co san pham phu hop cho dip nay.\n");
        }
        ctx.append("Goi y combo 2-3 san pham phoi cung nhau, giai thich phong cach, neu gia THUC.\n");
        ctx.append("KHONG bia san pham khong co trong danh sach.\n");
        return ctx.toString();
    }

    private String detectOccasion(String message) {
        if (containsAny(message, "di lam", "cong so", "van phong")) return "di lam";
        if (containsAny(message, "di choi", "dao pho", "cuoi tuan")) return "di choi";
        if (containsAny(message, "di tiec", "party", "su kien")) return "di tiec";
        if (containsAny(message, "hen ho", "date")) return "hen ho";
        if (containsAny(message, "tet", "nam moi", "xuan")) return "tet";
        if (containsAny(message, "du lich", "travel", "di bien")) return "du lich";
        if (containsAny(message, "the thao", "sport", "gym")) return "the thao";
        return "di choi";
    }

}
