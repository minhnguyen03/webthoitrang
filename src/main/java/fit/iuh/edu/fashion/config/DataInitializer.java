package fit.iuh.edu.fashion.config;

import fit.iuh.edu.fashion.models.Cart;
import fit.iuh.edu.fashion.models.Category;
import fit.iuh.edu.fashion.models.CustomerProfile;
import fit.iuh.edu.fashion.models.EmployeeProfile;
import fit.iuh.edu.fashion.models.Permission;
import fit.iuh.edu.fashion.models.Role;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.CartRepository;
import fit.iuh.edu.fashion.repositories.CategoryRepository;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import fit.iuh.edu.fashion.repositories.EmployeeProfileRepository;
import fit.iuh.edu.fashion.repositories.PermissionRepository;
import fit.iuh.edu.fashion.repositories.RoleRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final CartRepository cartRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initializeRolesAndPermissions();
        initializeStorefrontCategories();
        initializeDemoAccounts();
    }

    private void initializeRolesAndPermissions() {
        log.info("Ensuring roles and permissions...");

        List<Permission> permissions = List.of(
                Permission.builder().code("PRODUCT_CREATE").name("Tao san pham").build(),
                Permission.builder().code("PRODUCT_UPDATE").name("Sua san pham").build(),
                Permission.builder().code("PRODUCT_DELETE").name("Xoa san pham").build(),
                Permission.builder().code("PRODUCT_VIEW").name("Xem san pham").build(),
                Permission.builder().code("ORDER_VIEW").name("Xem don hang").build(),
                Permission.builder().code("ORDER_UPDATE").name("Cap nhat don hang").build(),
                Permission.builder().code("ORDER_DELETE").name("Xoa don hang").build(),
                Permission.builder().code("COUPON_MANAGE").name("Quan ly ma giam gia").build(),
                Permission.builder().code("USER_MANAGE").name("Quan ly nguoi dung").build(),
                Permission.builder().code("ROLE_MANAGE").name("Quan ly vai tro").build()
        );
        permissions.forEach(this::ensurePermission);

        Role adminRole = ensureRole("ADMIN", "Quan ly toan quyen", "Co toan quyen tren he thong");
        adminRole.setPermissions(new HashSet<>(permissionRepository.findAll()));
        roleRepository.save(adminRole);

        Set<Permission> staffProductPermissions = new HashSet<>();
        staffProductPermissions.add(permissionRepository.findByCode("PRODUCT_CREATE").orElseThrow());
        staffProductPermissions.add(permissionRepository.findByCode("PRODUCT_UPDATE").orElseThrow());
        staffProductPermissions.add(permissionRepository.findByCode("PRODUCT_DELETE").orElseThrow());
        staffProductPermissions.add(permissionRepository.findByCode("PRODUCT_VIEW").orElseThrow());
        Role staffProductRole = ensureRole("STAFF_PRODUCT", "Nhan vien san pham", "Quan ly san pham va ton kho");
        staffProductRole.setPermissions(staffProductPermissions);
        roleRepository.save(staffProductRole);

        Set<Permission> staffSalesPermissions = new HashSet<>();
        staffSalesPermissions.add(permissionRepository.findByCode("ORDER_VIEW").orElseThrow());
        staffSalesPermissions.add(permissionRepository.findByCode("ORDER_UPDATE").orElseThrow());
        staffSalesPermissions.add(permissionRepository.findByCode("PRODUCT_VIEW").orElseThrow());
        Role staffSalesRole = ensureRole("STAFF_SALES", "Nhan vien ban hang", "Xu ly don hang va cham soc khach hang");
        staffSalesRole.setPermissions(staffSalesPermissions);
        roleRepository.save(staffSalesRole);

        Role customerRole = ensureRole("CUSTOMER", "Khach hang", "Khach hang mua sam");
        customerRole.setPermissions(new HashSet<>());
        roleRepository.save(customerRole);

        log.info("Roles and permissions are ready");
    }

    private void initializeStorefrontCategories() {
        log.info("Ensuring storefront clothing categories...");
        ensureCategory("Áo sơ mi", "ao-so-mi", "Thiết kế áo sơ mi thanh lịch cho mọi dịp");
        ensureCategory("Chân váy", "chan-vay", "Chân váy thời trang nữ tính và hiện đại");
        ensureCategory("Set bộ", "set-bo", "Set đồ bộ phối sẵn, mặc là đẹp");
        log.info("Storefront categories are ready");
    }

    private Category ensureCategory(String name, String slug, String description) {
        Category category = categoryRepository.findBySlug(slug).orElseGet(() -> Category.builder()
                .name(name)
                .slug(slug)
                .isActive(true)
                .build());
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setIsActive(true);
        category.setParent(null);
        return categoryRepository.save(category);
    }

    private void ensurePermission(Permission seed) {
        permissionRepository.findByCode(seed.getCode()).orElseGet(() -> permissionRepository.save(seed));
    }

    private Role ensureRole(String code, String name, String description) {
        Role role = roleRepository.findByCode(code).orElseGet(() -> Role.builder()
                .code(code)
                .permissions(new HashSet<>())
                .build());
        role.setName(name);
        role.setDescription(description);
        return role;
    }

    private void initializeDemoAccounts() {
        Role admin = roleRepository.findByCode("ADMIN").orElseThrow();
        Role staffProduct = roleRepository.findByCode("STAFF_PRODUCT").orElseThrow();
        Role staffSales = roleRepository.findByCode("STAFF_SALES").orElseThrow();
        Role customer = roleRepository.findByCode("CUSTOMER").orElseThrow();

        User adminUser = ensureUser("admin@fashion.com", "Admin@123", "Fashion Admin", "0900000001", Set.of(admin));
        ensureEmployeeProfile(adminUser, "ADM-001", "Administrator");

        User staffUser = ensureUser("staff@fashion.com", "Staff@123", "Fashion Staff", "0900000002", Set.of(staffProduct, staffSales));
        ensureEmployeeProfile(staffUser, "STF-001", "Operations Staff");

        User customerUser = ensureUser("customer@fashion.com", "Customer@123", "Fashion Customer", "0900000003", Set.of(customer));
        ensureCustomerProfile(customerUser);
        ensureCart(customerUser);
    }

    private User ensureUser(String email, String rawPassword, String fullName, String phone, Set<Role> roles) {
        String phoneToUse = userRepository.findByPhone(phone)
                .map(existing -> existing.getEmail().equals(email) ? phone : null)
                .orElse(phone);
        User user = userRepository.findByEmail(email).orElseGet(() -> User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .fullName(fullName)
                .phone(phoneToUse)
                .isActive(true)
                .emailVerifiedAt(LocalDateTime.now())
                .roles(new HashSet<>())
                .build());
        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }
        user.getRoles().addAll(roles);
        if (user.getEmailVerifiedAt() == null) {
            user.setEmailVerifiedAt(LocalDateTime.now());
        }
        return userRepository.save(user);
    }

    private void ensureCustomerProfile(User user) {
        if (customerProfileRepository.existsById(user.getId())) return;
        User managedUser = userRepository.getReferenceById(user.getId());
        customerProfileRepository.save(CustomerProfile.builder()
                .user(managedUser)
                .gender(CustomerProfile.Gender.OTHER)
                .birthday(LocalDate.of(1998, 1, 1))
                .loyaltyPoint(0)
                .build());
    }

    private void ensureEmployeeProfile(User user, String employeeCode, String position) {
        if (employeeProfileRepository.existsById(user.getId())) return;
        User managedUser = userRepository.getReferenceById(user.getId());
        employeeProfileRepository.save(EmployeeProfile.builder()
                .user(managedUser)
                .employeeCode(employeeCode)
                .position(position)
                .hireDate(LocalDate.now())
                .build());
    }

    private void ensureCart(User user) {
        User managedUser = userRepository.getReferenceById(user.getId());
        cartRepository.findByCustomer(managedUser).orElseGet(() -> cartRepository.save(Cart.builder()
                .customer(managedUser)
                .items(new ArrayList<>())
                .build()));
    }
}
