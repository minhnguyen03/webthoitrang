package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.CatalogDataDTO;
import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import fit.iuh.edu.fashion.services.CatalogCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service tìm kiếm sản phẩm nâng cao cho AI — filter, sort theo relevance.
 * Kết hợp: category search + brand search + keyword search + filter + sort.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ProductSearchService {

    private final CatalogCacheService catalogCacheService;

    /**
     * Tìm kiếm sản phẩm nâng cao dựa trên ý định đã phân tích.
     * Strategy:
     * 1. Nếu có category → lấy TẤT CẢ sản phẩm của category đó
     * 2. Nếu có brand → lấy TẤT CẢ sản phẩm của brand đó
     * 3. Keyword search → bổ sung thêm sản phẩm phù hợp
     * 4. Merge + deduplicate + filter + sort
     */
    public List<ProductCatalogDTO> searchByIntent(UserIntentDTO intent) {
        log.info("searchByIntent: category={}, brand={}, productType={}, msg='{}'",
                intent.getCategory(), intent.getBrand(), intent.getProductType(), intent.getOriginalMessage());

        Set<Long> seenIds = new HashSet<>();
        List<ProductCatalogDTO> allProducts = new ArrayList<>();

        // 1. Category-based search — lấy TẤT CẢ sản phẩm trong danh mục
        if (intent.getCategory() != null) {
            Long categoryId = findCategoryId(intent.getCategory());
            if (categoryId != null) {
                List<ProductCatalogDTO> catProducts = catalogCacheService.getProductsByCategory(categoryId, 50);
                log.info("Category '{}' (id={}) → {} products", intent.getCategory(), categoryId, catProducts.size());
                for (ProductCatalogDTO p : catProducts) {
                    if (seenIds.add(p.getId())) allProducts.add(p);
                }
            }
        }

        // 2. Brand-based search — lấy TẤT CẢ sản phẩm của thương hiệu
        if (intent.getBrand() != null) {
            Long brandId = findBrandId(intent.getBrand());
            if (brandId != null) {
                List<ProductCatalogDTO> brandProducts = catalogCacheService.getProductsByBrand(brandId, 50);
                log.info("Brand '{}' (id={}) → {} products", intent.getBrand(), brandId, brandProducts.size());
                for (ProductCatalogDTO p : brandProducts) {
                    if (seenIds.add(p.getId())) allProducts.add(p);
                }
            }
        }

        // 3. Keyword search — bổ sung thêm sản phẩm chưa tìm được qua category/brand
        String keyword = intent.toQueryString();
        if (keyword == null || keyword.isEmpty()) keyword = intent.getOriginalMessage();
        if (keyword != null && keyword.trim().length() >= 2) {
            List<ProductCatalogDTO> kwProducts = catalogCacheService.searchProducts(keyword.trim(), 30);
            log.info("Keyword '{}' → {} products", keyword.trim(), kwProducts.size());
            for (ProductCatalogDTO p : kwProducts) {
                if (seenIds.add(p.getId())) allProducts.add(p);
            }

            // Nếu keyword dài, thử tìm từng từ riêng để bắt thêm kết quả
            if (kwProducts.isEmpty() && keyword.contains(" ")) {
                for (String word : keyword.split("\\s+")) {
                    if (isUsefulKeyword(word)) {
                        List<ProductCatalogDTO> wordProducts = catalogCacheService.searchProducts(word, 20);
                        for (ProductCatalogDTO p : wordProducts) {
                            if (seenIds.add(p.getId())) allProducts.add(p);
                        }
                    }
                }
            }
        }

        // 4. Fallback — nếu không tìm được gì, lấy top products
        if (allProducts.isEmpty()) {
            log.info("No results, falling back to top products");
            allProducts = catalogCacheService.getTopProducts(20);
        }

        // 5. Filter theo intent (price, color, size)
        allProducts = filterByIntent(allProducts, intent);

        // 6. Sort theo relevance
        allProducts = sortByRelevance(allProducts, intent);

        // 7. Limit — default 8 (toi uu cho 4096 token budget)
        int limit = extractLimit(intent.getOriginalMessage());
        if (allProducts.size() > limit) allProducts = allProducts.subList(0, limit);

        log.info("Final results: {} products", allProducts.size());
        return allProducts;
    }

    /**
     * Tìm sản phẩm liên quan từ câu hỏi (cho enhanced message)
     */
    public List<ProductCatalogDTO> findRelevantProducts(String query, int limit) {
        String[] words = query.toLowerCase().split("\\s+");
        for (String word : words) {
            if (word.length() > 2) {
                List<ProductCatalogDTO> products = catalogCacheService.searchProducts(word, limit);
                if (!products.isEmpty()) return products;
            }
        }
        return catalogCacheService.getTopProducts(limit);
    }

    /**
     * Kiểm tra câu hỏi có chứa từ khóa sản phẩm không
     */
    public boolean containsProductKeyword(String message) {
        String[] keywords = {"ao", "áo", "quan", "quần", "vay", "váy", "giay", "giày",
                "tui", "túi", "phu kien", "phụ kiện", "san pham", "sản phẩm",
                "mua", "tim", "tìm", "co", "có", "mau", "màu", "size", "gia", "giá",
                "polo", "jean", "kaki", "short", "khoac", "khoác", "so mi", "sơ mi",
                "thun", "the thao", "thể thao"};
        String lower = message.toLowerCase();
        for (String kw : keywords) { if (lower.contains(kw)) return true; }
        return false;
    }

    // ==================== CATALOG LOOKUP ====================

    private Long findCategoryId(String categoryName) {
        CatalogDataDTO catalog = catalogCacheService.getCatalogData();
        if (catalog.getCategories() == null) return null;
        String normalized = categoryName.toLowerCase().trim();
        for (CatalogDataDTO.CategoryInfo cat : catalog.getCategories()) {
            if (cat.getName().toLowerCase().trim().equals(normalized)) return cat.getId();
        }
        // Partial match
        for (CatalogDataDTO.CategoryInfo cat : catalog.getCategories()) {
            if (cat.getName().toLowerCase().contains(normalized) || normalized.contains(cat.getName().toLowerCase())) {
                return cat.getId();
            }
        }
        return null;
    }

    private Long findBrandId(String brandName) {
        CatalogDataDTO catalog = catalogCacheService.getCatalogData();
        if (catalog.getBrands() == null) return null;
        String normalized = brandName.toLowerCase().trim();
        for (CatalogDataDTO.BrandInfo brand : catalog.getBrands()) {
            if (brand.getName().toLowerCase().trim().equals(normalized)) return brand.getId();
        }
        for (CatalogDataDTO.BrandInfo brand : catalog.getBrands()) {
            if (brand.getName().toLowerCase().contains(normalized) || normalized.contains(brand.getName().toLowerCase())) {
                return brand.getId();
            }
        }
        return null;
    }

    // ==================== FILTER ====================

    private List<ProductCatalogDTO> filterByIntent(List<ProductCatalogDTO> products, UserIntentDTO intent) {
        return products.stream()
                .filter(p -> matchesPriceRange(p, intent.getPriceRange()))
                .filter(p -> matchesColors(p, intent.getColors()))
                .filter(p -> matchesSizes(p, intent.getSizes()))
                .filter(p -> matchesGender(p, intent.getGender()))
                .collect(Collectors.toList());
    }

    private boolean matchesPriceRange(ProductCatalogDTO p, UserIntentDTO.PriceRange range) {
        if (range == null) return true;
        if (p.getMinPrice() == null) return false;
        return range.isInRange(p.getMinPrice().longValue());
    }

    private boolean matchesColors(ProductCatalogDTO p, List<String> colors) {
        if (colors == null || colors.isEmpty()) return true;
        String pc = p.getColors();
        if (pc == null || pc.isEmpty()) return false;
        String lower = pc.toLowerCase();
        return colors.stream().anyMatch(c -> lower.contains(c.toLowerCase()));
    }

    private boolean matchesSizes(ProductCatalogDTO p, List<String> sizes) {
        if (sizes == null || sizes.isEmpty()) return true;
        String ps = p.getSizes();
        if (ps == null || ps.isEmpty()) return false;
        String lower = ps.toLowerCase();
        return sizes.stream().anyMatch(s -> lower.contains(s.toLowerCase()));
    }

    private boolean matchesGender(ProductCatalogDTO p, String gender) {
        if (gender == null || gender.isBlank()) return true;
        String haystack = ((p.getName() == null ? "" : p.getName()) + " "
                + (p.getCategoryName() == null ? "" : p.getCategoryName()) + " "
                + (p.getCategories() == null ? "" : String.join(" ", p.getCategories())))
                .toLowerCase();
        String normalizedGender = gender.toLowerCase();
        if (normalizedGender.contains("nam")) {
            return !(haystack.contains("nữ") || haystack.contains("nu ") || haystack.contains("women") || haystack.contains("woman"));
        }
        if (normalizedGender.contains("nữ") || normalizedGender.contains("nu")) {
            return !(haystack.contains(" nam") || haystack.startsWith("nam ") || haystack.contains("men") || haystack.contains("man"));
        }
        return true;
    }

    // ==================== SORT ====================

    private List<ProductCatalogDTO> sortByRelevance(List<ProductCatalogDTO> products, UserIntentDTO intent) {
        return products.stream()
                .sorted((a, b) -> Integer.compare(calcScore(b, intent), calcScore(a, intent)))
                .collect(Collectors.toList());
    }

    private int calcScore(ProductCatalogDTO p, UserIntentDTO intent) {
        int score = 0;
        if (intent.getBrand() != null && p.getBrandName() != null
                && p.getBrandName().toLowerCase().contains(intent.getBrand().toLowerCase())) score += 50;
        if (intent.getCategory() != null && p.getCategoryName() != null
                && p.getCategoryName().toLowerCase().contains(intent.getCategory().toLowerCase())) score += 40;
        if (intent.getProductType() != null && p.getName() != null
                && p.getName().toLowerCase().contains(intent.getProductType().toLowerCase())) score += 30;
        if (matchesColors(p, intent.getColors())) score += 20;
        if (matchesSizes(p, intent.getSizes())) score += 20;
        // Bonus for in-stock products
        if (p.getVariants() != null && p.getVariants().stream().anyMatch(v -> v.isAvailable() && v.getStock() > 0)) score += 10;
        return score;
    }

    // ==================== UTILITY ====================

    private int extractLimit(String message) {
        if (message == null) return 8;
        for (String w : message.split("\\s+")) {
            try {
                int n = Integer.parseInt(w.replaceAll("[^0-9]", ""));
                if (n > 0 && n <= 20) return n;
            } catch (NumberFormatException ignored) {}
        }
        return 8;
    }

    private boolean isUsefulKeyword(String word) {
        if (word == null) return false;
        String normalized = word.toLowerCase().replaceAll("[^\\p{L}\\p{N}]", "");
        if (normalized.length() < 3) return false;
        return !Set.of("toi", "tôi", "ban", "bạn", "can", "cần", "muon", "muốn", "tim", "tìm",
                "cho", "xem", "size", "gia", "giá", "mau", "màu", "san", "sản", "pham", "phẩm").contains(normalized);
    }
}
