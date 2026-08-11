-- Create AI Feedback table for tracking user satisfaction
CREATE TABLE IF NOT EXISTS ai_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(100) NOT NULL,
    conversation_id VARCHAR(100),
    user_id BIGINT,
    rating ENUM('POSITIVE', 'NEGATIVE') NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

