import Link from "next/link";
import { CreditCard, Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, ShoppingBag, Truck, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footerGrid">
          <div>
            <h2>
               <img
                  src="/logo2.png"
                  alt="ELIMAZ"
                  style={{
                    width: "100px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                />
              ELIMAZ SHOP
            </h2>
            <p>
              Điểm đến lý tưởng cho những tín đồ thời trang yêu thích sự chỉn chu, tiện lợi và nhiều lựa chọn mới mỗi ngày.
            </p>
            <div className="socialLinks" aria-label="Kênh mạng xã hội">
              <a href="https://facebook.com/fashionshop" aria-label="Facebook Fashion Shop" target="_blank" rel="noreferrer">
                <Facebook size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3>Về chúng tôi</h3>
            <div className="footerLinks">
              <Link href="/info/about">Giới thiệu</Link>
              <Link href="/info/contact">Liên hệ</Link>
            </div>
          </div>

          <div>
            <h3>Chăm sóc khách hàng</h3>
            <div className="footerLinks">
              <Link href="/info/shipping">Chính sách giao hàng</Link>
              <Link href="/info/returns">Đổi trả hàng</Link>
              <Link href="/info/payment">Thanh toán</Link>
              <Link href="/info/faq">Câu hỏi thường gặp</Link>
            </div>
          </div>

          {/* <div>
            <h3>Liên hệ</h3>
            <div className="footerLinks">
              <span>
                <MapPin size={16} aria-hidden="true" /> 
              </span>
              <a href="tel:1900123456">
                <Phone size={16} aria-hidden="true" /> 
              </a>
              <a href="mailto:support@fashionshop.vn">
                <Mail size={16} aria-hidden="true" /> 
              </a>
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </div>
          </div> */}
        </div>

        <div className="footerBottom">
          <span>© 2026 Elimaz Shop. All rights reserved.</span>
          <div className="footerPaymentMethods" aria-label="Phương thức thanh toán">
            <span><CreditCard size={15} aria-hidden="true" /> Visa/Mastercard</span>
            <span><ShieldCheck size={15} aria-hidden="true" /> VNPay</span>
            <span><Truck size={15} aria-hidden="true" /> COD</span>
          </div>
          <nav className="footerPolicyLinks" aria-label="Chính sách">
            <Link href="/info/privacy">Bảo mật</Link>
            <Link href="/info/terms">Điều khoản</Link>
            <Link href="/info/payment">Thanh toán</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
