package fit.iuh.edu.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequest {
    private String message;
    private String context; // Backward-compatible custom context.
    private String conversationId;
    private Boolean stream;
    private Map<String, Object> pageContext;
}

