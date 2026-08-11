import type { Metadata } from "next";
import Image from "next/image";
import { KeyRound, Sparkles } from "lucide-react";
import { ForgotPasswordForm } from "@/components/AuthAccountForms";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Yêu cầu hướng dẫn đặt lại mật khẩu Fashion Shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <section className="authExperience">
      <div className="container authShell">
        <div className="authVisual">
          <Image
            src={siteConfig.storyImage}
            alt="Không gian mua sắm thời trang tại Fashion Shop"
            fill
            priority
            sizes="(max-width: 1020px) 100vw, 58vw"
          />
          <div className="authVisualOverlay">
            <p className="authBadge">
              <Sparkles size={16} aria-hidden="true" />
              Khôi phục tài khoản
            </p>
            <h1>Lấy lại quyền truy cập mà không rời khỏi trải nghiệm UI mới.</h1>
            <p>Nhập email tài khoản, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu nếu email hợp lệ.</p>
          </div>
        </div>

        <aside className="authPanel authPanelElevated" aria-label="Quên mật khẩu">
          <div className="authPanelHeader">
            <p className="eyebrow">Bảo mật tài khoản</p>
            <h2>Đặt lại mật khẩu</h2>
            <p>Liên kết khôi phục sẽ được xử lý qua API và quay về trang Next.</p>
          </div>

          <ForgotPasswordForm />

          <div className="authTrustList" aria-label="Khôi phục an toàn">
            <span>
              <KeyRound size={16} aria-hidden="true" />
              Không chuyển sang giao diện Thymeleaf cũ
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
