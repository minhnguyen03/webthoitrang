package fit.iuh.edu.fashion.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.edu.fashion.config.VNPayConfig;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.PaymentTransaction;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.PaymentTransactionRepository;
import fit.iuh.edu.fashion.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentService paymentService;

    public String createPaymentUrl(Order order, HttpServletRequest request) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", order.getGrandTotal().multiply(new BigDecimal(100)).toBigIntegerExact().toString());
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + order.getCode());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", normalizedReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(calendar.getTime()));
        calendar.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(calendar.getTime()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        List<String> queryPairs = new ArrayList<>();
        List<String> hashPairs = new ArrayList<>();
        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) continue;
            hashPairs.add(fieldName + "=" + URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            queryPairs.add(URLEncoder.encode(fieldName, StandardCharsets.UTF_8) + "=" + URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
        }

        String hashData = String.join("&", hashPairs);
        String queryUrl = String.join("&", queryPairs);
        String secureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);

        queryUrl += "&vnp_SecureHashType=HmacSHA512";
        queryUrl += "&vnp_SecureHash=" + secureHash;
        return vnPayConfig.getVnpUrl() + "?" + queryUrl;
    }

    private String normalizedReturnUrl() {
        String returnUrl = vnPayConfig.getReturnUrl() == null ? "" : vnPayConfig.getReturnUrl().trim();
        try {
            URI uri = URI.create(returnUrl);
            if (uri.isAbsolute() && ("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme()))
                    && uri.getHost() != null) {
                return returnUrl;
            }
        } catch (IllegalArgumentException ignored) {
            // Fall through to a clear business error instead of generating a broken VNPay URL.
        }

        throw new BusinessException("VNPAY_RETURN_URL phải là URL tuyệt đối hợp lệ, ví dụ: https://your-ngrok.ngrok-free.app/api/payment/vnpay/callback");
    }

    @Transactional
    public int processCallback(Map<String, String> params) {
        if (!isSignatureValid(params)) {
            return -2;
        }

        String orderCode = params.get("vnp_TxnRef");
        Optional<Order> orderOpt = orderRepository.findByCode(orderCode);
        if (orderOpt.isEmpty()) {
            return -1;
        }

        Order order = orderOpt.get();
        if (!isAmountValid(order, params)) {
            return -3;
        }
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            return 1;
        }

        return applyVNPayResult(order, params, "RETURN_CALLBACK") ? 1 : 0;
    }

    @Transactional
    public Map<String, String> processIpn(Map<String, String> params) {
        Map<String, String> response = new HashMap<>();

        if (!isSignatureValid(params)) {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum");
            return response;
        }

        Optional<Order> orderOpt = orderRepository.findByCode(params.get("vnp_TxnRef"));
        if (orderOpt.isEmpty()) {
            response.put("RspCode", "01");
            response.put("Message", "Order not Found");
            return response;
        }

        Order order = orderOpt.get();
        if (!isAmountValid(order, params)) {
            response.put("RspCode", "04");
            response.put("Message", "Invalid Amount");
            return response;
        }
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            response.put("RspCode", "02");
            response.put("Message", "Order already confirmed");
            return response;
        }

        applyVNPayResult(order, params, "IPN");
        response.put("RspCode", "00");
        response.put("Message", "Confirm Success");
        return response;
    }

    private boolean applyVNPayResult(Order order, Map<String, String> params, String transactionType) {
        savePaymentTransaction(order, params, transactionType);

        String responseCode = params.get("vnp_ResponseCode");
        String transactionId = params.get("vnp_TransactionNo");
        if ("00".equals(responseCode)) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setPaymentTransactionId(transactionId);
            order.setPaymentTime(LocalDateTime.now());
            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);
            log.info("Order {} payment confirmed via {}", order.getCode(), transactionType);
            return true;
        }

        order.setPaymentStatus(Order.PaymentStatus.FAILED);
        orderRepository.save(order);
        log.warn("Order {} payment failed via {}. Response code: {}", order.getCode(), transactionType, responseCode);
        return false;
    }

    private boolean isSignatureValid(Map<String, String> params) {
        String secureHash = params.get("vnp_SecureHash");
        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");
        String signValue = VNPayUtil.hashAllFields(fields, vnPayConfig.getHashSecret());
        return signValue.equals(secureHash);
    }

    private boolean isAmountValid(Order order, Map<String, String> params) {
        try {
            long vnpAmount = Long.parseLong(params.get("vnp_Amount"));
            long expected = order.getGrandTotal().multiply(new BigDecimal(100)).longValueExact();
            return vnpAmount == expected;
        } catch (Exception e) {
            return false;
        }
    }

    private void savePaymentTransaction(Order order, Map<String, String> params, String transactionType) {
        try {
            BigDecimal amount = new BigDecimal(params.get("vnp_Amount")).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            String responseCode = params.get("vnp_ResponseCode");
            PaymentTransaction.TransactionStatus status;
            if ("00".equals(responseCode)) {
                status = PaymentTransaction.TransactionStatus.SUCCESS;
            } else if (responseCode != null && responseCode.startsWith("24")) {
                status = PaymentTransaction.TransactionStatus.CANCELLED;
            } else {
                status = PaymentTransaction.TransactionStatus.FAILED;
            }

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .order(order)
                    .transactionId(params.get("vnp_TransactionNo"))
                    .txnRef(params.get("vnp_TxnRef"))
                    .amount(amount)
                    .paymentMethod(Order.PaymentMethod.VNPAY)
                    .status(status)
                    .responseCode(responseCode)
                    .bankCode(params.get("vnp_BankCode"))
                    .bankTranNo(params.get("vnp_BankTranNo"))
                    .cardType(params.get("vnp_CardType"))
                    .payDate(params.get("vnp_PayDate"))
                    .orderInfo(params.get("vnp_OrderInfo"))
                    .transactionType(transactionType)
                    .secureHash(params.get("vnp_SecureHash"))
                    .rawData(new ObjectMapper().writeValueAsString(params))
                    .build();

            paymentTransactionRepository.save(transaction);
            paymentService.createPaymentFromTransaction(transaction);
        } catch (Exception e) {
            log.error("Failed to save VNPay transaction for order {}", order.getCode(), e);
        }
    }
}
