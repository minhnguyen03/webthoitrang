import type { Metadata } from "next";
import { CartClient } from "@/components/AddToCart";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Xem lại giỏ hàng Fashion Shop trước khi thanh toán.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <>
      <header className="pageHeader">
        <div className="container">
          <p className="eyebrow">Giỏ hàng</p>
          <h1>Sản phẩm bạn đã chọn.</h1>
          <p>Kiểm tra lại sản phẩm, số lượng và tổng tạm tính trước khi tiếp tục thanh toán.</p>
        </div>
      </header>
      <section className="bandCompact">
        <div className="container">
          <CartClient />
        </div>
      </section>
    </>
  );
}
