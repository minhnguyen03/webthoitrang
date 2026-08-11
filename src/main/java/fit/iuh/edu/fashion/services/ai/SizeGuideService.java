package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.dto.AiChatResponse;
import fit.iuh.edu.fashion.dto.UserIntentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service cung cấp hướng dẫn chọn size theo loại sản phẩm.
 * Trả về bảng size tĩnh (không cần gọi AI).
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SizeGuideService {

    @Value("${spring.ai.openai.chat.options.model}")
    private String modelName;

    /**
     * Cung cấp hướng dẫn chọn size dựa trên intent đã phân tích
     */
    public AiChatResponse provideSizeGuide(UserIntentDTO intent) {
        log.info("Providing size guide for: {}", intent.getOriginalMessage());

        String productType = intent.getProductType();
        if (productType == null) {
            productType = extractProductType(intent.getOriginalMessage());
        }

        StringBuilder guide = new StringBuilder();
        guide.append("📏 **HƯỚNG DẪN CHỌN SIZE**\n\n");
        guide.append(getSizeGuideContent(productType));
        guide.append(getSizeGuideTips());

        return new AiChatResponse(guide.toString(), modelName, System.currentTimeMillis());
    }

    // ==================== PRIVATE ====================

    private String getSizeGuideContent(String productType) {
        if (productType == null) {
            return getGeneralSizeGuide();
        }

        String lower = productType.toLowerCase();
        if (lower.contains("áo") || lower.contains("ao")) return getShirtSizeGuide();
        if (lower.contains("quần") || lower.contains("quan")) return getPantsSizeGuide();
        if (lower.contains("váy") || lower.contains("vay") || lower.contains("đầm") || lower.contains("dam")) return getDressSizeGuide();
        if (lower.contains("giày") || lower.contains("giay")) return getShoesSizeGuide();

        return getGeneralSizeGuide();
    }

    String extractProductType(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("áo") || lower.contains("ao")) return "áo";
        if (lower.contains("quần") || lower.contains("quan")) return "quần";
        if (lower.contains("váy") || lower.contains("vay") || lower.contains("đầm") || lower.contains("dam")) return "váy";
        if (lower.contains("giày") || lower.contains("giay")) return "giày";
        return null;
    }

    private String getSizeGuideTips() {
        return """
                
                
                💡 **LỜI KHUYÊN:**
                - Nếu bạn ở giữa 2 size, hãy chọn size lớn hơn để thoải mái
                - Đo vào buổi chiều/tối vì cơ thể hơi phồng lên trong ngày
                - Với áo len/áo khoác, có thể chọn size lớn hơn 1 size để mặc thoải mái
                - Liên hệ shop để được tư vấn size phù hợp nhất!
                
                📞 Cần hỗ trợ thêm? Hãy inbox shop hoặc gọi hotline nhé!""";
    }

    private String getShirtSizeGuide() {
        return """
                **BẢNG SIZE ÁO NAM/NỮ:**
                
                | SIZE | CHIỀU CAO (cm) | CÂN NẶNG (kg) | RỘNG VAI (cm) | VÒNG NGỰC (cm) | DÀI ÁO (cm) |
                |------|----------------|---------------|---------------|----------------|-------------|
                | S    | 155-160        | 45-52         | 38-40         | 82-86          | 60-62       |
                | M    | 160-165        | 52-58         | 40-42         | 86-90          | 62-64       |
                | L    | 165-170        | 58-65         | 42-44         | 90-94          | 64-66       |
                | XL   | 170-175        | 65-72         | 44-46         | 94-98          | 66-68       |
                | XXL  | 175-180        | 72-80         | 46-48         | 98-104         | 68-70       |
                
                **CÁCH ĐO:**
                1. **Vòng ngực**: Đo vòng quanh phần rộng nhất của ngực
                2. **Rộng vai**: Đo từ điểm cao nhất vai này sang vai kia
                3. **Dài áo**: Đo từ vai xuống đến eo/mông tùy kiểu áo""";
    }

    private String getPantsSizeGuide() {
        return """
                **BẢNG SIZE QUẦN NAM/NỮ:**
                
                | SIZE | VÒNG EO (cm) | VÒNG MÔNG (cm) | DÀI QUẦN (cm) | SIZE QUỐC TẾ |
                |------|--------------|----------------|---------------|--------------|
                | 26   | 64-67        | 86-89          | 95-97         | XS           |
                | 27   | 67-70        | 89-92          | 96-98         | S            |
                | 28   | 70-73        | 92-95          | 97-99         | S-M          |
                | 29   | 73-76        | 95-98          | 98-100        | M            |
                | 30   | 76-79        | 98-101         | 99-101        | M-L          |
                | 31   | 79-82        | 101-104        | 100-102       | L            |
                | 32   | 82-85        | 104-107        | 101-103       | L-XL         |
                | 33   | 85-88        | 107-110        | 102-104       | XL           |
                | 34   | 88-91        | 110-113        | 103-105       | XXL          |
                
                **CÁCH ĐO:**
                1. **Vòng eo**: Đo vòng quanh phần nhỏ nhất của eo
                2. **Vòng mông**: Đo vòng quanh phần rộng nhất của mông
                3. **Dài quần**: Đo từ eo xuống mắt cá chân""";
    }

    private String getDressSizeGuide() {
        return """
                **BẢNG SIZE VÁY/ĐẦM:**
                
                | SIZE | VÒNG NGỰC (cm) | VÒNG EO (cm) | VÒNG MÔNG (cm) | DÀI VÁY (cm) |
                |------|----------------|--------------|----------------|--------------|
                | S    | 80-84          | 62-66        | 86-90          | 85-90        |
                | M    | 84-88          | 66-70        | 90-94          | 88-93        |
                | L    | 88-92          | 70-74        | 94-98          | 90-95        |
                | XL   | 92-96          | 74-78        | 98-102         | 92-97        |
                | XXL  | 96-100         | 78-82        | 102-106        | 94-99        |
                
                **CÁCH ĐO:**
                1. **Vòng ngực**: Đo vòng quanh phần đầy nhất của ngực
                2. **Vòng eo**: Đo vòng quanh phần nhỏ nhất của eo
                3. **Vòng mông**: Đo vòng quanh phần rộng nhất của mông
                4. **Dài váy**: Đo từ vai xuống hem váy""";
    }

    private String getShoesSizeGuide() {
        return """
                **BẢNG SIZE GIÀY:**
                
                | SIZE VN | SIZE US (Nam) | SIZE US (Nữ) | SIZE EU | CHIỀU DÀI CHÂN (cm) |
                |---------|---------------|--------------|---------|---------------------|
                | 36      | 4             | 5.5          | 36      | 22.5                |
                | 37      | 4.5           | 6            | 37      | 23.0                |
                | 38      | 5             | 6.5          | 38      | 23.5                |
                | 39      | 6             | 7.5          | 39      | 24.0                |
                | 40      | 6.5           | 8            | 40      | 24.5                |
                | 41      | 7.5           | 9            | 41      | 25.0                |
                | 42      | 8             | 9.5          | 42      | 25.5                |
                | 43      | 9             | 10.5         | 43      | 26.0                |
                | 44      | 9.5           | 11           | 44      | 26.5                |
                | 45      | 10.5          | 12           | 45      | 27.0                |
                
                **CÁCH ĐO:**
                1. Đứng thẳng, đặt bàn chân lên giấy
                2. Đánh dấu điểm dài nhất (từ gót đến ngón chân dài nhất)
                3. Dùng thước đo khoảng cách giữa 2 điểm
                4. Cộng thêm 0.5-1cm để chọn size phù hợp""";
    }

    private String getGeneralSizeGuide() {
        return """
                **HƯỚNG DẪN CHỌN SIZE CHUNG:**
                
                **1. ÁO (Áo thun, Áo sơ mi, Áo khoác):**
                - S: 45-52kg, cao 155-160cm
                - M: 52-58kg, cao 160-165cm
                - L: 58-65kg, cao 165-170cm
                - XL: 65-72kg, cao 170-175cm
                - XXL: 72-80kg, cao 175-180cm
                
                **2. QUẦN (Jean, Kaki, Short):**
                - 27-28: Vòng eo 67-73cm
                - 29-30: Vòng eo 73-79cm
                - 31-32: Vòng eo 79-85cm
                - 33-34: Vòng eo 85-91cm
                
                **3. VÁY/ĐẦM:**
                - S: Vòng ngực 80-84cm, Vòng eo 62-66cm
                - M: Vòng ngực 84-88cm, Vòng eo 66-70cm
                - L: Vòng ngực 88-92cm, Vòng eo 70-74cm
                - XL: Vòng ngực 92-96cm, Vòng eo 74-78cm
                
                **4. GIÀY DÉP:**
                - 36-37: Dài chân 22.5-23.5cm
                - 38-39: Dài chân 23.5-24.5cm
                - 40-41: Dài chân 24.5-25.5cm
                - 42-43: Dài chân 25.5-26.5cm""";
    }
}

