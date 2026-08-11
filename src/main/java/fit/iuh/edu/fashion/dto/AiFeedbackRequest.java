package fit.iuh.edu.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiFeedbackRequest {
    private String messageId;
    private String conversationId;
    private String rating;   // "POSITIVE" or "NEGATIVE"
    private String comment;  // Optional
}

