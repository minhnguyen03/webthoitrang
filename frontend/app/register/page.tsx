import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { RegisterForm } from "@/components/AuthAccountForms";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tạo tài khoản",
  description: "Tạo tài khoản Fashion Shop để mua sắm, theo dõi đơn hàng và nhận ưu đãi cá nhân hóa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <section className="authExperience">
      <div className="container authShell">
        <div className="authVisual">
          <Image
            src={siteConfig.storyImage}
            alt="Trải nghiệm mua sắm thời trang tại Fashion Shop"
            fill
            priority
            sizes="(max-width: 1020px) 100vw, 58vw"
          />
          <div className="authVisualOverlay">
            <p className="authBadge">
              <Sparkles size={16} aria-hidden="true" />
              Tài khoản mua sắm cá nhân
            </p>
            <h1>Tạo tài khoản để lưu giỏ hàng và theo dõi đơn mua ngay trên UI mới.</h1>
            <p>Hoàn tất thông tin cơ bản, hệ thống sẽ đăng nhập và đưa bạn trở lại cửa hàng.</p>
          </div>
        </div>

        <aside className="authPanel authPanelElevated" aria-label="Tạo tài khoản">
          <div className="authPanelHeader">
            <p className="eyebrow">Fashion Shop</p>
            <h2>Bắt đầu tài khoản mới</h2>
            <p>Thông tin này dùng cho giao hàng, hỗ trợ đơn mua và các ưu đãi riêng của bạn.</p>
          </div>

          <RegisterForm />

          <div className="authDivider">
            <span>Đã có tài khoản?</span>
          </div>

          <Link className="ghostButton authCreateLink" href="/login">
            <UserRound size={16} aria-hidden="true" />
            Đăng nhập
          </Link>

          <div className="authTrustList" aria-label="Bảo mật tài khoản">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              Phiên đăng nhập dùng token bảo mật
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
