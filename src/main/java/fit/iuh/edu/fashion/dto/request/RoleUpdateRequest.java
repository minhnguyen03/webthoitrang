package fit.iuh.edu.fashion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class RoleUpdateRequest {
    @NotBlank(message = "Role name is required")
    @Size(max = 128, message = "Role name must not exceed 128 characters")
    private String name;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private Set<String> permissionCodes;
}
