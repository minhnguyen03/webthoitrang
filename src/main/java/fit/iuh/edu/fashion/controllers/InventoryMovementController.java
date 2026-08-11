package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.response.InventoryMovementResponse;
import fit.iuh.edu.fashion.models.InventoryMovement;
import fit.iuh.edu.fashion.repositories.InventoryMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory-movements")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF_PRODUCT')")
public class InventoryMovementController {

    private final InventoryMovementRepository inventoryMovementRepository;

    @GetMapping
    public Page<InventoryMovementResponse> list(
            @RequestParam(required = false) Long variantId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) InventoryMovement.MovementReason reason,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Pageable pageable
    ) {
        return inventoryMovementRepository.search(variantId, productId, orderId, reason, from, to, pageable)
                .map(InventoryMovementResponse::from);
    }
}
