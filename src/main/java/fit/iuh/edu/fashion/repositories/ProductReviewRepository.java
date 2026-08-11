package fit.iuh.edu.fashion.repositories;

import fit.iuh.edu.fashion.models.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Page<ProductReview> findByProductIdAndIsApprovedTrue(Long productId, Pageable pageable);

    List<ProductReview> findByProductIdAndIsApprovedOrderByCreatedAtDesc(Long productId, Boolean isApproved);

    @Query("SELECT AVG(pr.rating) FROM ProductReview pr WHERE pr.product.id = :productId AND pr.isApproved = true")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    Long countByProductIdAndIsApprovedTrue(Long productId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    /**
     * Lấy danh sách sản phẩm có rating trung bình cao nhất.
     * Trả về Object[]: [Product, avgRating (Double), reviewCount (Long)]
     */
    @Query("SELECT pr.product, AVG(pr.rating), COUNT(pr) FROM ProductReview pr " +
           "WHERE pr.isApproved = true AND pr.product.isActive = true " +
           "GROUP BY pr.product " +
           "HAVING COUNT(pr) >= 1 " +
           "ORDER BY AVG(pr.rating) DESC, COUNT(pr) DESC")
    List<Object[]> findTopRatedProducts(Pageable pageable);

    /**
     * Lấy danh sách sản phẩm có rating trung bình thấp nhất.
     * Trả về Object[]: [Product, avgRating (Double), reviewCount (Long)]
     */
    @Query("SELECT pr.product, AVG(pr.rating), COUNT(pr) FROM ProductReview pr " +
           "WHERE pr.isApproved = true AND pr.product.isActive = true " +
           "GROUP BY pr.product " +
           "HAVING COUNT(pr) >= 1 " +
           "ORDER BY AVG(pr.rating) ASC, COUNT(pr) DESC")
    List<Object[]> findLowestRatedProducts(Pageable pageable);

    /**
     * Lấy các review gần nhất trên toàn hệ thống.
     */
    @Query("SELECT pr FROM ProductReview pr " +
           "WHERE pr.isApproved = true AND pr.product.isActive = true " +
           "ORDER BY pr.createdAt DESC")
    List<ProductReview> findRecentReviews(Pageable pageable);

    /**
     * Tổng quan: tổng số review, rating trung bình toàn hệ thống.
     * Returns List with single Object[]{count, avg}.
     */
    @Query("SELECT COUNT(pr), AVG(pr.rating) FROM ProductReview pr WHERE pr.isApproved = true")
    List<Object[]> getOverallStats();
}
