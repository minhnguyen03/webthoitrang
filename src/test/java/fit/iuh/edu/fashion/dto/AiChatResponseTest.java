package fit.iuh.edu.fashion.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AiChatResponseTest {

    @Test
    void legacyConstructorStillPopulatesAnswerAndErrorFlag() {
        AiChatResponse response = new AiChatResponse("Xin chào", "model", 123L);

        assertThat(response.getResponse()).isEqualTo("Xin chào");
        assertThat(response.getAnswer()).isEqualTo("Xin chào");
        assertThat(response.getError()).isFalse();
    }

    @Test
    void builderSupportsStandardContractFields() {
        AiChatResponse response = AiChatResponse.builder()
                .messageId("msg-1")
                .conversationId("conv-1")
                .intent("PRODUCT_SEARCH")
                .answer("Có 2 sản phẩm phù hợp.")
                .build();

        assertThat(response.getAnswer()).contains("2 sản phẩm");
        assertThat(response.getMessageId()).isEqualTo("msg-1");
        assertThat(response.getConversationId()).isEqualTo("conv-1");
        assertThat(response.getIntent()).isEqualTo("PRODUCT_SEARCH");
    }
}
