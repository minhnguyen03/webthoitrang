package fit.iuh.edu.fashion.services.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static fit.iuh.edu.fashion.util.TextUtils.containsAny;

/**
 * Service cung cấp thông tin chính sách cửa hàng cho AI chatbot.
 * Static content — không cần query DB.
 */
@Service
@Slf4j
public class PolicyInfoService {

    public String retrievePolicy(String userMessage) {
        log.info("RAG: Retrieving policy for message: {}", userMessage);

        String normalized = userMessage.toLowerCase();
        StringBuilder ctx = new StringBuilder();
        ctx.append("CHINH SACH CUA HANG FASHION SHOP:\n\n");

        boolean specific = false;

        if (containsAny(normalized, "doi tra", "đổi trả", "tra hang", "trả hàng", "hoan tra", "hoàn trả")) {
            ctx.append(getReturnPolicy());
            specific = true;
        }

        if (containsAny(normalized, "ship", "giao hang", "giao hàng", "van chuyen", "vận chuyển",
                "phi ship", "phí ship", "phi giao", "phí giao")) {
            ctx.append(getShippingPolicy());
            specific = true;
        }

        if (containsAny(normalized, "bao hanh", "bảo hành", "chat luong", "chất lượng")) {
            ctx.append(getWarrantyPolicy());
            specific = true;
        }

        if (containsAny(normalized, "hoan tien", "hoàn tiền", "refund")) {
            ctx.append(getRefundPolicy());
            specific = true;
        }

        if (containsAny(normalized, "bao mat", "bảo mật", "thong tin", "thông tin", "privacy")) {
            ctx.append(getPrivacyPolicy());
            specific = true;
        }

        // If no specific match, return all policies
        if (!specific) {
            ctx.append(getReturnPolicy());
            ctx.append(getShippingPolicy());
            ctx.append(getWarrantyPolicy());
            ctx.append(getRefundPolicy());
        }

        ctx.append("CHI tra loi dua tren chinh sach o tren. KHONG bia them.\n");
        return ctx.toString();
    }

    private String getReturnPolicy() {
        return """
                📋 CHINH SACH DOI TRA:
                - Doi tra trong vong 7 ngay ke tu khi nhan hang
                - San pham phai con nguyen tem, nhan mac, chua qua su dung
                - Khong ap dung doi tra voi: do lot, tat, phu kien da mo seal
                - Loi do nha san xuat: doi moi 100% hoac hoan tien
                - Loi do khach hang: chi ho tro doi size/mau (neu con hang)
                - Lien he hotline hoac chat AI de yeu cau doi tra
                
                """;
    }

    private String getShippingPolicy() {
        return """
                🚚 CHINH SACH GIAO HANG:
                - Giao hang toan quoc
                - Phi ship: 25,000 - 50,000 VND tuy khu vuc
                - MIEN PHI ship cho don hang tu 500,000 VND
                - Thoi gian giao: 2-3 ngay (noi thanh), 3-5 ngay (ngoai thanh)
                - Kiem tra hang truoc khi nhan (COD)
                - Theo doi don hang qua ma van don
                
                """;
    }

    private String getWarrantyPolicy() {
        return """
                🛡️ CHINH SACH BAO HANH:
                - Bao hanh loi san xuat trong 30 ngay
                - Bao gom: loi duong chi, loi in, loi vai, loi phu kien
                - Khong bao hanh: hu hong do su dung sai cach, giat sai huong dan
                - Bao hanh doi moi hoac sua chua mien phi
                
                """;
    }

    private String getRefundPolicy() {
        return """
                💰 CHINH SACH HOAN TIEN:
                - Hoan tien khi san pham loi do nha san xuat
                - Hoan tien khi giao sai san pham
                - Thoi gian hoan tien: 3-5 ngay lam viec
                - Hoan qua phuong thuc thanh toan ban dau
                - VNPay: hoan ve tai khoan ngan hang
                - COD: hoan qua chuyen khoan ngan hang
                
                """;
    }

    private String getPrivacyPolicy() {
        return """
                🔒 CHINH SACH BAO MAT:
                - Thong tin ca nhan duoc bao mat tuyet doi
                - Khong chia se thong tin voi ben thu 3
                - Su dung ma hoa SSL cho moi giao dich
                - Khach hang co quyen yeu cau xoa thong tin ca nhan
                
                """;
    }
}

