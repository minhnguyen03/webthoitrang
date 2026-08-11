package fit.iuh.edu.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {
    private String response;
    private String answer;
    private String model;
    private Long timestamp;
    private String messageId;
    private String conversationId;
    private String intent;
    private List<Source> sources;
    private List<ProductCardDTO> products;
    private List<QuickAction> actions;
    private Long latencyMs;
    private Boolean error;

    public AiChatResponse(String response, String model, Long timestamp) {
        this.response = response;
        this.answer = response;
        this.model = model;
        this.timestamp = timestamp;
        this.error = "error".equals(model);
    }

    public String getAnswer() {
        return answer != null ? answer : response;
    }

    public String getResponse() {
        return response != null ? response : answer;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Source {
        private String type;
        private String label;
        private String href;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuickAction {
        private String id;
        private String label;
        private String message;
        private String href;
    }
}
