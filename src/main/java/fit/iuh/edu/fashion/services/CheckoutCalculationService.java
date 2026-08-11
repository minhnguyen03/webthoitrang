package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.dto.request.OrderItemRequest;
import fit.iuh.edu.fashion.dto.request.OrderRequest;
import fit.iuh.edu.fashion.dto.response.CheckoutQuoteResponse;
import fit.iuh.edu.fashion.dto.response.CouponValidationResponse;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.exception.InsufficientStockException;
import fit.iuh.edu.fashion.exception.ResourceNotFoundException;
import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.models.CustomerProfile;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.ProductVariant;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CheckoutCalculationService {

    public static final BigDecimal LOYALTY_POINT_VALUE = BigDecimal.valueOf(1000);
    public static final BigDecimal LOYALTY_EARN_UNIT = BigDecimal.valueOf(50000);

    private static final Set<Order.OrderStatus> COUPON_EXCLUDED_STATUSES = Set.of(
            Order.OrderStatus.CANCELLED,
            Order.OrderStatus.REFUNDED
    );

    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public CheckoutQuoteResponse quote(Long userId, OrderRequest request) {
        BigDecimal subtotal = calculateSubtotalForQuote(request.getItems());
        return calculate(userId, subtotal, request.getCouponCode(), request.getLoyaltyPointsToUse(), false);
    }

    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(Long userId, String code, BigDecimal orderAmount) {
        return validateCouponInternal(userId, normalizeCode(code), orderAmount);
    }

    @Transactional(readOnly = true)
    public CheckoutQuoteResponse calculate(Long userId, BigDecimal subtotal, String couponCode, Integer requestedPoints, boolean strictCoupon) {
        List<String> messages = new ArrayList<>();
        CouponValidationResponse couponResponse = null;
        BigDecimal discountTotal = BigDecimal.ZERO;
        String normalizedCouponCode = normalizeCode(couponCode);

        if (normalizedCouponCode != null) {
            couponResponse = validateCouponInternal(userId, normalizedCouponCode, subtotal);
            if (Boolean.TRUE.equals(couponResponse.getValid())) {
                discountTotal = couponResponse.getDiscountAmount();
            } else if (strictCoupon) {
                throw new BusinessException(couponResponse.getMessage());
            } else {
                messages.add(couponResponse.getMessage());
            }
        }

        BigDecimal maxLoyaltyDiscount = subtotal.subtract(discountTotal);
        if (maxLoyaltyDiscount.compareTo(BigDecimal.ZERO) < 0) {
            maxLoyaltyDiscount = BigDecimal.ZERO;
        }

        int pointsRequested = requestedPoints == null ? 0 : Math.max(0, requestedPoints);
        int availablePoints = getAvailableLoyaltyPoints(userId);
        int maxPointsByOrder = maxLoyaltyDiscount.divide(LOYALTY_POINT_VALUE, 0, RoundingMode.DOWN).intValue();
        int pointsUsed = Math.min(pointsRequested, Math.min(availablePoints, maxPointsByOrder));

        if (pointsRequested > pointsUsed) {
            messages.add("Số điểm vượt quá điểm khả dụng hoặc tổng đơn.");
        }

        BigDecimal loyaltyDiscount = BigDecimal.valueOf(pointsUsed).multiply(LOYALTY_POINT_VALUE);
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal taxTotal = BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal
                .subtract(discountTotal)
                .subtract(loyaltyDiscount)
                .add(shippingFee)
                .add(taxTotal);

        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }

        int pointsEarned = grandTotal.divide(LOYALTY_EARN_UNIT, 0, RoundingMode.DOWN).intValue();

        return CheckoutQuoteResponse.builder()
                .subtotal(subtotal)
                .discountTotal(discountTotal)
                .loyaltyDiscount(loyaltyDiscount)
                .shippingFee(shippingFee)
                .taxTotal(taxTotal)
                .grandTotal(grandTotal)
                .loyaltyPointsUsed(pointsUsed)
                .loyaltyPointsEarned(pointsEarned)
                .coupon(couponResponse)
                .messages(messages)
                .build();
    }

    private BigDecimal calculateSubtotalForQuote(List<OrderItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("Không thể tạo đơn vì dữ liệu giỏ hàng đã thay đổi.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest item : items) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found: " + item.getVariantId()));

            if (!Boolean.TRUE.equals(variant.getProduct().getIsActive()) || !Boolean.TRUE.equals(variant.getIsActive())) {
                throw new BusinessException("Sản phẩm hiện không còn bán.");
            }
            if (variant.getStock() < item.getQuantity()) {
                throw new InsufficientStockException(
                        String.format("Chỉ còn %d sản phẩm cho lựa chọn này.", variant.getStock())
                );
            }

            subtotal = subtotal.add(variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return subtotal;
    }

    private CouponValidationResponse validateCouponInternal(Long userId, String code, BigDecimal orderAmount) {
        BigDecimal safeOrderAmount = orderAmount == null ? BigDecimal.ZERO : orderAmount;
        LocalDateTime now = LocalDateTime.now();
        Coupon coupon = couponRepository.findByCode(code)
                .orElse(null);

        if (coupon == null) {
            return invalid(code, "Mã giảm giá không tồn tại.", "NOT_FOUND", safeOrderAmount, null, null);
        }
        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            return invalid(code, "Mã giảm giá hiện chưa được kích hoạt.", "INACTIVE", safeOrderAmount, coupon, null);
        }
        if (coupon.getStartAt() != null && coupon.getStartAt().isAfter(now)) {
            return invalid(code, "Mã giảm giá chưa đến thời gian sử dụng.", "NOT_STARTED", safeOrderAmount, coupon, null);
        }
        if (coupon.getEndAt() != null && coupon.getEndAt().isBefore(now)) {
            return invalid(code, "Mã giảm giá đã hết hạn.", "EXPIRED", safeOrderAmount, coupon, null);
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return invalid(code, "Mã " + code + " còn thời hạn nhưng đã hết lượt sử dụng.", "USAGE_EXHAUSTED", safeOrderAmount, coupon, 0);
        }
        if (coupon.getMinOrderAmount() != null && safeOrderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            return invalid(
                    code,
                    "Đơn tối thiểu " + money(coupon.getMinOrderAmount()) + " để dùng mã này.",
                    "MIN_ORDER_NOT_MET",
                    safeOrderAmount,
                    coupon,
                    remainingUsage(coupon)
            );
        }
        if (coupon.getPerUserLimit() != null && userId != null) {
            long usedByUser = orderRepository.countActiveCouponUsesByCustomer(userId, code, COUPON_EXCLUDED_STATUSES);
            if (usedByUser >= coupon.getPerUserLimit()) {
                return invalid(code, "Bạn đã dùng hết lượt cho mã giảm giá này.", "PER_USER_LIMIT", safeOrderAmount, coupon, remainingUsage(coupon));
            }
        }

        BigDecimal discount = calculateDiscount(coupon, safeOrderAmount);
        BigDecimal finalAmount = safeOrderAmount.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        return CouponValidationResponse.builder()
                .valid(true)
                .code(code)
                .message("Mã " + code + " giảm " + money(discount) + ". Tổng mới: " + money(finalAmount) + ".")
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .reasonCode("VALID")
                .remainingUsage(remainingUsage(coupon))
                .minOrderAmount(coupon.getMinOrderAmount())
                .build();
    }

    private CouponValidationResponse invalid(String code, String message, String reasonCode, BigDecimal orderAmount, Coupon coupon, Integer remainingUsage) {
        return CouponValidationResponse.builder()
                .valid(false)
                .code(code)
                .message(message)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(orderAmount)
                .reasonCode(reasonCode)
                .remainingUsage(remainingUsage)
                .minOrderAmount(coupon != null ? coupon.getMinOrderAmount() : null)
                .build();
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;
        if (coupon.getType() == Coupon.CouponType.PERCENT) {
            discount = subtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            discount = coupon.getValue();
        }
        return discount.min(subtotal).max(BigDecimal.ZERO);
    }

    private int getAvailableLoyaltyPoints(Long userId) {
        if (userId == null) return 0;
        return customerProfileRepository.findById(userId)
                .map(CustomerProfile::getLoyaltyPoint)
                .orElse(0);
    }

    private Integer remainingUsage(Coupon coupon) {
        if (coupon.getUsageLimit() == null) return null;
        return Math.max(0, coupon.getUsageLimit() - coupon.getUsedCount());
    }

    private String normalizeCode(String code) {
        if (code == null || code.isBlank()) return null;
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String money(BigDecimal value) {
        return String.format("%,.0f ₫", value);
    }
}
