package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import fit.iuh.edu.fashion.services.CatalogCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryRetrievalService {

    private final CatalogCacheService catalogCacheService;
    private final ProductSearchService productSearchService;

    public String retrieveInventoryContext(UserIntentDTO intent) {
        log.info("RAG: Retrieving inventory for intent: {}", intent.toQueryString());
        List<ProductCatalogDTO> products = productSearchService.searchByIntent(intent);
        if (products.isEmpty()) {
            products = catalogCacheService.searchProducts(intent.getOriginalMessage(), 10);
        }
        if (products.isEmpty()) {
            return "Khong tim thay san pham phu hop voi \"" + intent.toQueryString() + "\" trong kho.\n";
        }
        return buildInventoryContext(products);
    }

    private String buildInventoryContext(List<ProductCatalogDTO> products) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("DU LIEU TON KHO THUC TU HE THONG (").append(products.size()).append(" san pham):\n\n");
        for (ProductCatalogDTO product : products) {
            ctx.append("- ").append(product.getName());
            if (product.getBrandName() != null) ctx.append(" (").append(product.getBrandName()).append(")");
            if (product.getSlug() != null) ctx.append(" [Xem chi tiet](/products/").append(product.getSlug()).append(")");
            ctx.append("\n");
            if (product.getVariants() != null) {
                product.getVariants().stream()
                        .filter(v -> v.isAvailable() && v.getStock() > 0)
                        .forEach(v -> ctx.append("  + ").append(v.getColor()).append("/").append(v.getSize())
                                .append(": con ").append(v.getStock()).append(" cai")
                                .append(", gia ").append(v.getPrice() != null ? String.format("%,d VND", v.getPrice().longValue()) : "N/A")
                                .append("\n"));
                product.getVariants().stream()
                        .filter(v -> !v.isAvailable() || v.getStock() <= 0)
                        .forEach(v -> ctx.append("  x ").append(v.getColor()).append("/").append(v.getSize())
                                .append(": HET HANG\n"));
            }
            ctx.append("\n");
        }
        ctx.append("QUAN TRONG: CHI tra loi dua tren du lieu ton kho o tren. KHONG bia so luong.\n");
        return ctx.toString();
    }
}
