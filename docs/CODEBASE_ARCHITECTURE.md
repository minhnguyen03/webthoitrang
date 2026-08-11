# 📐 Fashion Shop — Kiến Trúc & Nghiệp Vụ Hệ Thống (Deep Code Analysis)

> **Tài liệu kỹ thuật chi tiết** được tạo từ phân tích toàn bộ codebase (Backend + Frontend).
> Cập nhật: 05/03/2026

---

## 📋 Mục Lục

- [1. Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
- [2. Database Schema & Entity Model](#2-database-schema--entity-model)
- [3. Business Logic Layer (Services)](#3-business-logic-layer-services)
- [4. Security & Authentication Flow](#4-security--authentication-flow)
- [5. Order & Payment Business Flow](#5-order--payment-business-flow)
- [6. AI Chatbot Architecture ⭐](#6-ai-chatbot-architecture-)
- [7. Caching Strategy](#7-caching-strategy)
- [8. Frontend Architecture](#8-frontend-architecture)
- [9. API Endpoints Map](#9-api-endpoints-map)
- [10. Data Flow Diagrams](#10-data-flow-diagrams)

---

## 1. Tổng Quan Kiến Trúc

### 1.1 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 25, Spring Boot 3.x, Spring Security, Spring Data JPA, Spring AI |
| **Database** | MariaDB (MySQL compatible), Flyway migration |
| **Cache** | Redis (Lettuce client), Spring Cache abstraction |
| **AI/ML** | LM Studio (Qwen 3.5 2B), ONNX Embedding (all-MiniLM-L6-v2), SimpleVectorStore |
| **Payment** | VNPay Sandbox (HMAC-SHA512 signature) |
| **Email** | Gmail SMTP (JavaMailSender) |
| **Frontend** | Thymeleaf SSR, Bootstrap 5, JavaScript ES6+, AJAX |
| **Build** | Maven, Lombok, MapStruct |

### 1.2 Package Structure

```
fit.iuh.edu.fashion/
├── config/            # Security, AI, Cache, VNPay, DataInitializer, RateLimit
├── controllers/       # 25 REST + View controllers
├── dto/               # Request/Response DTOs, AI DTOs
│   ├── request/       # LoginRequest, RegisterRequest, OrderRequest, ...
│   └── response/      # AuthResponse, OrderResponse, ProductResponse, ...
├── exception/         # BusinessException, ResourceNotFoundException, GlobalExceptionHandler
├── models/            # 27 JPA Entity classes
├── repositories/      # 27 Spring Data JPA Repositories
├── security/          # JWT filter, CustomUserDetails, JwtTokenProvider
├── services/          # Core business services
│   └── ai/           # 18 AI-specific services (RAG, Intent, Prompt, Memory, ...)
├── util/              # TextUtils (Vietnamese text processing)
└── utils/             # VNPayUtil (HMAC signature)
```

### 1.3 Kiến Trúc Tổng Thể

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Browser    │────▶│  Thymeleaf   │────▶│  REST API (/api) │
│ (Bootstrap5) │     │  Templates   │     │  Controllers     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                          ┌────────────────────────┤
                          ▼                        ▼
                   ┌─────────────┐         ┌─────────────┐
                   │  Services   │         │  Security    │
                   │ (Business)  │         │ (JWT+RBAC)   │
                   └──────┬──────┘         └─────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐
    │  MariaDB   │ │   Redis    │ │ LM Studio  │
    │ (JPA/ORM)  │ │  (Cache)   │ │ (AI Model) │
    └────────────┘ └────────────┘ └────────────┘
```

---

## 2. Database Schema & Entity Model

### 2.1 Entity Relationship Overview

```
User (1) ──── (N) Order ──── (N) OrderItem ──── (1) ProductVariant
  │                  │                                    │
  │                  ├── (N) Payment                      │
  │                  ├── (N) PaymentTransaction            │
  │                  └── (1) Shipment                     │
  │                                                       │
  ├── (1) CustomerProfile (loyalty points, gender)        │
  ├── (1) EmployeeProfile (employee code, position)       │
  ├── (N) Address                                         │
  ├── (N) ProductReview                                   │
  ├── (1) Cart ──── (N) CartItem ──── (1) ProductVariant  │
  └── (N) Role ──── (N) Permission                        │
                                                          │
Product (1) ──── (N) ProductVariant ──── (1) Color        │
    │                    │              └── (1) Size       │
    │                    └── (N) ProductImage              │
    ├── (N) Category (ManyToMany, hierarchical)
    └── (1) Brand

Coupon (standalone, applied via couponCode in Order)
AuditLog (standalone, tracks all actions)
AiFeedback (standalone, stores chatbot feedback)
InventoryMovement (tracks stock changes per variant)
```

### 2.2 Core Entities (27 total)

| Entity | Table | Mô Tả | Key Fields |
|--------|-------|--------|------------|
| **User** | `users` | Người dùng hệ thống | email (unique), passwordHash (BCrypt), fullName, isActive, roles (M2M) |
| **Role** | `roles` | Vai trò RBAC | code (ADMIN, CUSTOMER, STAFF_PRODUCT, STAFF_SALES), permissions (M2M) |
| **Permission** | `permissions` | Quyền hạn chi tiết | code (PRODUCT_CREATE, ORDER_VIEW, USER_MANAGE, ...) |
| **CustomerProfile** | `customer_profiles` | Hồ sơ khách hàng | gender, birthday, loyaltyPoint (int) |
| **EmployeeProfile** | `employee_profiles` | Hồ sơ nhân viên | employeeCode, position, hireDate, manager |
| **Product** | `products` | Sản phẩm | name, slug (unique), description (MEDIUMTEXT), material, origin, isActive |
| **ProductVariant** | `product_variants` | Biến thể SP | sku (unique), color, size, price (BigDecimal 12,2), stock, compareAtPrice |
| **ProductImage** | `product_images` | Ảnh sản phẩm | url, altText, sortOrder, variant (optional) |
| **Category** | `categories` | Danh mục (hierarchical) | name, slug, parent (self-ref), children, isActive |
| **Brand** | `brands` | Thương hiệu | name, slug, logo, description |
| **Color** | `colors` | Màu sắc | name (unique), hex (#RRGGBB) |
| **Size** | `sizes` | Kích thước | name (unique), note |
| **Cart** | `carts` | Giỏ hàng | customer (1:1 User), items |
| **CartItem** | `cart_items` | Mục giỏ hàng | cart, variant, quantity. Unique constraint: (cart_id, variant_id) |
| **Order** | `orders` | Đơn hàng | code (unique, ORD-yyyyMMddHHmmss-XXXX), status, subtotal/discountTotal/shippingFee/taxTotal/grandTotal, ship* fields, couponCode, loyaltyPoints* |
| **OrderItem** | `order_items` | Mục đơn hàng | product, variant, sku, productName (snapshot), colorName, sizeName, quantity, unitPrice, lineTotal |
| **Payment** | `payments` | Bản ghi thanh toán | order, paymentMethod, amount, status, transactionId, bankCode |
| **PaymentTransaction** | `payment_transactions` | Giao dịch VNPay chi tiết | order, transactionId, txnRef, amount, responseCode, bankCode, rawData (JSON) |
| **Coupon** | `coupons` | Mã giảm giá | code (unique), type (PERCENT/FIXED), value, maxDiscount, minOrderAmount, startAt/endAt, usageLimit, usedCount |
| **Shipment** | `shipments` | Vận chuyển | order, carrier, trackingNumber, status (READY→DELIVERED), shippedAt, deliveredAt |
| **InventoryMovement** | `inventory_movements` | Lịch sử tồn kho | variant, quantity (+/-), reason (PURCHASE/SALE/RETURN/ADJUST), relatedOrder |
| **Address** | `addresses` | Sổ địa chỉ | user, label, receiverName, phone, line1/line2, ward/district/city, isDefault |
| **ProductReview** | `product_reviews` | Đánh giá SP | product, user, rating (1-5), title, comment, isApproved. Unique: (product_id, user_id) |
| **AuditLog** | `audit_logs` | Nhật ký hệ thống | userId, username, action, entityType, entityId, oldValue/newValue, ipAddress, status |
| **AiFeedback** | `ai_feedback` | Đánh giá chatbot | messageId, conversationId, userId, rating (POSITIVE/NEGATIVE), comment |
| **RefreshToken** | `refresh_tokens` | JWT Refresh Token | user, token (unique), expiresAt |
| **PasswordResetToken** | `password_reset_tokens` | Token reset mật khẩu | user, token (unique), expiresAt, used (boolean) |

### 2.3 Enumerations

| Enum | Values | Mô Tả |
|------|--------|--------|
| `Order.OrderStatus` | PENDING → CONFIRMED → PACKING → SHIPPING → COMPLETED / CANCELLED / REFUNDED | Vòng đời đơn hàng |
| `Order.PaymentMethod` | COD, VNPAY, MOMO, ZALOPAY | Phương thức thanh toán |
| `Order.PaymentStatus` | UNPAID, PAID, REFUNDED, FAILED | Trạng thái thanh toán trên Order |
| `Payment.PaymentStatus` | PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED | Trạng thái bản ghi Payment |
| `Coupon.CouponType` | PERCENT, FIXED | Loại giảm giá |
| `Shipment.ShipmentStatus` | READY, PICKED, IN_TRANSIT, DELIVERED, LOST, RETURNED, CANCELLED | Trạng thái vận chuyển |
| `InventoryMovement.MovementReason` | PURCHASE, SALE, RETURN, ADJUST | Lý do biến động kho |
| `CustomerProfile.Gender` | MALE, FEMALE, OTHER | Giới tính |
| `AiFeedback.Rating` | POSITIVE, NEGATIVE | Đánh giá chatbot |

---

## 3. Business Logic Layer (Services)

### 3.1 AuthService — Xác Thực & Phân Quyền

**Flow đăng ký:**
1. Validate email/phone unique
2. Hash password (BCrypt)
3. Assign role `CUSTOMER` mặc định
4. Tạo `CustomerProfile` (loyalty = 0)
5. Tạo `Cart` rỗng cho user
6. Generate JWT Access + Refresh Token
7. Audit log: `REGISTER`

**Flow đăng nhập:**
1. Authenticate qua `AuthenticationManager`
2. Generate Access Token (24h) + Refresh Token (7 ngày)
3. Lưu Refresh Token vào DB (1 token/user — xóa cũ trước khi lưu mới)
4. Cập nhật `lastLoginAt`
5. Audit log: `LOGIN`

**Flow refresh token:**
1. Validate JWT signature
2. Kiểm tra token tồn tại trong DB
3. Kiểm tra chưa hết hạn
4. Xóa token cũ → tạo token mới (Rotation)
5. Trả về Access + Refresh Token mới

**Flow quên/reset mật khẩu:**
1. `forgotPassword`: Tạo UUID token → lưu DB (24h expiry) → gửi email HTML
2. `resetPassword`: Validate token → update password → đánh dấu token đã dùng

**Flow đổi mật khẩu:**
1. Verify mật khẩu hiện tại (BCrypt match)
2. Encode mật khẩu mới → update

### 3.2 ProductService — Quản Lý Sản Phẩm

- **CRUD** sản phẩm với Brand, Categories (ManyToMany), Variants, Images
- **Cache** Redis: `products` cache (key: `id_X`, `slug_Y`, `stock_Z_Q`)
- **Auto-deactivate**: Khi stock = 0 → variant.isActive = false → nếu tất cả variant hết → product.isActive = false
- **Soft delete**: `deleteProduct` chỉ set `isActive = false`
- **Search**: Hỗ trợ keyword search, filter theo category/brand
- **Audit log** cho mọi thao tác CREATE/UPDATE/DELETE

### 3.3 CartService — Giỏ Hàng

- **1 Cart per User** (OneToOne relationship)
- **Auto-create** cart nếu chưa có khi truy cập
- **Stock validation** khi thêm/cập nhật (kiểm tra real-time)
- **Dedup**: Nếu variant đã có trong cart → cộng quantity
- **Response** bao gồm: variant info, product image (ưu tiên variant image → product image), stock availability check

### 3.4 OrderService — Quản Lý Đơn Hàng ⭐

**Flow tạo đơn hàng (createOrder):**
1. Lấy user từ DB
2. Tạo Order object (code: `ORD-yyyyMMddHHmmss-XXXX`, random hex suffix chống trùng)
3. **Loop qua items:**
   - Pessimistic lock: `findByIdWithLock()` → tránh race condition
   - Atomic decrease stock: `decreaseStock(variantId, quantity)` → trả 0 nếu thiếu
   - Tạo OrderItem (snapshot productName, colorName, sizeName, unitPrice)
   - `checkAndUpdateStockStatus()` → auto-deactivate nếu hết hàng
4. **Apply coupon:**
   - Validate coupon active + trong thời hạn + min order amount
   - PERCENT: subtotal × value% (cap bởi maxDiscount)
   - FIXED: trừ trực tiếp
   - Tăng usedCount
5. **Apply loyalty points:**
   - 1 điểm = 1,000 VND
   - Không vượt quá (subtotal - discountTotal)
   - Trừ điểm khách hàng
6. **Tính grandTotal** = subtotal - discountTotal - loyaltyPointsDiscount + shippingFee + taxTotal (≥ 0)
7. **Tính loyalty points earned** = grandTotal / 100 (1% giá trị đơn)
8. **Tạo Payment record** cho COD (PENDING)
9. **Tạo InventoryMovement** (SALE, quantity âm)
10. **Clear cart** sau khi đặt hàng thành công
11. **Audit log**: `CREATE Order`

**Flow cập nhật trạng thái (updateOrderStatus):**
- **COMPLETED**: 
  - Cập nhật paymentStatus → PAID (nếu COD)
  - Complete pending Payment records
  - Cộng loyalty points earned cho customer
- **CANCELLED / REFUNDED**:
  - Restore stock (atomic `increaseStock`)
  - Tạo InventoryMovement (RETURN)
  - Hoàn loyalty points đã sử dụng
  - Trừ loyalty points đã cộng (nếu từng COMPLETED)
  - Cập nhật Payment records → REFUNDED/FAILED

**Flow hủy đơn (cancelOrder):**
- Chỉ PENDING hoặc CONFIRMED mới hủy được
- Verify ownership (user chỉ hủy đơn của mình)
- Restore stock + hoàn điểm

**Flow hoàn tiền (processRefund) — Admin only:**
- Chỉ hoàn đơn đã PAID
- Status → REFUNDED
- Restore stock + hoàn điểm đã dùng + trừ điểm đã cộng
- Payment records → REFUNDED

**Flow đổi phương thức thanh toán (updatePaymentMethod):**
- Chỉ cho PENDING/CONFIRMED + chưa PAID
- Cancel old PENDING payments
- Update paymentMethod trên Order

### 3.5 PaymentService — Quản Lý Thanh Toán

- **createPaymentFromTransaction**: Tạo Payment record từ VNPay transaction
- **createCODPayment**: Tạo Payment (PENDING) cho đơn COD
- **Đồng bộ trạng thái**: Payment ↔ Order (COMPLETED↔PAID, FAILED↔FAILED, REFUNDED↔REFUNDED)
- **syncAllPaymentOrderStatus**: Batch sync tất cả payment-order bị lệch
- **Statistics**: count by status, total amount

### 3.6 VNPayService — Tích Hợp Cổng Thanh Toán

**Flow tạo URL thanh toán:**
1. Build params: version, command, tmnCode, amount×100, orderCode, returnUrl
2. Sort params → HMAC-SHA512 signature
3. Return full VNPay redirect URL

**Flow callback (Return URL):**
1. Verify HMAC-SHA512 signature
2. Tìm Order by code
3. Nếu responseCode = "00" → PAID, set transactionId, CONFIRMED status
4. Nếu khác → FAILED

**Flow IPN (Instant Payment Notification):**
1. Verify signature
2. Validate amount (VNPay gửi ×100)
3. Idempotence check (đã PAID thì skip)
4. Cập nhật Order + tạo Payment record
5. Trả về RspCode cho VNPay

### 3.7 CouponService — Mã Giảm Giá

- **Validate**: code active + trong thời hạn + min order amount + usage limit
- **CRUD** với audit log
- **Toggle status**: bật/tắt nhanh
- **Value validation**: PERCENT (0-100), FIXED (> 0)
- **Date validation**: startAt < endAt

### 3.8 AuditService — Nhật Ký Hoạt Động

- **@Async** — ghi log không block main thread
- Capture: userId, username, action, entityType, entityId, oldValue/newValue, IP, User-Agent, requestMethod, requestUrl
- Hỗ trợ: logAction, logFailedAction, logLoginAttempt, logLogout, logUserRegistration, logPasswordChange

### 3.9 SystemMonitorService — Giám Sát Hệ Thống

- **JMX metrics**: RAM (used/total/max), CPU cores/load, Thread count
- **Disk**: total/free/usable space
- **DB stats**: count Users/Orders/Products/AuditLogs/Payments
- **App stats**: today orders, active users (24h)
- **Alert levels**: HEALTHY (<75%), WARNING (75-90%), CRITICAL (>90%)

### 3.10 EmailService — Gửi Email

- **Gmail SMTP** qua JavaMailSender
- **@Async** — không block main thread
- **HTML template** cho email reset password (responsive, gradient design)
- Token link có hiệu lực 24h, dùng 1 lần

---

## 4. Security & Authentication Flow

### 4.1 JWT Token Strategy

| Token | Expiry | Lưu Trữ | Mục Đích |
|-------|--------|---------|----------|
| **Access Token** | 24h (86400000ms) | Client (localStorage/cookie) | Authenticate mỗi request |
| **Refresh Token** | 7 ngày (604800000ms) | DB (`refresh_tokens` table) | Lấy Access Token mới khi hết hạn |

- **Token Rotation**: Mỗi lần refresh, xóa token cũ → tạo token mới
- **Single Session**: 1 user chỉ có 1 refresh token (xóa cũ khi login mới)

### 4.2 RBAC — Role-Based Access Control

**4 Roles mặc định (DataInitializer):**

| Role | Code | Permissions | Mô Tả |
|------|------|-------------|--------|
| **Admin** | ADMIN | ALL (10 permissions) | Toàn quyền hệ thống |
| **Staff Product** | STAFF_PRODUCT | PRODUCT_CREATE/UPDATE/DELETE/VIEW | Quản lý sản phẩm & tồn kho |
| **Staff Sales** | STAFF_SALES | ORDER_VIEW/UPDATE, PRODUCT_VIEW | Xử lý đơn hàng |
| **Customer** | CUSTOMER | (none — implicit) | Mua hàng, xem đơn, giỏ hàng |

**10 Permissions:**
`PRODUCT_CREATE`, `PRODUCT_UPDATE`, `PRODUCT_DELETE`, `PRODUCT_VIEW`, `ORDER_VIEW`, `ORDER_UPDATE`, `ORDER_DELETE`, `COUPON_MANAGE`, `USER_MANAGE`, `ROLE_MANAGE`

### 4.3 Security Filter Chain (SecurityConfig)

```
Request → RateLimitFilter → JwtAuthenticationFilter → SecurityFilterChain → Controller
```

**Public endpoints (no auth):**
- `/api/auth/**`, `/api/ai/**`, `/api/payment/vnpay/callback`, `/api/payment/vnpay/ipn`
- GET: `/api/products/**`, `/api/categories/**`, `/api/brands/**`, `/api/colors/**`, `/api/sizes/**`
- Pages: `/`, `/login`, `/register`, `/forgot-password`, `/products/**`, `/dashboard`, `/ai-chatbot`
- Static: `/css/**`, `/js/**`, `/images/**`, `/image_product/**`

**Customer endpoints** (ROLE_CUSTOMER + ROLE_ADMIN):
- `/api/cart/**`, `/api/orders/my/**`, `POST /api/orders`, `POST /api/orders/*/cancel`

**Staff Product** (ROLE_ADMIN + ROLE_STAFF_PRODUCT):
- POST/PUT/DELETE: products, variants, images, brands, categories, colors, sizes

**Staff Sales** (ROLE_ADMIN + ROLE_STAFF_SALES):
- `/api/orders/**`

**Admin only** (ROLE_ADMIN):
- `/api/admin/**`, `/api/users/**`, `/api/roles/**`

### 4.4 CORS Configuration

Allowed origins: `localhost:*`, `*.ngrok-free.app`, `*.loca.lt`, `*.serveo.net`, `*.trycloudflare.com`

---

## 5. Order & Payment Business Flow

### 5.1 Vòng Đời Đơn Hàng

```
    ┌──────────┐
    │ PENDING  │ ← Customer đặt hàng
    └────┬─────┘
         │ Admin xác nhận
    ┌────▼─────┐
    │CONFIRMED │ ← VNPay callback auto-confirm (nếu PAID)
    └────┬─────┘
         │ Admin đóng gói
    ┌────▼─────┐
    │ PACKING  │
    └────┬─────┘
         │ Admin giao cho shipper
    ┌────▼─────┐
    │ SHIPPING │
    └────┬─────┘
         │ Nhận hàng thành công
    ┌────▼─────┐
    │COMPLETED │ ← Auto: PAID (COD), cộng loyalty points
    └──────────┘

    ┌──────────┐
    │CANCELLED │ ← Customer/Admin hủy (chỉ PENDING/CONFIRMED)
    └──────────┘   → Restore stock, hoàn loyalty points

    ┌──────────┐
    │ REFUNDED │ ← Admin hoàn tiền (chỉ đơn đã PAID)
    └──────────┘   → Restore stock, hoàn/trừ loyalty points, Payment→REFUNDED
```

### 5.2 Thanh Toán VNPay Flow

```
Customer → Chọn VNPay → Server tạo URL → Redirect VNPay
                                              │
                            ┌─────────────────┤
                            ▼                 ▼
                     Return Callback      IPN Callback
                     (browser redirect)   (server-to-server)
                            │                 │
                            ▼                 ▼
                     processCallback()    processIpn()
                            │                 │
                            └────┬────────────┘
                                 ▼
                     Order: PAID + CONFIRMED
                     Payment: COMPLETED
                     PaymentTransaction: saved
```

### 5.3 Loyalty Points System

| Action | Points |
|--------|--------|
| **Earn** | 1% of grandTotal (rounded down) — chỉ khi COMPLETED |
| **Use** | 1 point = 1,000 VND discount — tại checkout |
| **Cancel** | Hoàn lại points đã dùng |
| **Refund** | Hoàn points đã dùng + trừ points đã cộng |

### 5.4 Coupon System

| Type | Cách Tính | Ví Dụ |
|------|----------|-------|
| **PERCENT** | subtotal × value% (capped by maxDiscount) | 10% max 50K: 500K → giảm 50K |
| **FIXED** | Trừ trực tiếp | Giảm 30K: 500K → giảm 30K |

**Conditions**: isActive + startAt ≤ now ≤ endAt + orderAmount ≥ minOrderAmount + usedCount < usageLimit

### 5.5 Inventory Management

- **Pessimistic Lock** khi tạo đơn: `findByIdWithLock()` → `decreaseStock()` atomic
- **Atomic stock operations**: `decreaseStock(id, qty)` trả 0 nếu thiếu → throw InsufficientStockException
- **Auto-restore** khi CANCELLED/REFUNDED: `increaseStock(id, qty)` atomic
- **InventoryMovement** tracking: SALE (-qty) / RETURN (+qty) / PURCHASE / ADJUST
- **Auto-deactivate** variant khi stock = 0 → auto-deactivate product khi tất cả variant hết

---

## 6. AI Chatbot Architecture ⭐

### 6.1 Tổng Quan Kiến Trúc

```
User Message → AiAssistantController → AiAssistantService (Local-first pipeline)
                                              │
                    ┌─────────────────────────┤
                    ▼                         ▼
            UserIntentAnalyzer          ConversationMemoryService
            (15 intent types)           (Redis / In-Memory)
                    │                         │
                    ▼                         ▼
        IntentHandler registry ◄──── UserContextService
                    │                (personalization)
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
ProductRetrievalGateway  Prompt Builder   AiModelService
(RAG wrapper)            (intent-specific) (LM Studio API)
    │                               │
    ▼                               ▼
ProductEmbedding                ChatModel.call()
(VectorStore +                  (blocking / streaming)
 ONNX Embedding)                     │
                                     ▼
                              TextUtils.fixStuckVietnameseWords()
                                     │
                                     ▼
                              AiChatResponse (to client)
```

### 6.2 Intent Classification (UserIntentAnalyzer)

**15 Intent Types** — phân loại bằng keyword matching (rule-based, không dùng ML):

| # | Intent | Keywords (sample) | RAG Source |
|---|--------|-------------------|------------|
| 1 | `PRODUCT_SEARCH` | "sản phẩm", "tìm", "xem" | RagRetrievalService (Hybrid: Vector + SQL) |
| 2 | `PRODUCT_RECOMMENDATION` | "nên mua", "gợi ý" | RagRetrievalService |
| 3 | `PRODUCT_COMPARE` | "so sánh", "khác nhau" | ProductSearchService |
| 4 | `SIZE_GUIDE` | "size", "bảng size", "chọn cỡ" | SizeGuideService (static, no AI call) |
| 5 | `INVENTORY_CHECK` | "còn hàng", "tồn kho", "có size" | InventoryRetrievalService |
| 6 | `ORDER_SUPPORT` | "đơn hàng", "mã đơn", "ORD-" | OrderRetrievalService |
| 7 | `PROMOTION_QUERY` | "giảm giá", "voucher", "sale" | PromotionRetrievalService |
| 8 | `OUTFIT_RECOMMENDATION` | "mặc gì đi", "outfit", "phối đồ đi" | OutfitRetrievalService |
| 9 | `CART_SUPPORT` | "giỏ hàng", "thêm vào giỏ" | CartRetrievalService |
| 10 | `PAYMENT_SUPPORT` | "thanh toán", "VNPay", "COD" | PaymentInfoService (static) |
| 11 | `REVIEW_QUERY` | "đánh giá", "review", "mấy sao" | ReviewRetrievalService |
| 12 | `LOYALTY_QUERY` | "điểm thưởng", "tích điểm" | LoyaltyRetrievalService |
| 13 | `POLICY_QUERY` | "đổi trả", "bảo hành", "chính sách" | PolicyInfoService (static) |
| 14 | `INFORMATION_QUERY` | "phối đồ", "cách mặc", "phong cách" | General |
| 15 | `GENERAL_CHAT` | "chào", "cảm ơn", "hello" | No RAG needed |

**Intent cũng trích xuất:**
- productType, category, brand (từ CatalogCacheService)
- colors, sizes, priceRange (regex extraction)
- gender, style
- orderCode (regex: ORD-xxx)

### 6.3 RAG (Retrieval-Augmented Generation) Pipeline

```
Query → ┬── Semantic Search (VectorStore + ONNX Embedding)
        │   → all-MiniLM-L6-v2 encode query → cosine similarity → top-K docs
        │
        └── Keyword Search (SQL via CatalogCacheService)
            → productRepository.searchProducts(keyword)
        
        → Merge + Deduplicate (ưu tiên semantic) → Format context string
        → Inject vào User Message → Send to LM Studio
```

**ProductEmbeddingService:**
- Index tất cả active products on startup (sau 10s delay cho ONNX init)
- Auto re-index mỗi 30 phút
- Batch processing (200 docs/batch)
- Document metadata: name, brand, categories, material, minPrice, maxPrice, colors, sizes, totalStock, inStock, slug

### 6.4 Conversation Memory

- **Redis** (nếu available) hoặc **In-Memory** (ConcurrentHashMap) fallback
- **Max 30 messages** per conversation, **60 phút** TTL
- **Context budget**: 6 tin nhắn gần nhất, mỗi tin max 300 chars
- **Cleanup**: scheduled mỗi 5 phút, max 1000 conversations
- **Key**: `chat:memory:{conversationId}`

### 6.5 User Personalization (UserContextService)

Từ lịch sử đơn hàng → build context:
- Tên khách hàng, số đơn, tổng chi tiêu
- Top brands, categories, sizes, colors (từ order items)
- Loyalty points, cart size
- Cached 10 phút

### 6.6 Prompt Engineering

Mỗi intent type có **system prompt riêng** (bằng tiếng Anh cho model nhỏ hiểu tốt):
- BASE: "You are a Fashion Shop assistant. Reply in Vietnamese. ALWAYS add spaces between Vietnamese words."
- MODE-specific rules (PRODUCT SEARCH, ORDER SUPPORT, PROMOTION, etc.)
- Response format template (bắt buộc tuân thủ)

### 6.7 AI Model Configuration

| Setting | Value |
|---------|-------|
| Model | `lmstudio-community/qwen3.5-2b` |
| Temperature | 0.35 |
| Max Tokens | 2048 |
| Timeout | 300s (5 phút) |
| SSE Chunk Timeout | 2 phút |
| SSE Total Timeout | 10 phút |
| Heartbeat | 25 giây (keep-alive) |

### 6.8 Vietnamese Text Processing (TextUtils)

Xử lý lỗi AI model nhỏ hay tạo từ dính:
1. **camelCase split**: `"ÁothunPolo"` → `"Áo thun Polo"`
2. **Syllable break with final consonant**: `"khachhang"` → `"khach hang"`
3. **Multi-vowel break**: `"cửahàng"` → `"cửa hàng"`
4. **Diacritic-based break**: `"sơmi"` → `"sơ mi"`, `"chitiết"` → `"chi tiết"`
5. **Protection**: URLs, markdown links, paths, slugs, prices, bold text, code blocks — KHÔNG bị tách

### 6.9 AI Endpoints

| Method | URL | Mô Tả |
|--------|-----|--------|
| POST | `/api/ai/chat` | Chat JSON `{ message, conversationId, stream, pageContext }`, returns `{ messageId, conversationId, intent, answer, sources, products, actions, model, latencyMs }` |
| GET | `/api/ai/chat/stream?message=&conversationId=` | Chat streaming SSE with typed events `meta`, `chunk`, `error`, `done` |
| POST | `/api/ai/chat/product` | Chat với context sản phẩm |
| GET | `/api/ai/search?keyword=&limit=` | Tìm kiếm + tư vấn |
| GET | `/api/ai/brand/{id}?question=&limit=` | Tư vấn theo thương hiệu |
| GET | `/api/ai/category/{id}?question=&limit=` | Tư vấn theo danh mục |
| GET | `/api/ai/health` | Health check AI + RAG |
| GET | `/api/ai/rag/status` | Vector store status |
| DELETE | `/api/ai/conversation/{id}` | Xóa lịch sử chat |
| POST | `/api/ai/feedback` | Gửi feedback (POSITIVE/NEGATIVE) |
| GET | `/api/ai/feedback/stats` | Thống kê feedback (admin) |
| GET | `/api/ai/admin/dashboard` | Admin AI dashboard data: health, RAG status, feedback, latency/error metrics |

---

## 7. Caching Strategy

### 7.1 Redis Cache Configuration

| Cache Name | TTL | Key Pattern | Mô Tả |
|-----------|-----|-------------|--------|
| `products` | 1h (default) | `id_X`, `slug_Y`, `stock_Z_Q` | Product detail, stock check |
| `catalogData` | 5 phút | single key | Full catalog metadata (brands, categories, colors, sizes) |
| `topProducts` | 2 phút | `limit` | Top active products cho AI |
| `productSearch` | default | `keyword_limit` | Search results |
| `productsByBrand` | default | `brandId_limit` | Products by brand |
| `productsByCategory` | default | `categoryId_limit` | Products by category |
| `userContext` | 10 phút | `userId` | User personalization cho AI |
| `chat:memory:*` | 60 phút | `conversationId` | Conversation history (Redis) |

### 7.2 Cache Eviction

- Product CRUD → `@CacheEvict(value = "products", allEntries = true)`
- `StartupCacheCleaner`: Clear all cache on application startup

---

## 8. Frontend Architecture

### 8.1 Thymeleaf Templates (24 pages)

**Customer-facing:**
| Page | URL | Mô Tả |
|------|-----|--------|
| `index.html` | `/` | Trang chủ, sản phẩm nổi bật |
| `products/list-modern.html` | `/products` | Danh sách sản phẩm (filter, search) |
| `products/detail.html` | `/products/{slug}` | Chi tiết sản phẩm (variants, reviews, images) |
| `cart.html` | `/cart` | Giỏ hàng |
| `orders/list.html` | `/orders` | Danh sách đơn hàng |
| `profile.html` | `/profile` | Trang cá nhân |
| `ai-chatbot.html` | `/ai-chatbot` | Trang AI Chatbot full-page |
| `dashboard.html` | `/dashboard` | Dashboard khách hàng |

**Auth:**
| Page | URL |
|------|-----|
| `auth/login.html` | `/login` |
| `auth/register.html` | `/register` |
| `auth/forgot-password.html` | `/forgot-password` |
| `auth/reset-password.html` | `/reset-password` |

**Admin:**
| Page | URL |
|------|-----|
| `admin/products.html` | `/admin/products` |
| `admin/orders.html` | `/admin/orders` |
| `admin/users.html` | `/admin/users` |
| `admin/brands.html` | `/admin/brands` |
| `admin/categories.html` | `/admin/categories` |
| `admin/coupons.html` | `/admin/coupons` |
| `admin/payments.html` | `/admin/payments` |
| `admin/audit-logs.html` | `/admin/audit-logs` |
| `admin/system-monitor.html` | `/admin/system-monitor` |

**Payment:**
| Page | URL |
|------|-----|
| `payment/redirect.html` | VNPay redirect |
| `payment/success.html` | Thanh toán thành công |
| `payment/failed.html` | Thanh toán thất bại |
| `payment/error.html` | Lỗi thanh toán |

**Fragments (reusable):**
- `fragments/navbar.html` — Navigation bar
- `fragments/footer.html` — Footer
- `fragments/chatbot-widget.html` — AI chatbot popup widget

### 8.2 Static Assets

| Type | Path | Files |
|------|------|-------|
| CSS | `/static/css/` | style.css, navbar.css, admin-sidebar.css, ai-chatbot-enhanced.css, chatbot-widget.css, product-search.css |
| JS | `/static/js/` | ai-chatbot-enhanced.js, chatbot widget JS, ... |
| Images | `/static/image_product/` | Product images (UUID naming) |

---

## 9. API Endpoints Map

### 9.1 Auth (`/api/auth`)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| POST | `/api/auth/register` | Public | Đăng ký |
| POST | `/api/auth/login` | Public | Đăng nhập |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Public | Đăng xuất |
| POST | `/api/auth/forgot-password` | Public | Quên mật khẩu |
| POST | `/api/auth/reset-password` | Public | Reset mật khẩu |
| POST | `/api/auth/change-password` | Authenticated | Đổi mật khẩu |

### 9.2 Products (`/api/products`)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| GET | `/api/products` | Public | Danh sách (pageable) |
| GET | `/api/products/{id}` | Public | Chi tiết theo ID |
| GET | `/api/products/slug/{slug}` | Public | Chi tiết theo slug |
| GET | `/api/products/search?keyword=` | Public | Tìm kiếm |
| GET | `/api/products/category/{id}` | Public | Theo danh mục |
| GET | `/api/products/brand/{id}` | Public | Theo thương hiệu |
| POST | `/api/products` | Staff/Admin | Tạo mới |
| PUT | `/api/products/{id}` | Staff/Admin | Cập nhật |
| DELETE | `/api/products/{id}` | Staff/Admin | Xóa (soft) |

### 9.3 Cart (`/api/cart`)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| GET | `/api/cart` | Customer | Xem giỏ hàng |
| POST | `/api/cart/add` | Customer | Thêm sản phẩm |
| PUT | `/api/cart/item/{id}` | Customer | Cập nhật số lượng |
| DELETE | `/api/cart/item/{id}` | Customer | Xóa item |
| DELETE | `/api/cart/clear` | Customer | Xóa toàn bộ |

### 9.4 Orders (`/api/orders`)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| GET | `/api/orders/my` | Customer | Đơn hàng của tôi |
| GET | `/api/orders/{id}` | Staff/Admin | Chi tiết đơn |
| GET | `/api/orders` | Staff/Admin | Tất cả đơn (pageable) |
| POST | `/api/orders` | Customer | Tạo đơn hàng |
| POST | `/api/orders/{id}/cancel` | Customer | Hủy đơn |
| PUT | `/api/orders/{id}/status?status=` | Staff/Admin | Cập nhật trạng thái |
| POST | `/api/orders/{id}/refund` | Admin | Hoàn tiền |
| PUT | `/api/orders/{id}/payment-method` | Customer | Đổi phương thức thanh toán |

### 9.5 Payment (`/api/payment`)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| POST | `/api/payment/vnpay/create` | Customer | Tạo URL thanh toán VNPay |
| GET | `/api/payment/vnpay/callback` | Public | VNPay return callback |
| GET | `/api/payment/vnpay/ipn` | Public | VNPay IPN notification |

### 9.6 Admin (`/api/admin` + others)
| Method | URL | Auth | Mô Tả |
|--------|-----|------|--------|
| GET | `/api/admin/system/health` | Admin | System monitor |
| GET | `/api/admin/audit-logs` | Admin | Nhật ký hoạt động |
| GET/POST/PUT/DELETE | `/api/coupons/**` | Admin | Quản lý mã giảm giá |
| GET/POST/PUT/DELETE | `/api/users/**` | Admin | Quản lý users |
| GET/POST/PUT/DELETE | `/api/brands/**` | Staff/Admin | Quản lý thương hiệu |
| GET/POST/PUT/DELETE | `/api/categories/**` | Staff/Admin | Quản lý danh mục |
| GET/POST/PUT/DELETE | `/api/colors/**` | Staff/Admin | Quản lý màu sắc |
| GET/POST/PUT/DELETE | `/api/sizes/**` | Staff/Admin | Quản lý kích thước |
| GET/POST/PUT/DELETE | `/api/product-variants/**` | Staff/Admin | Quản lý biến thể |
| GET/POST/DELETE | `/api/product-images/**` | Staff/Admin | Quản lý ảnh |

---

## 10. Data Flow Diagrams

### 10.1 Customer Purchase Flow

```
Browse Products → Add to Cart → Checkout
     │                │              │
     ▼                ▼              ▼
  ProductService   CartService    OrderService.createOrder()
  (read, cached)   (validate      ├── Pessimistic lock variants
                    stock)         ├── Decrease stock (atomic)
                                   ├── Apply coupon
                                   ├── Apply loyalty points
                                   ├── Calculate totals
                                   ├── Create Payment (COD)
                                   ├── Create InventoryMovements
                                   ├── Clear cart
                                   └── Audit log
                                          │
                              ┌────────────┤
                              ▼            ▼
                           COD         VNPay
                        (PENDING)    createPaymentUrl()
                              │            │
                              ▼            ▼
                        COMPLETED    VNPay callback
                        (on delivery) (auto-confirm)
```

### 10.2 Admin Order Management Flow

```
View Orders → Select Order → Update Status
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
              CONFIRMED     PACKING     SHIPPING
                                            │
                                   ┌────────┤
                                   ▼        ▼
                             COMPLETED  CANCELLED
                             ├── PAID    ├── Restore stock
                             ├── Cộng    ├── Hoàn điểm
                             │   điểm    └── Payment→FAILED
                             └── Payment
                                 →COMPLETED
```

### 10.3 AI Chatbot Data Flow

```
User → "Tìm áo thun nam dưới 200K"
         │
         ▼
UserIntentAnalyzer.analyzeIntent()
→ IntentType: PRODUCT_SEARCH
→ productType: "áo thun"
→ gender: "nam"
→ priceRange: {max: 200000}
         │
         ▼
resolveIntentContext()
├── RagRetrievalService.hybridSearch()
│   ├── ProductEmbeddingService.semanticSearch("áo thun nam", 8)
│   │   → VectorStore cosine similarity
│   └── ProductSearchService.searchByIntent(intent)
│       → CatalogCacheService → MySQL LIKE search
│       → Filter: price ≤ 200K
│       → Sort by relevance score
│
├── PromptBuilderService.getProductSystemPrompt()
│   → BASE + MODE: PRODUCT SEARCH + RULES + Catalog metadata
│
├── UserContextService.buildUserContext(userId)
│   → "KHACH HANG: Nguyen Van A | 5 don | Brand: LADOS | Size: XL"
│
└── ConversationMemoryService.buildContextString()
    → "K: Tìm áo thun nam\nAI: ..."
         │
         ▼
AiModelService.generate(message, systemPrompt)
→ ChatModel.call(Prompt) → LM Studio API
         │
         ▼
TextUtils.fixStuckVietnameseWords(result)
→ "Áo Thun Thể Thao Training Comfort LADOS"
         │
         ▼
AiChatResponse → Client (JSON or SSE stream)
```

---

## Appendix: Configuration Reference

### application.properties Key Settings

| Property | Default | Mô Tả |
|----------|---------|--------|
| `spring.datasource.url` | `jdbc:mariadb://localhost:3306/fashion_shop` | DB connection |
| `jwt.secret` | (env) | HMAC-SHA256 key |
| `jwt.access-token-expiration` | 86400000 (24h) | Access token TTL |
| `jwt.refresh-token-expiration` | 604800000 (7d) | Refresh token TTL |
| `spring.ai.openai.base-url` | `http://127.0.0.1:1234` | LM Studio URL |
| `spring.ai.openai.chat.options.model` | `lmstudio-community/qwen3.5-2b` | AI model |
| `spring.ai.openai.chat.options.max-tokens` | 4096 | Max output tokens |
| `spring.ai.openai.chat.options.temperature` | 0.7 | Creativity |
| `spring.ai.openai.chat.options.timeout` | 300s | Generation timeout |
| `spring.mvc.async.request-timeout` | 600000 (10m) | SSE streaming timeout |
| `app.chat.memory.max-messages` | 30 | Max messages per conversation |
| `app.chat.memory.ttl-minutes` | 60 | Conversation TTL |
| `spring.data.redis.port` | 6380 | Redis port |
| `spring.cache.redis.time-to-live` | 3600000 (1h) | Default cache TTL |
| `vnpay.tmn-code` | (env) | VNPay merchant code |
| `vnpay.hash-secret` | (env) | VNPay HMAC secret |
| `upload.path` | `src/main/resources/static/image_product` | Image upload dir |
| `spring.servlet.multipart.max-file-size` | 10MB | Max upload size |

---

> 📝 **Ghi chú**: Tài liệu này phản ánh trạng thái codebase tại thời điểm phân tích. Mọi thay đổi về logic nghiệp vụ cần được cập nhật đồng thời vào tài liệu.

