import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { KeyRound, Sparkles } from "lucide-react";
import { ResetPasswordForm } from "@/components/AuthAccountForms";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Cập nhật mật khẩu mới cho tài khoản Fashion Shop.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
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
              Mật khẩu mới
            </p>
            <h1>Cập nhật mật khẩu an toàn và quay lại mua sắm trên cùng một giao diện.</h1>
            <p>Trang này đọc token từ email khôi phục và gọi API đặt lại mật khẩu qua proxy Next.</p>
          </div>
        </div>

        <aside className="authPanel authPanelElevated" aria-label="Đặt lại mật khẩu">
          <div className="authPanelHeader">
            <p className="eyebrow">Bảo mật tài khoản</p>
            <h2>Nhập mật khẩu mới</h2>
            <p>Mật khẩu nên có ít nhất 6 ký tự và không trùng với mật khẩu dễ đoán.</p>
          </div>

          <Suspense fallback={<p className="authMessage" data-visible="true">Đang tải liên kết khôi phục...</p>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="authTrustList" aria-label="Khôi phục an toàn">
            <span>
              <KeyRound size={16} aria-hidden="true" />
              Xử lý toàn bộ trong UI mới
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
