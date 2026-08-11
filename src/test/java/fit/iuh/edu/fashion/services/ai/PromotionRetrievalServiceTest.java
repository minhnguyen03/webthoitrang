package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PromotionRetrievalServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private PromotionRetrievalService promotionRetrievalService;

    @Test
    void promotionAnswerListsUsableCouponsFromDatabase() {
        LocalDateTime now = LocalDateTime.now();
        Coupon coupon = Coupon.builder()
                .code("SAVE10")
                .type(Coupon.CouponType.PERCENT)
                .value(new BigDecimal("10.00"))
                .maxDiscount(new BigDecimal("50000"))
                .minOrderAmount(new BigDecimal("100000"))
                .startAt(now.minusDays(1))
                .endAt(now.plusDays(7))
                .usageLimit(10)
                .usedCount(3)
                .isActive(true)
                .build();
        when(couponRepository.findUsableCoupons(any(LocalDateTime.class))).thenReturn(List.of(coupon));

        String answer = promotionRetrievalService.retrieveActivePromotionAnswer();

        assertThat(answer)
                .contains("SAVE10")
                .contains("Gi\u1ea3m 10%")
                .contains("C\u00f2n 7 l\u01b0\u1ee3t")
                .doesNotContain("ch\u01b0a c\u00f3 m\u00e3 gi\u1ea3m gi\u00e1 n\u00e0o");
    }

    @Test
    void promotionAnswerSaysNoCurrentCouponWhenDatabaseHasNoUsableCoupon() {
        when(couponRepository.findUsableCoupons(any(LocalDateTime.class))).thenReturn(List.of());
        when(couponRepository.findCurrentCoupons(any(LocalDateTime.class))).thenReturn(List.of());

        String answer = promotionRetrievalService.retrieveActivePromotionAnswer();

        assertThat(answer).contains("ch\u01b0a c\u00f3 m\u00e3 gi\u1ea3m gi\u00e1 n\u00e0o \u0111ang ho\u1ea1t \u0111\u1ed9ng");
    }

    @Test
    void promotionAnswerExplainsCurrentCouponThatHasNoRemainingUsage() {
        LocalDateTime now = LocalDateTime.now();
        Coupon coupon = Coupon.builder()
                .code("A111")
                .type(Coupon.CouponType.FIXED)
                .value(new BigDecimal("20000.00"))
                .minOrderAmount(new BigDecimal("100000"))
                .startAt(now.minusDays(1))
                .endAt(LocalDateTime.of(2027, 1, 11, 15, 2))
                .usageLimit(2)
                .usedCount(2)
                .isActive(true)
                .build();
        when(couponRepository.findUsableCoupons(any(LocalDateTime.class))).thenReturn(List.of());
        when(couponRepository.findCurrentCoupons(any(LocalDateTime.class))).thenReturn(List.of(coupon));

        String answer = promotionRetrievalService.retrieveActivePromotionAnswer();

        assertThat(answer)
                .contains("A111")
                .contains("HSD: 11/01/2027")
                .contains("\u0110\u00e3 h\u1ebft l\u01b0\u1ee3t s\u1eed d\u1ee5ng (2/2)");
    }
}
