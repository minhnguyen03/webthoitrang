package fit.iuh.edu.fashion.services.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service quản lý conversation memory — lưu lịch sử chat multi-turn.
 * Dùng Redis nếu có, fallback sang in-memory với TTL eviction.
 */
@Service
@Slf4j
public class ConversationMemoryService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final boolean useRedis;

    /** In-memory store: conversationId → {messages, lastAccessed} */
    private final Map<String, ConversationEntry> inMemoryStore = new ConcurrentHashMap<>();

    @Value("${app.chat.memory.max-messages:20}")
    private int maxMessages;

    @Value("${app.chat.memory.ttl-minutes:30}")
    private int ttlMinutes;

    private static final String REDIS_KEY_PREFIX = "chat:memory:";
    private static final int MAX_CONVERSATIONS = 1000;

    public ConversationMemoryService(
            @org.springframework.beans.factory.annotation.Autowired(required = false)
            RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.useRedis = redisTemplate != null;
        log.info("ConversationMemoryService initialized. Redis: {}", useRedis ? "enabled" : "disabled (in-memory with TTL eviction)");
    }

    public void addMessage(String conversationId, String role, String content) {
        if (conversationId == null || content == null) return;
        try {
            if (useRedis) {
                addMessageRedis(conversationId, role, content);
            } else {
                addMessageInMemory(conversationId, role, content);
            }
        } catch (Exception e) {
            log.warn("Failed to save message to memory: {}", e.getMessage());
            addMessageInMemory(conversationId, role, content);
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, String>> getMessages(String conversationId) {
        if (conversationId == null) return Collections.emptyList();
        try {
            if (useRedis) {
                String key = REDIS_KEY_PREFIX + conversationId;
                Object data = redisTemplate.opsForValue().get(key);
                if (data instanceof List) {
                    return (List<Map<String, String>>) data;
                }
            }
        } catch (Exception e) {
            log.warn("Failed to get messages from Redis: {}", e.getMessage());
        }
        ConversationEntry entry = inMemoryStore.get(conversationId);
        if (entry != null) {
            entry.lastAccessed = Instant.now();
            return entry.messages;
        }
        return Collections.emptyList();
    }

    public String buildContextString(String conversationId) {
        List<Map<String, String>> messages = getMessages(conversationId);
        if (messages.isEmpty()) return "";

        StringBuilder ctx = new StringBuilder();
        ctx.append("\n=== LICH SU ===\n");
        // 4096 token budget → giữ tối đa 6 tin nhắn gần nhất, mỗi tin tối đa 300 chars
        int start = Math.max(0, messages.size() - 6);
        for (int i = start; i < messages.size(); i++) {
            Map<String, String> msg = messages.get(i);
            String role = msg.getOrDefault("role", "user");
            String content = msg.getOrDefault("content", "");
            if (content.length() > 300) content = content.substring(0, 300) + "...";
            ctx.append(role.equals("user") ? "K: " : "AI: ").append(content).append("\n");
        }
        ctx.append("=== HET ===\n\n");
        return ctx.toString();
    }

    public void clearConversation(String conversationId) {
        if (conversationId == null) return;
        try {
            if (useRedis) {
                redisTemplate.delete(REDIS_KEY_PREFIX + conversationId);
            }
        } catch (Exception ignored) {}
        inMemoryStore.remove(conversationId);
    }

    /**
     * Scheduled cleanup: evict expired conversations and enforce max size.
     * Chạy mỗi 5 phút.
     */
    @Scheduled(fixedDelay = 300_000, initialDelay = 300_000)
    public void evictExpiredConversations() {
        if (inMemoryStore.isEmpty()) return;

        Instant cutoff = Instant.now().minusSeconds(ttlMinutes * 60L);
        int evicted = 0;

        Iterator<Map.Entry<String, ConversationEntry>> it = inMemoryStore.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, ConversationEntry> entry = it.next();
            if (entry.getValue().lastAccessed.isBefore(cutoff)) {
                it.remove();
                evicted++;
            }
        }

        // Enforce max conversations: evict oldest if over limit
        if (inMemoryStore.size() > MAX_CONVERSATIONS) {
            inMemoryStore.entrySet().stream()
                    .sorted(Comparator.comparing(e -> e.getValue().lastAccessed))
                    .limit(inMemoryStore.size() - MAX_CONVERSATIONS)
                    .map(Map.Entry::getKey)
                    .toList()
                    .forEach(inMemoryStore::remove);
        }

        if (evicted > 0) {
            log.debug("Evicted {} expired conversations, {} remaining", evicted, inMemoryStore.size());
        }
    }

    // ==================== PRIVATE ====================

    @SuppressWarnings("unchecked")
    private void addMessageRedis(String conversationId, String role, String content) {
        String key = REDIS_KEY_PREFIX + conversationId;
        Object data = redisTemplate.opsForValue().get(key);
        List<Map<String, String>> messages;
        if (data instanceof List) {
            messages = new ArrayList<>((List<Map<String, String>>) data);
        } else {
            messages = new ArrayList<>();
        }
        messages.add(Map.of("role", role, "content", content));
        while (messages.size() > maxMessages) {
            messages.remove(0);
        }
        redisTemplate.opsForValue().set(key, messages, Duration.ofMinutes(ttlMinutes));
    }

    private void addMessageInMemory(String conversationId, String role, String content) {
        ConversationEntry entry = inMemoryStore.computeIfAbsent(conversationId, k -> new ConversationEntry());
        entry.messages.add(Map.of("role", role, "content", content));
        entry.lastAccessed = Instant.now();
        while (entry.messages.size() > maxMessages) {
            entry.messages.remove(0);
        }
    }

    /** Container for conversation data + TTL tracking. */
    private static class ConversationEntry {
        final List<Map<String, String>> messages = new ArrayList<>();
        volatile Instant lastAccessed = Instant.now();
    }
}
