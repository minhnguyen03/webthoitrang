package fit.iuh.edu.fashion.services;

import fit.iuh.edu.fashion.dto.CatalogDataDTO;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserIntentAnalyzerTest {

    private UserIntentAnalyzer analyzer;

    @BeforeEach
    void setUp() {
        CatalogCacheService catalogCacheService = mock(CatalogCacheService.class);
        CatalogDataDTO catalog = CatalogDataDTO.builder()
                .brands(List.of())
                .categories(List.of())
                .colors(List.of())
                .sizes(List.of())
                .build();
        when(catalogCacheService.getCatalogData()).thenReturn(catalog);
        analyzer = new UserIntentAnalyzer(catalogCacheService);
    }

    @Test
    void detectsAuthGatedOrderIntent() {
        UserIntentDTO intent = analyzer.analyzeIntent("Xem \u0111\u01a1n h\u00e0ng ORD-12345 c\u1ee7a t\u00f4i");

        assertThat(intent.getIntentType()).isEqualTo(UserIntentDTO.IntentType.ORDER_SUPPORT);
        assertThat(intent.getOrderCode()).isEqualTo("ORD-12345");
    }

    @Test
    void detectsCartIntentBeforeGenericProductSearch() {
        UserIntentDTO intent = analyzer.analyzeIntent("Gi\u1ecf h\u00e0ng c\u1ee7a t\u00f4i c\u00f3 nh\u1eefng s\u1ea3n ph\u1ea9m n\u00e0o?");

        assertThat(intent.getIntentType()).isEqualTo(UserIntentDTO.IntentType.CART_SUPPORT);
    }

    @Test
    void extractsPriceAndSizeWhenSizeGuideTakesPriority() {
        UserIntentDTO intent = analyzer.analyzeIntent("T\u00ecm \u00e1o thun size M d\u01b0\u1edbi 500k");

        assertThat(intent.getIntentType()).isEqualTo(UserIntentDTO.IntentType.SIZE_GUIDE);
        assertThat(intent.getSizes()).contains("M");
        assertThat(intent.getPriceRange()).isNotNull();
        assertThat(intent.getPriceRange().getMax()).isEqualTo(500_000L);
    }
}
