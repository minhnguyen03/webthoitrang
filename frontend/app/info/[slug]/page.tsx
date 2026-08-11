import Link from "next/link";

const infoContent: Record<string, { title: string; body: string }> = {
  about: {
    title: "Giới thiệu",
    body: "Fashion Shop tập trung vào trải nghiệm mua sắm thời trang gọn gàng, dễ chọn và dễ theo dõi đơn hàng.",
  },
  contact: {
    title: "Liên hệ",
    body: "Bạn có thể liên hệ Fashion Shop qua hotline 1900 123 456 hoặc email support@fashionshop.vn.",
  },
  stores: {
    title: "Hệ thống cửa hàng",
    body: "Thông tin cửa hàng đang được chuẩn hóa sang UI mới.",
  },
  careers: {
    title: "Tuyển dụng",
    body: "Các vị trí tuyển dụng sẽ được cập nhật tại đây.",
  },
  shipping: {
    title: "Chính sách giao hàng",
    body: "Đơn hàng được xử lý theo trạng thái trong trang đơn hàng và chính sách vận chuyển của cửa hàng.",
  },
  returns: {
    title: "Đổi trả hàng",
    body: "Chính sách đổi trả đang được chuẩn hóa để hiển thị đầy đủ trên UI mới.",
  },
  payment: {
    title: "Thanh toán",
    body: "Fashion Shop hỗ trợ COD và VNPay cho các đơn hàng hợp lệ.",
  },
  faq: {
    title: "Câu hỏi thường gặp",
    body: "Các câu hỏi thường gặp sẽ được cập nhật sau khi chuyển hết nghiệp vụ từ Thymeleaf sang UI mới.",
  },
};

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = infoContent[slug] || {
    title: "Thông tin",
    body: "Nội dung này đang được chuẩn hóa sang UI mới.",
  };

  return (
    <section className="infoExperience">
      <div className="container infoPanel">
        <p className="eyebrow">Fashion Shop</p>
        <h1>{content.title}</h1>
        <p>{content.body}</p>
        <Link className="button" href="/products">
          Xem sản phẩm
        </Link>
      </div>
    </section>
  );
}
