package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.OrderItem;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderRetrievalService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Transactional(readOnly = true)
    public String retrieveOrderByCode(String orderCode, Long userId) {
        if (userId == null) {
            return buildLoginRequiredContext();
        }
        Optional<Order> orderOpt = orderRepository.findByCode(orderCode);
        if (orderOpt.isEmpty()) {
            return "THONG TIN DON HANG:\n\n"
                 + "❌ Khong tim thay don hang co ma \"" + orderCode + "\".\n"
                 + "Hay kiem tra lai ma don hang hoac lien he ho tro.\n"
                 + "\nCHI tra loi dua tren thong tin tren. KHONG bia them.\n";
        }
        Order order = orderOpt.get();
        if (!order.getCustomer().getId().equals(userId)) {
            return "THONG TIN DON HANG:\n\n"
                 + "❌ Ban khong co quyen xem don hang nay.\n"
                 + "\nCHI tra loi dua tren thong tin tren. KHONG bia them.\n";
        }
        return formatOrderDetailed(order);
    }

    @Transactional(readOnly = true)
    public String retrieveRecentOrders(Long userId) {
        if (userId == null) {
            return buildLoginRequiredContext();
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return "THONG TIN DON HANG:\n\n❌ Khong tim thay nguoi dung.\n";
        }
        List<Order> orders = orderRepository.findByCustomerOrderByPlacedAtDesc(userOpt.get());
        if (orders.isEmpty()) {
            return "THONG TIN DON HANG CUA KHACH HANG (du lieu thuc tu he thong):\n\n"
                 + "📦 Ban chua co don hang nao.\n"
                 + "Hay tham khao san pham va dat hang ngay!\n"
                 + "\nCHI tra loi dua tren thong tin tren. KHONG bia them.\n";
        }

        List<Order> recent = orders.stream().limit(5).toList();
        StringBuilder ctx = new StringBuilder();
        ctx.append("DANH SACH DON HANG CUA KHACH HANG (du lieu thuc tu he thong):\n");
        ctx.append("Tong cong: ").append(orders.size()).append(" don hang. Hien thi ").append(recent.size()).append(" don moi nhat.\n\n");

        int idx = 1;
        for (Order o : recent) {
            ctx.append("--- DON HANG ").append(idx++).append(" ---\n");
            ctx.append("📋 Ma don: **").append(o.getCode()).append("**\n");
            ctx.append("📅 Ngay dat: ").append(o.getPlacedAt() != null ? o.getPlacedAt().format(DATE_FMT) : "N/A").append("\n");
            ctx.append("📊 Trang thai don: ").append(statusEmoji(o.getStatus())).append(" ").append(statusTextVi(o.getStatus())).append("\n");
            ctx.append("💳 Phuong thuc thanh toan: ").append(paymentMethodText(o.getPaymentMethod())).append("\n");
            ctx.append("💰 Trang thai thanh toan: ").append(paymentStatusText(o.getPaymentStatus())).append("\n");
            ctx.append("💵 Tong tien: ").append(String.format("%,d VND", o.getGrandTotal().longValue())).append("\n");

            // Items summary
            if (o.getItems() != null && !o.getItems().isEmpty()) {
                ctx.append("🛍️ San pham (").append(o.getItems().size()).append(" mon):\n");
                for (OrderItem item : o.getItems()) {
                    ctx.append("   - ").append(item.getProductName());
                    if (item.getColorName() != null || item.getSizeName() != null) {
                        ctx.append(" (");
                        if (item.getColorName() != null) ctx.append(item.getColorName());
                        if (item.getSizeName() != null) {
                            if (item.getColorName() != null) ctx.append("/");
                            ctx.append(item.getSizeName());
                        }
                        ctx.append(")");
                    }
                    ctx.append(" x").append(item.getQuantity());
                    ctx.append(" — ").append(String.format("%,d VND", item.getUnitPrice().longValue()));
                    ctx.append("\n");
                }
            }

            // Shipping info
            if (o.getShipName() != null) {
                ctx.append("📦 Giao den: ").append(o.getShipName()).append(" - ").append(o.getShipPhone()).append("\n");
                ctx.append("   Dia chi: ").append(o.getShipLine1());
                if (o.getShipWard() != null) ctx.append(", ").append(o.getShipWard());
                if (o.getShipDistrict() != null) ctx.append(", ").append(o.getShipDistrict());
                ctx.append(", ").append(o.getShipCity()).append("\n");
            }

            ctx.append("\n");
        }

        ctx.append("BAT BUOC: Tra loi bang thong tin DON HANG thuc o tren. ");
        ctx.append("Liet ke ma don, trang thai, ngay dat, tong tien, san pham. ");
        ctx.append("Kem link [Xem tat ca don hang](/orders) o cuoi cau tra loi. ");
        ctx.append("TUYET DOI KHONG bia don hang, khong noi ve ton kho hay san pham chung chung.\n");
        return ctx.toString();
    }

    // ==================== DETAILED FORMAT ====================

    private String formatOrderDetailed(Order order) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("CHI TIET DON HANG (du lieu thuc tu he thong):\n\n");
        ctx.append("📋 Ma don: **").append(order.getCode()).append("**\n");
        ctx.append("📅 Ngay dat: ").append(order.getPlacedAt() != null ? order.getPlacedAt().format(DATE_FMT) : "N/A").append("\n");
        ctx.append("📊 Trang thai don: ").append(statusEmoji(order.getStatus())).append(" ").append(statusTextVi(order.getStatus())).append("\n");
        ctx.append("💳 Phuong thuc thanh toan: ").append(paymentMethodText(order.getPaymentMethod())).append("\n");
        ctx.append("💰 Trang thai thanh toan: ").append(paymentStatusText(order.getPaymentStatus())).append("\n");

        // Price breakdown
        ctx.append("\n💵 Chi tiet gia:\n");
        ctx.append("   Tam tinh: ").append(String.format("%,d VND", order.getSubtotal().longValue())).append("\n");
        if (order.getDiscountTotal().longValue() > 0) {
            ctx.append("   Giam gia: -").append(String.format("%,d VND", order.getDiscountTotal().longValue())).append("\n");
        }
        if (order.getShippingFee().longValue() > 0) {
            ctx.append("   Phi ship: ").append(String.format("%,d VND", order.getShippingFee().longValue())).append("\n");
        }
        ctx.append("   **Tong cong: ").append(String.format("%,d VND", order.getGrandTotal().longValue())).append("**\n");

        if (order.getCouponCode() != null) {
            ctx.append("   Ma giam gia da dung: ").append(order.getCouponCode()).append("\n");
        }
        if (order.getLoyaltyPointsUsed() > 0) {
            ctx.append("   Diem thuong da dung: ").append(order.getLoyaltyPointsUsed()).append(" diem\n");
        }
        if (order.getLoyaltyPointsEarned() > 0) {
            ctx.append("   Diem thuong nhan duoc: +").append(order.getLoyaltyPointsEarned()).append(" diem\n");
        }

        // Items
        ctx.append("\n🛍️ San pham:\n");
        for (OrderItem item : order.getItems()) {
            ctx.append("   - ").append(item.getProductName());
            if (item.getColorName() != null || item.getSizeName() != null) {
                ctx.append(" (");
                if (item.getColorName() != null) ctx.append(item.getColorName());
                if (item.getSizeName() != null) {
                    if (item.getColorName() != null) ctx.append("/");
                    ctx.append(item.getSizeName());
                }
                ctx.append(")");
            }
            ctx.append(" x").append(item.getQuantity());
            ctx.append(" — ").append(String.format("%,d VND", item.getUnitPrice().longValue()));
            ctx.append("\n");
        }

        // Shipping
        if (order.getShipName() != null) {
            ctx.append("\n📦 Thong tin giao hang:\n");
            ctx.append("   Nguoi nhan: ").append(order.getShipName()).append("\n");
            ctx.append("   SDT: ").append(order.getShipPhone()).append("\n");
            ctx.append("   Dia chi: ").append(order.getShipLine1());
            if (order.getShipWard() != null) ctx.append(", ").append(order.getShipWard());
            if (order.getShipDistrict() != null) ctx.append(", ").append(order.getShipDistrict());
            ctx.append(", ").append(order.getShipCity()).append("\n");
        }

        if (order.getNote() != null && !order.getNote().isBlank()) {
            ctx.append("\n📝 Ghi chu: ").append(order.getNote()).append("\n");
        }

        ctx.append("\nBAT BUOC: Tra loi CHI dua tren thong tin DON HANG thuc o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    // ==================== LOGIN REQUIRED ====================

    private String buildLoginRequiredContext() {
        return "THONG TIN XAC THUC:\n\n"
             + "❌ Khach hang CHUA DANG NHAP.\n\n"
             + "De xem don hang, khach hang can:\n"
             + "1. Dang nhap tai [trang dang nhap](/login)\n"
             + "2. Hoac cung cap ma don hang cu the (VD: ORD-xxxx) de tra cuu\n\n"
             + "BAT BUOC: Thong bao khach hang can DANG NHAP de xem don hang. "
             + "Kem link [Dang nhap](/login). "
             + "Neu khach cung cap ma don hang cu the, hay hoi ho dang nhap truoc. "
             + "TUYET DOI KHONG bia thong tin don hang.\n";
    }

    // ==================== ENUM HELPERS ====================

    private String statusEmoji(Order.OrderStatus s) {
        if (s == null) return "⏳";
        return switch (s) {
            case PENDING -> "⏳";
            case CONFIRMED -> "✅";
            case PACKING -> "📦";
            case SHIPPING -> "🚚";
            case COMPLETED -> "✅";
            case CANCELLED -> "❌";
            case REFUNDED -> "💸";
        };
    }

    private String statusTextVi(Order.OrderStatus s) {
        if (s == null) return "Khong ro";
        return switch (s) {
            case PENDING -> "Cho xac nhan";
            case CONFIRMED -> "Da xac nhan";
            case PACKING -> "Dang dong goi";
            case SHIPPING -> "Dang giao hang";
            case COMPLETED -> "Da hoan thanh";
            case CANCELLED -> "Da huy";
            case REFUNDED -> "Da hoan tien";
        };
    }

    private String paymentMethodText(Order.PaymentMethod m) {
        if (m == null) return "Khong ro";
        return switch (m) {
            case COD -> "COD (Thanh toan khi nhan hang)";
            case VNPAY -> "VNPay (Thanh toan online)";
            case MOMO -> "MoMo";
            case ZALOPAY -> "ZaloPay";
        };
    }

    private String paymentStatusText(Order.PaymentStatus s) {
        if (s == null) return "Khong ro";
        return switch (s) {
            case UNPAID -> "Chua thanh toan";
            case PAID -> "Da thanh toan";
            case REFUNDED -> "Da hoan tien";
            case FAILED -> "Thanh toan that bai";
        };
    }
}
