package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.OrderItem;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.CartRepository;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service phân tích user context từ lịch sử đơn hàng, preferences.
 * Inject vào system prompt để personalization AI responses.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserContextService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final CartRepository cartRepository;

    /**
     * Xây dựng context string cho AI từ user's purchase history.
     * Cached 10 phút.
     */
    @Cacheable(value = "userContext", key = "#userId", unless = "#result == null || #result.isEmpty()")
    @Transactional(readOnly = true)
    public String buildUserContext(Long userId) {
        log.info("Building user context for userId: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("User not found: {}", userId);
            return "";
        }

        User user = userOpt.get();
        List<Order> orders = orderRepository.findByCustomerOrderByPlacedAtDesc(user);

        if (orders.isEmpty()) {
            return buildNewUserContext(user);
        }

        return buildExistingUserContext(user, orders);
    }

    // ==================== PRIVATE ====================

    private String buildNewUserContext(User user) {
        return "KHACH HANG: " + user.getFullName() + " (moi, chua co don)\n";
    }

    private String buildExistingUserContext(User user, List<Order> orders) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("KHACH HANG: ").append(user.getFullName());
        ctx.append(" | ").append(orders.size()).append(" don hang");

        // Tổng chi tiêu
        BigDecimal totalSpent = orders.stream()
                .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
                .map(Order::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        ctx.append(" | Chi tieu: ").append(formatPrice(totalSpent));

        // Phân tích sở thích từ order items
        Map<String, Integer> brandCounts = new LinkedHashMap<>();
        Map<String, Integer> categoryCounts = new LinkedHashMap<>();
        Map<String, Integer> sizeCounts = new LinkedHashMap<>();
        Map<String, Integer> colorCounts = new LinkedHashMap<>();

        for (Order order : orders) {
            if (order.getStatus() == Order.OrderStatus.CANCELLED) continue;
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null && item.getProduct().getBrand() != null)
                    brandCounts.merge(item.getProduct().getBrand().getName(), item.getQuantity(), Integer::sum);
                if (item.getProduct() != null && item.getProduct().getCategories() != null)
                    item.getProduct().getCategories().forEach(cat ->
                            categoryCounts.merge(cat.getName(), item.getQuantity(), Integer::sum));
                if (item.getSizeName() != null) sizeCounts.merge(item.getSizeName(), item.getQuantity(), Integer::sum);
                if (item.getColorName() != null) colorCounts.merge(item.getColorName(), item.getQuantity(), Integer::sum);
            }
        }

        if (!brandCounts.isEmpty()) ctx.append(" | Brand: ").append(topEntries(brandCounts, 2));
        if (!categoryCounts.isEmpty()) ctx.append(" | DM: ").append(topEntries(categoryCounts, 2));
        if (!sizeCounts.isEmpty()) ctx.append(" | Size: ").append(topEntries(sizeCounts, 2));
        if (!colorCounts.isEmpty()) ctx.append(" | Mau: ").append(topEntries(colorCounts, 2));

        // Loyalty points
        try {
            customerProfileRepository.findById(user.getId()).ifPresent(profile -> {
                int points = profile.getLoyaltyPoint() != null ? profile.getLoyaltyPoint() : 0;
                if (points > 0) ctx.append(" | Diem: ").append(points);
            });
        } catch (Exception e) { /* ignore */ }

        // Cart
        try {
            cartRepository.findByCustomerId(user.getId()).ifPresent(cart -> {
                int cartSize = cart.getItems() != null ? cart.getItems().size() : 0;
                if (cartSize > 0) ctx.append(" | Gio hang: ").append(cartSize).append("SP");
            });
        } catch (Exception e) { /* ignore */ }

        ctx.append("\n");

        return ctx.toString();
    }

    private String topEntries(Map<String, Integer> counts, int limit) {
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.joining(", "));
    }

    private String formatPrice(BigDecimal price) {
        if (price == null) return "0₫";
        return String.format("%,d₫", price.longValue());
    }
}

