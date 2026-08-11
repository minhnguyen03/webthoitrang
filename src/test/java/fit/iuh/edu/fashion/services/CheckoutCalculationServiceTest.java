package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.dto.response.CouponValidationResponse;
import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.ProductVariantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckoutCalculationServiceTest {

    @Mock
    ProductVariantRepository productVariantRepository;

    @Mock
    CouponRepository couponRepository;

    @Mock
    CustomerProfileRepository customerProfileRepository;

    @Mock
    OrderRepository orderRepository;

    @InjectMocks
    CheckoutCalculationService checkoutCalculationService;

    @Test
    void validateCouponReportsCurrentButExhaustedCoupon() {
        Coupon coupon = baseCoupon();
        coupon.setUsageLimit(2);
        coupon.setUsedCount(2);
        when(couponRepository.findByCode("A111")).thenReturn(Optional.of(coupon));

        CouponValidationResponse response = checkoutCalculationService.validateCoupon(
                1L,
                "A111",
                BigDecimal.valueOf(150000)
        );

        assertThat(response.getValid()).isFalse();
        assertThat(response.getReasonCode()).isEqualTo("USAGE_EXHAUSTED");
        assertThat(response.getMessage()).contains("hết lượt sử dụng");
        assertThat(response.getRemainingUsage()).isZero();
    }

    @Test
    void validateCouponReturnsDiscountAndFinalAmountForUsableCoupon() {
        Coupon coupon = baseCoupon();
        when(couponRepository.findByCode("A111")).thenReturn(Optional.of(coupon));
        when(orderRepository.countActiveCouponUsesByCustomer(eq(1L), eq("A111"), anyCollection())).thenReturn(0L);

        CouponValidationResponse response = checkoutCalculationService.validateCoupon(
                1L,
                "A111",
                BigDecimal.valueOf(150000)
        );

        assertThat(response.getValid()).isTrue();
        assertThat(response.getDiscountAmount()).isEqualByComparingTo("20000");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("130000");
        assertThat(response.getReasonCode()).isEqualTo("VALID");
    }

    @Test
    void validateCouponEnforcesPerUserLimit() {
        Coupon coupon = baseCoupon();
        coupon.setPerUserLimit(1);
        when(couponRepository.findByCode("A111")).thenReturn(Optional.of(coupon));
        when(orderRepository.countActiveCouponUsesByCustomer(eq(1L), eq("A111"), anyCollection())).thenReturn(1L);

        CouponValidationResponse response = checkoutCalculationService.validateCoupon(
                1L,
                "A111",
                BigDecimal.valueOf(150000)
        );

        assertThat(response.getValid()).isFalse();
        assertThat(response.getReasonCode()).isEqualTo("PER_USER_LIMIT");
    }

    private Coupon baseCoupon() {
        return Coupon.builder()
                .code("A111")
                .type(Coupon.CouponType.FIXED)
                .value(BigDecimal.valueOf(20000))
                .minOrderAmount(BigDecimal.valueOf(100000))
                .startAt(LocalDateTime.now().minusDays(1))
                .endAt(LocalDateTime.now().plusDays(1))
                .usageLimit(10)
                .usedCount(0)
                .perUserLimit(1)
                .isActive(true)
                .build();
    }
}
