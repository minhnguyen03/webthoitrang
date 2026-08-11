package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Product;
import fit.iuh.edu.fashion.models.ProductVariant;
import fit.iuh.edu.fashion.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductEmbeddingService {

    private final VectorStore vectorStore;
    private final ProductRepository productRepository;
    private volatile boolean indexed = false;
    private volatile int totalIndexed = 0;

    private static final int BATCH_SIZE = 200;

    @EventListener(ApplicationReadyEvent.class)
    @Async
    @Transactional(readOnly = true)
    public void indexOnStartup() {
        // Delay để ONNX model có thời gian khởi tạo (lần đầu tải về)
        try {
            Thread.sleep(10_000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Index startup interrupted, skipping.");
            return;
        }

        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.info("=== BAT DAU INDEX SAN PHAM VAO VECTOR STORE (attempt {}/{}) ===", attempt, maxRetries);
                indexAllProducts();
                log.info("=== HOAN THANH INDEX: {} san pham ===", totalIndexed);
                return;
            } catch (Exception e) {
                log.error("LOI khi index san pham (attempt {}/{}): {}", attempt, maxRetries, e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(15_000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.warn("Retry sleep interrupted, aborting indexing.");
                        return;
                    }
                }
            }
        }
        log.warn("=== KHONG THE INDEX SAN PHAM SAU {} LAN THU. Semantic search se khong hoat dong. ===", maxRetries);
    }

    @Scheduled(fixedDelay = 1800000, initialDelay = 1800000)
    @Transactional(readOnly = true)
    public void scheduledReindex() {
        try {
            List<Product> allProducts = productRepository.findAllActiveWithDetails();
            if (allProducts.isEmpty()) {
                log.warn("No products to re-index");
                return;
            }
            int totalDocs = 0;
            for (int i = 0; i < allProducts.size(); i += BATCH_SIZE) {
                List<Product> batch = allProducts.subList(i, Math.min(i + BATCH_SIZE, allProducts.size()));
                List<Document> docs = batch.stream()
                        .map(this::productToDocument)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                if (!docs.isEmpty()) {
                    vectorStore.add(docs);
                    totalDocs += docs.size();
                }
            }
            if (totalDocs > 0) {
                totalIndexed = totalDocs;
                indexed = true;
                log.info("Re-indexed {} products", totalDocs);
            }
        } catch (Exception e) {
            log.error("Re-index failed: {}", e.getMessage());
        }
    }

    public List<Document> semanticSearch(String query, int topK) {
        if (!indexed) return Collections.emptyList();
        try {
            SearchRequest req = SearchRequest.query(query).withTopK(topK);
            List<Document> results = vectorStore.similaritySearch(req);
            log.debug("Semantic search '{}' -> {} results", query, results.size());
            return results;
        } catch (Exception e) {
            log.error("Semantic search failed: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Document> semanticSearch(String query, int topK, double threshold) {
        if (!indexed) return Collections.emptyList();
        try {
            SearchRequest req = SearchRequest.query(query).withTopK(topK).withSimilarityThreshold(threshold);
            return vectorStore.similaritySearch(req);
        } catch (Exception e) {
            log.error("Semantic search with threshold failed: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public boolean isIndexed() { return indexed; }
    public int getTotalIndexed() { return totalIndexed; }

    /**
     * Index tất cả sản phẩm active.
     * Sử dụng eager-fetch query để tránh LazyInitializationException trong @Async context.
     */
    @Transactional(readOnly = true)
    public void indexAllProducts() {
        List<Product> allProducts = productRepository.findAllActiveWithDetails();

        if (allProducts.isEmpty()) {
            log.warn("No products to index");
            return;
        }

        int totalDocs = 0;

        // Process in batches for embedding
        for (int i = 0; i < allProducts.size(); i += BATCH_SIZE) {
            List<Product> batch = allProducts.subList(i, Math.min(i + BATCH_SIZE, allProducts.size()));
            int batchNum = (i / BATCH_SIZE) + 1;

            List<Document> docs = batch.stream()
                    .map(this::productToDocument)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            if (!docs.isEmpty()) {
                log.info("Embedding batch {}: {} documents...", batchNum, docs.size());
                vectorStore.add(docs);
                totalDocs += docs.size();
            }
        }

        if (totalDocs == 0) {
            log.warn("No products to index");
            return;
        }

        totalIndexed = totalDocs;
        indexed = true;
        int totalBatches = (allProducts.size() + BATCH_SIZE - 1) / BATCH_SIZE;
        log.info("Indexed {} products into Vector Store ({} batches)", totalIndexed, totalBatches);
    }

    private Document productToDocument(Product product) {
        try {
            StringBuilder text = new StringBuilder();
            text.append(product.getName());
            if (product.getBrand() != null) text.append(". Thuong hieu: ").append(product.getBrand().getName());
            if (product.getCategories() != null && !product.getCategories().isEmpty()) {
                text.append(". Danh muc: ").append(product.getCategories().stream().map(c -> c.getName()).collect(Collectors.joining(", ")));
            }
            if (product.getDescription() != null && !product.getDescription().isBlank()) {
                String desc = product.getDescription();
                if (desc.length() > 300) desc = desc.substring(0, 300);
                text.append(". ").append(desc);
            }
            if (product.getMaterial() != null) text.append(". Chat lieu: ").append(product.getMaterial());

            Set<String> colors = new LinkedHashSet<>();
            Set<String> sizes = new LinkedHashSet<>();
            int totalStock = 0;
            BigDecimal minPrice = null, maxPrice = null;
            if (product.getVariants() != null) {
                for (ProductVariant v : product.getVariants()) {
                    if (v.getIsActive() && v.getStock() > 0) {
                        if (v.getColor() != null) colors.add(v.getColor().getName());
                        if (v.getSize() != null) sizes.add(v.getSize().getName());
                        totalStock += v.getStock();
                        if (minPrice == null || v.getPrice().compareTo(minPrice) < 0) minPrice = v.getPrice();
                        if (maxPrice == null || v.getPrice().compareTo(maxPrice) > 0) maxPrice = v.getPrice();
                    }
                }
            }
            if (!colors.isEmpty()) text.append(". Mau: ").append(String.join(", ", colors));
            if (!sizes.isEmpty()) text.append(". Size: ").append(String.join(", ", sizes));
            if (minPrice != null) text.append(". Gia: ").append(String.format("%,d VND", minPrice.longValue()));
            text.append(". Ton kho: ").append(totalStock);

            Map<String, Object> meta = new HashMap<>();
            meta.put("productId", product.getId().toString());
            meta.put("name", product.getName());
            meta.put("slug", product.getSlug() != null ? product.getSlug() : "");
            meta.put("brand", product.getBrand() != null ? product.getBrand().getName() : "");
            meta.put("categories", product.getCategories() != null
                    ? product.getCategories().stream().map(c -> c.getName()).collect(Collectors.joining(", "))
                    : "");
            meta.put("material", product.getMaterial() != null ? product.getMaterial() : "");
            meta.put("colors", String.join(",", colors));
            meta.put("sizes", String.join(",", sizes));
            meta.put("totalStock", totalStock);
            meta.put("inStock", totalStock > 0);
            if (minPrice != null) meta.put("minPrice", minPrice.longValue());
            if (maxPrice != null) meta.put("maxPrice", maxPrice.longValue());
            return new Document(product.getId().toString(), text.toString(), meta);
        } catch (Exception e) {
            log.warn("Error converting product {}: {}", product.getId(), e.getMessage());
            return null;
        }
    }
}
