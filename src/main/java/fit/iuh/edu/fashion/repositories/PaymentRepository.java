package fit.iuh.edu.fashion.repositories;

import fit.iuh.edu.fashion.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByTransactionId(String transactionId);

    // Optimized queries - avoid loading all records into memory
    List<Payment> findByStatus(Payment.PaymentStatus status);

    List<Payment> findByPaymentMethodIgnoreCaseAndStatus(String paymentMethod, Payment.PaymentStatus status);

    long countByStatus(Payment.PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    double sumAmountByStatus(@Param("status") Payment.PaymentStatus status);

    List<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status);
}

