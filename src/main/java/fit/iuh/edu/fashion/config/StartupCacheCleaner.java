package fit.iuh.edu.fashion.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

/**
 * Xóa cache AI-related khi khởi động để tránh lỗi deserialization
 * do thay đổi DTO structure (VD: thêm/bớt @JsonIgnore fields).
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class StartupCacheCleaner implements ApplicationRunner {

    private final CacheManager cacheManager;

    private static final String[] AI_CACHES = {
            "catalogData", "topProducts", "productSearch",
            "productsByBrand", "productsByCategory", "aiResponses"
    };

    @Override
    public void run(ApplicationArguments args) {
        log.info("Cleaning AI-related caches on startup...");
        for (String cacheName : AI_CACHES) {
            try {
                var cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    cache.clear();
                    log.info("  Cleared cache: {}", cacheName);
                }
            } catch (Exception e) {
                log.warn("  Failed to clear cache {}: {}", cacheName, e.getMessage());
            }
        }
        log.info("AI cache cleanup complete.");
    }
}

