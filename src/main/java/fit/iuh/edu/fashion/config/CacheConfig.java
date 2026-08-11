package fit.iuh.edu.fashion.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(List.of(
                "products",
                "productReviews",
                "productVariants",
                "brands",
                "categories",
                "colors",
                "sizes",
                "aiResponses",
                "catalogData",
                "topProducts",
                "productSearch",
                "productsByBrand",
                "productsByCategory",
                "userContext"
        ));
        return cacheManager;
    }
}
