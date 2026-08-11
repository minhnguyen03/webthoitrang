package fit.iuh.edu.fashion.services.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;

import static fit.iuh.edu.fashion.util.TextUtils.fixStuckVietnameseWords;

/**
 * Service bao boc ChatModel - xu ly generate blocking va streaming.
 * Ho tro toi da 4096 tokens output (~3K tu tieng Viet).
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AiModelService {

    private final ChatModel chatModel;

    @Value("${spring.ai.openai.chat.options.model:lmstudio-community/qwen3.5-2b}")
    private String modelName;

    @Value("${spring.ai.openai.base-url:http://127.0.0.1:1234}")
    private String baseUrl;


    /** Timeout cho streaming — thoi gian toi da giua 2 chunk (2 phut) */
    private static final Duration STREAM_CHUNK_TIMEOUT = Duration.ofMinutes(2);

    /** Timeout tong cho 1 stream session (10 phut) */
    private static final Duration STREAM_TOTAL_TIMEOUT = Duration.ofMinutes(10);

    public String getModelName() {
        return modelName;
    }

    /**
     * Generate blocking response — ho tro 4K tokens output.
     */
    public String generate(String userMessage, String systemPrompt) {
        long startTime = System.currentTimeMillis();
        log.info("AI Generate START — prompt length: system={}chars, user={}chars",
                systemPrompt.length(), userMessage.length());
        try {
            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(userMessage)
            ));
            var response = chatModel.call(prompt);
            String result = response.getResult().getOutput().getContent();

            // Post-process: fix Vietnamese words stuck together (e.g. "ÁothunpoloJacquard")
            result = fixStuckVietnameseWords(result);

            long duration = System.currentTimeMillis() - startTime;
            int resultLen = result != null ? result.length() : 0;
            log.info("AI Generate DONE — {}chars in {}ms ({} tokens/s approx)",
                    resultLen, duration, duration > 0 ? (resultLen * 1000L / duration) : 0);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("AI Generate FAILED after {}ms: {}", duration, e.getMessage());
            if (isConnectionError(e)) {
                throw new AiServiceUnavailableException("LM Studio is not running", e);
            }
            throw e;
        }
    }

    /**
     * Generate streaming response — ho tro 4K tokens output.
     * Streaming giup hien thi tung chunk ngay lap tuc, khong can cho het.
     */
    public Flux<String> generateStream(String userMessage, String systemPrompt) {
        log.info("AI Stream START — prompt length: system={}chars, user={}chars",
                systemPrompt.length(), userMessage.length());
        long startTime = System.currentTimeMillis();
        try {
            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(userMessage)
            ));
            return chatModel.stream(prompt)
                    .map(response -> {
                        if (response.getResult() != null && response.getResult().getOutput() != null) {
                            String content = response.getResult().getOutput().getContent();
                            return content != null ? content : "";
                        }
                        return "";
                    })
                    .filter(s -> !s.isEmpty())
                    // NOTE: Không apply fixStuckVietnameseWords trên streaming chunks
                    // vì markdown links có thể bị cắt giữa 2 buffer gây phá slug.
                    // Frontend JS sẽ xử lý fix Vietnamese trên full accumulated text.
                    .timeout(STREAM_CHUNK_TIMEOUT)   // timeout giua 2 chunk
                    .take(STREAM_TOTAL_TIMEOUT)       // timeout tong
                    .doOnComplete(() -> {
                        long duration = System.currentTimeMillis() - startTime;
                        log.info("AI Stream DONE in {}ms", duration);
                    })
                    .doOnError(e -> {
                        long duration = System.currentTimeMillis() - startTime;
                        log.warn("AI Stream ERROR after {}ms: {}", duration, e.getMessage());
                    });
        } catch (Exception e) {
            log.error("AI streaming init error: {}", e.getMessage());
            if (isConnectionError(e)) {
                throw new AiServiceUnavailableException("LM Studio is not running", e);
            }
            throw e;
        }
    }

    /**
     * Health check — lightweight HTTP ping to LM Studio /v1/models endpoint.
     * Không gửi real chat request để tiết kiệm tài nguyên.
     */
    public boolean isAvailable() {
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(baseUrl)
                    .build();
            client.get()
                    .uri("/v1/models")
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (Exception e) {
            log.debug("LM Studio health check failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean isConnectionError(Exception e) {
        String msg = e.getMessage();
        return msg != null && (msg.contains("Connection refused") || msg.contains("connect"));
    }
}
