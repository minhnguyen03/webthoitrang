package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.ProductCatalogDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import fit.iuh.edu.fashion.services.CatalogCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * RAG Retrieval Service - Ket hop Vector Search (semantic) + SQL Search (keyword).
 *
 * HYBRID SEARCH STRATEGY:
 * 1. Vector Search: Embedding query -> tim k documents gan nhat trong VectorStore
 *    -> Hieu ngu nghia: "ao am" -> "ao khoac", "ao len"
 * 2. SQL Search: LIKE keyword -> tim trong MySQL
 *    -> Chinh xac: "Nike" -> tim brand Nike
 * 3. Merge + Deduplicate: Ket hop ket qua, uu tien vector search
 *
 * Nay MOI LA RAG thuc su.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RagRetrievalService {

    private final ProductEmbeddingService embeddingService;
    private final CatalogCacheService catalogCacheService;
    private final ProductSearchService productSearchService;

    /**
     * Hybrid RAG search - ket hop semantic + keyword
     * @param query Cau hoi cua user
     * @param intent Intent da phan tich
     * @param topK So ket qua toi da
     * @return Context string chua du lieu san pham THUC cho AI
     */
    public String hybridSearch(String query, UserIntentDTO intent, int topK) {
        log.info("RAG Hybrid Search: query='{}', topK={}", query, topK);

        // 1. SEMANTIC SEARCH (Vector)
        List<Document> semanticResults = embeddingService.semanticSearch(query, topK);

        // 2. KEYWORD SEARCH (SQL)
        List<ProductCatalogDTO> keywordResults = productSearchService.searchByIntent(intent);

        // 3. MERGE results
        return buildRagContext(semanticResults, keywordResults, query, topK);
    }

    /**
     * Pure semantic search - chi dung vector
     */
    public String semanticSearchContext(String query, int topK) {
        log.info("RAG Semantic Search: query='{}'", query);

        List<Document> results = embeddingService.semanticSearch(query, topK);

        if (results.isEmpty()) {
            return "Khong tim thay san pham phu hop voi \"" + query + "\" trong he thong.\n"
                    + "Hay thu tu khoa khac hoac xem danh muc san pham.\n";
        }

        return buildSemanticContext(results, query);
    }

    /**
     * Kiem tra vector store status
     */
    public boolean isVectorStoreReady() {
        return embeddingService.isIndexed();
    }

    public int getIndexedCount() {
        return embeddingService.getTotalIndexed();
    }

    // ==================== PRIVATE ====================

    private String buildRagContext(List<Document> semanticResults,
                                   List<ProductCatalogDTO> keywordResults,
                                   String query, int topK) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("=== SAN PHAM THUC (RAG) — Tim: \"").append(query).append("\" ===\n");

        Set<String> seenProductIds = new HashSet<>();
        int count = 0;

        // A. Semantic results (ưu tiên — hiểu ngữ nghĩa)
        if (!semanticResults.isEmpty()) {
            for (Document doc : semanticResults) {
                if (count >= topK) break;
                String productId = doc.getId();
                if (seenProductIds.contains(productId)) continue;
                seenProductIds.add(productId);
                ctx.append(formatDocumentForPrompt(doc, count + 1));
                count++;
            }
        }

        // B. Keyword results (bổ sung — chính xác)
        if (!keywordResults.isEmpty() && count < topK) {
            for (ProductCatalogDTO product : keywordResults) {
                if (count >= topK) break;
                String pid = product.getId().toString();
                if (seenProductIds.contains(pid)) continue;
                seenProductIds.add(pid);
                ctx.append(formatProductForPrompt(product, count + 1));
                count++;
            }
        }

        if (count == 0) {
            ctx.append("Khong tim thay san pham phu hop.\n");
        }

        ctx.append("=== HET ===\n");
        return ctx.toString();
    }

    private String buildSemanticContext(List<Document> results, String query) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("=== SAN PHAM (Semantic Search) — \"").append(query).append("\" ===\n");
        int count = 1;
        for (Document doc : results) {
            ctx.append(formatDocumentForPrompt(doc, count++));
        }
        ctx.append("=== HET ===\n");
        return ctx.toString();
    }

    private String formatDocumentForPrompt(Document doc, int index) {
        StringBuilder sb = new StringBuilder();
        Map<String, Object> meta = doc.getMetadata();

        sb.append(index).append(". ");
        sb.append(meta.getOrDefault("name", "N/A"));

        String brand = (String) meta.getOrDefault("brand", "");
        if (!brand.isEmpty()) sb.append(" - ").append(brand);

        // Danh mục sản phẩm
        String categories = (String) meta.getOrDefault("categories", "");
        if (!categories.isEmpty()) sb.append(" | Danh muc: ").append(categories);

        // Chất liệu
        String material = (String) meta.getOrDefault("material", "");
        if (!material.isEmpty()) sb.append(" | Chat lieu: ").append(material);

        Object minPrice = meta.get("minPrice");
        Object maxPrice = meta.get("maxPrice");
        if (minPrice != null) {
            sb.append(" | Gia: ").append(String.format("%,d", ((Number) minPrice).longValue())).append(" VND");
            if (maxPrice != null && !maxPrice.equals(minPrice)) {
                sb.append(" - ").append(String.format("%,d", ((Number) maxPrice).longValue())).append(" VND");
            }
        }

        String colors = (String) meta.getOrDefault("colors", "");
        if (!colors.isEmpty()) sb.append(" | Mau: ").append(colors);

        String sizes = (String) meta.getOrDefault("sizes", "");
        if (!sizes.isEmpty()) sb.append(" | Size: ").append(sizes);

        Object stock = meta.get("totalStock");
        boolean inStock = (boolean) meta.getOrDefault("inStock", false);
        if (inStock && stock != null) {
            sb.append(" | Ton kho: ").append(stock).append(" sp");
        } else {
            sb.append(" | HET HANG");
        }


        String slug = (String) meta.getOrDefault("slug", "");
        if (!slug.isEmpty()) sb.append(" | Link: /products/").append(slug);

        sb.append("\n");
        return sb.toString();
    }

    private String formatProductForPrompt(ProductCatalogDTO product, int index) {
        return index + ". " + product.toAiDescription() + "\n";
    }
}

