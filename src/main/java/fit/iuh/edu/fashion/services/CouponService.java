package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.dto.request.CouponRequest;
import fit.iuh.edu.fashion.dto.response.CouponValidationResponse;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.exception.DuplicateResourceException;
import fit.iuh.edu.fashion.exception.ResourceNotFoundException;
import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponService {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CheckoutCalculationService checkoutCalculationService;

    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(Long userId, String code, BigDecimal orderAmount) {
        return checkoutCalculationService.validateCoupon(userId, code, orderAmount);
    }

    @Transactional(readOnly = true)
    public Page<Coupon> getAllCoupons(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return couponRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findActiveCoupons(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại"));
    }

    @Transactional
    public Coupon createCoupon(CouponRequest request, Long creatorId) {
        String code = request.getCode().toUpperCase();
        if (couponRepository.findByCode(code).isPresent()) {
            auditDuplicate(code);
            throw new DuplicateResourceException("Mã giảm giá đã tồn tại");
        }

        validateCouponRequest(request);

        User creator = userRepository.findById(creatorId).orElse(null);
        Coupon coupon = Coupon.builder()
                .code(code)
                .type(request.getType())
                .value(request.getValue())
                .maxDiscount(request.getMaxDiscount())
                .minOrderAmount(request.getMinOrderAmount())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .usageLimit(request.getUsageLimit())
                .perUserLimit(request.getPerUserLimit())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .usedCount(0)
                .createdBy(creator)
                .build();

        Coupon saved = couponRepository.save(coupon);
        log.info("Coupon created: {} by user {}", saved.getCode(), creatorId);
        return saved;
    }

    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request) {
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại"));

        String code = request.getCode().toUpperCase();
        if (!existingCoupon.getCode().equals(code) && couponRepository.findByCode(code).isPresent()) {
            auditDuplicate(code);
            throw new DuplicateResourceException("Mã giảm giá đã tồn tại");
        }

        validateCouponRequest(request);

        existingCoupon.setCode(code);
        existingCoupon.setType(request.getType());
        existingCoupon.setValue(request.getValue());
        existingCoupon.setMaxDiscount(request.getMaxDiscount());
        existingCoupon.setMinOrderAmount(request.getMinOrderAmount());
        existingCoupon.setStartAt(request.getStartAt());
        existingCoupon.setEndAt(request.getEndAt());
        existingCoupon.setUsageLimit(request.getUsageLimit());
        existingCoupon.setPerUserLimit(request.getPerUserLimit());
        existingCoupon.setIsActive(request.getIsActive());

        return couponRepository.save(existingCoupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mã giảm giá không tồn tại");
        }
        couponRepository.deleteById(id);
        log.info("Coupon deleted: {}", id);
    }

    @Transactional
    public Coupon toggleCouponStatus(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại"));

        coupon.setIsActive(!coupon.getIsActive());
        return couponRepository.save(coupon);
    }

    private void validateCouponRequest(CouponRequest request) {
        if (request.getStartAt().isAfter(request.getEndAt())) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày kết thúc");
        }
        validateCouponValue(request);
    }

    private void validateCouponValue(CouponRequest request) {
        if (request.getType() == Coupon.CouponType.PERCENT) {
            if (request.getValue().compareTo(BigDecimal.ZERO) <= 0 ||
                    request.getValue().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new BusinessException("Giá trị phần trăm phải từ 0 đến 100");
            }
        } else if (request.getValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Giá trị giảm giá phải lớn hơn 0");
        }
    }

    private void auditDuplicate(String code) {
        log.warn("Duplicate coupon code attempted: {}", code);
    }
}
