package fit.iuh.edu.fashion.config;

import org.springframework.ai.transformers.TransformersEmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import lombok.extern.slf4j.Slf4j;

/**
 * Config cho Vector Store + Embedding Model.
 *
 * Dung TransformersEmbeddingModel (ONNX local) cho embedding,
 * KHONG dung OpenAiEmbeddingModel (can LM Studio load embedding model).
 */
@Configuration
@Slf4j
public class VectorStoreConfig {

    /**
     * Local ONNX Embedding Model - chay offline, khong can API.
     * Dung @Primary de ghi de OpenAiEmbeddingModel auto-configured.
     */
    @Bean
    @Primary
    public TransformersEmbeddingModel embeddingModel() {
        log.info("Initializing local ONNX Transformer Embedding Model (all-MiniLM-L6-v2)...");
        return new TransformersEmbeddingModel();
    }

    @Bean
    public VectorStore vectorStore(TransformersEmbeddingModel embeddingModel) {
        log.info("Initializing SimpleVectorStore with local ONNX embedding");
        return new SimpleVectorStore(embeddingModel);
    }
}
