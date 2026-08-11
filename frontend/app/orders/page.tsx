"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { authFetch, clearStoredAuth, hasStoredAuth } from "@/lib/auth-fetch";

type OrderItem = {
  id: number;
  sku?: string;
  productName?: string;
  colorName?: string;
  sizeName?: string;
  quantity?: number;
  unitPrice?: number | string;
  discountAmount?: number | string;
  lineTotal?: number | string;
};

type Order = {
  id: number;
  code?: string;
  status?: string;
  subtotal?: number | string;
  discountTotal?: number | string;
  shippingFee?: number | string;
  taxTotal?: number | string;
  grandTotal?: number | string;
  note?: string;
  placedAt?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentTransactionId?: string;
  paymentTime?: string;
  shipName?: string;
  shipPhone?: string;
  shipLine1?: string;
  shipLine2?: string;
  shipWard?: string;
  shipDistrict?: string;
  shipCity?: string;
  items?: OrderItem[];
};

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type VNPayResponse = {
  code?: string;
  message?: string;
  paymentUrl?: string;
};

const statusFilters = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PACKING", label: "Đang đóng gói" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

function formatCurrency(value?: number | string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "Chưa cập nhật";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status?: string) {
  const labels: Record<string, string> = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PACKING: "Đang đóng gói",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    REFUNDED: "Đã hoàn tiền",
  };

  return status ? labels[status] || status : "Chưa cập nhật";
}

function paymentLabel(status?: string) {
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thanh toán lỗi",
    REFUNDED: "Đã hoàn tiền",
  };

  return status ? labels[status] || status : "Chưa cập nhật";
}

function paymentMethodLabel(method?: string) {
  const labels: Record<string, string> = {
    COD: "Thanh toán khi nhận hàng",
    VNPAY: "VNPay",
    MOMO: "MoMo",
    ZALOPAY: "ZaloPay",
  };

  return method ? labels[method] || method : "Chưa cập nhật";
}

function isEditableOrder(order: Order) {
  return (order.status === "PENDING" || order.status === "CONFIRMED") && order.paymentStatus !== "REFUNDED";
}

function isOnlinePayment(method?: string) {
  return method === "VNPAY" || method === "MOMO" || method === "ZALOPAY";
}

export default function OrdersPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [ordersPage, setOrdersPage] = useState<Page<Order> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notice, setNotice] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Đang tải đơn hàng...");
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);

  function clearAuthAndLogin() {
    clearStoredAuth();
    router.replace("/login");
  }

  const jsonHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
  };

  async function loadOrders(page = pageIndex) {
    if (!hasStoredAuth()) {
      router.replace("/login");
      return;
    }

    setLoadingMessage("Đang tải đơn hàng...");
    try {
      const response = await authFetch(`/api/orders/my?page=${page}&size=50`, { headers: jsonHeaders }, { redirectOnFailure: true });

      if (!response || response.status === 401 || response.status === 403) {
        clearAuthAndLogin();
        return;
      }

      if (!response.ok) {
        throw new Error("orders_fetch_failed");
      }

      const data = (await response.json()) as Page<Order>;
      setOrdersPage(data);
      setLoadingMessage("");
      setNotice("");
    } catch {
      setLoadingMessage("Chưa thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    }
  }

  useEffect(() => {
    loadOrders(pageIndex);
  }, [pageIndex]);

  async function openOrderDetail(order: Order) {
    setSelectedOrder(order);
    try {
      const response = await authFetch(`/api/orders/${order.id}`, { headers: jsonHeaders }, { redirectOnFailure: true });
      if (response?.ok) {
        setSelectedOrder((await response.json()) as Order);
      }
    } catch {
      setNotice("Đang hiển thị thông tin đơn hàng hiện có. Chưa thể tải chi tiết mới nhất.");
    }
  }

  async function cancelOrder(order: Order) {
    const paidWarning =
      order.paymentStatus === "PAID"
        ? "\n\nĐơn hàng đã thanh toán sẽ được xử lý hoàn tiền theo chính sách của cửa hàng."
        : "";
    if (!window.confirm(`Bạn có chắc muốn hủy đơn ${order.code || `#${order.id}`}?${paidWarning}`)) return;

    setBusyOrderId(order.id);
    try {
      const response = await authFetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        headers: jsonHeaders,
      }, { redirectOnFailure: true });

      if (!response?.ok) {
        const error = await response?.json().catch(() => ({}));
        throw new Error(error.message || "Không thể hủy đơn hàng");
      }

      setNotice("Hủy đơn hàng thành công.");
      setSelectedOrder(null);
      await loadOrders(pageIndex);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function createVNPayPayment(orderId: number) {
    const response = await authFetch(`/api/payment/vnpay/create?orderId=${orderId}`, {
      method: "POST",
      headers: jsonHeaders,
    }, { redirectOnFailure: true });

    const data = (await response?.json().catch(() => ({}))) as VNPayResponse;
    if (!response?.ok || data.code !== "00" || !data.paymentUrl) {
      throw new Error(data.message || "Không thể tạo link thanh toán VNPay.");
    }

    window.location.href = data.paymentUrl;
  }

  async function retryPayment(order: Order) {
    setBusyOrderId(order.id);
    try {
      await createVNPayPayment(order.id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo thanh toán.");
      setBusyOrderId(null);
    }
  }

  async function switchToVNPay(order: Order) {
    if (!window.confirm("Chuyển đơn hàng này từ COD sang thanh toán qua VNPay?")) return;

    setBusyOrderId(order.id);
    try {
      const response = await authFetch(`/api/orders/${order.id}/payment-method`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify({ paymentMethod: "VNPAY" }),
      }, { redirectOnFailure: true });

      if (!response?.ok) {
        const error = await response?.json().catch(() => ({}));
        throw new Error(error.message || "Không thể cập nhật phương thức thanh toán.");
      }

      await createVNPayPayment(order.id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Có lỗi xảy ra khi chuyển sang VNPay.");
      setBusyOrderId(null);
      await loadOrders(pageIndex);
    }
  }

  const allOrders = ordersPage?.content || [];
  const orders = statusFilter ? allOrders.filter((order) => order.status === statusFilter) : allOrders;
  const totalItems = useMemo(() => orders.reduce((total, order) => total + (order.items?.length || 0), 0), [orders]);

  return (
    <section className="ordersExperience">
      <div className="container ordersShell">
        <header className="ordersHeader">
          <div>
            <p className="eyebrow">Đơn hàng đã mua</p>
            <h1>Lịch sử mua hàng</h1>
            <p>Theo dõi trạng thái, thanh toán và các sản phẩm trong từng đơn hàng của bạn.</p>
          </div>
          <Link className="button" href="/products">
            <ShoppingBag size={17} aria-hidden="true" />
            Mua thêm sản phẩm
          </Link>
        </header>

        <div className="ordersStats" aria-label="Tổng quan đơn hàng">
          <div>
            <ReceiptText size={22} aria-hidden="true" />
            <span>Tổng đơn</span>
            <strong>{ordersPage?.totalElements ?? 0}</strong>
          </div>
          <div>
            <PackageCheck size={22} aria-hidden="true" />
            <span>Sản phẩm đang xem</span>
            <strong>{totalItems}</strong>
          </div>
          <div>
            <CalendarDays size={22} aria-hidden="true" />
            <span>Trang hiện tại</span>
            <strong>{(ordersPage?.number ?? pageIndex) + 1}</strong>
          </div>
        </div>

        <div className="ordersFilters" aria-label="Lọc trạng thái đơn hàng">
          {statusFilters.map((filter) => (
            <button
              className="ordersFilterButton"
              type="button"
              key={filter.value || "all"}
              aria-pressed={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {notice ? <p className="ordersNotice" data-tone="success">{notice}</p> : null}
        {loadingMessage ? <p className="ordersNotice">{loadingMessage}</p> : null}

        {!loadingMessage && orders.length === 0 ? (
          <div className="ordersEmpty">
            <ReceiptText size={34} aria-hidden="true" />
            <strong>Không có đơn hàng phù hợp</strong>
            <p>Khi hoàn tất mua hàng, đơn hàng sẽ xuất hiện tại đây để bạn tiện theo dõi.</p>
            <Link className="button" href="/products">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : null}

        <div className="ordersList">
          {orders.map((order) => {
            const canCancel = isEditableOrder(order);
            const canSwitchToVNPay = order.paymentMethod === "COD" && order.paymentStatus === "UNPAID" && canCancel;
            const canRetryPayment = isOnlinePayment(order.paymentMethod) && order.paymentStatus === "UNPAID" && canCancel;

            return (
              <article className="orderCard" key={order.id}>
                <div className="orderCardHeader">
                  <div>
                    <span>Mã đơn</span>
                    <strong>{order.code || `#${order.id}`}</strong>
                  </div>
                  <div className="orderStatusGroup">
                    <span className="orderStatus" data-status={order.status || ""}>
                      {statusLabel(order.status)}
                    </span>
                    <span className="orderPayment">{paymentLabel(order.paymentStatus)}</span>
                  </div>
                </div>

                <div className="orderMeta">
                  <span>{formatDate(order.placedAt)}</span>
                  <span>{paymentMethodLabel(order.paymentMethod)}</span>
                  <span>{[order.shipLine1, order.shipWard, order.shipDistrict, order.shipCity].filter(Boolean).join(", ") || "Chưa cập nhật địa chỉ"}</span>
                </div>

                <div className="orderItems">
                  {(order.items || []).map((item) => (
                    <div className="orderItem" key={item.id}>
                      <div>
                        <strong>{item.productName || item.sku || "Sản phẩm"}</strong>
                        <span>{[item.colorName, item.sizeName, item.sku].filter(Boolean).join(" / ") || "Thông tin sản phẩm"}</span>
                      </div>
                      <span>x{item.quantity || 0}</span>
                      <strong>{formatCurrency(item.lineTotal || item.unitPrice)}</strong>
                    </div>
                  ))}
                </div>

                <footer className="orderFooter">
                  <span>
                    Người nhận: <strong>{order.shipName || "Chưa cập nhật"}</strong>
                    {order.shipPhone ? ` - ${order.shipPhone}` : ""}
                  </span>
                  <strong>{formatCurrency(order.grandTotal)}</strong>
                </footer>

                <div className="orderActions">
                  <button className="ghostButton" type="button" onClick={() => openOrderDetail(order)}>
                    <Eye size={16} aria-hidden="true" />
                    Xem chi tiết
                  </button>
                  {canCancel ? (
                    <button className="ghostButton orderDangerAction" type="button" disabled={busyOrderId === order.id} onClick={() => cancelOrder(order)}>
                      <XCircle size={16} aria-hidden="true" />
                      Hủy đơn
                    </button>
                  ) : null}
                  {canSwitchToVNPay ? (
                    <button className="button orderPayAction" type="button" disabled={busyOrderId === order.id} onClick={() => switchToVNPay(order)}>
                      <CreditCard size={16} aria-hidden="true" />
                      Chuyển sang VNPay
                    </button>
                  ) : null}
                  {canRetryPayment ? (
                    <button className="button orderPayAction" type="button" disabled={busyOrderId === order.id} onClick={() => retryPayment(order)}>
                      <CreditCard size={16} aria-hidden="true" />
                      Thanh toán ngay
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {ordersPage && ordersPage.totalPages > 1 ? (
          <div className="ordersPager">
            <button className="ghostButton" type="button" disabled={pageIndex <= 0} onClick={() => setPageIndex((current) => Math.max(0, current - 1))}>
              <ChevronLeft size={17} aria-hidden="true" />
              Trước
            </button>
            <span>
              Trang {ordersPage.number + 1} / {ordersPage.totalPages}
            </span>
            <button
              className="ghostButton"
              type="button"
              disabled={ordersPage.number + 1 >= ordersPage.totalPages}
              onClick={() => setPageIndex((current) => current + 1)}
            >
              Sau
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      {selectedOrder ? (
        <div className="orderDetailOverlay" role="dialog" aria-modal="true" aria-label="Chi tiết đơn hàng">
          <div className="orderDetailPanel">
            <header>
              <div>
                <span>Chi tiết đơn hàng</span>
                <h2>{selectedOrder.code || `#${selectedOrder.id}`}</h2>
              </div>
              <button className="iconButton" type="button" aria-label="Đóng chi tiết đơn hàng" onClick={() => setSelectedOrder(null)}>
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="orderDetailGrid">
              <section>
                <h3>Thông tin đơn</h3>
                <p>Trạng thái: <strong>{statusLabel(selectedOrder.status)}</strong></p>
                <p>Ngày đặt: <strong>{formatDate(selectedOrder.placedAt)}</strong></p>
                <p>Ghi chú: <strong>{selectedOrder.note || "Không có"}</strong></p>
              </section>
              <section>
                <h3>Giao hàng</h3>
                <p>Người nhận: <strong>{selectedOrder.shipName || "Chưa cập nhật"}</strong></p>
                <p>Số điện thoại: <strong>{selectedOrder.shipPhone || "Chưa cập nhật"}</strong></p>
                <p>Địa chỉ: <strong>{[selectedOrder.shipLine1, selectedOrder.shipLine2, selectedOrder.shipWard, selectedOrder.shipDistrict, selectedOrder.shipCity].filter(Boolean).join(", ") || "Chưa cập nhật"}</strong></p>
              </section>
              <section>
                <h3>Thanh toán</h3>
                <p>Phương thức: <strong>{paymentMethodLabel(selectedOrder.paymentMethod)}</strong></p>
                <p>Trạng thái: <strong>{paymentLabel(selectedOrder.paymentStatus)}</strong></p>
                <p>Mã giao dịch: <strong>{selectedOrder.paymentTransactionId || "Chưa có"}</strong></p>
              </section>
            </div>

            <div className="orderDetailItems">
              {(selectedOrder.items || []).map((item) => (
                <div className="orderItem" key={item.id}>
                  <div>
                    <strong>{item.productName || item.sku || "Sản phẩm"}</strong>
                    <span>{[item.colorName, item.sizeName, item.sku].filter(Boolean).join(" / ") || "Thông tin sản phẩm"}</span>
                  </div>
                  <span>x{item.quantity || 0}</span>
                  <strong>{formatCurrency(item.lineTotal || item.unitPrice)}</strong>
                </div>
              ))}
            </div>

            <div className="orderTotals">
              <span>Tạm tính <strong>{formatCurrency(selectedOrder.subtotal)}</strong></span>
              <span>Giảm giá <strong>-{formatCurrency(selectedOrder.discountTotal)}</strong></span>
              <span>Phí ship <strong>{formatCurrency(selectedOrder.shippingFee)}</strong></span>
              <span>Tổng cộng <strong>{formatCurrency(selectedOrder.grandTotal)}</strong></span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
