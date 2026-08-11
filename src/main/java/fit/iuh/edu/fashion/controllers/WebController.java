package fit.iuh.edu.fashion.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class WebController {

    @Value("${app.frontend-url:http://127.0.0.1:3000}")
    private String frontendUrl;

    @GetMapping({
            "/",
            "/login",
            "/register",
            "/forgot-password",
            "/reset-password",
            "/dashboard",
            "/admin",
            "/products",
            "/cart",
            "/orders",
            "/profile",
            "/payment/success",
            "/payment/failed",
            "/payment/error"
    })
    public RedirectView frontendPage(HttpServletRequest request) {
        return redirectCurrent(request);
    }

    @GetMapping("/products/{slug}")
    public RedirectView productDetail(HttpServletRequest request) {
        return redirectCurrent(request);
    }

    @GetMapping({
            "/admin/products",
            "/admin/orders",
            "/admin/users",
            "/admin/brands",
            "/admin/categories"
    })
    public RedirectView adminPage(HttpServletRequest request) {
        return redirectCurrent(request);
    }

    @GetMapping({
            "/admin/{section}/new",
            "/admin/{section}/create",
            "/admin/{section}/{item}",
            "/admin/{section}/{item}/edit"
    })
    public RedirectView nestedAdminPage(HttpServletRequest request) {
        String[] parts = request.getRequestURI().split("/");
        String section = parts.length > 2 ? parts[2] : "";
        return redirectToFrontend("/admin/" + section);
    }

    @GetMapping({
            "/checkout",
            "/cart/checkout"
    })
    public RedirectView checkoutPage() {
        return redirectToFrontend("/cart");
    }

    @GetMapping("/orders/{orderId}")
    public RedirectView orderDetailPage() {
        return redirectToFrontend("/orders");
    }

    @GetMapping({
            "/auth/login",
            "/auth/register",
            "/auth/forgot-password",
            "/auth/reset-password"
    })
    public RedirectView legacyAuthPage(HttpServletRequest request) {
        String query = request.getQueryString();
        String path = request.getRequestURI().replaceFirst("^/auth", "") + (query == null ? "" : "?" + query);
        return redirectToFrontend(path);
    }

    @GetMapping({
            "/about",
            "/contact",
            "/stores",
            "/careers",
            "/shipping",
            "/returns",
            "/payment",
            "/faq"
    })
    public RedirectView infoPage(HttpServletRequest request) {
        return redirectToFrontend("/info" + request.getRequestURI());
    }

    private RedirectView redirectCurrent(HttpServletRequest request) {
        String query = request.getQueryString();
        String path = request.getRequestURI() + (query == null ? "" : "?" + query);
        return redirectToFrontend(path);
    }

    private RedirectView redirectToFrontend(String path) {
        String base = frontendUrl.replaceAll("/+$", "");
        String normalizedPath = path.startsWith("/") ? path : "/" + path;
        RedirectView redirectView = new RedirectView(base + normalizedPath);
        redirectView.setExposeModelAttributes(false);
        return redirectView;
    }
}
