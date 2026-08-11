package fit.iuh.edu.fashion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    @Size(max = 50, message = "Address label must not exceed 50 characters")
    private String label;

    @NotBlank(message = "Receiver name is required")
    @Size(min = 2, max = 160, message = "Receiver name must be between 2 and 160 characters")
    private String receiverName;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Address line is required")
    @Size(min = 5, max = 255, message = "Address line must be between 5 and 255 characters")
    private String line1;

    @Size(max = 255, message = "Address line 2 must not exceed 255 characters")
    private String line2;

    @Size(max = 128, message = "Ward must not exceed 128 characters")
    private String ward;

    @Size(max = 128, message = "District must not exceed 128 characters")
    private String district;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 128, message = "City must be between 2 and 128 characters")
    private String city;

    @Size(max = 64, message = "Country must not exceed 64 characters")
    private String country = "Vietnam";

    private Boolean isDefault = false;
}
