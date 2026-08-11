import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="pageHeader">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>Trang này không tồn tại.</h1>
        <p>Quay lại catalog để tiếp tục xem sản phẩm từ Fashion Shop.</p>
        <div className="heroActions">
          <Link className="button" href="/products">
            <ArrowLeft size={17} aria-hidden="true" />
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    </section>
  );
}
