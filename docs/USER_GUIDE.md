# 📖 Hướng Dẫn Sử Dụng Hệ Thống - Fashion Shop

## 📋 Mục Lục

1. [Đăng Ký & Đăng Nhập](#đăng-ký--đăng-nhập)
2. [Mua Sắm](#mua-sắm)
3. [Quản Lý Sản Phẩm (Staff Product)](#quản-lý-sản-phẩm-staff-product)
4. [Quản Lý Đơn Hàng (Staff Sales)](#quản-lý-đơn-hàng-staff-sales)
5. [Quản Trị Hệ Thống (Admin)](#quản-trị-hệ-thống-admin)
6. [AI Chatbot](#ai-chatbot)

---

## Đăng Ký & Đăng Nhập

### Đăng Ký Tài Khoản Mới

1. Truy cập: `http://localhost:8080/register`
2. Điền thông tin:
   - **Email**: email@example.com
   - **Mật khẩu**: Tối thiểu 6 ký tự
   - **Họ tên**: Tên đầy đủ
   - **Số điện thoại**: 10 số
3. Click **Đăng ký**
4. Hệ thống tự động đăng nhập

### Đăng Nhập

1. Truy cập: `http://localhost:8080/login`
2. Nhập email và password
3. Click **Đăng nhập**
4. Redirect:
   - **Admin/Staff** → Dashboard
   - **Customer** → Trang chủ

### Quên Mật Khẩu

1. Click "Quên mật khẩu?" tại trang login
2. Nhập email đã đăng ký
3. Check email để lấy link reset password
4. Click link và đặt mật khẩu mới

---

## Mua Sắm

### Tìm Kiếm Sản Phẩm

**Cách 1: Tìm theo từ khóa**
1. Vào trang chủ
2. Nhập từ khóa vào ô tìm kiếm (vd: "áo thun")
3. Click 🔍 hoặc Enter

**Cách 2: Lọc theo tiêu chí**
1. Vào `/products`
2. Chọn filters:
   - **Danh mục**: Áo, Quần, Váy...
   - **Thương hiệu**: Nike, Adidas...
   - **Giá**: 0 - 5tr, 5tr - 10tr...
   - **Màu sắc**: Đen, Trắng, Xanh...
   - **Kích thước**: S, M, L, XL...
3. Sản phẩm tự động lọc

**Cách 3: Dùng AI Chatbot**
1. Click icon 💬 góc phải màn hình
2. Hỏi: "Tìm áo sơ mi nam giá dưới 500k"
3. AI sẽ gợi ý sản phẩm phù hợp

### Xem Chi Tiết Sản Phẩm

1. Click vào sản phẩm muốn xem
2. Trang chi tiết hiển thị:
   - **Hình ảnh**: Zoom để xem rõ
   - **Thông tin**: Tên, giá, mô tả
   - **Biến thể**: Chọn màu và size
   - **Đánh giá**: Rating từ khách khác

### Thêm Vào Giỏ Hàng

1. Chọn **Màu sắc**
2. Chọn **Kích thước**
3. Nhập **Số lượng**
4. Click **Thêm vào giỏ**
5. Toast notification hiện lên

### Xem Giỏ Hàng

1. Click icon 🛒 trên navbar
2. Hoặc vào `/cart`
3. Kiểm tra:
   - Sản phẩm đã chọn
   - Số lượng (có thể thay đổi)
   - Tổng tiền

### Đặt Hàng

1. Từ giỏ hàng, click **Thanh toán**
2. Điền thông tin giao hàng:
   - Họ tên người nhận
   - Số điện thoại
   - Địa chỉ đầy đủ
3. Nhập **Mã giảm giá** (nếu có)
4. Chọn phương thức thanh toán:
   - COD (Thanh toán khi nhận hàng)
   - VNPay (Thanh toán online)
5. Click **Đặt hàng**

### Thanh Toán VNPay

1. Sau khi đặt hàng, redirect đến VNPay
2. Chọn ngân hàng
3. Nhập thông tin thẻ (Sandbox - dùng thẻ test)
4. Xác nhận thanh toán
5. Redirect về website với kết quả

**Thẻ test VNPay Sandbox:**
- Số thẻ: `9704198526191432198`
- Tên: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- Mật khẩu OTP: `123456`

### Theo Dõi Đơn Hàng

1. Vào **Đơn hàng của tôi** (`/orders`)
2. Xem danh sách đơn hàng
3. Click vào đơn để xem chi tiết
4. Trạng thái:
   - ⏳ **Chờ xử lý**: Vừa đặt, chờ xác nhận
   - ✅ **Đã xác nhận**: Shop đã nhận
   - 📦 **Đang đóng gói**: Chuẩn bị hàng
   - 🚚 **Đang giao**: Shipper đang giao
   - 🎉 **Hoàn thành**: Đã nhận hàng
   - ❌ **Đã hủy**: Đơn bị hủy

### Hủy Đơn Hàng

1. Vào đơn hàng muốn hủy
2. Click **Hủy đơn** (chỉ khi đơn đang "Chờ xử lý")
3. Xác nhận hủy
4. Đơn chuyển sang trạng thái "Đã hủy"

### Đánh Giá Sản Phẩm

1. Sau khi đơn **Hoàn thành**
2. Vào đơn hàng → Click **Đánh giá**
3. Chọn số sao (1-5)
4. Viết nhận xét
5. Upload hình ảnh (optional)
6. Click **Gửi đánh giá**

---

## Quản Lý Sản Phẩm (Staff Product)

### Login Staff Product

- Email: `product@fashion.com`
- Password: `password123`

### Dashboard

1. Sau login, tự động vào `/dashboard`
2. Thống kê hiển thị:
   - ✅ Tổng sản phẩm
   - ✅ Tổng danh mục
   - ✅ Tổng thương hiệu
   - ❌ Đơn hàng: N/A (không có quyền)

### Thêm Sản Phẩm Mới

1. Vào **Quản lý Sản phẩm** (`/admin/products`)
2. Click **+ Thêm sản phẩm**
3. Điền thông tin:
   - **Tên sản phẩm**: VD: Áo sơ mi nam trắng
   - **Slug**: auto-generated hoặc tự nhập
   - **Danh mục**: Chọn từ dropdown
   - **Thương hiệu**: Chọn brand
   - **Mô tả**: Chi tiết về sản phẩm
   - **Chất liệu**: VD: Cotton 100%
   - **Xuất xứ**: VD: Việt Nam
4. Click **Lưu sản phẩm**

### Thêm Biến Thể (Variants)

1. Sau khi tạo sản phẩm, click **Quản lý biến thể**
2. Click **+ Thêm biến thể**
3. Điền:
   - **SKU**: Mã sản phẩm unique
   - **Màu sắc**: Chọn color
   - **Kích thước**: Chọn size
   - **Giá**: Giá bán
   - **Tồn kho**: Số lượng
4. Click **Lưu biến thể**
5. Repeat để thêm nhiều variants

### Upload Hình Ảnh

1. Trong quản lý biến thể
2. Click **📷 Upload ảnh** cho variant
3. Chọn file ảnh (JPG, PNG, WEBP)
4. Upload (tối đa 10MB)
5. Ảnh hiển thị ngay

### Sửa Sản Phẩm

1. Trong danh sách sản phẩm
2. Click icon ✏️ **Sửa**
3. Cập nhật thông tin
4. Click **Lưu**

### Xóa Sản Phẩm

1. Click icon 🗑️ **Xóa**
2. Confirm xóa
3. Sản phẩm bị xóa khỏi hệ thống

> ⚠️ **Lưu ý:** Không thể xóa sản phẩm đã có đơn hàng

### Quản Lý Danh Mục

1. Vào **Quản lý Danh mục** (`/admin/categories`)
2. Click **+ Thêm danh mục**
3. Nhập:
   - **Tên danh mục**: VD: Áo nam
   - **Slug**: ao-nam
   - **Mô tả**: Optional
   - **Danh mục cha**: Chọn parent (nếu là sub-category)
4. Click **Lưu**

### Quản Lý Thương Hiệu

1. Vào **Quản lý Thương hiệu** (`/admin/brands`)
2. Click **+ Thêm thương hiệu**
3. Nhập:
   - **Tên thương hiệu**: VD: Nike
   - **Mô tả**: Về brand
4. Click **Lưu**

---

## Quản Lý Đơn Hàng (Staff Sales)

### Login Staff Sales

- Email: `sales@fashion.com`
- Password: `password123`

### Dashboard

1. Sau login, vào `/dashboard`
2. Thống kê:
   - ❌ Sản phẩm: N/A
   - ✅ Tổng đơn hàng
   - ✅ Doanh thu (hôm nay, tuần, tháng)
   - ✅ Đơn theo trạng thái

### Xem Đơn Hàng

1. Vào **Quản lý Đơn hàng** (`/admin/orders`)
2. Danh sách tất cả đơn hàng
3. Filter theo:
   - Trạng thái
   - Ngày đặt
   - Từ khóa (mã đơn, tên khách)

### Xử Lý Đơn Hàng

1. Click vào đơn hàng
2. Xem chi tiết:
   - Thông tin khách hàng
   - Sản phẩm đã đặt
   - Tổng tiền
   - Địa chỉ giao hàng
3. Click **Cập nhật trạng thái**
4. Chọn trạng thái mới:
   - **Xác nhận** → Đã xác nhận
   - **Đóng gói** → Đang đóng gói
   - **Giao hàng** → Đang giao
   - **Hoàn thành** → Hoàn thành
   - **Hủy** → Đã hủy
5. Click **Cập nhật**

### In Hóa Đơn

1. Trong chi tiết đơn hàng
2. Click **🖨️ In hóa đơn**
3. Dialog print hiện ra
4. Chọn máy in và in

### Quản Lý Mã Giảm Giá

1. Vào **Quản lý Mã giảm giá** (`/admin/coupons`)
2. Click **+ Tạo mã mới**
3. Nhập:
   - **Mã coupon**: VD: SALE10
   - **Loại**: Phần trăm hoặc Giá trị
   - **Giá trị**: VD: 10% hoặc 50,000đ
   - **Ngày bắt đầu**: Start date
   - **Ngày kết thúc**: End date
   - **Số lượng**: Giới hạn sử dụng
   - **Đơn tối thiểu**: VD: 500,000đ
4. Click **Tạo mã**

### Xem Báo Cáo Doanh Thu

1. Dashboard hiển thị:
   - **Doanh thu hôm nay**
   - **Doanh thu tuần**
   - **Doanh thu tháng**
   - **Biểu đồ** doanh thu 7 ngày

---

## Quản Trị Hệ Thống (Admin)

### Login Admin

- Email: `admin@fashion.com`
- Password: `admin123`

> ⚠️ **Bắt buộc:** Đổi password ngay sau lần đầu login!

### Dashboard Tổng Quan

Admin thấy **TẤT CẢ** thống kê:
- ✅ Sản phẩm
- ✅ Danh mục, Thương hiệu
- ✅ Đơn hàng
- ✅ Doanh thu đầy đủ
- ✅ Biểu đồ

### Quản Lý Người Dùng

1. Vào **Quản lý Người dùng** (`/admin/users`)
2. Danh sách tất cả users
3. Click **Sửa** để:
   - Cập nhật thông tin
   - **Phân quyền**: Thêm/Xóa roles
   - Kích hoạt/Vô hiệu hóa tài khoản

### Phân Quyền User

1. Trong chi tiết user, click **Phân quyền**
2. Chọn roles:
   - ☑️ ADMIN
   - ☑️ STAFF_PRODUCT
   - ☑️ STAFF_SALES
   - ☑️ CUSTOMER
3. User có thể có nhiều roles
4. Click **Lưu**

### Xem Logs

1. Vào **Audit Logs** (đang phát triển)
2. Xem lịch sử:
   - User login
   - CRUD operations
   - Error logs

---

## AI Chatbot

### Mở Chatbot

1. Click icon 💬 góc phải dưới màn hình
2. Hoặc vào `/ai-chatbot`
3. Chatbot window mở ra

### Hỏi về Sản Phẩm

**Ví dụ câu hỏi:**
- "Tìm áo sơ mi nam giá dưới 500k"
- "Có váy đầm nào không?"
- "Giày Nike size 42 giá bao nhiêu?"
- "Cho tôi xem quần jean xanh"

**AI sẽ:**
- Tìm sản phẩm phù hợp
- Hiển thị danh sách
- Tư vấn size, màu sắc
- Gợi ý sản phẩm tương tự

### Hỏi về Size

**Ví dụ:**
- "Tư vấn size áo cho tôi, cao 1m70, nặng 65kg"
- "Bảng size quần jean"
- "Size M tương đương bao nhiêu cm?"

**AI cung cấp:**
- Bảng size chi tiết
- Hướng dẫn cách đo
- Gợi ý size phù hợp

### Quick Actions

Chatbot có các nút nhanh:
- **🔍 Tìm sản phẩm**
- **📏 Tư vấn size**
- **💰 Xem khuyến mãi**
- **📦 Theo dõi đơn hàng**

### Voice Input (Beta)

1. Click icon 🎤 trong chatbot
2. Nói câu hỏi
3. AI nhận diện giọng nói
4. Trả lời tự động

---

## Tips & Tricks

### Mua Sắm Hiệu Quả

✅ **Dùng Filter:** Tiết kiệm thời gian tìm sản phẩm
✅ **So Sánh:** Xem nhiều sản phẩm trước khi quyết định
✅ **Đọc Review:** Tham khảo đánh giá từ người mua trước
✅ **Dùng AI:** Chatbot giúp tìm nhanh hơn

### Tiết Kiệm Chi Phí

✅ **Mã Giảm Giá:** Luôn check coupon trước thanh toán
✅ **Flash Sale:** Theo dõi khuyến mãi đặc biệt
✅ **Mua Nhiều:** Đơn lớn thường có ưu đãi

### Bảo Mật

✅ **Password Mạnh:** Ít nhất 8 ký tự, có chữ hoa, số
✅ **Không Chia Sẻ:** Giữ kín thông tin đăng nhập
✅ **Đăng Xuất:** Luôn logout sau khi dùng xong

---

**Cần hỗ trợ?** 
- 📧 Email: support@fashion.com
- 💬 Chat trực tiếp với AI Chatbot
- 📞 Hotline: 1900-xxxx

