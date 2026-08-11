import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập Fashion Shop để theo dõi giỏ hàng, đơn mua và ưu đãi dành riêng cho bạn.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
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
              Bộ sưu tập mới mỗi tuần
            </p>
            <h1>Đăng nhập để mua sắm nhanh và theo dõi đơn hàng dễ hơn.</h1>
            <p>
              Lưu giỏ hàng, xem lịch sử mua sắm, nhận ưu đãi cá nhân hóa và tiếp tục trải nghiệm ở mọi thiết bị.
            </p>
          </div>
        </div>

        <aside className="authPanel authPanelElevated" aria-label="Đăng nhập tài khoản">
          <div className="authPanelHeader">
            <p className="eyebrow">Tài khoản Fashion Shop</p>
            <h2>Chào mừng bạn trở lại</h2>
            <p>Chưa đăng nhập? Nhập email và mật khẩu để tiếp tục mua sắm.</p>
          </div>

          <LoginForm />

          <div className="authDivider">
            <span>Chưa có tài khoản?</span>
          </div>

          <Link className="ghostButton authCreateLink" href="/register">
            Tạo tài khoản mới
          </Link>

          <div className="authTrustList" aria-label="Lợi ích khi đăng nhập">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              Bảo mật phiên đăng nhập
            </span>
            <span>
              <PackageCheck size={16} aria-hidden="true" />
              Theo dõi đơn hàng nhanh
            </span>
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              Lưu giỏ hàng tiện lợi
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
