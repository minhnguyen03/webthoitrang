package fit.iuh.edu.fashion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String label;
    private String receiverName;
    private String phone;
    private String line1;
    private String line2;
    private String ward;
    private String district;
    private String city;
    private String country;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}
