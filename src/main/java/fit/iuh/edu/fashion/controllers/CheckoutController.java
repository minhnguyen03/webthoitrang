package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.request.OrderRequest;
import fit.iuh.edu.fashion.dto.response.CheckoutQuoteResponse;
import fit.iuh.edu.fashion.security.CustomUserDetails;
import fit.iuh.edu.fashion.services.CheckoutCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutCalculationService checkoutCalculationService;

    @PostMapping("/quote")
    public ResponseEntity<CheckoutQuoteResponse> quote(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(checkoutCalculationService.quote(userDetails.getId(), request));
    }
}
