package fit.iuh.edu.fashion.dto.response;

import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.Shipment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ShipmentResponse {
    private Long id;
    private Long orderId;
    private String orderCode;
    private String customerName;
    private String carrier;
    private String trackingNumber;
    private Shipment.ShipmentStatus status;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ShipmentResponse from(Shipment shipment) {
        Order order = shipment.getOrder();
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .orderId(order != null ? order.getId() : null)
                .orderCode(order != null ? order.getCode() : null)
                .customerName(order != null ? order.getShipName() : null)
                .carrier(shipment.getCarrier())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus())
                .shippedAt(shipment.getShippedAt())
                .deliveredAt(shipment.getDeliveredAt())
                .note(shipment.getNote())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .build();
    }
}
