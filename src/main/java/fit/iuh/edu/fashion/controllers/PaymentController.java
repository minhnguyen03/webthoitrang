package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.response.VNPayResponse;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.security.CustomUserDetails;
import fit.iuh.edu.fashion.services.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;
    private final OrderRepository orderRepository;

    @Value("${app.frontend-url:http://127.0.0.1:3000}")
    private String frontendUrl;

    @PostMapping("/vnpay/create")
    @ResponseBody
    public ResponseEntity<VNPayResponse> createVNPayPayment(
            @RequestParam Long orderId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletRequest request
    ) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            validateVNPayCreateAccess(order, userDetails);

            String paymentUrl = vnPayService.createPaymentUrl(order, request);

            VNPayResponse response = VNPayResponse.builder()
                    .code("00")
                    .message("success")
                    .paymentUrl(paymentUrl)
                    .orderId(order.getId())
                    .orderCode(order.getCode())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            VNPayResponse response = VNPayResponse.builder()
                    .code("99")
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/vnpay/callback")
    public RedirectView vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            int result = vnPayService.processCallback(params);
            String orderCode = params.get("vnp_TxnRef");

            if (result == 1) {
                return redirectToFrontendPayment("success", "orderCode", orderCode);
            } else if (result == 0) {
                return redirectToFrontendPayment("failed", "orderCode", orderCode);
            } else if (result == -3) {
                return redirectToFrontendPayment("error", "message", "Invalid payment amount");
            } else {
                return redirectToFrontendPayment("error", "message", "Invalid signature");
            }
        } catch (Exception e) {
            return redirectToFrontendPayment("error", "message", e.getMessage());
        }
    }

    @GetMapping("/vnpay/ipn")
    @ResponseBody
    public ResponseEntity<Map<String, String>> vnpayIpn(@RequestParam Map<String, String> params) {
        Map<String, String> resp = vnPayService.processIpn(params);
        return ResponseEntity.ok(resp);
    }

    private RedirectView redirectToFrontendPayment(String status, String paramName, String paramValue) {
        String normalizedFrontendUrl = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1)
                : frontendUrl;
        String encodedValue = URLEncoder.encode(paramValue == null ? "" : paramValue, StandardCharsets.UTF_8);
        return new RedirectView(normalizedFrontendUrl + "/payment/" + status + "?" + paramName + "=" + encodedValue);
    }

    private void validateVNPayCreateAccess(Order order, CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException("Vui lòng đăng nhập để thanh toán.");
        }

        boolean staff = hasAnyAuthority(userDetails, "ROLE_ADMIN", "ROLE_STAFF_SALES");
        if (!staff && !order.getCustomer().getId().equals(userDetails.getId())) {
            throw new BusinessException("You can only pay your own orders");
        }
        if (order.getPaymentMethod() != Order.PaymentMethod.VNPAY) {
            throw new BusinessException("Đơn hàng chưa chọn phương thức VNPay.");
        }
        if (order.getPaymentStatus() != Order.PaymentStatus.UNPAID) {
            throw new BusinessException("Đơn hàng không còn ở trạng thái chờ thanh toán.");
        }
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new BusinessException("Đơn hàng không thể thanh toán ở trạng thái hiện tại.");
        }
    }

    private boolean hasAnyAuthority(CustomUserDetails userDetails, String... authorities) {
        for (GrantedAuthority grantedAuthority : userDetails.getAuthorities()) {
            for (String authority : authorities) {
                if (authority.equals(grantedAuthority.getAuthority())) {
                    return true;
                }
            }
        }
        return false;
    }
}
