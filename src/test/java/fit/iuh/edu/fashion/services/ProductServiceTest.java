package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.models.Product;
import fit.iuh.edu.fashion.repositories.BrandRepository;
import fit.iuh.edu.fashion.repositories.CategoryRepository;
import fit.iuh.edu.fashion.repositories.ProductRepository;
import fit.iuh.edu.fashion.repositories.ProductReviewRepository;
import fit.iuh.edu.fashion.repositories.ProductVariantRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository productRepository;

    @Mock
    BrandRepository brandRepository;

    @Mock
    CategoryRepository categoryRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ProductReviewRepository productReviewRepository;

    @Mock
    ProductVariantRepository productVariantRepository;

    @Mock
    AuditService auditService;

    @InjectMocks
    ProductService productService;

    @Test
    void getAllProductsUsesOnlyActiveProductsForPublicCatalog() {
        var pageable = PageRequest.of(0, 20);
        Product activeProduct = Product.builder()
                .id(1L)
                .name("Áo thun")
                .slug("ao-thun")
                .isActive(true)
                .build();
        when(productRepository.findByIsActive(true, pageable)).thenReturn(new PageImpl<>(List.of(activeProduct)));

        var page = productService.getAllProducts(pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).getIsActive()).isTrue();
        verify(productRepository).findByIsActive(true, pageable);
    }
}
