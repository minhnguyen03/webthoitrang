package fit.iuh.edu.fashion.dto.response;

import fit.iuh.edu.fashion.models.Permission;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionResponse {
    private Long id;
    private String code;
    private String name;
    private String description;

    public static PermissionResponse from(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .code(permission.getCode())
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
}
