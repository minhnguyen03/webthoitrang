package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PromotionRetrievalService {

    private final CouponRepository couponRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public String retrieveActivePromotions() {
        log.info("RAG: Retrieving active promotions");
        List<Coupon> coupons = findUsableCoupons();

        if (coupons.isEmpty()) {
            return "KHONG CO MA GIAM GIA DANG AP DUNG TU HE THONG.\n";
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("THONG TIN KHUYEN MAI THUC TU HE THONG (").append(coupons.size()).append(" ma):\n\n");
        for (Coupon c : coupons) {
            ctx.append("- Ma: ").append(c.getCode());
            if (c.getType() == Coupon.CouponType.PERCENT) {
                ctx.append(" | Giam ").append(c.getValue()).append("%");
                if (c.getMaxDiscount() != null) {
                    ctx.append(" (toi da ").append(String.format("%,d VND", c.getMaxDiscount().longValue())).append(")");
                }
            } else {
                ctx.append(" | Giam ").append(String.format("%,d VND", c.getValue().longValue()));
            }
            if (c.getMinOrderAmount() != null) {
                ctx.append(" | Don toi thieu: ").append(String.format("%,d VND", c.getMinOrderAmount().longValue()));
            }
            if (c.getEndAt() != null) {
                ctx.append(" | HSD: ").append(c.getEndAt().format(DATE_FMT));
            }
            if (c.getUsageLimit() != null) {
                int remaining = c.getUsageLimit() - (c.getUsedCount() != null ? c.getUsedCount() : 0);
                ctx.append(" | Con ").append(remaining).append(" luot");
            }
            ctx.append("\n");
        }
        ctx.append("\nCHI gioi thieu ma giam gia CO TRONG danh sach. KHONG bia them.\n");
        return ctx.toString();
    }

    public String retrieveActivePromotionAnswer() {
        List<Coupon> coupons = findUsableCoupons();
        if (coupons.isEmpty()) {
            List<Coupon> currentCoupons = findCurrentCoupons();
            if (!currentCoupons.isEmpty()) {
                return buildUnavailableCouponAnswer(currentCoupons);
            }
            return "Hi\u1ec7n t\u1ea1i ch\u01b0a c\u00f3 m\u00e3 gi\u1ea3m gi\u00e1 n\u00e0o \u0111ang ho\u1ea1t \u0111\u1ed9ng. "
                    + "B\u1ea1n mu\u1ed1n t\u00ecm s\u1ea3n ph\u1ea9m \u0111\u1ec3 \u00e1p d\u1ee5ng m\u00e3 gi\u1ea3m gi\u00e1 khi c\u00f3 m\u00e3 m\u1edbi?";
        }

        StringBuilder answer = new StringBuilder();
        answer.append("Hi\u1ec7n c\u00f3 ").append(coupons.size())
                .append(" m\u00e3 gi\u1ea3m gi\u00e1 \u0111ang \u00e1p d\u1ee5ng:\n");
        for (Coupon coupon : coupons) {
            answer.append("- **").append(coupon.getCode()).append("**: ")
                    .append(formatDiscount(coupon));
            if (coupon.getMinOrderAmount() != null) {
                answer.append(" | \u0110\u01a1n t\u1ed1i thi\u1ec3u: ")
                        .append(formatMoney(coupon.getMinOrderAmount()));
            }
            if (coupon.getEndAt() != null) {
                answer.append(" | HSD: ").append(coupon.getEndAt().format(DATE_FMT));
            }
            if (coupon.getUsageLimit() != null) {
                int remaining = coupon.getUsageLimit() - (coupon.getUsedCount() != null ? coupon.getUsedCount() : 0);
                answer.append(" | C\u00f2n ").append(Math.max(remaining, 0)).append(" l\u01b0\u1ee3t");
            }
            answer.append("\n");
        }
        answer.append("\nB\u1ea1n mu\u1ed1n t\u00ecm s\u1ea3n ph\u1ea9m \u0111\u1ec3 \u00e1p d\u1ee5ng m\u00e3 gi\u1ea3m gi\u00e1?");
        return answer.toString();
    }

    private List<Coupon> findUsableCoupons() {
        return couponRepository.findUsableCoupons(LocalDateTime.now());
    }

    private List<Coupon> findCurrentCoupons() {
        return couponRepository.findCurrentCoupons(LocalDateTime.now());
    }

    private String buildUnavailableCouponAnswer(List<Coupon> coupons) {
        StringBuilder answer = new StringBuilder();
        answer.append("Hi\u1ec7n c\u00f3 m\u00e3 gi\u1ea3m gi\u00e1 trong h\u1ec7 th\u1ed1ng, nh\u01b0ng ch\u01b0a c\u00f3 m\u00e3 n\u00e0o c\u00f2n l\u01b0\u1ee3t \u00e1p d\u1ee5ng:\n");
        for (Coupon coupon : coupons) {
            answer.append("- **").append(coupon.getCode()).append("**: ")
                    .append(formatDiscount(coupon));
            if (coupon.getEndAt() != null) {
                answer.append(" | HSD: ").append(coupon.getEndAt().format(DATE_FMT));
            }
            answer.append(" | ").append(unavailableReason(coupon)).append("\n");
        }
        answer.append("\nB\u1ea1n mu\u1ed1n t\u00ecm s\u1ea3n ph\u1ea9m kh\u00e1c ho\u1eb7c quay l\u1ea1i khi c\u00f3 m\u00e3 m\u1edbi?");
        return answer.toString();
    }

    private String unavailableReason(Coupon coupon) {
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null
                && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return "\u0110\u00e3 h\u1ebft l\u01b0\u1ee3t s\u1eed d\u1ee5ng ("
                    + coupon.getUsedCount() + "/" + coupon.getUsageLimit() + ")";
        }
        return "Ch\u01b0a th\u1ec3 \u00e1p d\u1ee5ng cho \u0111\u01a1n m\u1edbi";
    }

    private String formatDiscount(Coupon coupon) {
        if (coupon.getType() == Coupon.CouponType.PERCENT) {
            String value = coupon.getValue().stripTrailingZeros().toPlainString();
            String discount = "Gi\u1ea3m " + value + "%";
            if (coupon.getMaxDiscount() != null) {
                discount += " (t\u1ed1i \u0111a " + formatMoney(coupon.getMaxDiscount()) + ")";
            }
            return discount;
        }
        return "Gi\u1ea3m " + formatMoney(coupon.getValue());
    }

    private String formatMoney(java.math.BigDecimal amount) {
        return String.format("%,d VND", amount.longValue());
    }
}
