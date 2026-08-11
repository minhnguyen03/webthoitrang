# 🛍️ Fashion E-Commerce Platform

Hệ thống thương mại điện tử thời trang chuyên nghiệp với đầy đủ tính năng quản lý sản phẩm, đơn hàng, thanh toán và người dùng.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [Tài Khoản Mẫu](#-tài-khoản-mẫu)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Tính Năng

### 🛒 Khách Hàng
- ✅ Đăng ký, đăng nhập với JWT Authentication
- ✅ Xem và tìm kiếm sản phẩm (theo danh mục, thương hiệu, giá, màu sắc, kích thước)
- ✅ Giỏ hàng với tính năng thêm, sửa, xóa
- ✅ Đặt hàng và theo dõi đơn hàng
- ✅ Thanh toán qua VNPay, MoMo, ZaloPay, COD
- ✅ Hủy đơn hàng và hoàn tiền tự động
- ✅ Đánh giá và review sản phẩm
- ✅ Quản lý thông tin cá nhân
- ✅ Tích lũy và sử dụng điểm thưởng
- ✅ AI Chatbot hỗ trợ 24/7

### 👨‍💼 Admin
- ✅ Dashboard với thống kê chi tiết
- ✅ Quản lý sản phẩm (CRUD, variants, images)
- ✅ Quản lý danh mục và thương hiệu
- ✅ Quản lý đơn hàng (cập nhật trạng thái, hoàn tiền)
- ✅ Quản lý thanh toán và đối soát
- ✅ Quản lý người dùng và phân quyền (RBAC)
- ✅ Quản lý mã giảm giá
- ✅ Audit Logs - Theo dõi mọi hành động
- ✅ Giám sát hệ thống (RAM, CPU, Disk, Database)
- ✅ Quản lý kho hàng tự động

### 🔐 Bảo Mật
- JWT Access Token & Refresh Token
- Password encryption với BCrypt
- Role-Based Access Control (RBAC)
- CORS configuration
- Rate limiting
- XSS & CSRF protection
- Audit logging

---

## 🚀 Công Nghệ

### Backend
- **Java 25**
- **Spring Boot 3.x**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **MySQL** - Database
- **JWT** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **MapStruct** - Object mapping
- **Flyway** - Database migration

### Frontend
- **Thymeleaf** - Server-side template engine
- **Bootstrap 5** - UI framework
- **JavaScript ES6+**
- **AJAX** - Asynchronous requests
- **Bootstrap Icons**

### Payment Gateway
- **VNPay** - Vietnamese payment gateway
- **MoMo** - E-wallet
- **ZaloPay** - E-wallet

### Tools & Libraries
- **Maven** - Build tool
- **Git** - Version control
- **Postman** - API testing

---

## 📦 Yêu Cầu Hệ Thống

### Bắt Buộc
- **Java Development Kit (JDK) 25** trở lên
- **Maven 3.8+**
- **MySQL 8.0+**
- **Git**

### Khuyến Nghị
- **IntelliJ IDEA** hoặc **Eclipse IDE**
- **Postman** để test API
- **MySQL Workbench** để quản lý database
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **Disk**: Tối thiểu 2GB trống

---

## 🔧 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/fashion-ecommerce.git
cd fashion-ecommerce
```

### 2. Cài Đặt MySQL

**Windows:**
1. Download MySQL Installer từ [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Chạy installer và chọn "MySQL Server"
3. Thiết lập root password

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

### 3. Tạo Database

```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE fashion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (tùy chọn)
CREATE USER 'fashion_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fashion_db.* TO 'fashion_user'@'localhost';
FLUSH PRIVILEGES;

-- Thoát
exit;
```

### 4. Cấu Hình Application

**File cấu hình chính:** `src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=fashion

# Encoding Configuration
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true

# Database Configuration (MariaDB)
spring.datasource.url=jdbc:mariadb://localhost:3306/fashion_shop?createDatabaseIfNotExist=true&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# JWT Configuration
jwt.secret=your-secret-key-minimum-256-bits-for-HS256-algorithm-security
jwt.access-token-expiration=86400000
jwt.refresh-token-expiration=604800000

# Server Configuration
server.port=8080

# File Upload Configuration
upload.path=src/main/resources/static/image_product
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# VNPay Payment Gateway (Sandbox)
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:8080/api/payment/vnpay/callback
vnpay.ipn-url=http://localhost:8080/api/payment/vnpay/ipn

# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

> **Lưu ý quan trọng:**
> - Thay `your_database_password` bằng password MySQL/MariaDB của bạn
> - Đổi `jwt.secret` thành secret key mạnh hơn cho production
> - Cập nhật VNPay credentials nếu muốn dùng thanh toán online
> - Thay email/password cho email notification

### 5. Build Project

```bash
# Sử dụng Maven wrapper (khuyến nghị)
./mvnw clean install

# Hoặc sử dụng Maven global
mvn clean install
```

---

## ⚙️ Cấu Hình Nâng Cao

### Redis Cache Configuration (Tùy chọn - Cải thiện Performance)

Nếu muốn sử dụng Redis để cache, cải thiện hiệu suất:

1. **Cài đặt Redis:**

**Windows:**
```bash
# Download từ https://github.com/microsoftarchive/redis/releases
# Hoặc dùng Docker
docker run -d -p 6380:6379 --name redis redis:latest
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# Mac
brew install redis
brew services start redis
```

2. **Thêm vào application.properties:**

```properties
# Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6380
spring.data.redis.timeout=2000ms

# Cache Configuration
spring.cache.type=redis
spring.cache.redis.time-to-live=3600000
spring.cache.redis.cache-null-values=false
```

### AI Chatbot Configuration (LM Studio)

Hệ thống sử dụng **LM Studio** để chạy AI chatbot local-first. Next.js sở hữu UI `/ai-chatbot` và floating widget; Spring Boot cung cấp API/RAG.

#### Bước 1: Cài Đặt LM Studio

1. Download LM Studio từ [lmstudio.ai](https://lmstudio.ai)
2. Cài đặt và mở LM Studio
3. Download mô hình **lmstudio-community/qwen3.5-2b**:
   - Vào tab "Search"
   - Tìm "qwen3.5-2b"
   - Click Download

#### Bước 2: Khởi Động Local Server

1. Trong LM Studio, vào tab **"Local Server"**
2. Chọn model: **lmstudio-community/qwen3.5-2b**
3. Click **"Start Server"**
4. Server sẽ chạy tại: `http://127.0.0.1:1234`

#### Bước 3: Cấu Hình Spring Boot

Đã có sẵn trong `application.properties`:

```properties
# Spring AI - LM Studio Configuration
spring.ai.openai.api-key=lm-studio
spring.ai.openai.base-url=http://127.0.0.1:1234
spring.ai.openai.chat.options.model=lmstudio-community/qwen3.5-2b
spring.ai.openai.chat.options.temperature=0.35
spring.ai.openai.chat.options.max-tokens=2048
spring.ai.openai.chat.options.timeout=300s
```

#### Bước 4: Truy Cập Chatbot

- **URL chính**: http://localhost:3000/ai-chatbot
- **Legacy URL**: http://localhost:8080/ai-chatbot sẽ redirect về Next frontend
- **Hoặc**: Click icon AI ở góc dưới bên phải trên giao diện Next

#### Tính Năng AI Chatbot

- ✅ Tư vấn sản phẩm thời trang
- ✅ RAG hybrid: vector search local + catalog search
- ✅ Streaming SSE với events `meta`, `chunk`, `error`, `done`
- ✅ Gợi ý phối đồ
- ✅ Hướng dẫn chọn size
- ✅ Thông tin khuyến mãi
- ✅ Hỗ trợ bằng giọng nói (Voice input)
- ✅ Copy câu trả lời
- ✅ Feedback hữu ích/chưa tốt
- ✅ Admin dashboard tại `/admin/ai-chatbot`

#### Lưu Ý

> ⚠️ **Quan trọng:**
> - LM Studio phải chạy trước khi start Spring Boot
> - Mô hình Qwen 3.5 2B phù hợp cấu hình local 32GB RAM + RTX 3050 4GB VRAM
> - Nếu muốn dùng mô hình khác, đổi `model` trong config
> - **KHÔNG cần API key** vì chạy local hoàn toàn

### Email Notification Configuration

Để gửi email thông báo đơn hàng, xác nhận tài khoản:

1. **Tạo App Password cho Gmail:**
   - Vào [Google Account Security](https://myaccount.google.com/security)
   - Bật "2-Step Verification"
   - Vào "App passwords"
   - Tạo password mới cho "Mail"
   - Copy password (dạng: xxxx xxxx xxxx xxxx)

2. **Cập nhật application.properties:**

```properties
spring.mail.username=homequy001@gmail.com
spring.mail.password=xxxx-xxxx-xxxx-xxxx
```

### VNPay Payment Gateway Configuration

Để sử dụng thanh toán VNPay:

1. **Đăng ký VNPay:**
   - Truy cập [VNPay Sandbox](https://sandbox.vnpayment.vn)
   - Đăng ký tài khoản test
   - Lấy TMN Code và Hash Secret

2. **Cập nhật ngrok URL (cho development):**

```bash
# Install ngrok
# Windows: choco install ngrok
# Mac: brew install ngrok
# Linux: snap install ngrok

# Chạy ngrok
ngrok http 8080

# Copy HTTPS URL (vd: https://abc-123.ngrok.io)
```

3. **Cập nhật application.properties:**

```properties
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.return-url=https://your-ngrok-url.ngrok.io/api/payment/vnpay/callback
vnpay.ipn-url=https://your-ngrok-url.ngrok.io/api/payment/vnpay/ipn
```

> **Lưu ý:** Production không cần ngrok, dùng domain thật

### Logging Configuration

Đã có sẵn trong application.properties:

```properties
# Logging
logging.level.fit.iuh.edu.fashion=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

Để lưu log ra file:

```properties
# Thêm vào application.properties
logging.file.name=logs/fashion.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

---

## 🏃 Chạy Ứng Dụng

### 1. Development Mode

```bash
# Sử dụng Maven
./mvnw spring-boot:run

# Hoặc với profile cụ thể
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 2. Production Mode

```bash
# Build JAR file
./mvnw clean package -DskipTests

# Chạy JAR
java -jar target/fashion-0.0.1-SNAPSHOT.jar

# Hoặc với profile production
java -jar -Dspring.profiles.active=prod target/fashion-0.0.1-SNAPSHOT.jar
```

### 3. Trong IDE

**IntelliJ IDEA:**
1. Mở project
2. Tìm class `FashionApplication.java`
3. Right-click → Run 'FashionApplication'

**Eclipse:**
1. Import project as Maven project
2. Right-click project → Run As → Spring Boot App

### 4. Truy Cập Ứng Dụng

- **Homepage**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin/products
- **API Base URL**: http://localhost:8080/api

---

## 👤 Tài Khoản Mẫu

### Admin Account
```
Email: admin@fashion.com
Password: Admin@123
```

### Staff Account
```
Email: staff@fashion.com
Password: Staff@123
```

### Customer Account
```
Email: customer@fashion.com
Password: Customer@123
```

> ⚠️ **Lưu ý**: Thay đổi password mặc định ngay sau khi đăng nhập lần đầu trong môi trường production!

---

## 📖 Hướng Dẫn Sử Dụng

### Khách Hàng

#### 1. Đăng Ký Tài Khoản
1. Truy cập http://localhost:8080
2. Click "Đăng ký"
3. Điền thông tin: Email, Password, Họ tên, SĐT
4. Click "Đăng ký"
5. Đăng nhập với tài khoản vừa tạo

#### 2. Mua Hàng
1. **Tìm sản phẩm**:
   - Duyệt theo danh mục
   - Tìm kiếm theo tên
   - Lọc theo giá, màu sắc, kích thước

2. **Thêm vào giỏ**:
   - Click vào sản phẩm
   - Chọn màu sắc và kích thước
   - Chọn số lượng
   - Click "Thêm vào giỏ hàng"

3. **Đặt hàng**:
   - Vào giỏ hàng (icon giỏ hàng góc phải)
   - Kiểm tra sản phẩm
   - Click "Thanh toán"
   - Điền địa chỉ giao hàng
   - Chọn phương thức thanh toán:
     - **COD**: Thanh toán khi nhận hàng
     - **VNPay**: Thanh toán online qua VNPay
     - **MoMo**: Thanh toán qua ví MoMo
   - Áp dụng mã giảm giá (nếu có)
   - Sử dụng điểm tích lũy (nếu có)
   - Click "Đặt hàng"

4. **Thanh toán**:
   - **COD**: Hoàn tất đặt hàng
   - **VNPay/MoMo**: 
     - Chuyển đến trang thanh toán
     - Đăng nhập và xác nhận
     - Quay lại sau khi thanh toán

#### 3. Theo Dõi Đơn Hàng
1. Vào "Đơn hàng của tôi"
2. Xem danh sách đơn hàng
3. Click "Xem chi tiết" để xem thông tin đầy đủ
4. Trạng thái đơn hàng:
   - **Chờ xử lý**: Đơn hàng mới tạo
   - **Đã xác nhận**: Admin đã xác nhận
   - **Đang đóng gói**: Đang chuẩn bị hàng
   - **Đang giao**: Đơn hàng đang được vận chuyển
   - **Hoàn thành**: Đã nhận hàng
   - **Đã hủy**: Đơn hàng bị hủy

#### 4. Hủy Đơn Hàng
1. Vào "Đơn hàng của tôi"
2. Tìm đơn cần hủy (chỉ hủy được đơn "Chờ xử lý" hoặc "Đã xác nhận")
3. Click "Hủy đơn"
4. Xác nhận hủy
5. **Nếu đã thanh toán**: Tiền sẽ được hoàn lại trong 3-7 ngày

#### 5. Đánh Giá Sản Phẩm
1. Vào trang chi tiết sản phẩm
2. Cuộn xuống phần "Đánh giá"
3. Chọn số sao (1-5)
4. Nhập tiêu đề và nội dung đánh giá
5. Click "Gửi đánh giá"
6. Có thể chỉnh sửa đánh giá sau này

---

### Admin

#### 1. Đăng Nhập Admin
1. Truy cập http://localhost:8080/login
2. Đăng nhập với tài khoản admin
3. Tự động chuyển đến Dashboard

#### 2. Quản Lý Sản Phẩm

**Thêm sản phẩm mới:**
1. Vào "Quản lý Sản phẩm"
2. Click "Thêm sản phẩm mới"
3. Điền thông tin:
   - Tên sản phẩm
   - Mô tả
   - Danh mục
   - Thương hiệu
   - Giá
4. Thêm variants (màu sắc, kích thước, số lượng)
5. Upload ảnh sản phẩm
6. Click "Lưu"

**Cập nhật sản phẩm:**
1. Tìm sản phẩm cần sửa
2. Click "Sửa"
3. Chỉnh sửa thông tin
4. Click "Cập nhật"

**Quản lý kho:**
1. Xem số lượng tồn kho
2. Cập nhật số lượng khi cần
3. Hệ thống tự động trừ khi có đơn
4. Tự động cộng lại khi hủy đơn

#### 3. Quản Lý Đơn Hàng

**Xử lý đơn hàng:**
1. Vào "Quản lý Đơn hàng"
2. Xem danh sách đơn hàng mới
3. Click "Xác nhận" cho đơn "Chờ xử lý"
4. Click "Đóng gói" khi chuẩn bị xong hàng
5. Click "Giao hàng" khi bàn giao cho shipper
6. Click "Hoàn thành" khi khách đã nhận hàng

**Hủy đơn hàng:**
1. Tìm đơn cần hủy
2. Click "Hủy đơn"
3. Nhập lý do hủy
4. Xác nhận
5. **Nếu đã thanh toán**: 
   - Hệ thống tự động đánh dấu cần hoàn tiền
   - Vào cổng thanh toán (VNPay/MoMo) để hoàn tiền thực tế

**Hoàn tiền:**
1. Tìm đơn cần hoàn tiền
2. Click "Hoàn tiền"
3. Nhập lý do
4. Xác nhận
5. Hệ thống tự động:
   - Hoàn lại kho hàng
   - Hoàn lại điểm tích lũy
6. Admin cần vào cổng thanh toán để hoàn tiền thực tế

#### 4. Quản Lý Thanh Toán

**Đối soát thanh toán:**
1. Vào "Quản lý Thanh toán"
2. Lọc theo ngày, trạng thái, phương thức
3. Kiểm tra các giao dịch
4. Đối chiếu với báo cáo từ VNPay/MoMo

**Xử lý thanh toán COD:**
1. Tìm đơn COD đã giao thành công
2. Trạng thái tự động chuyển thành "Đã thanh toán" khi hoàn thành

#### 5. Quản Lý Mã Giảm Giá

**Tạo mã giảm giá:**
1. Vào "Quản lý Mã giảm giá"
2. Click "Thêm mã giảm giá"
3. Điền thông tin:
   - Mã code (VD: SUMMER2025)
   - Loại giảm (% hoặc số tiền cố định)
   - Giá trị giảm
   - Đơn tối thiểu
   - Giảm tối đa
   - Số lượng
   - Ngày bắt đầu/kết thúc
4. Click "Lưu"

**Bật/Tắt mã:**
1. Tìm mã cần bật/tắt
2. Click nút toggle
3. Mã tắt sẽ không áp dụng được

#### 6. Giám Sát Hệ Thống

**Xem metrics:**
1. Vào "Giám sát Hệ thống"
2. Xem các chỉ số:
   - RAM usage
   - Disk usage
   - CPU cores
   - Active users
   - Orders today
3. Tự động refresh mỗi 30 giây

**Cảnh báo:**
- 🟢 **HEALTHY**: < 75% - Hệ thống hoạt động tốt
- 🟡 **WARNING**: 75-90% - Cần theo dõi
- 🔴 **CRITICAL**: > 90% - Cần xử lý ngay

#### 7. Audit Logs

**Xem logs:**
1. Vào "Nhật ký hoạt động"
2. Lọc theo:
   - User
   - Hành động (Login, Create, Update, Delete...)
   - Entity (Order, Product, User...)
   - Ngày
3. Click "Xem chi tiết" để xem đầy đủ thông tin

**Sử dụng:**
- Theo dõi hoạt động người dùng
- Audit security
- Troubleshooting
- Truy vết thay đổi

---

## 🔌 API Documentation

### Authentication APIs

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "fullName": "Nguyen Van A",
  "phone": "0123456789"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "roles": ["ROLE_CUSTOMER"]
  }
}
```

### Product APIs

```http
GET /api/products?page=0&size=20&sort=createdAt,desc
GET /api/products/{id}
GET /api/products/search?keyword=áo&category=1&minPrice=100000&maxPrice=500000
```

### Order APIs

```http
POST /api/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "shipName": "Nguyen Van A",
  "shipPhone": "0123456789",
  "shipLine1": "123 Nguyen Trai",
  "shipWard": "Phuong 1",
  "shipDistrict": "Quan 1",
  "shipCity": "Ho Chi Minh",
  "paymentMethod": "VNPAY",
  "couponCode": "SUMMER2025",
  "loyaltyPointsUsed": 100
}
```

```http
GET /api/orders/my
POST /api/orders/{id}/cancel
PUT /api/orders/{id}/status?status=CONFIRMED (Admin only)
POST /api/orders/{id}/refund (Admin only)
```

### Payment APIs

```http
POST /api/payment/vnpay/create
GET /api/payment/vnpay/return?vnp_ResponseCode=00&...
POST /api/payment/momo/create
POST /api/payment/momo/notify
```

> 📚 **Full API Documentation**: Import file `Fashion_API.postman_collection.json` vào Postman để xem đầy đủ APIs

---

## 🐛 Troubleshooting

### 1. Database Connection Error

**Lỗi:**
```
Communications link failure
```

**Giải pháp:**
- Kiểm tra MySQL đã chạy: `sudo systemctl status mysql`
- Kiểm tra username/password trong `application.properties`
- Kiểm tra database đã tạo chưa
- Kiểm tra firewall không block port 3306

### 2. Port 8080 Already in Use

**Lỗi:**
```
Port 8080 was already in use
```

**Giải pháp:**
```bash
# Windows - Kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Hoặc đổi port trong application.properties
server.port=8081
```

### 3. JWT Token Invalid

**Lỗi:**
```
401 Unauthorized
```

**Giải pháp:**
- Token hết hạn → Login lại
- Token sai format → Kiểm tra header: `Authorization: Bearer {token}`
- Secret key sai → Kiểm tra `jwt.secret` trong config

### 4. File Upload Error

**Lỗi:**
```
Maximum upload size exceeded
```

**Giải pháp:**
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 5. Payment Gateway Error

**Lỗi:**
```
Invalid signature
```

**Giải pháp:**
- Kiểm tra `vnpay.hashSecret` hoặc `momo.secretKey`
- Kiểm tra TMN code / Partner code
- Test với sandbox trước
- Kiểm tra returnUrl và notifyUrl đúng

### 6. Out of Memory

**Lỗi:**
```
java.lang.OutOfMemoryError: Java heap space
```

**Giải pháp:**
```bash
# Tăng heap size khi chạy
java -Xmx2G -jar target/fashion-0.0.1-SNAPSHOT.jar
```

---

## 📂 Cấu Trúc Project

```
fashion/
├── src/
│   ├── main/
│   │   ├── java/fit/iuh/edu/fashion/
│   │   │   ├── config/           # Security, CORS, etc.
│   │   │   ├── controllers/      # REST Controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── models/           # Entity classes
│   │   │   ├── repositories/     # JPA Repositories
│   │   │   ├── services/         # Business logic
│   │   │   ├── security/         # JWT, UserDetails
│   │   │   └── FashionApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/           # CSS, JS, Images
│   │       └── templates/        # Thymeleaf templates
│   └── test/                     # Unit & Integration tests
├── docs/                         # Documentation
├── pom.xml                       # Maven dependencies
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Duong Van Quy** - Lead Developer & Project Owner

---

## 📞 Contact & Support

- **Developer**: Duong Van Quy
- **Email**: homequy001@gmail.com
- **Phone/Zalo**: 0382050645
- **GitHub**: [Fashion E-Commerce](https://github.com/yourusername/fashion-ecommerce)

---

## 📚 Tài Liệu Bổ Sung

### 📐 Kiến Trúc & Nghiệp Vụ (Deep Code Analysis)
- **[⭐ Codebase Architecture & Business Logic](docs/CODEBASE_ARCHITECTURE.md)** — Phân tích chi tiết toàn bộ codebase:
  - Database Schema (27 entities, relationships, enums)
  - Business Logic Layer (10+ services, order/payment/loyalty flows)
  - Security & RBAC (4 roles, 10 permissions, JWT strategy)
  - AI Chatbot Architecture (15 intents, RAG pipeline, conversation memory)
  - Caching Strategy (Redis, 8 cache regions)
  - API Endpoints Map (50+ endpoints)
  - Data Flow Diagrams (Purchase, Admin, AI Chatbot)

### 🛠️ Hướng Dẫn Cài Đặt & Vận Hành
- **[Quick Setup Guide](QUICK_SETUP.md)** - ⚡ Cài đặt nhanh trong 15 phút
- [Setup Guide](docs/SETUP.md) - Hướng dẫn cài đặt và cấu hình chi tiết từng bước

### 💳 Thanh Toán & Đơn Hàng
- [Payment Integration Guide](docs/PAYMENT_SYNC_README.md)
- [Refund System Guide](docs/REFUND_SYSTEM_GUIDE.md)

### 📊 Giám Sát & Quản Trị
- [System Monitoring Guide](docs/SYSTEM_MONITORING_GUIDE.md)
- [Audit Logs Guide](docs/IMPROVE_AUDIT_LOGS_DISPLAY.md)

### 🔐 Bảo Mật
- [RBAC Guide](docs/RBAC_GUIDE.md) - Phân quyền Role-Based Access Control

### 📖 Nghiệp Vụ
- [Backend Business Logic](docs/BACKEND_BUSINESS_LOGIC.md)
- [Frontend Business Logic](docs/FRONTEND_BUSINESS_LOGIC.md)
- [User Guide](docs/USER_GUIDE.md)

---

**Made with ❤️ by Fashion Team**

*Last Updated: March 5, 2026*

