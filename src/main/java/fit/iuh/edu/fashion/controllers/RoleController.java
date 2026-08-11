package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.request.RoleUpdateRequest;
import fit.iuh.edu.fashion.dto.response.PermissionResponse;
import fit.iuh.edu.fashion.dto.response.RoleResponse;
import fit.iuh.edu.fashion.models.Permission;
import fit.iuh.edu.fashion.models.Role;
import fit.iuh.edu.fashion.repositories.PermissionRepository;
import fit.iuh.edu.fashion.repositories.RoleRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @GetMapping
    public List<RoleResponse> list() {
        return roleRepository.findAll().stream()
                .sorted(Comparator.comparing(role -> role.getCode().toLowerCase()))
                .map(RoleResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public RoleResponse get(@PathVariable Long id) {
        return RoleResponse.from(findRole(id));
    }

    @GetMapping("/permissions")
    public List<PermissionResponse> permissions() {
        return permissionRepository.findAll().stream()
                .sorted(Comparator.comparing(permission -> permission.getCode().toLowerCase()))
                .map(PermissionResponse::from)
                .toList();
    }

    @PutMapping("/{id}")
    public RoleResponse update(@PathVariable Long id, @Valid @RequestBody RoleUpdateRequest request) {
        Role role = findRole(id);
        role.setName(request.getName().trim());
        role.setDescription(request.getDescription());
        if (request.getPermissionCodes() != null) {
            Set<Permission> permissions = new HashSet<>();
            for (String code : request.getPermissionCodes()) {
                Permission permission = permissionRepository.findByCode(code)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission not found: " + code));
                permissions.add(permission);
            }
            role.setPermissions(permissions);
        }
        return RoleResponse.from(roleRepository.save(role));
    }

    private Role findRole(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
    }
}
