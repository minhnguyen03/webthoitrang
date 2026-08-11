package fit.iuh.edu.fashion.dto.request;

import fit.iuh.edu.fashion.models.Coupon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    private String code;

    @NotNull(message = "Loại giảm giá không được để trống")
    private Coupon.CouponType type;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal value;

    private BigDecimal maxDiscount;

    private BigDecimal minOrderAmount;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startAt;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endAt;

    private Integer usageLimit;

    private Integer perUserLimit;

    private Boolean isActive;
}

