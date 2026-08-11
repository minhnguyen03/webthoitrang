"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Boxes,
  CalendarClock,
  Check,
  CreditCard,
  Database,
  Eye,
  FileClock,
  Gauge,
  Grid3X3,
  Home,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tags,
  TicketPercent,
  Truck,
  Trash2,
  Unlock,
  UsersRound,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authFetch, clearStoredAuth, hasStoredAuth } from "@/lib/auth-fetch";
import { formatMoney } from "@/lib/format";

type User = {
  role?: string;
  roles?: string[];
  fullName?: string;
  username?: string;
  email?: string;
};

type AdminRecord = Record<string, unknown>;
type VariantFormState = {
  sku: string;
  colorId: string;
  sizeId: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  weightGram: string;
  barcode: string;
  isActive: boolean;
};

type FieldType = "text" | "number" | "textarea" | "boolean" | "datetime" | "select" | "roles" | "lookup" | "lookup-multiple" | "permissions";

type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  lookup?: "brands" | "categories" | "permissions";
};

type SectionConfig = {
  title: string;
  description: string;
  endpoint: string;
  writeEndpoint?: string;
  columns: string[];
  detailFields?: string[];
  formFields?: FieldConfig[];
  deleteLabel?: string;
  canDelete?: boolean;
  canEdit?: boolean;
};

type AdminPayloadMeta = {
  rowSource: string;
  totalItems: number;
  totalPages?: number;
  currentPage?: number;
  payloadKeys: string[];
  loadedAt: Date | null;
};

type AdminMetric = {
  label: string;
  value: string;
  helper: string;
  tone?: string;
};

type AdminActionModal =
  | { type: "pending-cod"; title: string; rows: AdminRecord[] }
  | { type: "method-stats"; title: string; stats: Record<string, AdminRecord> };

const roleOptions = [
  { value: "CUSTOMER", label: "Khách hàng" },
  { value: "STAFF_PRODUCT", label: "Nhân viên sản phẩm" },
  { value: "STAFF_SALES", label: "Nhân viên bán hàng" },
  { value: "ADMIN", label: "Quản trị viên" },
];

const HARD_CODED_COLORS: AdminRecord[] = [
  { id: "Vàng", name: "Vàng", hex: "#fbbf24", aliases: [ "vàng"] },
  { id: "Đỏ", name: "Đỏ", hex: "#ef4444", aliases: [ "đỏ"] },
  { id: "Đen", name: "Đen", hex: "#111827", aliases: ["đen"] },
  { id: "Trắng", name: "Trắng", hex: "#f9fafb", aliases: ["trắng"] },
  { id: "Xanh", name: "Xanh", hex: "#3b82f6", aliases: ["xanh"] },
  { id: "Xanh lá", name: "Xanh lá", hex: "#22c55e", aliases: ["xanh lá"] },
  { id: "Hồng", name: "Hồng", hex: "#ec4899", aliases: ["hồng"] },
  { id: "Tím", name: "Tím", hex: "#a855f7", aliases: ["tím"] },
];

const HARD_CODED_SIZES: AdminRecord[] = [
  { id: "s", name: "S", aliases: ["s"] },
  { id: "m", name: "M", aliases: ["m"] },
  { id: "l", name: "L", aliases: ["l"] },
  { id: "xl", name: "XL", aliases: ["xl"] },
];

const sectionConfig: Record<string, SectionConfig> = {
  products: {
    title: "Quản lý sản phẩm",
    description: "Sản phẩm public chỉ hiển thị bản active; admin xem và chỉnh toàn bộ catalog tại Next.",
    endpoint: "/api/products/admin?page=0&size=100",
    writeEndpoint: "/api/products",
    columns: ["id", "name", "brand", "categories", "priceRange", "totalStock", "variantCount", "imageCount", "averageRating", "totalReviews", "isActive", "updatedAt"],
    detailFields: ["id", "name", "slug", "description", "brand", "categories", "material", "origin", "priceRange", "totalStock", "variantCount", "imageCount", "averageRating", "totalReviews", "isActive", "createdAt", "updatedAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Ngừng bán sản phẩm này?",
    formFields: [
      { key: "name", label: "Tên sản phẩm" },
      { key: "slug", label: "Slug" },
      { key: "description", label: "Mô tả", type: "textarea" },
      { key: "brandId", label: "Thương hiệu", type: "lookup", lookup: "brands" },
      { key: "categoryIds", label: "Danh mục", type: "lookup-multiple", lookup: "categories" },
      { key: "material", label: "Chất liệu" },
      { key: "origin", label: "Xuất xứ" },
      { key: "isActive", label: "Đang bán", type: "boolean" },
    ],
  },
  categories: {
    title: "Quản lý danh mục",
    description: "Danh mục dùng cho điều hướng và lọc catalog.",
    endpoint: "/api/categories",
    writeEndpoint: "/api/categories",
    columns: ["id", "name", "slug", "description", "parentName", "childrenCount", "createdAt"],
    detailFields: ["id", "name", "slug", "description", "parentId", "parentName", "childrenCount", "createdAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Xóa danh mục này?",
    formFields: [
      { key: "name", label: "Tên danh mục" },
      { key: "slug", label: "Slug" },
      { key: "parentId", label: "Danh mục cha", type: "lookup", lookup: "categories" },
    ],
  },
  brands: {
    title: "Quản lý thương hiệu",
    description: "Thương hiệu hiển thị trong catalog và bộ lọc.",
    endpoint: "/api/brands",
    writeEndpoint: "/api/brands",
    columns: ["id", "name", "slug", "description", "logo", "createdAt"],
    detailFields: ["id", "name", "slug", "description", "logo", "createdAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Xóa thương hiệu này?",
    formFields: [
      { key: "name", label: "Tên thương hiệu" },
      { key: "slug", label: "Slug" },
    ],
  },
  orders: {
    title: "Quản lý đơn hàng",
    description: "Xử lý trạng thái đơn, thanh toán và hoàn tiền thủ công.",
    endpoint: "/api/orders?page=0&size=100",
    columns: ["id", "orderCode", "customerName", "shipPhone", "shipCity", "itemsCount", "status", "paymentMethod", "paymentStatus", "grandTotal", "couponCode", "loyaltyPointsUsed", "placedAt"],
    detailFields: ["id", "orderCode", "customerName", "shipPhone", "shipLine1", "shipWard", "shipDistrict", "shipCity", "status", "paymentMethod", "paymentStatus", "paymentTransactionId", "paymentTime", "subtotal", "discountTotal", "shippingFee", "taxTotal", "grandTotal", "couponCode", "loyaltyPointsUsed", "loyaltyPointsEarned", "note", "itemsCount", "placedAt"],
  },
  payments: {
    title: "Quản lý thanh toán",
    description: "Theo dõi payment record được ghi nhận từ COD/VNPay.",
    endpoint: "/api/payments?page=0&size=100",
    columns: ["id", "orderCode", "orderStatus", "method", "status", "amount", "transactionId", "bankCode", "responseCode", "createdAt", "completedAt"],
    detailFields: ["id", "orderCode", "orderStatus", "method", "status", "amount", "transactionId", "bankCode", "responseCode", "paymentInfo", "createdAt", "completedAt", "order"],
  },
  shipments: {
    title: "Quản lý vận chuyển",
    description: "Theo dõi carrier, mã tracking và trạng thái giao hàng theo từng đơn.",
    endpoint: "/api/shipments?page=0&size=100",
    writeEndpoint: "/api/shipments",
    columns: ["id", "orderCode", "customerName", "carrier", "trackingNumber", "status", "shippedAt", "deliveredAt", "updatedAt"],
    detailFields: ["id", "orderId", "orderCode", "customerName", "carrier", "trackingNumber", "status", "shippedAt", "deliveredAt", "note", "createdAt", "updatedAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Xóa bản ghi vận chuyển này?",
    formFields: [
      { key: "orderId", label: "Order ID", type: "number" },
      { key: "carrier", label: "Đơn vị vận chuyển" },
      { key: "trackingNumber", label: "Mã tracking" },
      { key: "status", label: "Trạng thái", type: "select", options: ["READY", "PICKED", "IN_TRANSIT", "DELIVERED", "LOST", "RETURNED", "CANCELLED"] },
      { key: "shippedAt", label: "Thời điểm gửi", type: "datetime" },
      { key: "deliveredAt", label: "Thời điểm giao", type: "datetime" },
      { key: "note", label: "Ghi chú", type: "textarea" },
    ],
  },
  inventory: {
    title: "Inventory movement",
    description: "Lịch sử nhập/xuất/điều chỉnh tồn kho theo variant, sản phẩm và đơn hàng.",
    endpoint: "/api/inventory-movements?page=0&size=100&sort=createdAt,desc",
    columns: ["id", "productName", "sku", "colorName", "sizeName", "quantity", "reason", "relatedOrderCode", "note", "createdByName", "createdAt"],
    detailFields: ["id", "variantId", "sku", "productId", "productName", "colorName", "sizeName", "quantity", "reason", "relatedOrderId", "relatedOrderCode", "note", "createdById", "createdByName", "createdAt"],
  },
  coupons: {
    title: "Mã giảm giá",
    description: "Quản lý điều kiện áp dụng, giới hạn lượt dùng và thời hạn coupon.",
    endpoint: "/api/coupons?page=0&size=100",
    writeEndpoint: "/api/coupons",
    columns: ["id", "code", "type", "value", "minOrderAmount", "maxDiscount", "usage", "perUserLimit", "startAt", "endAt", "isActive"],
    detailFields: ["id", "code", "type", "value", "minOrderAmount", "maxDiscount", "usageLimit", "usedCount", "perUserLimit", "startAt", "endAt", "isActive", "createdAt", "updatedAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Xóa mã giảm giá này?",
    formFields: [
      { key: "code", label: "Mã" },
      { key: "type", label: "Loại", type: "select", options: ["FIXED", "PERCENT"] },
      { key: "value", label: "Giá trị", type: "number" },
      { key: "maxDiscount", label: "Giảm tối đa", type: "number" },
      { key: "minOrderAmount", label: "Đơn tối thiểu", type: "number" },
      { key: "usageLimit", label: "Tổng lượt dùng", type: "number" },
      { key: "perUserLimit", label: "Lượt mỗi khách", type: "number" },
      { key: "startAt", label: "Bắt đầu", type: "datetime" },
      { key: "endAt", label: "Kết thúc", type: "datetime" },
      { key: "isActive", label: "Kích hoạt", type: "boolean" },
    ],
  },
  users: {
    title: "Người dùng",
    description: "Danh sách tài khoản và vai trò hệ thống.",
    endpoint: "/api/users?page=0&size=100",
    writeEndpoint: "/api/users",
    columns: ["id", "email", "fullName", "phone", "roles", "isActive", "emailVerifiedAt", "lastLoginAt", "createdAt"],
    detailFields: ["id", "email", "fullName", "phone", "roles", "isActive", "emailVerifiedAt", "lastLoginAt", "createdAt"],
    canEdit: true,
    canDelete: true,
    deleteLabel: "Xóa vĩnh viễn người dùng này? Hành động này không thể hoàn tác.",
    formFields: [
      { key: "email", label: "Email" },
      { key: "password", label: "Mật khẩu mới khi tạo" },
      { key: "fullName", label: "Họ tên" },
      { key: "phone", label: "Số điện thoại" },
      { key: "address", label: "Địa chỉ", type: "textarea" },
      { key: "roles", label: "Vai trò", type: "roles" },
      { key: "isActive", label: "Tài khoản hoạt động", type: "boolean" },
    ],
  },
  roles: {
    title: "Role & permission",
    description: "Quản trị quyền theo role đang được dùng trong security contract.",
    endpoint: "/api/roles",
    writeEndpoint: "/api/roles",
    columns: ["id", "code", "name", "description", "permissionCount", "createdAt"],
    detailFields: ["id", "code", "name", "description", "permissionCount", "permissions", "createdAt"],
    canEdit: true,
    formFields: [
      { key: "name", label: "Tên role" },
      { key: "description", label: "Mô tả", type: "textarea" },
      { key: "permissionCodes", label: "Permissions", type: "permissions", lookup: "permissions" },
    ],
  },
  "audit-logs": {
    title: "Nhật ký hoạt động",
    description: "Theo dõi thay đổi dữ liệu và sự kiện vận hành.",
    endpoint: "/api/audit-logs?page=0&size=100",
    columns: ["id", "username", "action", "entityType", "entityId", "status", "requestMethod", "requestUrl", "ipAddress", "createdAt"],
    detailFields: ["id", "userId", "username", "action", "entityType", "entityId", "status", "requestMethod", "requestUrl", "ipAddress", "userAgent", "oldValue", "newValue", "errorMessage", "createdAt"],
  },
  "system-monitor": {
    title: "System monitor",
    description: "Kiểm tra nhanh tình trạng hệ thống qua API.",
    endpoint: "/api/system/health",
    columns: ["status", "message", "javaVersion", "osName", "uptime", "memoryUsagePercent", "systemCpuLoad", "processCpuLoad", "threadCount", "totalUsers", "totalOrders", "totalProducts", "todayOrders", "activeUsers", "diskUsagePercent"],
    detailFields: ["status", "message", "javaVersion", "osName", "osVersion", "osArch", "uptime", "totalMemory", "freeMemory", "usedMemory", "maxMemory", "memoryUsagePercent", "availableProcessors", "systemCpuLoad", "processCpuLoad", "threadCount", "peakThreadCount", "totalStartedThreadCount", "databaseStats", "totalUsers", "totalOrders", "totalProducts", "todayOrders", "activeUsers", "totalDiskSpace", "freeDiskSpace", "usableDiskSpace", "diskUsagePercent"],
  },
};

const columnLabels: Record<string, string> = {
  id: "ID",
  name: "Tên",
  slug: "Slug",
  description: "Mô tả",
  brand: "Thương hiệu",
  categories: "Danh mục",
  material: "Chất liệu",
  origin: "Xuất xứ",
  basePrice: "Giá",
  priceRange: "Giá bán",
  totalStock: "Tồn kho",
  variantCount: "Phân loại",
  imageCount: "Ảnh",
  averageRating: "Đánh giá",
  totalReviews: "Lượt đánh giá",
  isActive: "Kích hoạt",
  parentId: "Danh mục cha",
  parentName: "Danh mục cha",
  childrenCount: "Danh mục con",
  logo: "Logo",
  orderCode: "Mã đơn",
  customerName: "Khách hàng",
  shipCity: "Tỉnh/TP",
  shipLine1: "Địa chỉ",
  shipWard: "Phường/Xã",
  shipDistrict: "Quận/Huyện",
  note: "Ghi chú",
  itemsCount: "Số dòng",
  status: "Trạng thái",
  paymentMethod: "Thanh toán",
  paymentStatus: "TT thanh toán",
  paymentTransactionId: "Mã GD thanh toán",
  paymentTime: "Thời điểm thanh toán",
  subtotal: "Tạm tính",
  discountTotal: "Giảm giá",
  shippingFee: "Phí vận chuyển",
  taxTotal: "Thuế",
  couponCode: "Coupon",
  loyaltyPointsUsed: "Điểm dùng",
  loyaltyPointsEarned: "Điểm nhận",
  totalAmount: "Tổng tiền",
  grandTotal: "Tổng tiền",
  shipPhone: "SĐT nhận",
  orderStatus: "TT đơn",
  method: "Phương thức",
  amount: "Số tiền",
  transactionId: "Mã GD",
  carrier: "Đơn vị VC",
  trackingNumber: "Tracking",
  shippedAt: "Đã gửi",
  deliveredAt: "Đã giao",
  orderId: "Order ID",
  productName: "Sản phẩm",
  sku: "SKU",
  colorName: "Màu",
  sizeName: "Size",
  quantity: "Số lượng",
  reason: "Lý do",
  relatedOrderId: "Order ID",
  relatedOrderCode: "Mã đơn",
  createdById: "Người tạo ID",
  createdByName: "Người tạo",
  permissionCount: "Số quyền",
  permissions: "Permissions",
  permissionCodes: "Permissions",
  bankCode: "Ngân hàng",
  responseCode: "Mã phản hồi",
  paymentInfo: "Thông tin thanh toán",
  completedAt: "Hoàn tất",
  createdAt: "Ngày tạo",
  updatedAt: "Cập nhật",
  placedAt: "Ngày đặt",
  code: "Mã",
  type: "Loại",
  value: "Giá trị",
  minOrderAmount: "Đơn tối thiểu",
  maxDiscount: "Giảm tối đa",
  startAt: "Bắt đầu",
  endAt: "Kết thúc",
  usage: "Lượt dùng",
  usageLimit: "Giới hạn dùng",
  usedCount: "Đã dùng",
  perUserLimit: "Mỗi khách",
  email: "Email",
  fullName: "Họ tên",
  phone: "SĐT",
  roles: "Vai trò",
  emailVerifiedAt: "Xác thực email",
  lastLoginAt: "Đăng nhập cuối",
  actor: "Người thao tác",
  username: "Người thao tác",
  userId: "User ID",
  action: "Hành động",
  entity: "Đối tượng",
  entityType: "Loại đối tượng",
  entityId: "ID đối tượng",
  requestMethod: "Method",
  requestUrl: "URL",
  ipAddress: "IP",
  userAgent: "User agent",
  oldValue: "Giá trị cũ",
  newValue: "Giá trị mới",
  errorMessage: "Lỗi",
  javaVersion: "Java",
  osName: "OS",
  osVersion: "OS version",
  osArch: "Kiến trúc",
  totalMemory: "RAM tổng",
  freeMemory: "RAM trống",
  usedMemory: "RAM dùng",
  maxMemory: "RAM tối đa",
  memoryUsagePercent: "RAM %",
  availableProcessors: "CPU cores",
  systemCpuLoad: "CPU hệ thống",
  processCpuLoad: "CPU app",
  threadCount: "Threads",
  peakThreadCount: "Peak threads",
  totalStartedThreadCount: "Threads đã tạo",
  databaseStats: "Database stats",
  totalUsers: "Users",
  totalOrders: "Orders",
  totalProducts: "Products",
  todayOrders: "Đơn hôm nay",
  activeUsers: "User hoạt động",
  totalDiskSpace: "Disk tổng",
  freeDiskSpace: "Disk trống",
  usableDiskSpace: "Disk dùng được",
  diskUsagePercent: "Disk %",
  database: "Database",
  uptime: "Uptime",
  timestamp: "Thời điểm",
  message: "Thông báo",
};

const orderStatuses = ["PENDING", "CONFIRMED", "PACKING", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"];

const emptyVariantForm: VariantFormState = {
  sku: "",
  colorId: "",
  sizeId: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  weightGram: "",
  barcode: "",
  isActive: true,
};

function readUser() {
  try {
    const raw = window.localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function isStaff(user: User | null) {
  return [user?.role, ...(user?.roles || [])].filter(Boolean).join(" ").match(/ADMIN|STAFF/i);
}

function roleText(user: User | null) {
  return [user?.role, ...(user?.roles || [])].filter(Boolean).join(" ");
}

function isAdmin(user: User | null) {
  return /ADMIN/i.test(roleText(user));
}

function canManageProducts(user: User | null) {
  return /ADMIN|STAFF_PRODUCT/i.test(roleText(user));
}

function canManageOrders(user: User | null) {
  return /ADMIN|STAFF_SALES/i.test(roleText(user));
}

function userDisplayName(user: User | null) {
  return user?.fullName || user?.username || user?.email || "Nhân sự vận hành";
}

function unwrapApiPayload(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const rowArrayKeys = ["content", "items", "results", "payments", "users", "auditLogs", "logs", "transactions", "recentTransactions", "records"];

function extractRows(payload: unknown): AdminRecord[] {
  const data = unwrapApiPayload(payload);
  if (Array.isArray(data)) return data as AdminRecord[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of rowArrayKeys) {
      if (Array.isArray(record[key])) return record[key] as AdminRecord[];
    }
    return [record];
  }
  return [];
}

function extractPayloadMeta(payload: unknown, rows: AdminRecord[]): AdminPayloadMeta {
  const data = unwrapApiPayload(payload);
  const record = data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
  const rowSource = rowArrayKeys.find((key) => Array.isArray(record[key])) || (Array.isArray(data) ? "array" : "object");
  const totalItems = Number(record.totalElements ?? record.totalItems ?? rows.length);
  const totalPages = Number(record.totalPages ?? 1);
  const currentPage = Number(record.number ?? record.currentPage ?? 0);

  return {
    rowSource,
    totalItems: Number.isFinite(totalItems) ? totalItems : rows.length,
    totalPages: Number.isFinite(totalPages) ? totalPages : undefined,
    currentPage: Number.isFinite(currentPage) ? currentPage : undefined,
    payloadKeys: Object.keys(record),
    loadedAt: new Date(),
  };
}

function formatNumber(value?: number | string | null) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? new Intl.NumberFormat("vi-VN").format(numeric) : "-";
}

function formatBytes(value: unknown) {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: index ? 1 : 0 }).format(bytes / 1024 ** index)} ${units[index]}`;
}

function formatDuration(value: unknown) {
  const milliseconds = Number(value || 0);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "-";
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days) return `${days} ngày ${hours % 24} giờ`;
  if (hours) return `${hours} giờ ${minutes % 60} phút`;
  return `${Math.max(minutes, 1)} phút`;
}

function getValue(row: AdminRecord, key: string) {
  if (key === "orderCode") return row.code || row.orderCode || (row.order as AdminRecord | undefined)?.code;
  if (key === "orderStatus") return row.orderStatus || (row.order as AdminRecord | undefined)?.status;
  if (key === "customerName") {
    const customer = row.customer as AdminRecord | undefined;
    const order = row.order as AdminRecord | undefined;
    const orderCustomer = order?.customer as AdminRecord | undefined;
    return row.customerName || row.shipName || customer?.fullName || customer?.email || orderCustomer?.fullName || orderCustomer?.email;
  }
  if (key === "totalAmount" || key === "grandTotal") return row.grandTotal || row.totalAmount;
  if (key === "itemsCount") return Array.isArray(row.items) ? row.items.length : row.itemsCount;
  if (key === "placedAt") return row.placedAt || row.createdAt;
  if (key === "basePrice") {
    const variants = Array.isArray(row.variants) ? row.variants as AdminRecord[] : [];
    return variants[0]?.price || row.basePrice;
  }
  if (key === "priceRange") {
    const variants = Array.isArray(row.variants) ? row.variants as AdminRecord[] : [];
    const prices = variants.map((variant) => Number(variant.price)).filter((price) => Number.isFinite(price) && price > 0);
    if (!prices.length) return row.basePrice;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? min : `${formatMoney(min)} - ${formatMoney(max)}`;
  }
  if (key === "totalStock") {
    const variants = Array.isArray(row.variants) ? row.variants as AdminRecord[] : [];
    return variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);
  }
  if (key === "variantCount") {
    const variants = Array.isArray(row.variants) ? row.variants as AdminRecord[] : [];
    return variants.length;
  }
  if (key === "imageCount") {
    const images = Array.isArray(row.images) ? row.images as AdminRecord[] : [];
    return images.length;
  }
  if (key === "categories") {
    const categories = Array.isArray(row.categories) ? row.categories as AdminRecord[] : [];
    return categories.map((category) => category.name || category.slug || category.id).filter(Boolean).join(", ");
  }
  if (key === "parentName") return row.parentName || (row.parent as AdminRecord | undefined)?.name;
  if (key === "active") return row.isActive ?? row.active;
  if (key === "usage") return `${row.usedCount ?? 0}/${row.usageLimit ?? "∞"}`;
  if (key === "method") return row.paymentMethod || row.method;
  if (key === "transactionId") return row.transactionId || row.vnpTxnRef || row.gatewayTransactionId;
  if (key === "roles" && Array.isArray(row.roles)) return (row.roles as unknown[]).join(", ");
  if (key === "actor") return row.username || row.actor;
  if (key === "entity") return [row.entityType, row.entityId ? `#${row.entityId}` : ""].filter(Boolean).join(" ");
  return row[key];
}

function formatCell(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "✓" : "-";
  if (key === "uptime") return formatDuration(value);
  if (key.toLowerCase().includes("memory") || key.toLowerCase().includes("diskspace")) return formatBytes(value);
  if (key.toLowerCase().includes("percent") || key.toLowerCase().includes("load")) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(numeric)}%` : String(value);
  }
  if ((key.endsWith("At") || key === "placedAt" || key === "paymentTime" || key === "completedAt") && typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  const countKeys = new Set([
    "totalStock",
    "totalReviews",
    "variantCount",
    "imageCount",
    "itemsCount",
    "usageLimit",
    "usedCount",
    "perUserLimit",
    "loyaltyPointsUsed",
    "loyaltyPointsEarned",
    "threadCount",
    "peakThreadCount",
    "totalStartedThreadCount",
    "totalUsers",
    "totalOrders",
    "totalProducts",
    "todayOrders",
    "activeUsers",
    "stock",
    "availableProcessors",
    "childrenCount",
    "quantity",
    "permissionCount",
  ]);
  if (countKeys.has(key)) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? formatNumber(numeric) : String(value);
  }
  const moneyKeys = new Set(["grandTotal", "subtotal", "discountTotal", "taxTotal", "shippingFee", "amount", "value", "maxDiscount", "minOrderAmount"]);
  if (moneyKeys.has(key) || key.includes("Price") || key.includes("Amount")) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? formatMoney(numeric) : String(value);
  }
  if (Array.isArray(value)) {
    if (!value.length) return "-";
    return value
      .map((item) => (item && typeof item === "object" ? formatCell(key, item) : String(item)))
      .join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return String(record.name || record.fullName || record.email || record.code || record.status || JSON.stringify(record));
  }
  return String(value);
}

function renderAdminCell(key: string, value: unknown) {
  if (typeof value === "boolean") {
    return <span className={`adminBooleanBadge ${value ? "isTrue" : "isFalse"}`}>{value ? "✓" : "-"}</span>;
  }
  if (key === "roles" && Array.isArray(value)) {
    return (
      <span className="adminRoleBadges">
        {value.map((role) => (
          <span className="adminRoleBadge" key={String(role)}>{String(role)}</span>
        ))}
      </span>
    );
  }
  const statusKeys = new Set(["status", "paymentStatus", "orderStatus", "method", "paymentMethod"]);
  if (statusKeys.has(key) && value !== null && value !== undefined && value !== "") {
    const status = formatCell(key, value);
    const statusTone = status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return <span className="adminStatusBadge" data-status={statusTone}>{status}</span>;
  }
  return formatCell(key, value);
}

function formatDetailValue(key: string, value: unknown) {
  const text = formatCell(key, value);
  return text.length > 360 ? `${text.slice(0, 360)}...` : text;
}

function isRecord(value: unknown): value is AdminRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function renderObjectDetail(value: AdminRecord) {
  const entries = Object.entries(value).filter(([entryKey]) => !["password", "passwordHash"].includes(entryKey));
  if (!entries.length) return "-";
  return (
    <div className="adminObjectDetail">
      {entries.slice(0, 8).map(([entryKey, entryValue]) => (
        <div key={entryKey}>
          <span>{columnLabels[entryKey] || entryKey}</span>
          <strong>{formatDetailValue(entryKey, entryValue)}</strong>
        </div>
      ))}
    </div>
  );
}

function renderVariantDetails(value: unknown) {
  const variants = Array.isArray(value) ? value.filter(isRecord) : [];
  if (!variants.length) return "-";
  return (
    <div className="adminVariantDetailList">
      {variants.map((variant, index) => {
        const color = isRecord(variant.color) ? variant.color : null;
        const size = isRecord(variant.size) ? variant.size : null;
        return (
          <article key={String(variant.id || variant.sku || index)}>
            <div>
              <span>SKU</span>
              <strong>{String(variant.sku || "-")}</strong>
            </div>
            <div>
              <span>Màu</span>
              <strong className="adminColorValue">
                {color?.hex ? <i style={{ background: String(color.hex) }} aria-hidden="true" /> : null}
                {String(color?.name || variant.colorId || "-")}
              </strong>
            </div>
            <div>
              <span>Size</span>
              <strong>{String(size?.name || variant.sizeId || "-")}</strong>
            </div>
            <div>
              <span>Giá</span>
              <strong>{formatCell("price", variant.price)}</strong>
            </div>
            <div>
              <span>Tồn</span>
              <strong>{formatCell("stock", variant.stock)}</strong>
            </div>
            <div>
              <span>Kích hoạt</span>
              <strong>{renderAdminCell("isActive", variant.isActive)}</strong>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function renderImageDetails(value: unknown) {
  const images = Array.isArray(value) ? value.filter(isRecord) : [];
  if (!images.length) return "-";
  return (
    <div className="adminImageDetailGrid">
      {images.map((image, index) => (
        <figure key={String(image.id || image.url || index)}>
          <img src={resolveAdminImageUrl(image.url)} alt={String(image.altText || "Ảnh sản phẩm")} />
          <figcaption>
            <strong>Ảnh #{String(image.sortOrder ?? index)}</strong>
            <span>Variant {String(image.variantId || "chung")}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function renderDetailValue(key: string, value: unknown) {
  if (key === "variants") return renderVariantDetails(value);
  if (key === "images") return renderImageDetails(value);
  if (Array.isArray(value)) {
    const records = value.filter(isRecord);
    if (records.length) {
      return (
        <div className="adminObjectStack">
          {records.map((record, index) => (
            <div key={String(record.id || record.code || index)}>{renderObjectDetail(record)}</div>
          ))}
        </div>
      );
    }
  }
  if (isRecord(value)) return renderObjectDetail(value);
  return formatDetailValue(key, value);
}

function detailValueIsWide(key: string, value: unknown) {
  if (["description", "variants", "images", "items", "order", "databaseStats", "oldValue", "newValue", "errorMessage"].includes(key)) return true;
  if (Array.isArray(value) || isRecord(value)) return true;
  return String(formatDetailValue(key, value)).length > 110;
}

function adminCellClassName(key: string) {
  const numberKeys = new Set([
    "id",
    "totalStock",
    "variantCount",
    "imageCount",
    "averageRating",
    "totalReviews",
    "itemsCount",
    "stock",
    "childrenCount",
    "quantity",
    "permissionCount",
  ]);
  const moneyKeys = new Set(["priceRange", "grandTotal", "subtotal", "discountTotal", "taxTotal", "shippingFee", "amount", "value", "maxDiscount", "minOrderAmount"]);
  if (key.endsWith("At") || key === "placedAt" || key === "paymentTime" || key === "completedAt") return "adminCellDate";
  if (numberKeys.has(key)) return "adminCellNumber";
  if (moneyKeys.has(key) || key.includes("Price") || key.includes("Amount")) return "adminCellMoney";
  if (["status", "paymentStatus", "orderStatus", "isActive", "method", "paymentMethod"].includes(key)) return "adminCellStatus";
  if (["name", "description"].includes(key)) return "adminCellWide";
  return undefined;
}

function detailSummaryKeys(record: AdminRecord | null, config: SectionConfig) {
  if (!record) return [];
  const candidates = ["id", "status", "paymentStatus", "isActive", "priceRange", "totalStock", "variantCount", "imageCount", "grandTotal", "updatedAt", "createdAt"];
  return candidates.filter((key) => detailKeys(record, config).includes(key) && getValue(record, key) !== undefined && getValue(record, key) !== null && getValue(record, key) !== "");
}

function detailKeys(record: AdminRecord | null, config: SectionConfig) {
  if (!record) return [];
  const preferred = config.detailFields || config.columns;
  const extras = Object.keys(record).filter((key) => !preferred.includes(key) && !["password", "passwordHash"].includes(key));
  return [...preferred, ...extras].filter((key, index, list) => list.indexOf(key) === index);
}

function recordKey(row: AdminRecord, index: number) {
  return String(row.id || row.code || row.email || row.transactionId || row.username || index);
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function lookupLabel(record: AdminRecord) {
  return String(record.name || record.fullName || record.code || record.slug || record.id || "-");
}

function buildMetrics(section: string, rows: AdminRecord[], meta: AdminPayloadMeta): AdminMetric[] {
  const activeCount = rows.filter((row) => getValue(row, "isActive") === true || getValue(row, "active") === true).length;
  const pendingCount = rows.filter((row) => String(getValue(row, "status") || "").includes("PENDING")).length;
  const completedCount = rows.filter((row) => ["COMPLETED", "SUCCESS"].includes(String(getValue(row, "status") || ""))).length;
  const sourceLabels: Record<string, string> = {
    content: "Phân trang",
    array: "Danh sách",
    object: "Object đơn",
    payments: "Payments",
    users: "Users",
    auditLogs: "Audit logs",
    error: "Lỗi API",
  };
  const apiSourceLabel = sourceLabels[meta.rowSource] || meta.rowSource || "Không rõ";
  const apiSourceHelper = typeof meta.currentPage === "number"
    ? `Trang ${meta.currentPage + 1}/${meta.totalPages || 1} · ${formatNumber(rows.length)} bản ghi`
    : "Tải thành công";

  if (section === "products") {
    const stock = rows.reduce((total, row) => total + Number(getValue(row, "totalStock") || 0), 0);
    const variants = rows.reduce((total, row) => total + Number(getValue(row, "variantCount") || 0), 0);
    return [
      { label: "Bản ghi", value: formatNumber(meta.totalItems), helper: `${rows.length} dòng đang hiển thị`, tone: "primary" },
      { label: "Đang bán", value: formatNumber(activeCount), helper: "Sản phẩm active", tone: "success" },
      { label: "Tồn kho", value: formatNumber(stock), helper: `${formatNumber(variants)} phân loại`, tone: "catalog" },
    ];
  }

  if (section === "orders") {
    const revenue = rows.reduce((total, row) => total + Number(getValue(row, "grandTotal") || 0), 0);
    return [
      { label: "Đơn hàng", value: formatNumber(meta.totalItems), helper: `${rows.length} dòng đang hiển thị`, tone: "primary" },
      { label: "Chờ xử lý", value: formatNumber(pendingCount), helper: "Đơn cần theo dõi", tone: "warning" },
      { label: "Tổng tiền", value: formatMoney(revenue), helper: "Theo dữ liệu đang tải", tone: "success" },
    ];
  }

  if (section === "payments") {
    const amount = rows.reduce((total, row) => total + Number(getValue(row, "amount") || 0), 0);
    return [
      { label: "Thanh toán", value: formatNumber(meta.totalItems), helper: `${rows.length} dòng đang hiển thị`, tone: "primary" },
      { label: "Hoàn tất", value: formatNumber(completedCount), helper: "Trạng thái completed/success", tone: "success" },
      { label: "Tổng tiền", value: formatMoney(amount), helper: "Theo payment records", tone: "catalog" },
    ];
  }

  if (section === "users") {
    const staffCount = rows.filter((row) => String(getValue(row, "roles")).match(/ADMIN|STAFF/)).length;
    return [
      { label: "Người dùng", value: formatNumber(meta.totalItems), helper: `${rows.length} tài khoản đang hiển thị`, tone: "primary" },
      { label: "Active", value: formatNumber(activeCount), helper: "Tài khoản hoạt động", tone: "success" },
      { label: "Staff/Admin", value: formatNumber(staffCount), helper: "Có quyền vận hành", tone: "catalog" },
    ];
  }

  if (section === "system-monitor") {
    const row = rows[0] || {};
    return [
      { label: "Trạng thái", value: formatCell("status", getValue(row, "status")), helper: formatCell("message", getValue(row, "message")), tone: "success" },
      { label: "RAM", value: formatCell("memoryUsagePercent", getValue(row, "memoryUsagePercent")), helper: `${formatCell("usedMemory", getValue(row, "usedMemory"))} đang dùng`, tone: "catalog" },
      { label: "Đơn hôm nay", value: formatCell("todayOrders", getValue(row, "todayOrders")), helper: `${formatCell("activeUsers", getValue(row, "activeUsers"))} user hoạt động`, tone: "primary" },
    ];
  }

  return [
    { label: "Bản ghi", value: formatNumber(meta.totalItems), helper: `${rows.length} dòng đang hiển thị`, tone: "primary" },
    { label: "Nguồn API", value: apiSourceLabel, helper: apiSourceHelper, tone: "catalog" },
    { label: "Cập nhật", value: meta.loadedAt ? meta.loadedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "-", helper: "Thời điểm tải dữ liệu", tone: "success" },
  ];
}

function resolveAdminImageUrl(value: unknown) {
  const url = String(value || "");
  if (!url) return "/placeholder.svg";
  if (/^(https?:|data:|blob:)/i.test(url) || url.startsWith("/backend-assets/")) return url;
  return `/backend-assets/${url.replace(/^\/+/, "")}`;
}

function normalizeFormValue(field: FieldConfig, raw: FormDataEntryValue | null) {
  if (field.type === "boolean") return raw === "on";
  if (field.type === "number") {
    if (raw === null || String(raw).trim() === "") return null;
    return Number(raw);
  }
  if (field.type === "lookup") {
    if (raw === null || String(raw).trim() === "") return null;
    return Number(raw);
  }
  if (field.type === "lookup-multiple") {
    return String(raw || "")
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);
  }
  if (field.type === "permissions") {
    return String(raw || "")
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean);
  }
  if (field.key === "categoryIds") {
    return String(raw || "")
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);
  }
  if (field.key === "roles") {
    return String(raw || "")
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean);
  }
  return String(raw || "").trim();
}

function buildInitialForm(record: AdminRecord | null, fields?: FieldConfig[]) {
  const initial: Record<string, unknown> = {};
  for (const field of fields || []) {
    if (!record) {
      initial[field.key] = field.type === "boolean" ? true : field.type === "lookup-multiple" || field.type === "roles" || field.type === "permissions" ? [] : "";
      continue;
    }
    if (field.key === "brandId") {
      initial[field.key] = (record.brand as AdminRecord | undefined)?.id || "";
    } else if (field.key === "categoryIds") {
      const categories = Array.isArray(record.categories) ? record.categories as AdminRecord[] : [];
      initial[field.key] = categories.map((category) => category.id).filter(Boolean).map(String);
    } else if (field.key === "roles") {
      const roles = Array.isArray(record.roles) ? record.roles : Array.from((record.roles as Set<unknown> | undefined) || []);
      initial[field.key] = roles.map(String);
    } else if (field.key === "permissionCodes") {
      const permissions = Array.isArray(record.permissions) ? record.permissions as AdminRecord[] : [];
      initial[field.key] = permissions.map((permission) => permission.code).filter(Boolean).map(String);
    } else if (field.key === "password") {
      initial[field.key] = "";
    } else {
      initial[field.key] = record[field.key] ?? "";
    }
  }
  return initial;
}

function dedupeVariantOptions(options: AdminRecord[]) {
  const deduped: AdminRecord[] = [];
  const seen = new Set<string>();

  for (const option of options) {
    const label = String(option?.name || option?.code || option?.slug || option?.id || "").trim().toLowerCase();
    const id = String(option?.id || "").trim().toLowerCase();
    const key = label || id;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(option);
  }

  return deduped;
}

export default function AdminSectionPage() {
  const params = useParams<{ section: string }>();
  const router = useRouter();
  const section = params.section;
  const config = useMemo(() => sectionConfig[section] || sectionConfig.products, [section]);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rows, setRows] = useState<AdminRecord[]>([]);
  const [payloadMeta, setPayloadMeta] = useState<AdminPayloadMeta>({
    rowSource: "unknown",
    totalItems: 0,
    payloadKeys: [],
    loadedAt: null,
  });
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [formState, setFormState] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [managedProduct, setManagedProduct] = useState<AdminRecord | null>(null);
  const [managedVariants, setManagedVariants] = useState<AdminRecord[]>([]);
  const [managedImages, setManagedImages] = useState<AdminRecord[]>([]);
  const [brandOptions, setBrandOptions] = useState<AdminRecord[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<AdminRecord[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<AdminRecord[]>([]);
  const [colorOptions, setColorOptions] = useState<AdminRecord[]>(HARD_CODED_COLORS);
  const [sizeOptions, setSizeOptions] = useState<AdminRecord[]>(HARD_CODED_SIZES);
  const [variantEditingId, setVariantEditingId] = useState<number | null>(null);
  const [variantForm, setVariantForm] = useState<VariantFormState>(emptyVariantForm);
  const [uploadVariantId, setUploadVariantId] = useState("");

  function buildVariantSku(productId: unknown, colorId: string, sizeId: string) {
    if (productId == null || !colorId || !sizeId) return "";
    const normalizedProductId = String(productId).trim();
    if (!normalizedProductId) return "";
    const normalizedColor = String(colorId).trim().toLowerCase();
    const normalizedSize = String(sizeId).trim().toLowerCase();
    return `EA26-${normalizedProductId}-${normalizedColor}-${normalizedSize}`;
  }

  function shouldAutoUpdateSku(currentSku: string, productId: unknown) {
    if (!currentSku) return true;
    const normalizedSku = String(currentSku).trim().toUpperCase();
    const prefix = productId ? `EA26-${String(productId).trim().toUpperCase()}` : "EA26-";
    return normalizedSku.startsWith(prefix);
  }

  async function resolveVariantOptionId(kind: "color" | "size", value: string) {
    if (!value) return null;
    const normalizedValue = value.trim().toLowerCase();

    if (/^\d+$/.test(normalizedValue)) return Number(value);

    const allDisplayOptions = kind === "color" ? HARD_CODED_COLORS : HARD_CODED_SIZES;
    const selectedDisplay = allDisplayOptions.find((option) => {
      const optionId = String(option.id || "").trim().toLowerCase();
      const optionName = String(option.name || option.code || option.slug || option.id || "").trim().toLowerCase();
      const aliases = Array.isArray(option.aliases) ? (option.aliases as string[]).map((alias) => alias.trim().toLowerCase()) : [];
      return optionId === normalizedValue || optionName === normalizedValue || aliases.includes(normalizedValue);
    });

    const targetName = kind === "color"
      ? String(selectedDisplay?.name || selectedDisplay?.id || value).trim()
      : String(selectedDisplay?.name || selectedDisplay?.id || value).trim().toUpperCase();

    const endpoint = kind === "color" ? "/api/colors" : "/api/sizes";
    const response = await authFetch(endpoint, {}, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    const existingOptions = extractRows(payload);

    const searchNames = new Set<string>([
      targetName.trim().toLowerCase(),
      ...(Array.isArray(selectedDisplay?.aliases) ? (selectedDisplay!.aliases as string[]).map((alias) => alias.trim().toLowerCase()) : []),
      normalizedValue,
    ]);

    const existingMatch = existingOptions.find((option) => {
      const optionName = String(option.name || option.code || option.slug || option.id || "").trim().toLowerCase();
      return searchNames.has(optionName);
    });
    if (existingMatch) {
      const existingId = Number(existingMatch.id);
      if (Number.isFinite(existingId) && existingId > 0) return existingId;
    }

    const createBody = kind === "color"
      ? { name: targetName, hexCode: String(selectedDisplay?.hex || "#000000"), isActive: true }
      : { name: targetName, description: String(selectedDisplay?.name || targetName), isActive: true };

    const createResponse = await authFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createBody),
    }, { redirectOnFailure: true }).catch(() => null);

    if (!createResponse?.ok) {
      return null;
    }

    const createPayload = await createResponse.json().catch(() => null);
    return Number((createPayload as AdminRecord | null)?.id || 0);
  }

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<AdminActionModal | null>(null);
  const nestedPanelRef = useRef<HTMLElement>(null);

  const loadData = useCallback(async () => {
    if (!hasStoredAuth()) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setMessage("");
    const response = await authFetch(config.endpoint, {}, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);

    if (!response?.ok) {
      setRows([]);
      setSelectedRecord(null);
      setPayloadMeta({ rowSource: "error", totalItems: 0, payloadKeys: [], loadedAt: new Date() });
      setMessage("API quản trị chưa phản hồi thành công cho mục này.");
      setLoading(false);
      return;
    }

    const nextRows = extractRows(payload);
    setRows(nextRows);
    setSelectedRecord(nextRows[0] || null);
    setPayloadMeta(extractPayloadMeta(payload, nextRows));
    setLoading(false);
  }, [config.endpoint, router]);

  const loadLookupOptions = useCallback(async () => {
    const needsBrands = config.formFields?.some((field) => field.lookup === "brands");
    const needsCategories = config.formFields?.some((field) => field.lookup === "categories");
    const needsPermissions = config.formFields?.some((field) => field.lookup === "permissions");
    const jobs: Promise<void>[] = [];

    if (needsBrands) {
      jobs.push(authFetch("/api/brands", {}, { redirectOnFailure: true })
        .then(async (response) => {
          if (response?.ok) setBrandOptions(extractRows(await response.json()));
        })
        .catch(() => undefined));
    }

    if (needsCategories) {
      jobs.push(authFetch("/api/categories", {}, { redirectOnFailure: true })
        .then(async (response) => {
          if (response?.ok) setCategoryOptions(extractRows(await response.json()));
        })
        .catch(() => undefined));
    }

    if (needsPermissions) {
      jobs.push(authFetch("/api/roles/permissions", {}, { redirectOnFailure: true })
        .then(async (response) => {
          if (response?.ok) setPermissionOptions(extractRows(await response.json()));
        })
        .catch(() => undefined));
    }

    await Promise.all(jobs);
  }, [config.formFields]);

  useEffect(() => {
    const storedUser = readUser();
    setUser(storedUser);
    if (!hasStoredAuth() || !isStaff(storedUser)) {
      router.replace(storedUser ? "/profile" : "/login");
      return;
    }

    setReady(true);
    setSelectedRecord(null);
    setEditing(null);
    setDetailModalOpen(false);
    setEditModalOpen(false);
    setFormState(buildInitialForm(null, config.formFields));
    void loadData();
    void loadLookupOptions();
  }, [config.formFields, loadData, loadLookupOptions, router]);

  function startEdit(record: AdminRecord | null) {
    setEditing(record);
    setFormState(buildInitialForm(record, config.formFields));
    if (config.formFields) setEditModalOpen(true);
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config.writeEndpoint || !config.formFields) return;

    const formData = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {};
    for (const field of config.formFields) {
      if (["roles", "lookup-multiple", "permissions"].includes(field.type || "")) {
        body[field.key] = Array.isArray(formState[field.key]) ? formState[field.key] : normalizeFormValue(field, formData.get(field.key));
      } else {
        body[field.key] = normalizeFormValue(field, formData.get(field.key));
      }
    }

    const id = editing?.id;
    if (section === "users") {
      const roles = Array.isArray(body.roles) ? body.roles : [];
      if (!roles.length) {
        setSaving(false);
        setMessage("Vui lòng chọn ít nhất một vai trò cho người dùng.");
        return;
      }
      if (id) {
        delete body.password;
      } else if (!body.password || String(body.password).length < 6) {
        setSaving(false);
        setMessage("Mật khẩu tạo mới phải có ít nhất 6 ký tự.");
        return;
      }
    }
    const response = await authFetch(id ? `${config.writeEndpoint}/${id}` : config.writeEndpoint, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }, { redirectOnFailure: true }).catch(() => null);

    setSaving(false);
    if (!response?.ok) {
      const payload = await response?.json().catch(() => null);
      setMessage((payload as { message?: string } | null)?.message || "Chưa lưu được bản ghi. Vui lòng kiểm tra dữ liệu.");
      return;
    }

    setMessage(id ? "Bản ghi đã được cập nhật." : "Bản ghi đã được tạo.");
    setEditing(null);
    setFormState(buildInitialForm(null, config.formFields));
    setEditModalOpen(false);
    await loadData();
  }

  async function deleteRecord(record: AdminRecord) {
    if (!config.writeEndpoint || !config.canDelete) return;
    if (!window.confirm(config.deleteLabel || "Xóa bản ghi này?")) return;

    const response = await authFetch(`${config.writeEndpoint}/${record.id}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);

    if (!response?.ok) {
      setMessage("Chưa thực hiện được thao tác. Vui lòng kiểm tra quyền hoặc dữ liệu liên quan.");
      return;
    }

    setMessage("Thao tác đã hoàn tất.");
    await loadData();
  }

  async function loadProductOperations(product: AdminRecord) {
    const productId = Number(product.id || 0);
    if (!productId) return;
    setManagedProduct(product);
    const [variantResponse, imageResponse] = await Promise.all([
      authFetch(`/api/product-variants/product/${productId}`, {}, { redirectOnFailure: true }).catch(() => null),
      authFetch(`/api/product-images/product/${productId}`, {}, { redirectOnFailure: true }).catch(() => null),
    ]);
    const variantPayload = await variantResponse?.json().catch(() => null);
    const imagePayload = await imageResponse?.json().catch(() => null);
    setManagedVariants(extractRows(variantPayload));
    setManagedImages(extractRows(imagePayload));
    setColorOptions(HARD_CODED_COLORS);
    setSizeOptions(HARD_CODED_SIZES);
    setVariantEditingId(null);
    setVariantForm(emptyVariantForm);
    window.setTimeout(() => nestedPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function startVariantEdit(variant?: AdminRecord) {
    if (!variant) {
      setVariantEditingId(null);
      setVariantForm(emptyVariantForm);
      return;
    }
    setVariantEditingId(Number(variant.id || 0));
    setVariantForm({
      sku: String(variant.sku || ""),
      colorId: String((variant.color as AdminRecord | undefined)?.id || variant.colorId || ""),
      sizeId: String((variant.size as AdminRecord | undefined)?.id || variant.sizeId || ""),
      price: String(variant.price || ""),
      compareAtPrice: String(variant.compareAtPrice || ""),
      stock: String(variant.stock ?? 0),
      weightGram: String(variant.weightGram || ""),
      barcode: String(variant.barcode || ""),
      isActive: variant.isActive !== false,
    });
  }

  async function saveVariant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!managedProduct?.id) return;
    const colorId = await resolveVariantOptionId("color", variantForm.colorId);
    const sizeId = await resolveVariantOptionId("size", variantForm.sizeId);
    if (variantForm.colorId && !colorId) {
      setMessage("Không thể tạo hoặc chọn màu này. Vui lòng thử lại.");
      return;
    }
    if (variantForm.sizeId && !sizeId) {
      setMessage("Không thể tạo hoặc chọn kích cỡ này. Vui lòng thử lại.");
      return;
    }
    const body = {
      productId: Number(managedProduct.id),
      sku: variantForm.sku.trim().toUpperCase(),
      colorId: colorId ?? null,
      sizeId: sizeId ?? null,
      price: Number(variantForm.price),
      compareAtPrice: variantForm.compareAtPrice ? Number(variantForm.compareAtPrice) : null,
      stock: Number(variantForm.stock || 0),
      weightGram: variantForm.weightGram ? Number(variantForm.weightGram) : null,
      barcode: variantForm.barcode.trim().toUpperCase(),
      isActive: variantForm.isActive,
    };
    const response = await authFetch(variantEditingId ? `/api/product-variants/${variantEditingId}` : "/api/product-variants", {
      method: variantEditingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }, { redirectOnFailure: true }).catch(() => null);
    if (!response?.ok) {
      setMessage("Chưa lưu được phân loại. Kiểm tra SKU, Color ID, Size ID, giá và tồn kho.");
      return;
    }
    setMessage(variantEditingId ? "Phân loại đã được cập nhật." : "Phân loại đã được tạo.");
    await loadProductOperations(managedProduct);
    await loadData();
  }

  async function deleteVariant(variant: AdminRecord) {
    if (!window.confirm("Xóa phân loại sản phẩm này?")) return;
    const response = await authFetch(`/api/product-variants/${variant.id}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);
    if (!response?.ok) {
      setMessage("Chưa xóa được phân loại.");
      return;
    }
    setMessage("Phân loại đã được xóa.");
    if (managedProduct) await loadProductOperations(managedProduct);
    await loadData();
  }

  async function uploadProductImages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!managedProduct?.id) return;
    const formData = new FormData(event.currentTarget);
    const variantId = uploadVariantId ? `?variantId=${uploadVariantId}` : "";
    const response = await authFetch(`/api/product-images/upload/${managedProduct.id}${variantId}`, {
      method: "POST",
      body: formData,
    }, { redirectOnFailure: true }).catch(() => null);
    if (!response?.ok) {
      const payload = await response?.json().catch(() => null);
      const detail = (payload as { message?: string } | null)?.message;
      setMessage(detail ? `Chưa tải được ảnh sản phẩm: ${detail}` : "Chưa tải được ảnh sản phẩm.");
      return;
    }
    setMessage("Ảnh sản phẩm đã được tải lên.");
    event.currentTarget.reset();
    setUploadVariantId("");
    await loadProductOperations(managedProduct);
    await loadData();
  }

  async function deleteProductImage(image: AdminRecord) {
    if (!window.confirm("Xóa ảnh sản phẩm này?")) return;
    const response = await authFetch(`/api/product-images/${image.id}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);
    if (!response?.ok) {
      setMessage("Chưa xóa được ảnh sản phẩm.");
      return;
    }
    setMessage("Ảnh sản phẩm đã được xóa.");
    if (managedProduct) await loadProductOperations(managedProduct);
    await loadData();
  }

  async function toggleUserStatus(record: AdminRecord) {
    const id = Number(record.id || 0);
    if (!id) return;
    const nextActive = getValue(record, "isActive") !== true;
    const action = nextActive ? "mở khóa" : "khóa";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${String(record.email || "")}?`)) return;
    const response = await authFetch(`/api/users/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: nextActive }),
    }, { redirectOnFailure: true }).catch(() => null);
    if (!response?.ok) {
      const payload = await response?.json().catch(() => null);
      setMessage((payload as { message?: string } | null)?.message || `Chưa thể ${action} tài khoản.`);
      return;
    }
    setMessage(nextActive ? "Tài khoản đã được mở khóa." : "Tài khoản đã được khóa.");
    await loadData();
  }

  async function resetUserPassword(record: AdminRecord) {
    const id = Number(record.id || 0);
    if (!id) return;
    if (!window.confirm(`Cấp lại mật khẩu cho ${String(record.email || "người dùng này")}?`)) return;
    const response = await authFetch(`/api/users/${id}/reset-password`, {
      method: "POST",
    }, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa cấp lại được mật khẩu.");
      return;
    }
    setMessage((payload as { message?: string } | null)?.message || "Đã gửi yêu cầu cấp lại mật khẩu.");
  }

  function isCodPendingPayment(record: AdminRecord) {
    return String(getValue(record, "method") || "").toUpperCase() === "COD" && String(getValue(record, "status") || "").toUpperCase() === "PENDING";
  }

  async function confirmCodPayment(record: AdminRecord) {
    const id = Number(record.id || 0);
    if (!id) return;
    if (!window.confirm("Xác nhận đã thu tiền COD từ khách hàng?")) return;
    const note = window.prompt("Ghi chú tùy chọn:") || "";
    const response = await authFetch(`/api/payments/${id}/confirm-cod`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note ? { note } : {}),
    }, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa xác nhận được thanh toán COD.");
      return;
    }
    setMessage((payload as { message?: string } | null)?.message || "Đã xác nhận thanh toán COD.");
    setActionModal(null);
    await loadData();
  }

  async function failCodPayment(record: AdminRecord) {
    const id = Number(record.id || 0);
    if (!id) return;
    const reason = window.prompt("Nhập lý do COD thất bại:");
    if (!reason) return;
    const response = await authFetch(`/api/payments/${id}/fail-cod`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa đánh dấu được COD thất bại.");
      return;
    }
    setMessage((payload as { message?: string } | null)?.message || "Đã đánh dấu COD thất bại.");
    setActionModal(null);
    await loadData();
  }

  async function loadPendingCodPayments() {
    const response = await authFetch("/api/payments/cod/pending", {}, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa tải được danh sách COD chờ xác nhận.");
      return;
    }
    setActionModal({ type: "pending-cod", title: "COD chờ xác nhận", rows: extractRows(payload) });
  }

  async function loadPaymentMethodStats() {
    const response = await authFetch("/api/payments/statistics/by-method", {}, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa tải được thống kê thanh toán.");
      return;
    }
    const stats = isRecord((payload as AdminRecord | null)?.statistics) ? (payload as AdminRecord).statistics as Record<string, AdminRecord> : {};
    setActionModal({ type: "method-stats", title: "Thống kê theo phương thức", stats });
  }

  async function syncPaymentStatuses() {
    if (!window.confirm("Đồng bộ lại trạng thái Payment và Order cho toàn bộ dữ liệu?")) return;
    const response = await authFetch("/api/payments/sync-all", {
      method: "POST",
    }, { redirectOnFailure: true }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage((payload as { message?: string } | null)?.message || "Chưa đồng bộ được trạng thái thanh toán.");
      return;
    }
    setMessage((payload as { message?: string } | null)?.message || "Đã đồng bộ trạng thái Payment và Order.");
    await loadData();
  }

  async function updateOrderStatus(order: AdminRecord, status: string) {
    const response = await authFetch(`/api/orders/${order.id}/status?status=${status}`, {
      method: "PUT",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      setMessage("Trạng thái đơn hàng đã được cập nhật.");
      await loadData();
    } else {
      setMessage("Chưa cập nhật được trạng thái đơn hàng.");
    }
  }

  async function refundOrder(order: AdminRecord) {
    const reason = window.prompt("Ghi nhận hoàn tiền thủ công?");
    if (!reason) return;
    const response = await authFetch(`/api/orders/${order.id}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      setMessage("Đã ghi nhận hoàn tiền thủ công.");
      await loadData();
    } else {
      setMessage("Chưa ghi nhận được hoàn tiền.");
    }
  }

  const canProducts = canManageProducts(user);
  const canOrders = canManageOrders(user);
  const admin = isAdmin(user);
  const navItems = useMemo(
    () =>
      [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: true, active: false },
        { href: "/admin/products", label: "Sản phẩm", icon: Boxes, visible: canProducts, active: section === "products" },
        { href: "/admin/categories", label: "Danh mục", icon: Grid3X3, visible: canProducts, active: section === "categories" },
        { href: "/admin/brands", label: "Thương hiệu", icon: Tags, visible: canProducts, active: section === "brands" },
        { href: "/admin/orders", label: "Đơn hàng", icon: ReceiptText, visible: canOrders, active: section === "orders" },
        { href: "/admin/payments", label: "Thanh toán", icon: CreditCard, visible: canOrders, active: section === "payments" },
        { href: "/admin/shipments", label: "Vận chuyển", icon: Truck, visible: canOrders, active: section === "shipments" },
        { href: "/admin/coupons", label: "Mã giảm giá", icon: TicketPercent, visible: canOrders, active: section === "coupons" },
        { href: "/admin/inventory", label: "Tồn kho", icon: Database, visible: canProducts, active: section === "inventory" },
        { href: "/admin/users", label: "Người dùng", icon: UsersRound, visible: admin, active: section === "users" },
        { href: "/admin/roles", label: "Phân quyền", icon: ShieldCheck, visible: admin, active: section === "roles" },
        { href: "/admin/audit-logs", label: "Audit log", icon: FileClock, visible: admin, active: section === "audit-logs" },
        { href: "/admin/system-monitor", label: "System", icon: Gauge, visible: admin, active: section === "system-monitor" },
      ].filter((item) => item.visible),
    [admin, canOrders, canProducts, section],
  );
  const metrics = useMemo(() => buildMetrics(section, rows, payloadMeta), [payloadMeta, rows, section]);
  const selectedDetailKeys = useMemo(() => detailKeys(selectedRecord, config), [config, selectedRecord]);

  function logout() {
    clearStoredAuth();
    router.replace("/login");
  }

  function lookupOptions(field: FieldConfig) {
    if (field.lookup === "brands") return brandOptions;
    if (field.lookup === "categories") return categoryOptions;
    if (field.lookup === "permissions") return permissionOptions;
    return [];
  }

  if (!ready) return null;

  return (
    <section className="adminWorkspace">
      <aside className="adminWorkspaceNav" aria-label="Điều hướng quản trị">
        <div className="adminWorkspaceBrand">
          <Sparkles size={20} aria-hidden="true" />
          <span>Fashion Ops</span>
        </div>
        <div className="adminWorkspaceUser">
          <span>{roleText(user) || "STAFF"}</span>
          <strong>{userDisplayName(user)}</strong>
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

      <div className="adminWorkspaceMain adminCrudMain">
        <header className="adminWorkspaceHeader">
          <div>
            <p className="eyebrow">Admin Workspace</p>
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
          <div className="adminHeaderMeta">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              {roleText(user) || "STAFF"}
            </span>
            <span>
              <CalendarClock size={16} aria-hidden="true" />
              {payloadMeta.loadedAt ? payloadMeta.loadedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "Chưa tải"}
            </span>
          </div>
        </header>

        <section className="adminCrudMetrics" aria-label="Tóm tắt dữ liệu">
          {metrics.map((metric) => (
            <article className="adminMetricCard" data-tone={metric.tone || "primary"} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.helper}</small>
            </article>
          ))}
        </section>

        <section className="adminModernPanel adminDataPanel">
          <div className="adminToolbar">
            <div>
              <Database size={20} aria-hidden="true" />
              <span>{rows.length} dòng hiển thị · {formatNumber(payloadMeta.totalItems)} tổng</span>
            </div>
            <button className="ghostButton adminActionButton adminActionNeutral" type="button" onClick={() => void loadData()} disabled={loading}>
              {loading ? <LoaderCircle className="spinIcon" size={16} aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}
              Làm mới
            </button>
            {config.formFields && section !== "roles" ? (
              <button className="ghostButton adminActionButton adminActionCreate" type="button" onClick={() => startEdit(null)}>
                <Plus size={16} aria-hidden="true" />
                Tạo mới
              </button>
            ) : null}
            {section === "payments" ? (
              <>
                <button className="ghostButton adminActionButton adminActionWarning" type="button" onClick={() => void loadPendingCodPayments()}>
                  <CreditCard size={16} aria-hidden="true" />
                  COD chờ
                </button>
                <button className="ghostButton adminActionButton adminActionView" type="button" onClick={() => void loadPaymentMethodStats()}>
                  <BarChart3 size={16} aria-hidden="true" />
                  Theo phương thức
                </button>
                {isAdmin(user) ? (
                  <button className="ghostButton adminActionButton adminActionManage" type="button" onClick={() => void syncPaymentStatuses()}>
                    <RefreshCw size={16} aria-hidden="true" />
                    Đồng bộ
                  </button>
                ) : null}
              </>
            ) : null}
          </div>

          {message ? (
            <p className="adminNoticeModern">
              <AlertCircle size={16} aria-hidden="true" />
              {message}
            </p>
          ) : null}

          <div className="adminCrudGrid">
            <div className="adminTableWrap">
              <table className="adminTable adminDenseTable">
                <thead>
                  <tr>
                    {config.columns.map((column) => (
                      <th className={adminCellClassName(column)} key={column}>{columnLabels[column] || column}</th>
                    ))}
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={config.columns.length + 1}>Đang tải dữ liệu...</td>
                    </tr>
                  ) : rows.length ? (
                    rows.map((row, index) => (
                      <tr key={recordKey(row, index)} aria-selected={selectedRecord === row}>
                        {config.columns.map((column) => (
                          <td className={adminCellClassName(column)} key={column}>{renderAdminCell(column, getValue(row, column))}</td>
                        ))}
                        <td>
                          <div className="adminRowActions">
                            <button className="ghostButton adminActionButton adminActionView" type="button" onClick={() => {
                              setSelectedRecord(row);
                              setDetailModalOpen(true);
                            }}>
                              <Eye size={16} aria-hidden="true" />
                              Chi tiết
                            </button>
                            {config.canEdit ? (
                              <button className="ghostButton adminActionButton adminActionEdit" type="button" title="Sửa" onClick={() => startEdit(row)}>
                                <Pencil size={16} aria-hidden="true" />
                                Sửa
                              </button>
                            ) : null}
                            {section === "products" ? (
                              <button className="ghostButton adminActionButton adminActionManage" type="button" onClick={() => void loadProductOperations(row)}>
                                <Database size={16} aria-hidden="true" />
                                Phân loại/ảnh
                              </button>
                            ) : null}
                            {section === "users" ? (
                              <>
                                <button className="ghostButton adminActionButton adminActionWarning" type="button" title="Cấp lại mật khẩu" onClick={() => void resetUserPassword(row)}>
                                  <KeyRound size={16} aria-hidden="true" />
                                  Reset mật khẩu
                                </button>
                                <button className={`ghostButton adminActionButton ${getValue(row, "isActive") === true ? "adminActionWarning" : "adminActionCreate"}`} type="button" onClick={() => void toggleUserStatus(row)}>
                                  {getValue(row, "isActive") === true ? <Lock size={16} aria-hidden="true" /> : <Unlock size={16} aria-hidden="true" />}
                                  {getValue(row, "isActive") === true ? "Khóa" : "Mở khóa"}
                                </button>
                              </>
                            ) : null}
                            {section === "payments" && isCodPendingPayment(row) ? (
                              <>
                                <button className="ghostButton adminActionButton adminActionCreate" type="button" onClick={() => void confirmCodPayment(row)}>
                                  <Check size={16} aria-hidden="true" />
                                  Đã thu COD
                                </button>
                                <button className="ghostButton adminActionButton adminActionDelete" type="button" onClick={() => void failCodPayment(row)}>
                                  <X size={16} aria-hidden="true" />
                                  COD lỗi
                                </button>
                              </>
                            ) : null}
                            {section === "orders" ? (
                              <>
                                <select value={String(row.status || "")} onChange={(event) => void updateOrderStatus(row, event.target.value)} aria-label="Trạng thái đơn">
                                  {orderStatuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                <button className="ghostButton adminActionButton adminActionWarning" type="button" onClick={() => void refundOrder(row)}>
                                  Hoàn tiền
                                </button>
                              </>
                            ) : null}
                            {config.canDelete ? (
                              <button className="ghostButton adminActionButton adminActionDelete" type="button" title="Xóa" onClick={() => void deleteRecord(row)}>
                                <Trash2 size={16} aria-hidden="true" />
                                Xóa
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={config.columns.length + 1}>Chưa có dữ liệu hiển thị.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {section === "products" && managedProduct ? (
            <section className="adminNestedPanel" ref={nestedPanelRef}>
              <div className="sectionHeader">
                <div>
                  <p className="eyebrow">Catalog detail</p>
                  <h2>{String(managedProduct.name || "Sản phẩm")}</h2>
                  <p>Quản lý phân loại màu, kích cỡ, tồn kho và ảnh dùng cho trang chi tiết sản phẩm.</p>
                </div>
                <button className="ghostButton adminActionButton adminActionNeutral" type="button" onClick={() => setManagedProduct(null)}>
                  Đóng
                </button>
              </div>

              <div className="adminSplitGrid">
                <div>
                  <div className="checkoutBlockTitle">
                    <Database size={18} aria-hidden="true" />
                    <span>Phân loại màu và kích cỡ</span>
                  </div>
                  <div className="adminTableWrap">
                    <table className="adminTable">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Màu</th>
                          <th>Kích cỡ</th>
                          <th>Giá</th>
                          <th>Tồn</th>
                          <th>Kích hoạt</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managedVariants.length ? (
                          managedVariants.map((variant) => (
                            <tr key={String(variant.id || variant.sku)}>
                              <td>{String(variant.sku || "-")}</td>
                              <td>{formatCell("color", variant.color)}</td>
                              <td>{formatCell("size", variant.size)}</td>
                              <td>{formatCell("price", variant.price)}</td>
                              <td>{formatCell("stock", variant.stock)}</td>
                              <td>{renderAdminCell("isActive", variant.isActive)}</td>
                              <td>
                                <div className="adminQuickActions">
                                  <button className="ghostButton adminActionButton adminActionEdit" type="button" onClick={() => startVariantEdit(variant)}>
                                    <Pencil size={16} aria-hidden="true" />
                                    Sửa
                                  </button>
                                  <button className="ghostButton adminActionButton adminActionDelete" type="button" onClick={() => void deleteVariant(variant)}>
                                    <Trash2 size={16} aria-hidden="true" />
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>Chưa có phân loại cho sản phẩm này.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <form className="checkoutForm" onSubmit={saveVariant}>
                    <div className="checkoutBlockTitle">
                      <Check size={18} aria-hidden="true" />
                      <span>{variantEditingId ? "Cập nhật phân loại" : "Thêm phân loại"}</span>
                    </div>
                    <div className="checkoutGrid">
                      <label className="checkoutField">
                        <span>SKU</span>
                        <input value={variantForm.sku} onChange={(event) => setVariantForm((current) => ({ ...current, sku: event.target.value }))} required />
                      </label>
                      <label className="checkoutField">
                        <span>Màu</span>
                        <select value={variantForm.colorId} onChange={(event) => {
                          const nextColor = event.target.value;
                          setVariantForm((current) => {
                            const nextSku = buildVariantSku(managedProduct?.id, nextColor, current.sizeId);
                            return {
                              ...current,
                              colorId: nextColor,
                              sku: shouldAutoUpdateSku(current.sku, managedProduct?.id) ? nextSku : current.sku,
                            };
                          });
                        }}>
                          <option value="">Không gán màu</option>
                          {!colorOptions.some((color) => String(color.id) === variantForm.colorId) && variantForm.colorId ? (
                            <option value={variantForm.colorId}>Màu hiện tại</option>
                          ) : null}
                          {colorOptions.map((color) => (
                            <option key={String(color.id)} value={String(color.id)}>
                              {String(color.name || color.code || color.id)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="checkoutField">
                        <span>Kích cỡ</span>
                        <select value={variantForm.sizeId} onChange={(event) => {
                          const nextSize = event.target.value;
                          setVariantForm((current) => {
                            const nextSku = buildVariantSku(managedProduct?.id, current.colorId, nextSize);
                            return {
                              ...current,
                              sizeId: nextSize,
                              sku: shouldAutoUpdateSku(current.sku, managedProduct?.id) ? nextSku : current.sku,
                            };
                          });
                        }}>
                          <option value="">Không gán size</option>
                          {!sizeOptions.some((size) => String(size.id) === variantForm.sizeId) && variantForm.sizeId ? (
                            <option value={variantForm.sizeId}>Kích cỡ hiện tại</option>
                          ) : null}
                          {sizeOptions.map((size) => (
                            <option key={String(size.id)} value={String(size.id)}>
                              {String(size.name || size.code || size.id)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="checkoutField">
                        <span>Giá</span>
                        <input type="number" value={variantForm.price} onChange={(event) => setVariantForm((current) => ({ ...current, price: event.target.value }))} required />
                      </label>
                      <label className="checkoutField">
                        <span>Giá so sánh</span>
                        <input type="number" value={variantForm.compareAtPrice} onChange={(event) => setVariantForm((current) => ({ ...current, compareAtPrice: event.target.value }))} />
                      </label>
                      <label className="checkoutField">
                        <span>Tồn kho</span>
                        <input type="number" value={variantForm.stock} onChange={(event) => setVariantForm((current) => ({ ...current, stock: event.target.value }))} required />
                      </label>
                    </div>
                    <div className="checkoutGrid">
                      <label className="checkoutField">
                        <span>Weight gram</span>
                        <input type="number" value={variantForm.weightGram} onChange={(event) => setVariantForm((current) => ({ ...current, weightGram: event.target.value }))} />
                      </label>
                      <label className="checkoutField">
                        <span>Barcode</span>
                        <input value={variantForm.barcode} onChange={(event) => setVariantForm((current) => ({ ...current, barcode: event.target.value }))} />
                      </label>
                      <label className="checkoutField">
                        <span>Kích hoạt</span>
                        <input type="checkbox" checked={variantForm.isActive} onChange={(event) => setVariantForm((current) => ({ ...current, isActive: event.target.checked }))} />
                      </label>
                    </div>
                    <div className="adminQuickActions">
                      <button className="button" type="submit">
                        <Check size={18} aria-hidden="true" />
                        Lưu phân loại
                      </button>
                      <button className="ghostButton adminActionButton adminActionCreate" type="button" onClick={() => startVariantEdit()}>
                        Tạo mới
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <div className="checkoutBlockTitle">
                    <Database size={18} aria-hidden="true" />
                    <span>Ảnh sản phẩm</span>
                  </div>
                  <div className="adminImageGrid">
                    {managedImages.length ? (
                      managedImages.map((image) => (
                        <figure key={String(image.id || image.url)}>
                          <img src={resolveAdminImageUrl(image.url)} alt={String(image.altText || managedProduct.name || "Ảnh sản phẩm")} />
                          <figcaption>Variant {String(image.variantId || "chung")}</figcaption>
                          <button className="ghostButton adminActionButton adminActionDelete" type="button" onClick={() => void deleteProductImage(image)}>
                            <Trash2 size={16} aria-hidden="true" />
                            Xóa ảnh
                          </button>
                        </figure>
                      ))
                    ) : (
                      <p className="checkoutHint">Sản phẩm chưa có ảnh.</p>
                    )}
                  </div>

                  <form className="checkoutForm" onSubmit={uploadProductImages}>
                    <label className="checkoutField">
                      <span>Gán vào Variant ID</span>
                      <input type="number" value={uploadVariantId} onChange={(event) => setUploadVariantId(event.target.value)} placeholder="Bỏ trống nếu là ảnh chung" />
                    </label>
                    <label className="checkoutField">
                      <span>Chọn ảnh</span>
                      <input name="files" type="file" accept="image/*" multiple required />
                    </label>
                    <button className="button" type="submit">
                      <Plus size={18} aria-hidden="true" />
                      Tải ảnh lên
                    </button>
                  </form>
                </div>
              </div>
            </section>
          ) : null}

          {config.formFields && editModalOpen ? (
            <div className="adminModalOverlay" role="presentation" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setEditModalOpen(false);
            }}>
              <section className="adminModalPanel" role="dialog" aria-modal="true" aria-label={editing ? "Cập nhật bản ghi" : "Tạo bản ghi"}>
                <div className="adminModalHeader">
                  <div>
                    <p className="eyebrow">Admin form</p>
                    <h2>{editing ? "Cập nhật bản ghi" : "Tạo bản ghi"}</h2>
                  </div>
                  <button className="iconButton" type="button" aria-label="Đóng form" onClick={() => setEditModalOpen(false)}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <form className="checkoutForm" onSubmit={(event) => {
                  setSaving(true);
                  void saveRecord(event);
                }}>
                  <div className="checkoutBlockTitle">
                    <Check size={18} aria-hidden="true" />
                    <span>{editing ? "Cập nhật bản ghi" : "Tạo bản ghi"}</span>
                  </div>
                  {config.formFields.map((field) => (
                    <label className="checkoutField" key={field.key}>
                      <span>{field.label}</span>
                      {field.type === "roles" ? (
                        <div className="adminRoleCheckboxGrid">
                          {roleOptions.map((role) => {
                            const selectedRoles = toStringArray(formState[field.key]);
                            return (
                              <label key={role.value}>
                                <input
                                  name={field.key}
                                  type="checkbox"
                                  value={role.value}
                                  checked={selectedRoles.includes(role.value)}
                                  onChange={(event) => setFormState((current) => {
                                    const currentRoles = toStringArray(current[field.key]);
                                    const nextRoles = event.target.checked
                                      ? [...currentRoles, role.value]
                                      : currentRoles.filter((value: string) => value !== role.value);
                                    return { ...current, [field.key]: nextRoles };
                                  })}
                                />
                                <span>{role.label}</span>
                                <small>{role.value}</small>
                              </label>
                            );
                          })}
                        </div>
                      ) : field.type === "permissions" || field.type === "lookup-multiple" ? (
                        <div className="adminRoleCheckboxGrid">
                          {lookupOptions(field).map((option) => {
                            const optionValue = String(field.type === "permissions" ? option.code : option.id);
                            const selectedValues = toStringArray(formState[field.key]);
                            return (
                              <label key={optionValue}>
                                <input
                                  name={field.key}
                                  type="checkbox"
                                  value={optionValue}
                                  checked={selectedValues.includes(optionValue)}
                                  onChange={(event) => setFormState((current) => {
                                    const currentValues = toStringArray(current[field.key]);
                                    const nextValues = event.target.checked
                                      ? [...currentValues, optionValue]
                                      : currentValues.filter((value: string) => value !== optionValue);
                                    return { ...current, [field.key]: nextValues };
                                  })}
                                />
                                <span>{lookupLabel(option)}</span>
                                <small>{String(option.code || option.slug || option.id)}</small>
                              </label>
                            );
                          })}
                        </div>
                      ) : field.type === "lookup" ? (
                        <select name={field.key} value={String(formState[field.key] || "")} onChange={(event) => setFormState((current) => ({ ...current, [field.key]: event.target.value }))}>
                          <option value="">Không chọn</option>
                          {lookupOptions(field).map((option) => (
                            <option key={String(option.id)} value={String(option.id)}>
                              {lookupLabel(option)}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea name={field.key} value={String(formState[field.key] || "")} onChange={(event) => setFormState((current) => ({ ...current, [field.key]: event.target.value }))} rows={3} />
                      ) : field.type === "boolean" ? (
                        <input name={field.key} type="checkbox" checked={Boolean(formState[field.key])} onChange={(event) => setFormState((current) => ({ ...current, [field.key]: event.target.checked }))} />
                      ) : field.type === "select" ? (
                        <select name={field.key} value={String(formState[field.key] || field.options?.[0] || "")} onChange={(event) => setFormState((current) => ({ ...current, [field.key]: event.target.value }))}>
                          {(field.options || []).map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={field.key}
                          type={field.type === "datetime" ? "datetime-local" : field.type === "number" ? "number" : "text"}
                          value={String(formState[field.key] || "")}
                          onChange={(event) => setFormState((current) => ({ ...current, [field.key]: event.target.value }))}
                        />
                      )}
                    </label>
                  ))}
                  <div className="adminQuickActions">
                    <button className="button" type="submit" disabled={saving}>
                      {saving ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
                      {saving ? "Đang lưu" : "Lưu"}
                    </button>
                    <button className="ghostButton" type="button" onClick={() => setEditModalOpen(false)}>
                      Hủy
                    </button>
                  </div>
                </form>
              </section>
            </div>
          ) : null}

          {detailModalOpen ? (
            <div className="adminModalOverlay" role="presentation" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDetailModalOpen(false);
            }}>
              <aside className="adminDetailInspector adminModalPanel" role="dialog" aria-modal="true" aria-label="Chi tiết bản ghi">
                <div className="adminModalHeader">
                  <div>
                    <p className="eyebrow">Record detail</p>
                    <h2>{selectedRecord ? String(getValue(selectedRecord, "name") || getValue(selectedRecord, "orderCode") || getValue(selectedRecord, "email") || "Chi tiết bản ghi") : "Chi tiết bản ghi"}</h2>
                    <p>{selectedRecord ? `${selectedDetailKeys.length} trường dữ liệu` : "Chọn một dòng để xem dữ liệu."}</p>
                  </div>
                  <button className="iconButton" type="button" aria-label="Đóng chi tiết" onClick={() => setDetailModalOpen(false)}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                {selectedRecord ? (
                  <>
                    <div className="adminDetailSummary">
                      {detailSummaryKeys(selectedRecord, config).map((key) => (
                        <div key={key}>
                          <span>{columnLabels[key] || key}</span>
                          <strong>{renderAdminCell(key, getValue(selectedRecord, key))}</strong>
                        </div>
                      ))}
                    </div>
                    <dl className="adminDetailList">
                      {selectedDetailKeys.map((key) => (
                        <div className={detailValueIsWide(key, getValue(selectedRecord, key)) ? "isWide" : undefined} key={key}>
                          <dt>{columnLabels[key] || key}</dt>
                          <dd>{renderDetailValue(key, getValue(selectedRecord, key))}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <p className="adminEmptyText">Chưa có bản ghi được chọn.</p>
                )}
              </aside>
            </div>
          ) : null}

          {actionModal ? (
            <div className="adminModalOverlay" role="presentation" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActionModal(null);
            }}>
              <section className="adminModalPanel adminOperationModal" role="dialog" aria-modal="true" aria-label={actionModal.title}>
                <div className="adminModalHeader">
                  <div>
                    <p className="eyebrow">Admin operation</p>
                    <h2>{actionModal.title}</h2>
                    <p>{actionModal.type === "pending-cod" ? `${actionModal.rows.length} thanh toán cần xử lý` : "Số liệu lấy trực tiếp từ API thanh toán"}</p>
                  </div>
                  <button className="iconButton" type="button" aria-label="Đóng" onClick={() => setActionModal(null)}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                {actionModal.type === "pending-cod" ? (
                  actionModal.rows.length ? (
                    <div className="adminTableWrap">
                      <table className="adminTable">
                        <thead>
                          <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Số tiền</th>
                            <th>Thời gian</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionModal.rows.map((payment, index) => {
                            const order = isRecord(payment.order) ? payment.order : {};
                            const customer = isRecord(order.customer) ? order.customer : {};
                            return (
                              <tr key={String(payment.id || index)}>
                                <td><strong>{String(order.code || payment.orderCode || "-")}</strong></td>
                                <td>
                                  <strong>{String(customer.fullName || customer.email || "-")}</strong>
                                  <small className="adminCellSubtle">{String(customer.phone || "")}</small>
                                </td>
                                <td>{formatCell("amount", payment.amount)}</td>
                                <td>{formatCell("createdAt", payment.createdAt)}</td>
                                <td>
                                  <div className="adminQuickActions">
                                    <button className="ghostButton adminActionButton adminActionCreate" type="button" onClick={() => void confirmCodPayment(payment)}>
                                      <Check size={16} aria-hidden="true" />
                                      Xác nhận
                                    </button>
                                    <button className="ghostButton adminActionButton adminActionView" type="button" onClick={() => {
                                      setSelectedRecord(payment);
                                      setDetailModalOpen(true);
                                    }}>
                                      <Eye size={16} aria-hidden="true" />
                                      Chi tiết
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="adminEmptyText">Không có thanh toán COD nào đang chờ xác nhận.</p>
                  )
                ) : (
                  <div className="adminMethodStatsGrid">
                    {Object.entries(actionModal.stats).map(([method, stats]) => (
                      <article key={method}>
                        <h3>{method}</h3>
                        <dl>
                          <div><dt>Tổng giao dịch</dt><dd>{formatNumber(Number(stats.count || 0))}</dd></div>
                          <div><dt>Thành công</dt><dd>{formatNumber(Number(stats.completed || 0))}</dd></div>
                          <div><dt>Đang chờ</dt><dd>{formatNumber(Number(stats.pending || 0))}</dd></div>
                          <div><dt>Thất bại</dt><dd>{formatNumber(Number(stats.failed || 0))}</dd></div>
                          <div><dt>Doanh thu</dt><dd>{formatMoney(Number(stats.totalAmount || 0))}</dd></div>
                        </dl>
                      </article>
                    ))}
                    {!Object.keys(actionModal.stats).length ? <p className="adminEmptyText">Chưa có dữ liệu thống kê.</p> : null}
                  </div>
                )}
              </section>
            </div>
          ) : null}

          <div className="adminQuickActions">
            <Link href="/dashboard">
              <LayoutDashboard size={16} aria-hidden="true" />
              Về dashboard
            </Link>
            <Link href="/products">
              <ArrowLeft size={16} aria-hidden="true" />
              Về cửa hàng
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
