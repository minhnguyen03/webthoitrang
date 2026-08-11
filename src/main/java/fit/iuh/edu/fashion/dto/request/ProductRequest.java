package fit.iuh.edu.fashion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(min = 2, max = 255, message = "Slug must be between 2 and 255 characters")
    @Pattern(
    regexp = "^EA\\d{2}\\.\\d+$",
    message = "Mã sản phẩm phải có dạng EA26.01"
)
private String slug;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private Long brandId;

    private Set<Long> categoryIds;

    @Size(max = 255, message = "Material must not exceed 255 characters")
    private String material;

    @Size(max = 255, message = "Origin must not exceed 255 characters")
    private String origin;

    private Boolean isActive = true;
}
