"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Boxes,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  Database,
  FileClock,
  Gauge,
  Grid3X3,
  Home,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  PackagePlus,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tags,
  TicketPercent,
  Truck,
  UserRoundCog,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch, clearStoredAuth, hasStoredAuth } from "@/lib/auth-fetch";

type Product = {
  id: number;
  name?: string;
  isActive?: boolean;
  variants?: { price?: number | string }[];
};

type Order = {
  id: number;
  code?: string;
  orderCode?: string;
  status?: string;
  grandTotal?: number | string;
  totalAmount?: number | string;
  createdAt?: string;
  placedAt?: string;
  shipName?: string;
  customerName?: string;
  paymentMethod?: string;
};

type Page<T> = {
  content: T[];
  totalElements: number;
};

type User = {
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  roles?: string[];
};

type RevenueSummary = {
  amount: number;
  count: number;
};

type DashboardState = {
  products: Page<Product> | null;
  categoriesCount: number | null;
  brandsCount: number | null;
  orders: Page<Order> | null;
};

const initialDashboardState: DashboardState = {
  products: null,
  categoriesCount: null,
  brandsCount: null,
  orders: null,
};

const orderStatuses = ["PENDING", "CONFIRMED", "PACKING", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"];

const statusMeta: Record<string, { label: string; tone: string; icon: typeof FileClock }> = {
  PENDING: { label: "Chờ xử lý", tone: "warning", icon: FileClock },
  CONFIRMED: { label: "Đã xác nhận", tone: "info", icon: ClipboardCheck },
  PACKING: { label: "Đang đóng gói", tone: "primary", icon: Boxes },
  SHIPPING: { label: "Đang giao", tone: "primary", icon: Truck },
  COMPLETED: { label: "Hoàn thành", tone: "success", icon: PackageCheck },
  CANCELLED: { label: "Đã hủy", tone: "danger", icon: FileClock },
  REFUNDED: { label: "Đã hoàn tiền", tone: "danger", icon: WalletCards },
};

function formatCurrency(value?: number | string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) return "...";
  return new Intl.NumberFormat("vi-VN").format(value);
}

function roleText(user: User | null) {
  return [user?.role, ...(user?.roles || [])].filter(Boolean).join(" ");
}

function canManageProducts(user: User | null) {
  return /ADMIN|STAFF_PRODUCT/i.test(roleText(user));
}

function canManageOrders(user: User | null) {
  return /ADMIN|STAFF_SALES/i.test(roleText(user));
}

function isAdmin(user: User | null) {
  return /ADMIN/i.test(roleText(user));
}

function isAdminOrStaff(user: User | null) {
  return /ADMIN|STAFF/i.test(roleText(user));
}

function getStoredUser(): User | null {
  try {
    const rawUser = window.localStorage.getItem("user");
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch {
    return null;
  }
}

function getOrderTotal(order: Order) {
  return Number(order.grandTotal ?? order.totalAmount ?? 0);
}

function getOrderDate(order: Order) {
  const rawDate = order.createdAt || order.placedAt;
  const date = rawDate ? new Date(rawDate) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function getOrderCode(order: Order) {
  return order.code || order.orderCode || `#${order.id}`;
}

function getCustomerName(order: Order) {
  return order.shipName || order.customerName || "Khách hàng";
}

function statusLabel(status?: string) {
  return status ? statusMeta[status]?.label || status : "Chưa cập nhật";
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildRevenueSummary(orders: Order[], from: Date): RevenueSummary {
  return orders.reduce(
    (summary, order) => {
      const orderDate = getOrderDate(order);
      if (order.status === "COMPLETED" && orderDate && orderDate >= from) {
        summary.amount += getOrderTotal(order);
        summary.count += 1;
      }
      return summary;
    },
    { amount: 0, count: 0 },
  );
}

function buildRevenueChart(orders: Order[]) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });

  return days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const amount = orders.reduce((total, order) => {
      const orderDate = getOrderDate(order);
      const orderKey = orderDate?.toISOString().slice(0, 10);
      return order.status === "COMPLETED" && orderKey === key ? total + getOrderTotal(order) : total;
    }, 0);

    return {
      label: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      amount,
    };
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<DashboardState>(initialDashboardState);
  const [notice, setNotice] = useState("Đang tải dashboard...");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  const loadDashboard = useCallback(async (storedUser: User) => {
    if (!hasStoredAuth()) return;

    const nextState: DashboardState = { ...initialDashboardState };
    const jobs: Promise<void>[] = [];

    if (canManageProducts(storedUser)) {
      jobs.push(
        authFetch("/api/products?page=0&size=6&sortBy=id&sortDirection=DESC", { headers: { Accept: "application/json" } }, { redirectOnFailure: true })
          .then(async (response) => {
            if (response?.ok) nextState.products = (await response.json()) as Page<Product>;
          })
          .catch(() => undefined),
        fetch("/api/categories", { headers: { Accept: "application/json" } })
          .then(async (response) => {
            if (response.ok) nextState.categoriesCount = ((await response.json()) as unknown[]).length;
          })
          .catch(() => undefined),
        fetch("/api/brands", { headers: { Accept: "application/json" } })
          .then(async (response) => {
            if (response.ok) nextState.brandsCount = ((await response.json()) as unknown[]).length;
          })
          .catch(() => undefined),
      );
    }

    if (canManageOrders(storedUser)) {
      jobs.push(
        authFetch("/api/orders?page=0&size=100&sortBy=id&sortDirection=DESC", { headers: { Accept: "application/json" } }, { redirectOnFailure: true })
          .then(async (response) => {
            if (!response || response.status === 401 || response.status === 403) throw new Error("forbidden");
            if (response.ok) nextState.orders = (await response.json()) as Page<Order>;
          })
          .catch((error) => {
            if (error instanceof Error && error.message === "forbidden") throw error;
          }),
      );
    }

    await Promise.all(jobs);
    setState(nextState);
    setLastUpdated(new Date());
    setNotice("");
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setNow(new Date());

    if (!hasStoredAuth() || !storedUser || !isAdminOrStaff(storedUser)) {
      router.replace(storedUser ? "/profile" : "/login");
      return;
    }

    loadDashboard(storedUser).catch(() => {
      setNotice("Không thể tải một số dữ liệu dashboard. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập lại.");
    });
  }, [loadDashboard, router]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const orderList = state.orders?.content || [];
  const recentProducts = state.products?.content || [];
  const recentOrders = orderList.slice(0, 6);
  const completedOrders = orderList.filter((order) => order.status === "COMPLETED");
  const totalRevenue = completedOrders.reduce((total, order) => total + getOrderTotal(order), 0);
  const chartData = useMemo(() => buildRevenueChart(orderList), [orderList]);
  const maxChartAmount = Math.max(...chartData.map((item) => item.amount), 1);

  const todaySummary = buildRevenueSummary(orderList, startOfDay(new Date()));
  const weekSummary = buildRevenueSummary(orderList, startOfWeek(new Date()));
  const monthSummary = buildRevenueSummary(orderList, startOfMonth(new Date()));

  const statusStats = useMemo(() => {
    const stats = Object.fromEntries(orderStatuses.map((status) => [status, 0])) as Record<string, number>;
    orderList.forEach((order) => {
      if (order.status && stats[order.status] !== undefined) {
        stats[order.status] += 1;
      }
    });
    return stats;
  }, [orderList]);

  const userDisplayName = user?.fullName || user?.username || user?.email || "Quản trị viên";
  const canProducts = canManageProducts(user);
  const canOrders = canManageOrders(user);
  const admin = isAdmin(user);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: true, active: true },
    { href: "/admin/products", label: "Sản phẩm", icon: Boxes, visible: canProducts },
    { href: "/admin/categories", label: "Danh mục", icon: Grid3X3, visible: canProducts },
    { href: "/admin/brands", label: "Thương hiệu", icon: Tags, visible: canProducts },
    { href: "/admin/orders", label: "Đơn hàng", icon: ReceiptText, visible: canOrders },
    { href: "/admin/payments", label: "Thanh toán", icon: CreditCard, visible: canOrders },
    { href: "/admin/shipments", label: "Vận chuyển", icon: Truck, visible: canOrders },
    { href: "/admin/coupons", label: "Mã giảm giá", icon: TicketPercent, visible: canOrders },
    { href: "/admin/inventory", label: "Tồn kho", icon: Database, visible: canProducts },
    { href: "/admin/users", label: "Người dùng", icon: UsersRound, visible: admin },
    { href: "/admin/roles", label: "Phân quyền", icon: ShieldCheck, visible: admin },
    { href: "/admin/audit-logs", label: "Audit log", icon: FileClock, visible: admin },
    { href: "/admin/system-monitor", label: "System", icon: Gauge, visible: admin },
  ].filter((item) => item.visible);

  const quickActions = [
    { href: "/admin/products", label: "Thêm hoặc sửa sản phẩm", icon: PackagePlus, visible: canProducts },
    { href: "/admin/categories", label: "Quản lý danh mục", icon: Grid3X3, visible: canProducts },
    { href: "/admin/brands", label: "Quản lý thương hiệu", icon: Tags, visible: canProducts },
    { href: "/admin/orders", label: "Xử lý đơn hàng", icon: ReceiptText, visible: canOrders },
    { href: "/admin/payments", label: "Đối soát thanh toán", icon: WalletCards, visible: canOrders },
    { href: "/admin/shipments", label: "Cập nhật vận chuyển", icon: Truck, visible: canOrders },
    { href: "/admin/coupons", label: "Cấu hình coupon", icon: TicketPercent, visible: canOrders },
    { href: "/admin/inventory", label: "Đối soát tồn kho", icon: Database, visible: canProducts },
    { href: "/admin/users", label: "Phân quyền người dùng", icon: UserRoundCog, visible: admin },
    { href: "/admin/roles", label: "Role & permission", icon: ShieldCheck, visible: admin },
    { href: "/admin/audit-logs", label: "Xem nhật ký hoạt động", icon: FileClock, visible: admin },
  ].filter((action) => action.visible);

  function logout() {
    clearStoredAuth();
    router.replace("/login");
  }

  return (
    <section className="adminWorkspace">
      <aside className="adminWorkspaceNav" aria-label="Điều hướng quản trị">
        <div className="adminWorkspaceBrand">
          <Sparkles size={20} aria-hidden="true" />
          <span>Fashion Ops</span>
        </div>
        <div className="adminWorkspaceUser">
          <span>{roleText(user) || "STAFF"}</span>
          <strong>{userDisplayName}</strong>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-current={item.active ? "page" : undefined}>
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="adminWorkspaceNavFooter">
          <Link href="/products">
            <Home size={17} aria-hidden="true" />
            Về cửa hàng
          </Link>
          <button type="button" onClick={logout}>
            <LogOut size={17} aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="adminWorkspaceMain">
        <header className="adminWorkspaceHeader">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Tổng quan vận hành</h1>
            <p>Theo dõi sản phẩm, đơn hàng, doanh thu và các điểm cần xử lý trong một màn hình.</p>
          </div>
          <div className="adminHeaderMeta">
            <span>
              <CalendarClock size={16} aria-hidden="true" />
              {now?.toLocaleString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) || "Đang cập nhật"}
            </span>
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              {roleText(user) || "STAFF"}
            </span>
          </div>
        </header>

        {notice ? <p className="adminNoticeModern">{notice}</p> : null}

        <section className="adminKpiGrid" aria-label="Chỉ số tổng quan">
          <div className="adminKpiCard" data-tone="orders">
            <ReceiptText size={22} aria-hidden="true" />
            <span>Tổng đơn hàng</span>
            <strong>{canOrders ? formatNumber(state.orders?.totalElements ?? null) : "N/A"}</strong>
            <small>{statusStats.PENDING} đơn đang chờ xử lý</small>
          </div>
          <div className="adminKpiCard" data-tone="products">
            <Boxes size={22} aria-hidden="true" />
            <span>Sản phẩm</span>
            <strong>{canProducts ? formatNumber(state.products?.totalElements ?? null) : "N/A"}</strong>
            <small>{formatNumber(state.categoriesCount)} danh mục</small>
          </div>
          <div className="adminKpiCard" data-tone="catalog">
            <Tags size={22} aria-hidden="true" />
            <span>Thương hiệu</span>
            <strong>{canProducts ? formatNumber(state.brandsCount) : "N/A"}</strong>
            <small>Dữ liệu catalog đang hoạt động</small>
          </div>
          <div className="adminKpiCard" data-tone="revenue">
            <CircleDollarSign size={22} aria-hidden="true" />
            <span>Tổng doanh thu</span>
            <strong>{canOrders ? formatCurrency(totalRevenue) : "N/A"}</strong>
            <small>Chỉ tính đơn hoàn thành</small>
          </div>
        </section>

        <section className="adminRevenueGrid" aria-label="Doanh thu theo thời gian">
          <div className="adminRevenueCard">
            <span>Hôm nay</span>
            <strong>{canOrders ? formatCurrency(todaySummary.amount) : "N/A"}</strong>
            <small>{todaySummary.count} đơn hoàn thành</small>
          </div>
          <div className="adminRevenueCard">
            <span>Tuần này</span>
            <strong>{canOrders ? formatCurrency(weekSummary.amount) : "N/A"}</strong>
            <small>{weekSummary.count} đơn hoàn thành</small>
          </div>
          <div className="adminRevenueCard">
            <span>Tháng này</span>
            <strong>{canOrders ? formatCurrency(monthSummary.amount) : "N/A"}</strong>
            <small>{monthSummary.count} đơn hoàn thành</small>
          </div>
          <div className="adminRevenueCard adminRefreshCard">
            <span>Cập nhật cuối</span>
            <strong>{lastUpdated ? lastUpdated.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "..."}</strong>
            <button
              className="ghostButton"
              type="button"
              onClick={() => user && loadDashboard(user)}
              disabled={!user}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Làm mới
            </button>
          </div>
        </section>

        <div className="adminDashboardGrid">
          <section className="adminModernPanel adminChartPanel">
            <div className="adminPanelTitle">
              <div>
                <h2>Doanh thu 7 ngày</h2>
                <p>Dựa trên các đơn đã hoàn thành</p>
              </div>
              <BarChart3 size={20} aria-hidden="true" />
            </div>
            <div className="adminBarChart" aria-label="Biểu đồ doanh thu 7 ngày">
              {chartData.map((item) => (
                <div key={item.label} className="adminBarColumn">
                  <span>{formatCurrency(item.amount)}</span>
                  <i style={{ height: `${Math.max((item.amount / maxChartAmount) * 100, item.amount ? 12 : 4)}%` }} />
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="adminModernPanel">
            <div className="adminPanelTitle">
              <div>
                <h2>Thao tác nhanh</h2>
                <p>Đi thẳng vào màn nghiệp vụ theo vai trò</p>
              </div>
              <Activity size={20} aria-hidden="true" />
            </div>
            <div className="adminActionGrid">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Icon size={17} aria-hidden="true" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <section className="adminModernPanel">
          <div className="adminPanelTitle">
            <div>
              <h2>Luồng xử lý đơn hàng</h2>
              <p>Theo dõi trạng thái từ tiếp nhận đến hoàn tất hoặc hoàn tiền</p>
            </div>
            <ReceiptText size={20} aria-hidden="true" />
          </div>
          <div className="adminFlowGrid">
            {orderStatuses.map((status) => {
              const Icon = statusMeta[status].icon;
              return (
                <div key={status} className="adminFlowStep" data-tone={statusMeta[status].tone}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{statusMeta[status].label}</span>
                  <strong>{canOrders ? statusStats[status] : "N/A"}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <div className="adminDashboardGrid">
          <section className="adminModernPanel">
            <div className="adminPanelTitle">
              <div>
                <h2>Sản phẩm mới nhất</h2>
                <p>Kiểm tra nhanh catalog sau khi nhập hàng</p>
              </div>
              <PackageCheck size={20} aria-hidden="true" />
            </div>
            <div className="adminRecordList">
              {recentProducts.length ? (
                recentProducts.map((product) => (
                  <Link key={product.id} href="/admin/products" className="adminRecordRow">
                    <span>{product.name || `#${product.id}`}</span>
                    <strong>{formatCurrency(product.variants?.[0]?.price)}</strong>
                    <em data-tone={product.isActive === false ? "muted" : "success"}>{product.isActive === false ? "Ngưng" : "Hoạt động"}</em>
                  </Link>
                ))
              ) : (
                <p className="adminEmptyText">{canProducts ? "Chưa có dữ liệu sản phẩm." : "Bạn không có quyền xem sản phẩm."}</p>
              )}
            </div>
          </section>

          <section className="adminModernPanel">
            <div className="adminPanelTitle">
              <div>
                <h2>Đơn hàng gần đây</h2>
                <p>Nắm nhanh trạng thái và khách hàng cần chăm sóc</p>
              </div>
              <ReceiptText size={20} aria-hidden="true" />
            </div>
            <div className="adminRecordList">
              {recentOrders.length ? (
                recentOrders.map((order) => (
                  <Link key={order.id} href="/admin/orders" className="adminRecordRow">
                    <span>{getOrderCode(order)}</span>
                    <strong>{getCustomerName(order)}</strong>
                    <em data-tone={order.status === "COMPLETED" ? "success" : order.status === "CANCELLED" || order.status === "REFUNDED" ? "danger" : "warning"}>
                      {statusLabel(order.status)}
                    </em>
                  </Link>
                ))
              ) : (
                <p className="adminEmptyText">{canOrders ? "Chưa có dữ liệu đơn hàng." : "Bạn không có quyền xem đơn hàng."}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
