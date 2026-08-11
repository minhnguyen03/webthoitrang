package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Cart;
import fit.iuh.edu.fashion.models.CartItem;
import fit.iuh.edu.fashion.repositories.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Service truy vấn giỏ hàng để cung cấp context cho AI chatbot.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CartRetrievalService {

    private final CartRepository cartRepository;

    @Transactional(readOnly = true)
    public String retrieveCartContext(Long userId) {
        if (userId == null) {
            return "Ban can [dang nhap](/login) de xem gio hang.\n";
        }

        log.info("RAG: Retrieving cart for userId: {}", userId);
        Optional<Cart> cartOpt = cartRepository.findByCustomerId(userId);

        if (cartOpt.isEmpty() || cartOpt.get().getItems().isEmpty()) {
            return "Gio hang cua ban hien dang trong. Hay [xem san pham](/products) va them vao gio hang!\n";
        }

        Cart cart = cartOpt.get();
        return buildCartContext(cart);
    }

    private String buildCartContext(Cart cart) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("THONG TIN GIO HANG THUC TU HE THONG:\n\n");

        BigDecimal grandTotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            totalItems += item.getQuantity();
            String productName = item.getVariant().getProduct().getName();
            String color = item.getVariant().getColor() != null ? item.getVariant().getColor().getName() : "N/A";
            String size = item.getVariant().getSize() != null ? item.getVariant().getSize().getName() : "N/A";
            BigDecimal price = item.getVariant().getPrice();
            int stock = item.getVariant().getStock();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            grandTotal = grandTotal.add(subtotal);

            ctx.append("- **").append(productName).append("**");
            ctx.append(" (").append(color).append("/").append(size).append(")");
            ctx.append(" x").append(item.getQuantity());
            ctx.append(" | Gia: ").append(String.format("%,d VND", price.longValue()));
            ctx.append(" | Thanh tien: ").append(String.format("%,d VND", subtotal.longValue()));
            ctx.append(" | Ton kho: ").append(stock).append(" cai");
            if (stock < item.getQuantity()) {
                ctx.append(" ⚠️ KHONG DU HANG");
            }
            ctx.append("\n");
        }

        ctx.append("\n");
        ctx.append("Tong so luong: ").append(totalItems).append(" san pham\n");
        ctx.append("Tong tien: ").append(String.format("%,d VND", grandTotal.longValue())).append("\n");
        ctx.append("Link: [Xem gio hang](/cart)\n");
        ctx.append("\nCHI tra loi dua tren du lieu gio hang o tren. KHONG bia them san pham.\n");

        return ctx.toString();
    }
}

