package fit.iuh.edu.fashion.repositories;

import fit.iuh.edu.fashion.models.InventoryMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByVariantId(Long variantId);

    @Query("SELECT im FROM InventoryMovement im WHERE im.variant.id = :variantId " +
           "AND im.createdAt BETWEEN :startDate AND :endDate ORDER BY im.createdAt DESC")
    List<InventoryMovement> findByVariantIdAndDateRange(@Param("variantId") Long variantId,
                                                        @Param("startDate") LocalDateTime startDate,
                                                        @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT im FROM InventoryMovement im
            WHERE (:variantId IS NULL OR im.variant.id = :variantId)
              AND (:productId IS NULL OR im.variant.product.id = :productId)
              AND (:orderId IS NULL OR im.relatedOrder.id = :orderId)
              AND (:reason IS NULL OR im.reason = :reason)
              AND (:fromDate IS NULL OR im.createdAt >= :fromDate)
              AND (:toDate IS NULL OR im.createdAt <= :toDate)
            """)
    Page<InventoryMovement> search(@Param("variantId") Long variantId,
                                   @Param("productId") Long productId,
                                   @Param("orderId") Long orderId,
                                   @Param("reason") InventoryMovement.MovementReason reason,
                                   @Param("fromDate") LocalDateTime fromDate,
                                   @Param("toDate") LocalDateTime toDate,
                                   Pageable pageable);
}

