package fit.iuh.edu.fashion.config;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AiConfiguration {

    @Value("${spring.ai.openai.base-url}")
    private String baseUrl;

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model}")
    private String model;

    @Value("${spring.ai.openai.chat.options.temperature:0.35}")
    private Double temperature;

    @Value("${spring.ai.openai.chat.options.max-tokens:2048}")
    private Integer maxTokens;

    @Bean
    public RetryTemplate aiRetryTemplate() {
        // TẮT HOÀN TOÀN retry để tránh "Request cancelled" errors
        return RetryTemplate.builder()
                .maxAttempts(1)
                .build();
    }

    @Bean
    public ClientHttpRequestFactory aiClientHttpRequestFactory() {
        // Dùng SimpleClientHttpRequestFactory thay vì JdkClientHttpRequestFactory
        // vì nó ổn định hơn với timeout dài
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // Timeout cho LM Studio — qwen3.5-2b / 4096 tokens
        factory.setConnectTimeout(15000);   // 15 giây connect
        factory.setReadTimeout(300000);     // 300 giây read (5 phút)

        return factory;
    }

    @Bean
    public RestClient.Builder restClientBuilder(ClientHttpRequestFactory aiClientHttpRequestFactory) {
        return RestClient.builder()
                .requestFactory(aiClientHttpRequestFactory);
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .codecs(configurer -> configurer
                .defaultCodecs()
                .maxInMemorySize(32 * 1024 * 1024)); // 32MB for large token responses
    }

    @Bean
    public OpenAiApi openAiApi(RestClient.Builder restClientBuilder, WebClient.Builder webClientBuilder) {
        RestClient.Builder configuredRestBuilder = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey);

        WebClient.Builder configuredWebBuilder = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey);

        return new OpenAiApi(baseUrl, apiKey, configuredRestBuilder, configuredWebBuilder);
    }

    @Bean
    @Primary
    public ChatModel customChatModel(OpenAiApi openAiApi, RetryTemplate aiRetryTemplate) {
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withModel(model)
                .withTemperature(temperature)
                .withMaxTokens(maxTokens)
                .build();

        // Sử dụng constructor với 2 tham số (OpenAiApi và Options)
        // RetryTemplate được configure bên trong OpenAiChatModel
        return new OpenAiChatModel(openAiApi, options);
    }
}
