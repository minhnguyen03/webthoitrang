package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.dto.request.OrderRequest;
import fit.iuh.edu.fashion.dto.response.CheckoutQuoteResponse;
import fit.iuh.edu.fashion.dto.response.OrderItemResponse;
import fit.iuh.edu.fashion.dto.response.OrderResponse;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.exception.InsufficientStockException;
import fit.iuh.edu.fashion.exception.ResourceNotFoundException;
import fit.iuh.edu.fashion.models.Coupon;
import fit.iuh.edu.fashion.models.CustomerProfile;
import fit.iuh.edu.fashion.models.InventoryMovement;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.OrderItem;
import fit.iuh.edu.fashion.models.Payment;
import fit.iuh.edu.fashion.models.ProductVariant;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.CartItemRepository;
import fit.iuh.edu.fashion.repositories.CartRepository;
import fit.iuh.edu.fashion.repositories.CouponRepository;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import fit.iuh.edu.fashion.repositories.InventoryMovementRepository;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.ProductVariantRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final AuditService auditService;
    private final ProductService productService;
    private final PaymentService paymentService;
    private final CheckoutCalculationService checkoutCalculationService;

    @Transactional(readOnly = true)
    public Page<OrderResponse> getMyOrders(Long userId, Pageable pageable) {
        return orderRepository.findByCustomerId(userId, pageable)
                .map(this::mapToOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return mapToOrderResponse(findOrder(id));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForCustomer(Long id, Long userId) {
        Order order = findOrder(id);
        if (!order.getCustomer().getId().equals(userId)) {
            throw new BusinessException("You can only view your own orders");
        }
        return mapToOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToOrderResponse);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable)
                .map(this::mapToOrderResponse);
    }

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Order.PaymentMethod paymentMethod = parsePaymentMethod(request.getPaymentMethod());

        Order order = Order.builder()
                .code(createUniqueOrderCode())
                .customer(customer)
                .status(Order.OrderStatus.PENDING)
                .shipName(request.getShipName())
                .shipPhone(request.getShipPhone())
                .shipLine1(request.getShipLine1())
                .shipLine2(request.getShipLine2())
                .shipWard(request.getShipWard())
                .shipDistrict(request.getShipDistrict())
                .shipCity(request.getShipCity())
                .shipCountry(request.getShipCountry())
                .note(request.getNote())
                .paymentMethod(paymentMethod)
                .paymentStatus(Order.PaymentStatus.UNPAID)
                .items(new ArrayList<>())
                .build();

        java.math.BigDecimal subtotal = java.math.BigDecimal.ZERO;
        for (var itemRequest : request.getItems()) {
            ProductVariant variant = productVariantRepository.findByIdWithLock(itemRequest.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found: " + itemRequest.getVariantId()));

            if (!Boolean.TRUE.equals(variant.getProduct().getIsActive()) || !Boolean.TRUE.equals(variant.getIsActive())) {
                throw new BusinessException("Sản phẩm hiện không còn bán.");
            }

            int rowsAffected = productVariantRepository.decreaseStock(variant.getId(), itemRequest.getQuantity());
            if (rowsAffected == 0) {
                throw new InsufficientStockException(
                        String.format("Chỉ còn %d sản phẩm cho lựa chọn này.", variant.getStock())
                );
            }

            productVariantRepository.flush();
            variant = productVariantRepository.findById(variant.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(variant.getProduct())
                    .variant(variant)
                    .sku(variant.getSku())
                    .productName(variant.getProduct().getName())
                    .colorName(variant.getColor() != null ? variant.getColor().getName() : null)
                    .sizeName(variant.getSize() != null ? variant.getSize().getName() : null)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(variant.getPrice())
                    .discountAmount(java.math.BigDecimal.ZERO)
                    .lineTotal(variant.getPrice().multiply(java.math.BigDecimal.valueOf(itemRequest.getQuantity())))
                    .build();

            order.getItems().add(orderItem);
            subtotal = subtotal.add(orderItem.getLineTotal());
            productService.checkAndUpdateStockStatus(variant.getId());
        }

        order.setSubtotal(subtotal);
        CheckoutQuoteResponse quote = checkoutCalculationService.calculate(
                userId,
                subtotal,
                request.getCouponCode(),
                request.getLoyaltyPointsToUse(),
                true
        );
        applyQuote(order, quote);
        consumeCoupon(request.getCouponCode(), order);
        reserveLoyaltyPoints(customer.getId(), quote.getLoyaltyPointsUsed());

        order = orderRepository.save(order);
        createPaymentRecordIfNeeded(order);
        createInventoryMovements(order, customer);
        clearServerCart(customer);

        auditService.logAction("CREATE", "Order", order.getId(), null,
                String.format("Created order: %s, Total: %s", order.getCode(), order.getGrandTotal()));

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = findOrder(orderId);
        Order.OrderStatus oldStatus = order.getStatus();
        if (oldStatus == status) {
            return mapToOrderResponse(order);
        }

        order.setStatus(status);
        if (status == Order.OrderStatus.COMPLETED) {
            handleOrderCompleted(order, oldStatus);
        } else if (status == Order.OrderStatus.CANCELLED || status == Order.OrderStatus.REFUNDED) {
            restoreOrderStock(order);
            handleOrderCancelledOrRefunded(order, oldStatus);
        }

        order = orderRepository.save(order);
        auditService.logAction("UPDATE_STATUS", "Order", order.getId(),
                "Status: " + oldStatus, "Status: " + status);
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updatePaymentMethod(Long orderId, String paymentMethod, Long userId) {
        Order order = findOrder(orderId);
        if (!order.getCustomer().getId().equals(userId)) {
            throw new BusinessException("You can only update your own orders");
        }
        return updatePaymentMethodInternal(order, paymentMethod);
    }

    @Transactional
    public OrderResponse updatePaymentMethodForStaff(Long orderId, String paymentMethod) {
        return updatePaymentMethodInternal(findOrder(orderId), paymentMethod);
    }

    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = findOrder(orderId);
        if (!order.getCustomer().getId().equals(userId)) {
            throw new BusinessException("You can only cancel your own orders");
        }
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new BusinessException("Chỉ có thể hủy đơn hàng đang chờ xử lý hoặc đã xác nhận");
        }

        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(Order.OrderStatus.CANCELLED);
        handleOrderCancelledOrRefunded(order, oldStatus);
        restoreOrderStock(order);
        orderRepository.save(order);
        auditService.logAction("CANCEL", "Order", order.getId(), "Status: " + oldStatus, "Status: CANCELLED");
    }

    @Transactional
    public void processRefund(Long orderId, String adminReason) {
        Order order = findOrder(orderId);
        if (order.getPaymentStatus() != Order.PaymentStatus.PAID) {
            throw new BusinessException("Chỉ có thể hoàn tiền cho đơn hàng đã thanh toán");
        }

        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(Order.OrderStatus.REFUNDED);
        order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        refundPaymentRecords(order);
        restoreOrderStock(order);
        restoreLoyaltyPoints(order);
        deductEarnedLoyaltyPoints(order, oldStatus);
        restoreCouponUsage(order);
        orderRepository.save(order);

        auditService.logAction("REFUND", "Order", order.getId(),
                "Status: " + oldStatus + ", Payment: PAID",
                "Status: REFUNDED, Payment: REFUNDED, Manual reason: " + adminReason);
    }

    private OrderResponse updatePaymentMethodInternal(Order order, String paymentMethod) {
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new BusinessException("Cannot change payment method for orders in " + order.getStatus() + " status");
        }
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            throw new BusinessException("Cannot change payment method for already paid orders");
        }

        Order.PaymentMethod oldMethod = order.getPaymentMethod();
        Order.PaymentMethod newMethod = parsePaymentMethod(paymentMethod);

        paymentService.getPaymentsByOrder(order.getId()).forEach(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
                paymentService.updatePaymentStatus(payment.getId(), Payment.PaymentStatus.CANCELLED);
            }
        });

        order.setPaymentMethod(newMethod);
        order = orderRepository.save(order);
        auditService.logAction("UPDATE_PAYMENT_METHOD", "Order", order.getId(),
                "Payment Method: " + oldMethod, "Payment Method: " + newMethod);
        return mapToOrderResponse(order);
    }

    private void applyQuote(Order order, CheckoutQuoteResponse quote) {
        order.setDiscountTotal(quote.getDiscountTotal());
        order.setShippingFee(quote.getShippingFee());
        order.setTaxTotal(quote.getTaxTotal());
        order.setGrandTotal(quote.getGrandTotal());
        order.setLoyaltyPointsUsed(quote.getLoyaltyPointsUsed());
        order.setLoyaltyPointsEarned(quote.getLoyaltyPointsEarned());
    }

    private void consumeCoupon(String couponCode, Order order) {
        if (couponCode == null || couponCode.isBlank()) return;
        String normalizedCouponCode = couponCode.trim().toUpperCase(Locale.ROOT);
        Coupon coupon = couponRepository.findByCode(normalizedCouponCode)
                .orElseThrow(() -> new BusinessException("Mã giảm giá không tồn tại."));
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        order.setCouponCode(normalizedCouponCode);
    }

    private void reserveLoyaltyPoints(Long customerId, Integer pointsUsed) {
        if (pointsUsed == null || pointsUsed <= 0) return;
        CustomerProfile profile = customerProfileRepository.findById(customerId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy hồ sơ điểm thưởng."));
        if (profile.getLoyaltyPoint() < pointsUsed) {
            throw new BusinessException("Số điểm vượt quá điểm khả dụng hoặc tổng đơn.");
        }
        profile.setLoyaltyPoint(profile.getLoyaltyPoint() - pointsUsed);
        customerProfileRepository.save(profile);
    }

    private void createPaymentRecordIfNeeded(Order order) {
        if (order.getPaymentMethod() != Order.PaymentMethod.COD) return;
        try {
            paymentService.createCODPayment(order);
        } catch (Exception e) {
            log.error("Failed to create COD payment for order {}", order.getCode(), e);
        }
    }

    private void createInventoryMovements(Order order, User customer) {
        for (OrderItem item : order.getItems()) {
            InventoryMovement movement = InventoryMovement.builder()
                    .variant(item.getVariant())
                    .quantity(-item.getQuantity())
                    .reason(InventoryMovement.MovementReason.SALE)
                    .relatedOrder(order)
                    .note("Order: " + order.getCode())
                    .createdBy(customer)
                    .build();
            inventoryMovementRepository.save(movement);
        }
    }

    private void clearServerCart(User customer) {
        cartRepository.findByCustomer(customer).ifPresent(cart -> {
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private void handleOrderCompleted(Order order, Order.OrderStatus oldStatus) {
        if (order.getPaymentStatus() != Order.PaymentStatus.PAID) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setPaymentTime(LocalDateTime.now());
            if (order.getPaymentMethod() == Order.PaymentMethod.COD) {
                completePendingPayments(order);
            }
        }
        if (order.getLoyaltyPointsEarned() > 0 && oldStatus != Order.OrderStatus.COMPLETED) {
            addLoyaltyPoints(order.getCustomer().getId(), order.getLoyaltyPointsEarned());
        }
    }

    private void handleOrderCancelledOrRefunded(Order order, Order.OrderStatus oldStatus) {
        if (order.getPaymentStatus() == Order.PaymentStatus.UNPAID) {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
        } else if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
            refundPaymentRecords(order);
        }
        restoreLoyaltyPoints(order);
        deductEarnedLoyaltyPoints(order, oldStatus);
        restoreCouponUsage(order);
    }

    private void restoreLoyaltyPoints(Order order) {
        if (order.getLoyaltyPointsUsed() == null || order.getLoyaltyPointsUsed() <= 0) return;
        customerProfileRepository.findById(order.getCustomer().getId()).ifPresent(profile -> {
            profile.setLoyaltyPoint(profile.getLoyaltyPoint() + order.getLoyaltyPointsUsed());
            customerProfileRepository.save(profile);
        });
    }

    private void deductEarnedLoyaltyPoints(Order order, Order.OrderStatus oldStatus) {
        if (oldStatus != Order.OrderStatus.COMPLETED || order.getLoyaltyPointsEarned() == null || order.getLoyaltyPointsEarned() <= 0) return;
        customerProfileRepository.findById(order.getCustomer().getId()).ifPresent(profile -> {
            profile.setLoyaltyPoint(Math.max(0, profile.getLoyaltyPoint() - order.getLoyaltyPointsEarned()));
            customerProfileRepository.save(profile);
        });
    }

    private void addLoyaltyPoints(Long customerId, int points) {
        customerProfileRepository.findById(customerId).ifPresent(profile -> {
            profile.setLoyaltyPoint(profile.getLoyaltyPoint() + points);
            customerProfileRepository.save(profile);
        });
    }

    private void restoreCouponUsage(Order order) {
        if (order.getCouponCode() == null || order.getCouponCode().isBlank()) return;
        couponRepository.findByCode(order.getCouponCode()).ifPresent(coupon -> {
            coupon.setUsedCount(Math.max(0, coupon.getUsedCount() - 1));
            couponRepository.save(coupon);
        });
    }

    private void refundPaymentRecords(Order order) {
        paymentService.getPaymentsByOrder(order.getId()).forEach(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                paymentService.updatePaymentStatus(payment.getId(), Payment.PaymentStatus.REFUNDED);
            }
        });
    }

    private void completePendingPayments(Order order) {
        paymentService.getPaymentsByOrder(order.getId()).forEach(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
                paymentService.updatePaymentStatus(payment.getId(), Payment.PaymentStatus.COMPLETED);
            }
        });
    }

    private void restoreOrderStock(Order order) {
        for (OrderItem item : order.getItems()) {
            int rowsAffected = productVariantRepository.increaseStock(item.getVariant().getId(), item.getQuantity());
            if (rowsAffected == 0) {
                throw new RuntimeException("Failed to restore stock for variant: " + item.getVariant().getId());
            }
            productVariantRepository.flush();
            productService.checkAndUpdateStockStatus(item.getVariant().getId());
            InventoryMovement movement = InventoryMovement.builder()
                    .variant(item.getVariant())
                    .quantity(item.getQuantity())
                    .reason(InventoryMovement.MovementReason.RETURN)
                    .relatedOrder(order)
                    .note("Order " + order.getStatus() + ": " + order.getCode())
                    .build();
            inventoryMovementRepository.save(movement);
        }
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    private Order.PaymentMethod parsePaymentMethod(String value) {
        String method = value == null || value.isBlank() ? "COD" : value.trim().toUpperCase(Locale.ROOT);
        try {
            Order.PaymentMethod paymentMethod = Order.PaymentMethod.valueOf(method);
            if (paymentMethod == Order.PaymentMethod.MOMO || paymentMethod == Order.PaymentMethod.ZALOPAY) {
                throw new BusinessException("Phương thức thanh toán này sắp hỗ trợ. Vui lòng chọn COD hoặc VNPay.");
            }
            return paymentMethod;
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid payment method: " + value);
        }
    }

    private String createUniqueOrderCode() {
        for (int attempt = 0; attempt < 5; attempt++) {
            String code = generateOrderCode();
            if (!orderRepository.existsByCode(code)) {
                return code;
            }
        }
        return "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "-" + java.util.UUID.randomUUID().toString().replaceAll("[^A-Z0-9]", "").substring(0, 8).toUpperCase();
    }

    private String generateOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.format("%04X", new java.security.SecureRandom().nextInt(0xFFFF));
        return "ORD-" + timestamp + "-" + randomSuffix;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .code(order.getCode())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .discountTotal(order.getDiscountTotal())
                .shippingFee(order.getShippingFee())
                .taxTotal(order.getTaxTotal())
                .grandTotal(order.getGrandTotal())
                .note(order.getNote())
                .placedAt(order.getPlacedAt())
                .shipName(order.getShipName())
                .shipPhone(order.getShipPhone())
                .shipLine1(order.getShipLine1())
                .shipLine2(order.getShipLine2())
                .shipWard(order.getShipWard())
                .shipDistrict(order.getShipDistrict())
                .shipCity(order.getShipCity())
                .shipCountry(order.getShipCountry())
                .couponCode(order.getCouponCode())
                .loyaltyPointsUsed(order.getLoyaltyPointsUsed())
                .loyaltyPointsEarned(order.getLoyaltyPointsEarned())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)
                .paymentTransactionId(order.getPaymentTransactionId())
                .paymentTime(order.getPaymentTime())
                .items(order.getItems().stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .sku(item.getSku())
                .productName(item.getProductName())
                .colorName(item.getColorName())
                .sizeName(item.getSizeName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .discountAmount(item.getDiscountAmount())
                .lineTotal(item.getLineTotal())
                .build();
    }
}
