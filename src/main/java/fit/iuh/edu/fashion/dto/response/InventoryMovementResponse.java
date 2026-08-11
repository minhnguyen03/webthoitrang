package fit.iuh.edu.fashion.dto.response;

import fit.iuh.edu.fashion.models.InventoryMovement;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.Product;
import fit.iuh.edu.fashion.models.ProductVariant;
import fit.iuh.edu.fashion.models.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryMovementResponse {
    private Long id;
    private Long variantId;
    private String sku;
    private Long productId;
    private String productName;
    private String colorName;
    private String sizeName;
    private Integer quantity;
    private InventoryMovement.MovementReason reason;
    private Long relatedOrderId;
    private String relatedOrderCode;
    private String note;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;

    public static InventoryMovementResponse from(InventoryMovement movement) {
        ProductVariant variant = movement.getVariant();
        Product product = variant != null ? variant.getProduct() : null;
        Order order = movement.getRelatedOrder();
        User createdBy = movement.getCreatedBy();
        return InventoryMovementResponse.builder()
                .id(movement.getId())
                .variantId(variant != null ? variant.getId() : null)
                .sku(variant != null ? variant.getSku() : null)
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .colorName(variant != null && variant.getColor() != null ? variant.getColor().getName() : null)
                .sizeName(variant != null && variant.getSize() != null ? variant.getSize().getName() : null)
                .quantity(movement.getQuantity())
                .reason(movement.getReason())
                .relatedOrderId(order != null ? order.getId() : null)
                .relatedOrderCode(order != null ? order.getCode() : null)
                .note(movement.getNote())
                .createdById(createdBy != null ? createdBy.getId() : null)
                .createdByName(createdBy != null ? createdBy.getFullName() : null)
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
