package fit.iuh.edu.fashion.dto.response;

import fit.iuh.edu.fashion.models.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Data
@Builder
public class RoleResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer permissionCount;
    private List<PermissionResponse> permissions;
    private LocalDateTime createdAt;

    public static RoleResponse from(Role role) {
        List<PermissionResponse> permissions = role.getPermissions().stream()
                .sorted(Comparator.comparing(permission -> permission.getCode().toLowerCase()))
                .map(PermissionResponse::from)
                .toList();
        return RoleResponse.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .description(role.getDescription())
                .permissionCount(permissions.size())
                .permissions(permissions)
                .createdAt(role.getCreatedAt())
                .build();
    }
}
