# 🔐 Hướng Dẫn Phân Quyền - Fashion Shop RBAC

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Các Vai Trò](#các-vai-trò)
3. [Ma Trận Phân Quyền](#ma-trận-phân-quyền)
4. [Cấu Hình Database](#cấu-hình-database)
5. [Sử Dụng Hệ Thống](#sử-dụng-hệ-thống)
6. [Testing](#testing)

---

## Tổng Quan

Fashion Shop sử dụng mô hình **RBAC (Role-Based Access Control)** với 4 vai trò chính:

| Role | Code | Description |
|------|------|-------------|
| 👑 **Admin** | `ADMIN` | Quản trị viên - Toàn quyền |
| 📦 **Staff Product** | `STAFF_PRODUCT` | Nhân viên quản lý sản phẩm |
| 🛒 **Staff Sales** | `STAFF_SALES` | Nhân viên quản lý đơn hàng |
| 👤 **Customer** | `CUSTOMER` | Khách hàng mua sắm |

---

## Các Vai Trò

### 👑 ADMIN (Quản Trị Viên)

**Quyền hạn:** FULL ACCESS - Toàn quyền quản lý hệ thống

**Có thể:**
- ✅ Truy cập Dashboard
- ✅ Quản lý Sản phẩm (CRUD)
- ✅ Quản lý Danh mục (CRUD)
- ✅ Quản lý Thương hiệu (CRUD)
- ✅ Quản lý Đơn hàng (CRUD)
- ✅ Quản lý Mã giảm giá (CRUD)
- ✅ Quản lý Người dùng (CRUD)
- ✅ Xem tất cả thống kê
- ✅ Quản lý phân quyền

**Tài khoản mặc định:**
- Email: `admin@fashion.com`
- Password: `admin123`

---

### 📦 STAFF_PRODUCT (Nhân Viên Sản Phẩm)

**Chức năng:** Quản lý toàn bộ về sản phẩm

**Có thể:**
- ✅ Truy cập Dashboard (stats sản phẩm)
- ✅ Quản lý Sản phẩm
  - Thêm/Sửa/Xóa sản phẩm
  - Quản lý biến thể (màu sắc, kích thước, giá)
  - Upload hình ảnh sản phẩm
- ✅ Quản lý Danh mục
  - Thêm/Sửa/Xóa danh mục
- ✅ Quản lý Thương hiệu
  - Thêm/Sửa/Xóa thương hiệu
- ✅ Quản lý Màu sắc và Kích thước
- ✅ Xem thống kê sản phẩm

**Không thể:**
- ❌ Quản lý Đơn hàng
- ❌ Quản lý Mã giảm giá
- ❌ Quản lý Người dùng
- ❌ Xem thống kê doanh thu

**Tài khoản test:**
- Email: `product@fashion.com`
- Password: `password123`

---

### 🛒 STAFF_SALES (Nhân Viên Bán Hàng)

**Chức năng:** Quản lý đơn hàng và chăm sóc khách hàng

**Có thể:**
- ✅ Truy cập Dashboard (stats đơn hàng)
- ✅ Quản lý Đơn hàng
  - Xem tất cả đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Hủy đơn hàng
  - In hóa đơn
- ✅ Quản lý Mã giảm giá
  - Tạo/Sửa/Xóa mã giảm giá
  - Theo dõi sử dụng coupon
- ✅ Xem thống kê doanh thu
- ✅ Xem danh sách sản phẩm (read-only)

**Không thể:**
- ❌ Chỉnh sửa Sản phẩm
- ❌ Quản lý Danh mục
- ❌ Quản lý Thương hiệu
- ❌ Quản lý Người dùng
- ❌ Xem thống kê sản phẩm

**Tài khoản test:**
- Email: `sales@fashion.com`
- Password: `password123`

---

### 👤 CUSTOMER (Khách Hàng)

**Chức năng:** Mua sắm trực tuyến

**Có thể:**
- ✅ Xem và tìm kiếm sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Đặt hàng và thanh toán
- ✅ Xem đơn hàng của mình
- ✅ Đánh giá sản phẩm
- ✅ Cập nhật thông tin cá nhân
- ✅ Sử dụng AI Chatbot

**Không thể:**
- ❌ Truy cập Dashboard Admin
- ❌ Xem đơn hàng của người khác
- ❌ Chỉnh sửa sản phẩm
- ❌ Quản lý hệ thống

---

## Ma Trận Phân Quyền

### Quản Lý Sản Phẩm

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Xem sản phẩm | ✅ | ✅ | 👁️ View | 👁️ View |
| Thêm sản phẩm | ✅ | ✅ | ❌ | ❌ |
| Sửa sản phẩm | ✅ | ✅ | ❌ | ❌ |
| Xóa sản phẩm | ✅ | ✅ | ❌ | ❌ |
| Quản lý biến thể | ✅ | ✅ | ❌ | ❌ |
| Upload hình ảnh | ✅ | ✅ | ❌ | ❌ |

### Quản Lý Danh Mục & Thương Hiệu

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Xem categories | ✅ | ✅ | 👁️ View | 👁️ View |
| CRUD categories | ✅ | ✅ | ❌ | ❌ |
| Xem brands | ✅ | ✅ | 👁️ View | 👁️ View |
| CRUD brands | ✅ | ✅ | ❌ | ❌ |

### Quản Lý Đơn Hàng

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Xem tất cả đơn | ✅ | ❌ | ✅ | ❌ |
| Xem đơn của mình | ✅ | ✅ | ✅ | ✅ |
| Tạo đơn hàng | ✅ | ✅ | ✅ | ✅ |
| Cập nhật trạng thái | ✅ | ❌ | ✅ | ❌ |
| Hủy đơn hàng | ✅ | ❌ | ✅ | 👁️ Own |

### Quản Lý Mã Giảm Giá

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Xem coupons | ✅ | ❌ | ✅ | 👁️ Public |
| Tạo coupon | ✅ | ❌ | ✅ | ❌ |
| Sửa coupon | ✅ | ❌ | ✅ | ❌ |
| Xóa coupon | ✅ | ❌ | ✅ | ❌ |
| Sử dụng coupon | ✅ | ✅ | ✅ | ✅ |

### Quản Lý Người Dùng

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Xem users | ✅ | ❌ | ❌ | ❌ |
| Tạo user | ✅ | ❌ | ❌ | ❌ |
| Sửa user | ✅ | ❌ | ❌ | 👁️ Self |
| Xóa user | ✅ | ❌ | ❌ | ❌ |
| Phân quyền | ✅ | ❌ | ❌ | ❌ |

### Dashboard & Thống Kê

| Chức năng | ADMIN | STAFF_PRODUCT | STAFF_SALES | CUSTOMER |
|-----------|-------|---------------|-------------|----------|
| Access Dashboard | ✅ | ✅ | ✅ | ❌ |
| Stats Sản phẩm | ✅ | ✅ | ❌ | ❌ |
| Stats Đơn hàng | ✅ | ❌ | ✅ | ❌ |
| Stats Doanh thu | ✅ | ❌ | ✅ | ❌ |
| Báo cáo | ✅ | ❌ | ✅ | ❌ |

---

## Cấu Hình Database

### 1. Insert Roles

```sql
-- Insert default roles
INSERT INTO roles (code, name, description, created_at) VALUES
('ADMIN', 'Quản trị viên', 'Toàn quyền quản lý hệ thống', NOW()),
('CUSTOMER', 'Khách hàng', 'Mua sắm và quản lý đơn hàng cá nhân', NOW()),
('STAFF_PRODUCT', 'Nhân viên Sản phẩm', 'Quản lý sản phẩm, danh mục, thương hiệu', NOW()),
('STAFF_SALES', 'Nhân viên Bán hàng', 'Quản lý đơn hàng và mã giảm giá', NOW());
```

### 2. Tạo Test Users

```sql
-- Password hash for "password123"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Admin
INSERT INTO users (email, phone, password_hash, full_name, is_active, created_at, updated_at) 
VALUES ('admin@fashion.com', '0901234567', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin Fashion', true, NOW(), NOW());

-- Staff Product
INSERT INTO users (email, phone, password_hash, full_name, is_active, created_at, updated_at) 
VALUES ('product@fashion.com', '0901234568', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyễn Văn A', true, NOW(), NOW());

-- Staff Sales
INSERT INTO users (email, phone, password_hash, full_name, is_active, created_at, updated_at) 
VALUES ('sales@fashion.com', '0901234569', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Trần Thị B', true, NOW(), NOW());

-- Customer
INSERT INTO users (email, phone, password_hash, full_name, is_active, created_at, updated_at) 
VALUES ('customer@fashion.com', '0901234570', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Khách Hàng Test', true, NOW(), NOW());
```

### 3. Gán Roles

```sql
-- Get user IDs
SELECT id, email FROM users;

-- Assign roles (adjust user_id accordingly)
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),  -- Admin
(2, 3),  -- Staff Product
(3, 4),  -- Staff Sales
(4, 2);  -- Customer
```

---

## Sử Dụng Hệ Thống

### Login

1. Truy cập: `http://localhost:8080/login`
2. Nhập email và password
3. Hệ thống tự động redirect dựa trên role:
   - **ADMIN/STAFF** → `/dashboard`
   - **CUSTOMER** → `/` (trang chủ)

### Dashboard Navigation

Menu sidebar tự động hiển thị theo quyền:

**ADMIN thấy:**
```
☰ Dashboard
─────────────
📦 Quản lý Sản phẩm
📁 Quản lý Danh mục
🏷️ Quản lý Thương hiệu
🛒 Quản lý Đơn hàng
🎫 Quản lý Mã giảm giá
👥 Quản lý Người dùng
```

**STAFF_PRODUCT thấy:**
```
☰ Dashboard
─────────────
📦 Quản lý Sản phẩm
📁 Quản lý Danh mục
🏷️ Quản lý Thương hiệu
```

**STAFF_SALES thấy:**
```
☰ Dashboard
─────────────
🛒 Quản lý Đơn hàng
🎫 Quản lý Mã giảm giá
```

---

## Testing

### Test 1: STAFF_PRODUCT Access

```bash
# Login
POST /api/auth/login
{
  "email": "product@fashion.com",
  "password": "password123"
}

# Should work ✅
GET /api/products
POST /api/products
GET /api/categories
POST /api/categories

# Should fail ❌ (403 Forbidden)
GET /api/orders
POST /api/coupons
GET /api/users
```

### Test 2: STAFF_SALES Access

```bash
# Login
POST /api/auth/login
{
  "email": "sales@fashion.com",
  "password": "password123"
}

# Should work ✅
GET /api/orders
PUT /api/orders/1/status
GET /api/coupons
POST /api/coupons

# Should fail ❌ (403 Forbidden)
POST /api/products
POST /api/categories
GET /api/users
```

### Test 3: Page Access

**STAFF_PRODUCT:**
- ✅ `/admin/products` → OK
- ✅ `/admin/categories` → OK
- ❌ `/admin/orders` → Alert + Redirect
- ❌ `/admin/users` → Alert + Redirect

**STAFF_SALES:**
- ❌ `/admin/products` → Alert + Redirect
- ✅ `/admin/orders` → OK
- ✅ `/admin/coupons` → OK
- ❌ `/admin/users` → Alert + Redirect

---

## Security Notes

### Triple Protection

1. **Backend (Spring Security)**
   ```java
   @PreAuthorize("hasAnyRole('ADMIN', 'STAFF_PRODUCT')")
   ```

2. **Frontend (JavaScript)**
   ```javascript
   checkProductAccess(); // Redirect if no permission
   ```

3. **UI (Menu Visibility)**
   ```javascript
   if (!isAdmin() && !isStaffProduct()) {
       hideMenu('products');
   }
   ```

### Best Practices

✅ **DO:**
- Luôn check quyền ở backend
- Sử dụng JWT tokens
- Log tất cả admin actions
- Đổi password định kỳ

❌ **DON'T:**
- Không dựa 100% vào frontend check
- Không hard-code roles
- Không chia sẻ admin credentials
- Không skip authorization checks

---

**Cần hỗ trợ?** Liên hệ team hoặc mở issue trên GitHub!

