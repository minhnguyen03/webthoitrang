package fit.iuh.edu.fashion.repositories;

import fit.iuh.edu.fashion.models.AiFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiFeedbackRepository extends JpaRepository<AiFeedback, Long> {

    List<AiFeedback> findByConversationId(String conversationId);

    List<AiFeedback> findTop10ByRatingOrderByCreatedAtDesc(AiFeedback.Rating rating);

    long countByRating(AiFeedback.Rating rating);

    @Query("SELECT COUNT(f) FROM AiFeedback f")
    long countAll();

    @Query("SELECT COUNT(f) FROM AiFeedback f WHERE f.rating = 'POSITIVE'")
    long countPositive();

    @Query("SELECT COUNT(f) FROM AiFeedback f WHERE f.rating = 'NEGATIVE'")
    long countNegative();
}

