package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.ProductCardDTO;
import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProductRetrievalGateway {

    private final RagRetrievalService ragRetrievalService;
    private final ProductSearchService productSearchService;

    public RetrievedProducts retrieve(String query, UserIntentDTO intent, int topK) {
        List<ProductCatalogDTO> catalogProducts = productSearchService.searchByIntent(intent).stream()
                .limit(topK)
                .toList();
        String context = ragRetrievalService.hybridSearch(query, intent, topK)
                + "\n" + buildVerifiedProductContext(catalogProducts);
        return new RetrievedProducts(context, catalogProducts, catalogProducts.stream().map(this::toCard).toList());
    }

    public List<ProductCatalogDTO> searchByIntent(UserIntentDTO intent, int limit) {
        return productSearchService.searchByIntent(intent).stream().limit(limit).toList();
    }

    public boolean isReady() {
        return ragRetrievalService.isVectorStoreReady();
    }

    public int indexedCount() {
        return ragRetrievalService.getIndexedCount();
    }

    private ProductCardDTO toCard(ProductCatalogDTO product) {
        List<String> sizes = splitCsv(product.getSizes());
        List<String> colors = splitCsv(product.getColors());
        int totalStock = product.getVariants() == null ? 0 : product.getVariants().stream()
                .filter(v -> v.isAvailable() && v.getStock() != null)
                .mapToInt(ProductCatalogDTO.VariantInfo::getStock)
                .sum();

        return ProductCardDTO.builder()
                .id(product.getId())
                .slug(product.getSlug())
                .name(product.getName())
                .brand(product.getBrandName())
                .price(product.getMinPrice() != null ? product.getMinPrice().doubleValue() : null)
                .availableSizes(sizes)
                .availableColors(colors)
                .stockStatus(totalStock <= 0 ? "OUT_OF_STOCK" : totalStock <= 5 ? "LOW_STOCK" : "IN_STOCK")
                .shortDescription(product.getDescription())
                .category(product.getCategoryName())
                .build();
    }

    private List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(Objects::nonNull)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    private String buildVerifiedProductContext(List<ProductCatalogDTO> products) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("=== VERIFIED_PRODUCTS_FOR_ANSWER ===\n");
        if (products == null || products.isEmpty()) {
            ctx.append("No verified products matched the current filters.\n");
            ctx.append("=== END_VERIFIED_PRODUCTS ===\n");
            return ctx.toString();
        }

        for (int i = 0; i < products.size(); i++) {
            ProductCatalogDTO product = products.get(i);
            ctx.append("PRODUCT ").append(i + 1).append("\n");
            append(ctx, "Name", product.getName());
            append(ctx, "Brand", product.getBrandName());
            append(ctx, "Category", product.getCategories() == null ? "" : String.join(", ", product.getCategories()));
            append(ctx, "Material", product.getMaterial());
            append(ctx, "Description", product.getDescription());
            append(ctx, "Price", formatPriceRange(product.getMinPrice(), product.getMaxPrice()));
            append(ctx, "Colors", product.getColors());
            append(ctx, "Sizes", product.getSizes());
            append(ctx, "Stock", String.valueOf(totalStock(product)));
            append(ctx, "Link", product.getSlug() == null ? "" : "/products/" + product.getSlug());
            ctx.append("\n");
        }
        ctx.append("=== END_VERIFIED_PRODUCTS ===\n");
        return ctx.toString();
    }

    private void append(StringBuilder ctx, String label, String value) {
        if (value != null && !value.isBlank()) {
            ctx.append(label).append(": ").append(value.strip()).append("\n");
        }
    }

    private String formatPriceRange(BigDecimal min, BigDecimal max) {
        if (min == null) return "";
        if (max != null && !min.equals(max)) {
            return String.format("%,d - %,d VND", min.longValue(), max.longValue());
        }
        return String.format("%,d VND", min.longValue());
    }

    private int totalStock(ProductCatalogDTO product) {
        if (product.getVariants() == null) return 0;
        return product.getVariants().stream()
                .filter(v -> v.isAvailable() && v.getStock() != null)
                .mapToInt(ProductCatalogDTO.VariantInfo::getStock)
                .sum();
    }

    public record RetrievedProducts(String context, List<ProductCatalogDTO> catalogProducts, List<ProductCardDTO> productCards) {
    }
}
