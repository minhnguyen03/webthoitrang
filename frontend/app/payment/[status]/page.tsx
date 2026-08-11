import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

type PaymentStatusPageProps = {
  params: Promise<{ status: string }>;
  searchParams: Promise<{ orderCode?: string; message?: string }>;
};

const statusCopy = {
  success: {
    tone: "success",
    icon: CheckCircle2,
    title: "Thanh toán thành công.",
    description: "Đơn hàng đã được ghi nhận thanh toán. Bạn có thể theo dõi trạng thái xử lý trong trang đơn hàng.",
  },
  failed: {
    tone: "danger",
    icon: Clock,
    title: "Thanh toán chưa hoàn tất.",
    description: "Giao dịch chưa thành công hoặc đã bị hủy. Bạn có thể thử lại trong trang đơn hàng.",
  },
  error: {
    tone: "danger",
    icon: AlertCircle,
    title: "Cần kiểm tra giao dịch.",
    description: "Hệ thống chưa xác minh được thanh toán. Vui lòng kiểm tra đơn hàng hoặc liên hệ hỗ trợ.",
  },
} as const;

export default async function PaymentStatusPage({ params, searchParams }: PaymentStatusPageProps) {
  const { status } = await params;
  const query = await searchParams;
  const copy = statusCopy[status as keyof typeof statusCopy] || statusCopy.error;
  const Icon = copy.icon;

  return (
    <section className="paymentExperience">
      <div className="container paymentPanel" data-tone={copy.tone}>
        <Icon size={42} aria-hidden="true" />
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        {query.orderCode ? <strong>Mã đơn: {query.orderCode}</strong> : null}
        {query.message && status === "error" ? <p>{query.message}</p> : null}
        <div className="paymentActions">
          <Link className="button" href="/orders">
            Xem đơn hàng
          </Link>
          <Link className="ghostButton" href="/products">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </section>
  );
}
