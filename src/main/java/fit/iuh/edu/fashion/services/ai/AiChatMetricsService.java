package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.AiChatResponse;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AiChatMetricsService {

    private static final int MAX_RECENT_EVENTS = 100;

    private final AtomicLong totalRequests = new AtomicLong();
    private final AtomicLong totalErrors = new AtomicLong();
    private final AtomicLong totalLatencyMs = new AtomicLong();
    private final Map<String, AtomicLong> intents = new ConcurrentHashMap<>();
    private final Deque<ChatEvent> recentEvents = new ArrayDeque<>();

    public synchronized void record(AiChatResponse response) {
        totalRequests.incrementAndGet();
        long latency = response.getLatencyMs() != null ? response.getLatencyMs() : 0;
        totalLatencyMs.addAndGet(latency);
        String intent = response.getIntent() != null ? response.getIntent() : "UNKNOWN";
        intents.computeIfAbsent(intent, ignored -> new AtomicLong()).incrementAndGet();
        if (Boolean.TRUE.equals(response.getError())) {
            totalErrors.incrementAndGet();
        }
        recentEvents.addFirst(new ChatEvent(
                response.getMessageId(),
                response.getConversationId(),
                intent,
                latency,
                Boolean.TRUE.equals(response.getError()),
                Instant.now().toString()
        ));
        while (recentEvents.size() > MAX_RECENT_EVENTS) {
            recentEvents.removeLast();
        }
    }

    public synchronized Map<String, Object> snapshot() {
        long total = totalRequests.get();
        long errors = totalErrors.get();
        Map<String, Long> intentCounts = new LinkedHashMap<>();
        intents.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.comparingLong(AtomicLong::get).reversed()))
                .forEach(entry -> intentCounts.put(entry.getKey(), entry.getValue().get()));

        return Map.of(
                "totalRequests", total,
                "totalErrors", errors,
                "errorRate", total > 0 ? Math.round(errors * 1000.0 / total) / 10.0 : 0,
                "averageLatencyMs", total > 0 ? totalLatencyMs.get() / total : 0,
                "intentCounts", intentCounts,
                "recentEvents", new ArrayList<>(recentEvents)
        );
    }

    @Getter
    public static class ChatEvent {
        private final String messageId;
        private final String conversationId;
        private final String intent;
        private final long latencyMs;
        private final boolean error;
        private final String createdAt;

        public ChatEvent(String messageId, String conversationId, String intent, long latencyMs, boolean error, String createdAt) {
            this.messageId = messageId;
            this.conversationId = conversationId;
            this.intent = intent;
            this.latencyMs = latencyMs;
            this.error = error;
            this.createdAt = createdAt;
        }
    }
}
