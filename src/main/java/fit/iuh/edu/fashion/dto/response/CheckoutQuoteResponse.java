package fit.iuh.edu.fashion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutQuoteResponse {
    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal loyaltyDiscount;
    private BigDecimal shippingFee;
    private BigDecimal taxTotal;
    private BigDecimal grandTotal;
    private Integer loyaltyPointsUsed;
    private Integer loyaltyPointsEarned;
    private CouponValidationResponse coupon;
    private List<String> messages;
}
