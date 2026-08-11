package fit.iuh.edu.fashion.services.ai;

import fit.iuh.edu.fashion.models.CustomerProfile;
import fit.iuh.edu.fashion.repositories.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service truy vấn điểm thưởng khách hàng để cung cấp context cho AI chatbot.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LoyaltyRetrievalService {

    private final CustomerProfileRepository customerProfileRepository;

    @Transactional(readOnly = true)
    public String retrieveLoyaltyContext(Long userId) {
        if (userId == null) {
            return "Ban can [dang nhap](/login) de xem thong tin diem thuong.\n";
        }

        log.info("RAG: Retrieving loyalty points for userId: {}", userId);
        Optional<CustomerProfile> profileOpt = customerProfileRepository.findById(userId);

        if (profileOpt.isEmpty()) {
            return "Khong tim thay thong tin khach hang.\n";
        }

        CustomerProfile profile = profileOpt.get();
        return buildLoyaltyContext(profile);
    }

    private String buildLoyaltyContext(CustomerProfile profile) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("THONG TIN DIEM THUONG KHACH HANG:\n\n");

        int points = profile.getLoyaltyPoint() != null ? profile.getLoyaltyPoint() : 0;
        long pointValue = points * 1000L; // 1 điểm = 1,000 VND

        ctx.append("🎯 Diem hien co: ").append(String.format("%,d", points)).append(" diem\n");
        ctx.append("💰 Gia tri quy doi: ").append(String.format("%,d VND", pointValue)).append("\n\n");

        ctx.append("CACH TICH DIEM:\n");
        ctx.append("- Moi don hang thanh cong: tich 1% tong gia tri don hang\n");
        ctx.append("- Vi du: Don hang 500,000 VND → nhan 5 diem\n\n");

        ctx.append("CACH SU DUNG DIEM:\n");
        ctx.append("- 1 diem = 1,000 VND\n");
        ctx.append("- Ap dung truc tiep khi thanh toan\n");
        ctx.append("- Toi da su dung 50% gia tri don hang bang diem\n");
        ctx.append("- Nhap so diem muon dung tai buoc thanh toan\n\n");
        ctx.append("Link: [Xem trang ca nhan](/profile)\n\n");
        ctx.append("CHI tra loi dua tren thong tin o tren. KHONG bia them.\n");

        return ctx.toString();
    }
}

