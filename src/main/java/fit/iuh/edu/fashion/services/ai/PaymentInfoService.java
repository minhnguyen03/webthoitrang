package fit.iuh.edu.fashion.services.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service cung cấp thông tin phương thức thanh toán cho AI chatbot.
 * Static content — không cần query DB.
 */
@Service
@Slf4j
public class PaymentInfoService {

    public String retrievePaymentInfo() {
        log.info("RAG: Retrieving payment information");

        return """
                THONG TIN PHUONG THUC THANH TOAN CUA CUA HANG:
                
                1. **COD (Thanh toan khi nhan hang)**:
                   - Tra tien mat truc tiep cho shipper khi nhan hang
                   - Ap dung cho tat ca don hang toan quoc
                   - Khong mat phi giao dich
                   - Kiem tra hang truoc khi thanh toan
                
                2. **VNPay (Thanh toan online)**:
                   - Thanh toan qua ngan hang noi dia (ATM/Internet Banking)
                   - Thanh toan qua vi dien tu VNPay
                   - Thanh toan qua QR Code
                   - Bao mat, xac thuc OTP
                   - Nhan xac nhan thanh toan ngay lap tuc
                
                QUY TRINH THANH TOAN:
                1. Them san pham vao gio hang
                2. Vao trang thanh toan, dien thong tin giao hang
                3. Chon phuong thuc thanh toan (COD hoac VNPay)
                4. Xac nhan don hang
                5. Voi VNPay: chuyen sang trang VNPay de thanh toan
                6. Nhan email xac nhan don hang
                
                LUU Y:
                - Don hang se tu dong huy sau 24h neu chua thanh toan (VNPay)
                - Co the ap dung ma giam gia truoc khi thanh toan
                - Diem thuong duoc tru truc tiep vao tong tien
                
                CHI tra loi dua tren thong tin o tren.
                """;
    }

    public String retrievePaymentInfoForTopic(String topic) {
        String lowerTopic = topic.toLowerCase();
        if (lowerTopic.contains("vnpay")) {
            return """
                    THONG TIN VNPAY:
                    - VNPay la cong thanh toan truc tuyen uy tin tai Viet Nam
                    - Ho tro thanh toan qua: ngan hang noi dia, vi VNPay, QR Code
                    - Bao mat voi xac thuc OTP
                    - Thanh toan xong → nhan xac nhan ngay lap tuc
                    - Don hang duoc xu ly nhanh hon so voi COD
                    
                    CACH THANH TOAN VNPAY:
                    1. Chon VNPay khi checkout
                    2. He thong chuyen sang trang VNPay
                    3. Chon ngan hang/vi dien tu
                    4. Nhap thong tin the va OTP
                    5. Hoan tat → quay lai trang xac nhan
                    """;
        } else if (lowerTopic.contains("cod")) {
            return """
                    THONG TIN COD (THANH TOAN KHI NHAN HANG):
                    - Tra tien mat cho shipper khi nhan hang
                    - Duoc kiem tra hang truoc khi tra tien
                    - Khong can tai khoan ngan hang
                    - Ap dung toan quoc
                    - Khong mat phi giao dich them
                    """;
        }
        return retrievePaymentInfo();
    }
}

