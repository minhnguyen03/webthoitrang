package fit.iuh.edu.fashion.dto.request;

import fit.iuh.edu.fashion.models.Shipment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShipmentRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Carrier is required")
    @Size(max = 120, message = "Carrier must not exceed 120 characters")
    private String carrier;

    @Size(max = 120, message = "Tracking number must not exceed 120 characters")
    private String trackingNumber;

    private Shipment.ShipmentStatus status = Shipment.ShipmentStatus.READY;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    @Size(max = 1000, message = "Note must not exceed 1000 characters")
    private String note;
}
