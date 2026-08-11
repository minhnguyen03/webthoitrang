package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.request.ShipmentRequest;
import fit.iuh.edu.fashion.dto.response.ShipmentResponse;
import fit.iuh.edu.fashion.models.Order;
import fit.iuh.edu.fashion.models.Shipment;
import fit.iuh.edu.fashion.repositories.OrderRepository;
import fit.iuh.edu.fashion.repositories.ShipmentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF_SALES')")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @GetMapping
    public Page<ShipmentResponse> list(Pageable pageable) {
        return shipmentRepository.findAll(pageable).map(ShipmentResponse::from);
    }

    @GetMapping("/{id}")
    public ShipmentResponse get(@PathVariable Long id) {
        return ShipmentResponse.from(findShipment(id));
    }

    @GetMapping("/order/{orderId}")
    public List<ShipmentResponse> listByOrder(@PathVariable Long orderId) {
        return shipmentRepository.findByOrderId(orderId).stream()
                .map(ShipmentResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<ShipmentResponse> create(@Valid @RequestBody ShipmentRequest request) {
        Shipment shipment = new Shipment();
        apply(shipment, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ShipmentResponse.from(shipmentRepository.save(shipment)));
    }

    @PutMapping("/{id}")
    public ShipmentResponse update(@PathVariable Long id, @Valid @RequestBody ShipmentRequest request) {
        Shipment shipment = findShipment(id);
        apply(shipment, request);
        return ShipmentResponse.from(shipmentRepository.save(shipment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Shipment shipment = findShipment(id);
        shipmentRepository.delete(shipment);
        return ResponseEntity.noContent().build();
    }

    private Shipment findShipment(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found"));
    }

    private void apply(Shipment shipment, ShipmentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        Shipment.ShipmentStatus nextStatus = request.getStatus() != null ? request.getStatus() : Shipment.ShipmentStatus.READY;
        shipment.setOrder(order);
        shipment.setCarrier(request.getCarrier().trim());
        shipment.setTrackingNumber(request.getTrackingNumber() != null ? request.getTrackingNumber().trim() : null);
        shipment.setStatus(nextStatus);
        shipment.setShippedAt(request.getShippedAt());
        shipment.setDeliveredAt(request.getDeliveredAt());
        shipment.setNote(request.getNote());

        if ((nextStatus == Shipment.ShipmentStatus.PICKED || nextStatus == Shipment.ShipmentStatus.IN_TRANSIT)
                && shipment.getShippedAt() == null) {
            shipment.setShippedAt(LocalDateTime.now());
        }
        if (nextStatus == Shipment.ShipmentStatus.DELIVERED && shipment.getDeliveredAt() == null) {
            LocalDateTime now = LocalDateTime.now();
            shipment.setDeliveredAt(now);
            if (shipment.getShippedAt() == null) {
                shipment.setShippedAt(now);
            }
        }
    }
}
