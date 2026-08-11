package fit.iuh.edu.fashion.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class ViewController {

    @Value("${app.frontend-url:http://127.0.0.1:3000}")
    private String frontendUrl;

    @GetMapping({
            "/admin/coupons",
            "/admin/payments",
            "/admin/audit-logs",
            "/admin/system-monitor"
    })
    public RedirectView adminPage(HttpServletRequest request) {
        String query = request.getQueryString();
        String path = request.getRequestURI() + (query == null ? "" : "?" + query);
        String base = frontendUrl.replaceAll("/+$", "");
        RedirectView redirectView = new RedirectView(base + path);
        redirectView.setExposeModelAttributes(false);
        return redirectView;
    }
}
