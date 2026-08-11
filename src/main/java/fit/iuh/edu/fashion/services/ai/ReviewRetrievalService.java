package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Product;
import fit.iuh.edu.fashion.models.ProductReview;
import fit.iuh.edu.fashion.models.ProductVariant;
import fit.iuh.edu.fashion.repositories.ProductRepository;
import fit.iuh.edu.fashion.repositories.ProductReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static fit.iuh.edu.fashion.util.TextUtils.containsAny;
import static fit.iuh.edu.fashion.util.TextUtils.normalizeVietnamese;

/**
 * Service truy vấn đánh giá sản phẩm để cung cấp context cho AI chatbot.
 * Hỗ trợ cả truy vấn chung (top/lowest rated) và truy vấn cụ thể theo tên sản phẩm.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewRetrievalService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Entry point chính — phân loại câu hỏi rồi dispatch phù hợp.
     */
    @Transactional(readOnly = true)
    public String retrieveReviewsByProductName(String queryText) {
        log.info("RAG: Retrieving reviews for query: {}", queryText);

        String normalized = normalizeVietnamese(queryText.toLowerCase());

        // 1. Detect general review queries
        if (isLowestRatedQuery(normalized)) {
            return retrieveLowestRatedProducts();
        }
        if (isTopRatedQuery(normalized)) {
            return retrieveTopRatedProducts();
        }
        if (isRecentReviewQuery(normalized)) {
            return retrieveRecentReviews();
        }
        if (isOverviewQuery(normalized)) {
            return retrieveReviewOverview();
        }

        // 2. Try specific product search
        Pageable pageable = PageRequest.of(0, 5);
        var products = productRepository.searchProducts(queryText, pageable);

        // 3. If no products found with search keywords, try broader fallback
        if (products.isEmpty()) {
            // Strip common review-related words and try again
            String cleanedQuery = stripReviewKeywords(queryText);
            if (!cleanedQuery.isBlank() && !cleanedQuery.equals(queryText)) {
                products = productRepository.searchProducts(cleanedQuery, pageable);
            }
        }

        // 4. If still no products, return a general overview instead of error
        if (products.isEmpty()) {
            return retrieveReviewOverview();
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("DANH GIA SAN PHAM TU KHACH HANG THUC:\n\n");

        for (Product product : products.getContent()) {
            ctx.append(buildReviewContext(product));
        }

        ctx.append("CHI tra loi dua tren danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    @Transactional(readOnly = true)
    public String retrieveReviewsByProductId(Long productId) {
        log.info("RAG: Retrieving reviews for productId: {}", productId);

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return "Khong tim thay san pham de xem danh gia.\n";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("DANH GIA SAN PHAM TU KHACH HANG THUC:\n\n");
        ctx.append(buildReviewContext(productOpt.get()));
        ctx.append("CHI tra loi dua tren danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    // ==================== GENERAL QUERIES ====================

    @Transactional(readOnly = true)
    public String retrieveTopRatedProducts() {
        log.info("RAG: Retrieving top rated products");
        List<Object[]> results = reviewRepository.findTopRatedProducts(PageRequest.of(0, 10));

        if (results.isEmpty()) {
            return "Hien tai chua co san pham nao duoc danh gia.\n";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("TOP SAN PHAM DUOC DANH GIA CAO NHAT (du lieu thuc tu he thong):\n\n");

        Map<Long, Product> productMap = eagerLoadProducts(results);

        int rank = 1;
        for (Object[] row : results) {
            Product lazyProduct = (Product) row[0];
            Product product = productMap.getOrDefault(lazyProduct.getId(), lazyProduct);
            double avgRating = ((Number) row[1]).doubleValue();
            long count = ((Number) row[2]).longValue();

            ctx.append(rank++).append(". **").append(product.getName()).append("**");
            if (product.getBrand() != null) {
                ctx.append(" (").append(product.getBrand().getName()).append(")");
            }
            if (product.getSlug() != null) {
                ctx.append(" [Xem chi tiet](/products/").append(product.getSlug()).append(")");
            }
            ctx.append("\n");
            appendPriceInfo(ctx, product);
            ctx.append("   ⭐ Rating: ").append(String.format("%.1f", avgRating)).append("/5");
            ctx.append(" (").append(count).append(" luot danh gia)\n");
        }

        ctx.append("\nCHI tra loi dua tren du lieu danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    @Transactional(readOnly = true)
    public String retrieveLowestRatedProducts() {
        log.info("RAG: Retrieving lowest rated products");
        List<Object[]> results = reviewRepository.findLowestRatedProducts(PageRequest.of(0, 10));

        if (results.isEmpty()) {
            return "Hien tai chua co san pham nao duoc danh gia.\n";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("SAN PHAM CO DANH GIA THAP NHAT (du lieu thuc tu he thong):\n\n");

        Map<Long, Product> productMap = eagerLoadProducts(results);

        int rank = 1;
        for (Object[] row : results) {
            Product lazyProduct = (Product) row[0];
            Product product = productMap.getOrDefault(lazyProduct.getId(), lazyProduct);
            double avgRating = ((Number) row[1]).doubleValue();
            long count = ((Number) row[2]).longValue();

            ctx.append(rank++).append(". **").append(product.getName()).append("**");
            if (product.getBrand() != null) {
                ctx.append(" (").append(product.getBrand().getName()).append(")");
            }
            if (product.getSlug() != null) {
                ctx.append(" [Xem chi tiet](/products/").append(product.getSlug()).append(")");
            }
            ctx.append("\n");
            appendPriceInfo(ctx, product);
            ctx.append("   ⭐ Rating: ").append(String.format("%.1f", avgRating)).append("/5");
            ctx.append(" (").append(count).append(" luot danh gia)\n");

            // Show recent negative reviews for context
            List<ProductReview> reviews = reviewRepository
                    .findByProductIdAndIsApprovedOrderByCreatedAtDesc(product.getId(), true);
            reviews.stream()
                    .filter(r -> r.getRating() <= 3)
                    .limit(2)
                    .forEach(r -> {
                        ctx.append("   - ").append("⭐".repeat(r.getRating()));
                        if (r.getComment() != null && !r.getComment().isBlank()) {
                            ctx.append(" \"").append(truncate(r.getComment(), 80)).append("\"");
                        }
                        ctx.append(" - ").append(r.getUser().getFullName()).append("\n");
                    });
        }

        ctx.append("\nCHI tra loi dua tren du lieu danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    @Transactional(readOnly = true)
    public String retrieveRecentReviews() {
        log.info("RAG: Retrieving recent reviews");
        List<ProductReview> reviews = reviewRepository.findRecentReviews(PageRequest.of(0, 10));

        if (reviews.isEmpty()) {
            return "Hien tai chua co danh gia nao.\n";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("DANH GIA GAN DAY NHAT (du lieu thuc tu he thong):\n\n");

        for (ProductReview review : reviews) {
            ctx.append("- ").append("⭐".repeat(review.getRating()));
            ctx.append(" **").append(review.getProduct().getName()).append("**");
            if (review.getProduct().getSlug() != null) {
                ctx.append(" [Xem](/products/").append(review.getProduct().getSlug()).append(")");
            }
            ctx.append(" - ").append(review.getUser().getFullName());
            if (review.getCreatedAt() != null) {
                ctx.append(" (").append(review.getCreatedAt().format(DATE_FMT)).append(")");
            }
            ctx.append("\n");
            if (review.getComment() != null && !review.getComment().isBlank()) {
                ctx.append("  ").append(truncate(review.getComment(), 100)).append("\n");
            }
        }

        ctx.append("\nCHI tra loi dua tren du lieu danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    @Transactional(readOnly = true)
    public String retrieveReviewOverview() {
        log.info("RAG: Retrieving review overview");

        List<Object[]> statsList = reviewRepository.getOverallStats();
        long totalReviews = 0L;
        double avgRating = 0.0;
        if (statsList != null && !statsList.isEmpty()) {
            Object[] stats = statsList.get(0);
            if (stats[0] != null) totalReviews = ((Number) stats[0]).longValue();
            if (stats[1] != null) avgRating = ((Number) stats[1]).doubleValue();
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("TONG QUAN DANH GIA SAN PHAM (du lieu thuc tu he thong):\n\n");
        ctx.append("📊 Tong so danh gia: ").append(totalReviews).append(" luot\n");
        ctx.append("⭐ Rating trung binh toan he thong: ").append(String.format("%.1f", avgRating)).append("/5\n\n");

        // Include top rated
        List<Object[]> topRated = reviewRepository.findTopRatedProducts(PageRequest.of(0, 5));
        Map<Long, Product> topProductMap = eagerLoadProducts(topRated);
        if (!topRated.isEmpty()) {
            ctx.append("TOP SAN PHAM DUOC DANH GIA CAO NHAT:\n");
            int rank = 1;
            for (Object[] row : topRated) {
                Product lazyP = (Product) row[0];
                Product p = topProductMap.getOrDefault(lazyP.getId(), lazyP);
                double avg = ((Number) row[1]).doubleValue();
                long count = ((Number) row[2]).longValue();
                ctx.append(rank++).append(". **").append(p.getName()).append("**");
                if (p.getSlug() != null) {
                    ctx.append(" [Xem](/products/").append(p.getSlug()).append(")");
                }
                appendPriceInline(ctx, p);
                ctx.append(" - ");
                ctx.append(String.format("%.1f", avg)).append("/5 (").append(count).append(" luot)\n");
            }
            ctx.append("\n");
        }

        // Include lowest rated
        List<Object[]> lowestRated = reviewRepository.findLowestRatedProducts(PageRequest.of(0, 5));
        Map<Long, Product> lowProductMap = eagerLoadProducts(lowestRated);
        if (!lowestRated.isEmpty()) {
            ctx.append("SAN PHAM CO DANH GIA THAP NHAT:\n");
            int rank = 1;
            for (Object[] row : lowestRated) {
                Product lazyP = (Product) row[0];
                Product p = lowProductMap.getOrDefault(lazyP.getId(), lazyP);
                double avg = ((Number) row[1]).doubleValue();
                long count = ((Number) row[2]).longValue();
                ctx.append(rank++).append(". **").append(p.getName()).append("**");
                if (p.getSlug() != null) {
                    ctx.append(" [Xem](/products/").append(p.getSlug()).append(")");
                }
                appendPriceInline(ctx, p);
                ctx.append(" - ");
                ctx.append(String.format("%.1f", avg)).append("/5 (").append(count).append(" luot)\n");
            }
            ctx.append("\n");
        }

        ctx.append("CHI tra loi dua tren du lieu danh gia thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Eagerly load products with variants from aggregate query results.
     * Aggregate GROUP BY queries return lazy Product proxies — accessing variants causes
     * LazyInitializationException. This method batch-fetches all products with their variants.
     */
    private Map<Long, Product> eagerLoadProducts(List<Object[]> aggregateResults) {
        List<Long> productIds = aggregateResults.stream()
                .map(row -> ((Product) row[0]).getId())
                .collect(Collectors.toList());

        if (productIds.isEmpty()) return Map.of();

        return productRepository.findByIdsWithVariants(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
    }

    private String buildReviewContext(Product product) {
        StringBuilder ctx = new StringBuilder();
        Long productId = product.getId();

        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countByProductIdAndIsApprovedTrue(productId);

        ctx.append("📦 **").append(product.getName()).append("**");
        if (product.getBrand() != null) {
            ctx.append(" (").append(product.getBrand().getName()).append(")");
        }
        if (product.getSlug() != null) {
            ctx.append(" [Xem san pham](/products/").append(product.getSlug()).append(")");
        }
        ctx.append("\n");

        // Price info from variants
        appendPriceInfo(ctx, product);

        if (reviewCount == 0) {
            ctx.append("  Chua co danh gia nao.\n\n");
            return ctx.toString();
        }

        ctx.append("  ⭐ Rating trung binh: ").append(String.format("%.1f", avgRating)).append("/5");
        ctx.append(" (").append(reviewCount).append(" luot danh gia)\n");

        // Get recent reviews (max 5)
        List<ProductReview> reviews = reviewRepository
                .findByProductIdAndIsApprovedOrderByCreatedAtDesc(productId, true);
        List<ProductReview> recentReviews = reviews.stream().limit(5).toList();

        for (ProductReview review : recentReviews) {
            ctx.append("  - ");
            ctx.append("⭐".repeat(review.getRating()));
            if (review.getTitle() != null) {
                ctx.append(" \"").append(review.getTitle()).append("\"");
            }
            ctx.append(" - ").append(review.getUser().getFullName());
            if (review.getCreatedAt() != null) {
                ctx.append(" (").append(review.getCreatedAt().format(DATE_FMT)).append(")");
            }
            ctx.append("\n");
            if (review.getComment() != null && !review.getComment().isBlank()) {
                ctx.append("    ").append(truncate(review.getComment(), 100)).append("\n");
            }
        }

        ctx.append("\n");
        return ctx.toString();
    }

    private boolean isLowestRatedQuery(String normalized) {
        return containsAny(normalized, "thap nhat", "thấp nhất", "tệ nhất", "te nhat",
                "kem nhat", "kém nhất", "worst", "lowest", "it sao nhat", "ít sao nhất",
                "1 sao", "2 sao", "danh gia thap", "đánh giá thấp", "rating thap");
    }

    private boolean isTopRatedQuery(String normalized) {
        return containsAny(normalized, "cao nhat", "cao nhất", "tot nhat", "tốt nhất",
                "best", "top", "highest", "nhieu sao nhat", "nhiều sao nhất",
                "5 sao", "duoc danh gia cao", "được đánh giá cao", "rating cao",
                "ban chay", "bán chạy", "yeu thich", "yêu thích", "popular");
    }

    private boolean isRecentReviewQuery(String normalized) {
        return containsAny(normalized, "gan day", "gần đây", "moi nhat", "mới nhất",
                "recent", "latest", "vua danh gia", "vừa đánh giá");
    }

    private boolean isOverviewQuery(String normalized) {
        return containsAny(normalized, "tong quan", "tổng quan", "overview", "tat ca",
                "tất cả", "toan bo", "toàn bộ", "chung", "general");
    }

    /**
     * Strip common review-related keywords to extract potential product name.
     */
    private String stripReviewKeywords(String text) {
        String[] reviewWords = {
            "đánh giá", "danh gia", "review", "nhận xét", "nhan xet",
            "rating", "sao", "stars", "bình luận", "binh luan",
            "feedback", "comment", "sản phẩm", "san pham",
            "có", "co", "được", "duoc", "thấp", "thap", "cao",
            "nhất", "nhat", "nào", "nao", "tốt", "tot", "tệ", "te",
            "thế nào", "the nao", "như thế nào", "nhu the nao",
            "bao nhiêu", "bao nhieu", "mấy", "may",
            "cho", "xem", "về", "ve", "của", "cua", "la", "là"
        };
        String result = text.toLowerCase();
        for (String word : reviewWords) {
            result = result.replace(word, " ");
        }
        return result.replaceAll("\\s+", " ").trim();
    }

    /**
     * Append price range and stock info from product variants (multi-line).
     */
    private void appendPriceInfo(StringBuilder ctx, Product product) {
        try {
            if (product.getVariants() == null || product.getVariants().isEmpty()) return;

            BigDecimal minPrice = null, maxPrice = null;
            int totalStock = 0;

            for (ProductVariant v : product.getVariants()) {
                if (v.getIsActive() != null && v.getIsActive() && v.getPrice() != null) {
                    if (minPrice == null || v.getPrice().compareTo(minPrice) < 0) minPrice = v.getPrice();
                    if (maxPrice == null || v.getPrice().compareTo(maxPrice) > 0) maxPrice = v.getPrice();
                    totalStock += (v.getStock() != null ? v.getStock() : 0);
                }
            }

            if (minPrice != null) {
                ctx.append("  💰 Gia: ");
                if (minPrice.equals(maxPrice)) {
                    ctx.append(String.format("%,d VND", minPrice.longValue()));
                } else {
                    ctx.append(String.format("%,d - %,d VND", minPrice.longValue(), maxPrice.longValue()));
                }
                ctx.append("\n");
            }
            ctx.append("  📦 Ton kho: ").append(totalStock > 0 ? totalStock + " san pham" : "Het hang").append("\n");
        } catch (Exception e) {
            log.debug("Could not load price info for product {}: {}", product.getId(), e.getMessage());
        }
    }

    /**
     * Append price inline (short format for overview lists).
     */
    private void appendPriceInline(StringBuilder ctx, Product product) {
        try {
            if (product.getVariants() == null || product.getVariants().isEmpty()) return;

            BigDecimal minPrice = null;
            for (ProductVariant v : product.getVariants()) {
                if (v.getIsActive() != null && v.getIsActive() && v.getPrice() != null) {
                    if (minPrice == null || v.getPrice().compareTo(minPrice) < 0) minPrice = v.getPrice();
                }
            }

            if (minPrice != null) {
                ctx.append(" - ").append(String.format("%,d VND", minPrice.longValue()));
            }
        } catch (Exception e) {
            log.debug("Could not load inline price for product {}: {}", product.getId(), e.getMessage());
        }
    }

    private String truncate(String text, int maxLen) {
        if (text.length() <= maxLen) return text;
        return text.substring(0, maxLen) + "...";
    }
}

