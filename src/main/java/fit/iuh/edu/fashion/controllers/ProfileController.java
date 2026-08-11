package fit.iuh.edu.fashion.controllers;

import fit.iuh.edu.fashion.dto.request.AddressRequest;
import fit.iuh.edu.fashion.dto.request.ChangePasswordRequest;
import fit.iuh.edu.fashion.dto.request.UpdateProfileRequest;
import fit.iuh.edu.fashion.dto.response.AddressResponse;
import fit.iuh.edu.fashion.dto.response.ProfileResponse;
import fit.iuh.edu.fashion.exception.BusinessException;
import fit.iuh.edu.fashion.models.Address;
import fit.iuh.edu.fashion.models.CustomerProfile;
import fit.iuh.edu.fashion.models.User;
import fit.iuh.edu.fashion.repositories.AddressRepository;
import fit.iuh.edu.fashion.repositories.UserRepository;
import fit.iuh.edu.fashion.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse response = mapToProfileResponse(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Cập nhật thông tin cơ bản
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());

            // Cập nhật hoặc tạo customer profile
            CustomerProfile profile = user.getCustomerProfile();
            if (profile == null) {
                profile = new CustomerProfile();
                profile.setUser(user);
                profile.setUserId(user.getId());
                profile.setLoyaltyPoint(0);
            }

            if (request.getGender() != null && !request.getGender().isEmpty()) {
                profile.setGender(CustomerProfile.Gender.valueOf(request.getGender()));
            }
            profile.setBirthday(request.getBirthday());

            user.setCustomerProfile(profile);
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(mapToProfileResponse(savedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Không thể cập nhật thông tin: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            authService.changePassword(email, request);
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToAddressResponse)
                .toList());
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault())
                || addressRepository.findByUserId(user.getId()).isEmpty();

        if (shouldBeDefault) {
            clearDefaultAddresses(user.getId());
        }

        Address address = Address.builder()
                .user(user)
                .label(blankToNull(request.getLabel()))
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .line1(request.getLine1())
                .line2(blankToNull(request.getLine2()))
                .ward(blankToNull(request.getWard()))
                .district(blankToNull(request.getDistrict()))
                .city(request.getCity())
                .country(blankToDefault(request.getCountry(), "Vietnam"))
                .isDefault(shouldBeDefault)
                .build();

        return ResponseEntity.ok(mapToAddressResponse(addressRepository.save(address)));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Address address = getOwnedAddress(user.getId(), addressId);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultAddresses(user.getId());
            address.setIsDefault(true);
        } else if (Boolean.FALSE.equals(request.getIsDefault())) {
            address.setIsDefault(false);
        }

        address.setLabel(blankToNull(request.getLabel()));
        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setLine1(request.getLine1());
        address.setLine2(blankToNull(request.getLine2()));
        address.setWard(blankToNull(request.getWard()));
        address.setDistrict(blankToNull(request.getDistrict()));
        address.setCity(request.getCity());
        address.setCountry(blankToDefault(request.getCountry(), "Vietnam"));

        return ResponseEntity.ok(mapToAddressResponse(addressRepository.save(address)));
    }

    @PutMapping("/addresses/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long addressId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Address address = getOwnedAddress(user.getId(), addressId);
        clearDefaultAddresses(user.getId());
        address.setIsDefault(true);
        return ResponseEntity.ok(mapToAddressResponse(addressRepository.save(address)));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Address address = getOwnedAddress(user.getId(), addressId);
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        if (wasDefault) {
            addressRepository.findByUserId(user.getId()).stream().findFirst().ifPresent(next -> {
                next.setIsDefault(true);
                addressRepository.save(next);
            });
        }

        return ResponseEntity.ok().build();
    }

    private ProfileResponse mapToProfileResponse(User user) {
        List<AddressResponse> addresses = addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToAddressResponse)
                .toList();
        AddressResponse defaultAddress = addresses.stream()
                .filter(address -> Boolean.TRUE.equals(address.getIsDefault()))
                .findFirst()
                .orElse(addresses.isEmpty() ? null : addresses.get(0));

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .emailVerifiedAt(user.getEmailVerifiedAt())
                .createdAt(user.getCreatedAt())
                .addresses(addresses)
                .defaultAddress(defaultAddress);

        if (user.getCustomerProfile() != null) {
            CustomerProfile profile = user.getCustomerProfile();
            builder.gender(profile.getGender() != null ? profile.getGender().name() : null)
                    .birthday(profile.getBirthday())
                    .loyaltyPoint(profile.getLoyaltyPoint());
        }

        return builder.build();
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Address getOwnedAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new BusinessException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("You can only update your own addresses");
        }
        return address;
    }

    private void clearDefaultAddresses(Long userId) {
        addressRepository.findByUserId(userId).forEach(address -> {
            if (Boolean.TRUE.equals(address.getIsDefault())) {
                address.setIsDefault(false);
                addressRepository.save(address);
            }
        });
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .receiverName(address.getReceiverName())
                .phone(address.getPhone())
                .line1(address.getLine1())
                .line2(address.getLine2())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .country(address.getCountry())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
