package fit.iuh.edu.fashion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponValidationResponse {
    private Boolean valid;
    private String code;
    private String message;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String reasonCode;
    private Integer remainingUsage;
    private BigDecimal minOrderAmount;
}
