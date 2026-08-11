package fit.iuh.edu.fashion.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class AiChatbotViewController {

    @Value("${app.frontend-url:http://127.0.0.1:3000}")
    private String frontendUrl;

    @GetMapping("/ai-chatbot")
    public RedirectView showChatbot() {
        String base = frontendUrl.replaceAll("/+$", "");
        RedirectView redirectView = new RedirectView(base + "/ai-chatbot");
        redirectView.setExposeModelAttributes(false);
        return redirectView;
    }
}
