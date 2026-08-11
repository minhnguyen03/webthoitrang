# 🚀 Hướng Dẫn Cài Đặt và Cấu Hình Hệ Thống

> Tài liệu hướng dẫn chi tiết từng bước để cài đặt và cấu hình Fashion E-Commerce Platform

---

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#1-yêu-cầu-hệ-thống)
2. [Cài Đặt Công Cụ](#2-cài-đặt-công-cụ)
3. [Cài Đặt Database](#3-cài-đặt-database)
4. [Clone và Build Project](#4-clone-và-build-project)
5. [Cấu Hình Application Properties](#5-cấu-hình-application-properties)
6. [Cấu Hình AI Chatbot (LM Studio)](#6-cấu-hình-ai-chatbot-lm-studio)
7. [Cấu Hình Redis Cache](#7-cấu-hình-redis-cache)
8. [Cấu Hình Email Notification](#8-cấu-hình-email-notification)
9. [Cấu Hình VNPay Payment](#9-cấu-hình-vnpay-payment)
10. [Chạy và Kiểm Tra](#10-chạy-và-kiểm-tra)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Yêu Cầu Hệ Thống

### ✅ Bắt Buộc

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| **Java JDK** | 25 trở lên | Runtime môi trường |
| **Maven** | 3.8+ | Build tool |
| **MariaDB/MySQL** | 8.0+ | Database |
| **Git** | Latest | Version control |

### 🔧 Khuyến Nghị

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| **IntelliJ IDEA** | 2023+ | IDE (hoặc Eclipse) |
| **Postman** | Latest | Test API |
| **MySQL Workbench** | Latest | Quản lý DB |
| **LM Studio** | Latest | AI Chatbot local |
| **Redis** | 7.0+ | Cache (optional) |
| **ngrok** | Latest | Testing VNPay (dev) |

### 💻 Phần Cứng

- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **Disk**: Tối thiểu 5GB trống
- **CPU**: 2 cores trở lên

---

## 2. Cài Đặt Công Cụ

### 2.1. Cài Đặt Java JDK 25

#### Windows

```bash
# Cách 1: Download từ Oracle
# Truy cập: https://www.oracle.com/java/technologies/downloads/#java25
# Download Java 25 installer và cài đặt

# Cách 2: Sử dụng Chocolatey
choco install openjdk25

# Kiểm tra cài đặt
java -version
```

#### Linux (Ubuntu/Debian)

```bash
# Cài đặt OpenJDK 25
sudo apt update
sudo apt install openjdk-25-jdk

# Kiểm tra
java -version
javac -version
```

#### macOS

```bash
# Sử dụng Homebrew
brew install openjdk@25

# Thêm vào PATH
echo 'export PATH="/usr/local/opt/openjdk@25/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Kiểm tra
java -version
```

### 2.2. Cài Đặt Maven

#### Windows

```bash
# Download từ: https://maven.apache.org/download.cgi
# Giải nén và thêm vào PATH

# Hoặc dùng Chocolatey
choco install maven

# Kiểm tra
mvn -version
```

#### Linux

```bash
sudo apt update
sudo apt install maven

# Kiểm tra
mvn -version
```

#### macOS

```bash
brew install maven

# Kiểm tra
mvn -version
```

### 2.3. Cài Đặt Git

#### Windows

```bash
# Download từ: https://git-scm.com/download/win
# Hoặc dùng Chocolatey
choco install git

# Kiểm tra
git --version
```

#### Linux

```bash
sudo apt update
sudo apt install git

# Kiểm tra
git --version
```

#### macOS

```bash
brew install git

# Kiểm tra
git --version
```

---

## 3. Cài Đặt Database

### 3.1. Cài Đặt MariaDB

#### Windows

```bash
# Download từ: https://mariadb.org/download/
# Chạy installer
# Thiết lập root password

# Hoặc dùng Chocolatey
choco install mariadb

# Khởi động service
net start MariaDB
```

#### Linux (Ubuntu/Debian)

```bash
# Cài đặt MariaDB
sudo apt update
sudo apt install mariadb-server

# Khởi động service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Bảo mật cài đặt
sudo mysql_secure_installation
```

**Trong quá trình `mysql_secure_installation`, chọn:**
- Set root password? **Yes** → Nhập password mạnh
- Remove anonymous users? **Yes**
- Disallow root login remotely? **Yes**
- Remove test database? **Yes**
- Reload privilege tables? **Yes**

#### macOS

```bash
# Cài đặt qua Homebrew
brew install mariadb

# Khởi động service
brew services start mariadb

# Bảo mật
mysql_secure_installation
```

### 3.2. Tạo Database và User

```sql
-- Đăng nhập MariaDB
mysql -u root -p
# Nhập password đã tạo

-- Tạo database
CREATE DATABASE fashion_shop 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Tạo user riêng (khuyến nghị cho production)
CREATE USER 'fashion_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Cấp quyền
GRANT ALL PRIVILEGES ON fashion_shop.* TO 'fashion_user'@'localhost';
FLUSH PRIVILEGES;

-- Kiểm tra
SHOW DATABASES;
USE fashion_shop;

-- Thoát
EXIT;
```

### 3.3. Kiểm Tra Kết Nối

```bash
# Test kết nối với user mới tạo
mysql -u fashion_user -p fashion_shop

# Nếu thành công, bạn sẽ thấy prompt:
# MariaDB [fashion_shop]>
```

---

## 4. Clone và Build Project

### 4.1. Clone Repository

```bash
# Clone từ GitHub
git clone https://github.com/yourusername/fashion-ecommerce.git

# Di chuyển vào thư mục project
cd fashion-ecommerce

# Kiểm tra branch
git branch
```

### 4.2. Build Project Lần Đầu

```bash
# Sử dụng Maven wrapper (khuyến nghị)
./mvnw clean install

# Trên Windows (PowerShell)
.\mvnw.cmd clean install

# Hoặc dùng Maven global
mvn clean install
```

**Kết quả mong đợi:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 2.5 min
```

### 4.3. Cấu Trúc Thư Mục

```
fashion/
├── src/
│   ├── main/
│   │   ├── java/                 # Source code
│   │   └── resources/
│   │       ├── application.properties  # ⭐ File cấu hình chính
│   │       ├── static/           # CSS, JS, Images
│   │       └── templates/        # HTML templates
│   └── test/                     # Test code
├── target/                       # Compiled files
├── pom.xml                       # Maven config
└── mvnw                          # Maven wrapper
```

---

## 5. Cấu Hình Application Properties

### 5.1. Mở File Cấu Hình

```bash
# File: src/main/resources/application.properties
```

### 5.2. Cấu Hình Database

**Tìm và cập nhật:**

```properties
# Database Configuration
spring.datasource.url=jdbc:mariadb://localhost:3306/fashion_shop?createDatabaseIfNotExist=true&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=fashion_user
spring.datasource.password=YourStrongPassword123!
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
```

**Thay thế:**
- `fashion_user` → Username bạn đã tạo (hoặc `root`)
- `YourStrongPassword123!` → Password của bạn

### 5.3. Cấu Hình JWT Secret

```properties
# JWT Configuration
jwt.secret=change-this-to-a-very-long-secret-key-minimum-256-bits-for-production
jwt.access-token-expiration=86400000
jwt.refresh-token-expiration=604800000
```

**Thay đổi cho Production:**

```bash
# Generate secret key mạnh
openssl rand -base64 64

# Copy output và paste vào jwt.secret
```

### 5.4. Cấu Hình File Upload

```properties
# File Upload Configuration
upload.path=src/main/resources/static/image_product
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

**Tạo thư mục nếu chưa có:**

```bash
mkdir -p src/main/resources/static/image_product
```

### 5.5. Cấu Hình Server

```properties
# Server Configuration
server.port=8080

# Nếu port 8080 bị chiếm, đổi sang 8081, 8082, etc.
```

---

## 6. Cấu Hình AI Chatbot (LM Studio)

### 6.1. Download và Cài Đặt LM Studio

1. **Truy cập:** https://lmstudio.ai
2. **Download** phiên bản cho hệ điều hành của bạn:
   - Windows: `LMStudio-Setup.exe`
   - macOS: `LMStudio.dmg`
   - Linux: `LMStudio.AppImage`
3. **Cài đặt** theo hướng dẫn

### 6.2. Download Mô Hình AI

1. **Mở LM Studio**
2. **Vào tab "Search"** (icon kính lúp)
3. **Tìm kiếm:** `qwen3.5-2b`
4. **Chọn mô hình:**
   - Tên: `lmstudio-community/qwen3.5-2b`
   - Size: tùy bản quantized
   - Khuyến nghị: GGUF format, Q4_K_M quantization
5. **Click "Download"**
6. **Chờ download** hoàn tất (~5-10 phút)

### 6.3. Khởi Động Local Server

1. **Vào tab "Local Server"** (icon server)
2. **Chọn model:** Trong dropdown, chọn `lmstudio-community/qwen3.5-2b`
3. **Cấu hình server:**
   - Port: `1234` (mặc định)
   - Host: `127.0.0.1`
   - CORS: Enable
4. **Click "Start Server"**
5. **Kiểm tra:** Bạn sẽ thấy "Server Running" màu xanh

### 6.4. Test Server

```bash
# Test bằng curl
curl http://127.0.0.1:1234/v1/models

# Kết quả mong đợi:
# {
#   "object": "list",
#   "data": [...]
# }
```

### 6.5. Cấu Hình trong Application Properties

```properties
# Spring AI - LM Studio Configuration
spring.ai.openai.api-key=lm-studio
spring.ai.openai.base-url=http://127.0.0.1:1234
spring.ai.openai.chat.options.model=lmstudio-community/qwen3.5-2b
spring.ai.openai.chat.options.temperature=0.35
spring.ai.openai.chat.options.max-tokens=2048
spring.ai.openai.chat.options.timeout=300s
```

**✅ Đã có sẵn - Không cần thay đổi!**

### 6.6. Lưu Ý Quan Trọng

- ⚠️ **LM Studio phải chạy TRƯỚC** khi start Spring Boot
- ⚠️ **Không tắt LM Studio** khi app đang chạy
- ⚠️ **Mô hình khác:** Có thể thử model 3B/7B quantized nếu máy đủ VRAM/RAM
- ✅ **Hoàn toàn FREE**, không cần API key

---

## 7. Cấu Hình Redis Cache (Tùy chọn)

> Redis giúp cải thiện performance bằng caching. Có thể bỏ qua bước này cho development.

### 7.1. Cài Đặt Redis

#### Windows

```bash
# Cách 1: Docker (khuyến nghị)
docker pull redis:latest
docker run -d -p 6380:6379 --name fashion-redis redis:latest

# Cách 2: Download binary
# https://github.com/microsoftarchive/redis/releases
# Giải nén và chạy redis-server.exe
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# Khởi động
sudo systemctl start redis
sudo systemctl enable redis

# Kiểm tra
redis-cli ping
# Kết quả: PONG
```

#### macOS

```bash
# Cài đặt
brew install redis

# Khởi động
brew services start redis

# Kiểm tra
redis-cli ping
```

### 7.2. Cấu Hình Application Properties

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

**✅ Đã có sẵn - Chỉ cần uncomment nếu muốn dùng**

### 7.3. Test Redis

```bash
# Kết nối Redis CLI
redis-cli -p 6380

# Test
127.0.0.1:6380> SET test "Hello Redis"
127.0.0.1:6380> GET test
# Kết quả: "Hello Redis"

127.0.0.1:6380> EXIT
```

---

## 8. Cấu Hình Email Notification

### 8.1. Tạo Gmail App Password

1. **Truy cập:** https://myaccount.google.com/security
2. **Bật "2-Step Verification":**
   - Click "2-Step Verification"
   - Follow hướng dẫn setup
3. **Tạo App Password:**
   - Quay lại Security page
   - Click "App passwords"
   - Select app: "Mail"
   - Select device: "Windows Computer" (hoặc thiết bị bạn dùng)
   - Click "Generate"
4. **Copy password** (dạng: `xxxx xxxx xxxx xxxx`)

### 8.2. Cấu Hình Application Properties

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Thay đổi:**
- `your-email@gmail.com` → Email của bạn
- `xxxx xxxx xxxx xxxx` → App password vừa tạo (giữ nguyên spaces hoặc xóa hết)

### 8.3. Test Email

```java
// Test trong code hoặc dùng Spring Boot Admin
```

---

## 9. Cấu Hình VNPay Payment

### 9.1. Đăng Ký VNPay Sandbox

1. **Truy cập:** https://sandbox.vnpayment.vn/
2. **Đăng ký tài khoản** demo/test
3. **Login và lấy thông tin:**
   - TMN Code: Mã merchant
   - Hash Secret: Secret key

### 9.2. Cài Đặt ngrok (cho Development)

```bash
# Windows
choco install ngrok

# macOS
brew install ngrok

# Linux
snap install ngrok
```

**Chạy ngrok:**

```bash
# Expose local server
ngrok http 8080

# Lưu URL HTTPS (VD: https://abc-123.ngrok-free.app)
```

### 9.3. Cấu Hình Application Properties

```properties
# VNPay Configuration
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=https://abc-123.ngrok-free.app/api/payment/vnpay/callback
vnpay.ipn-url=https://abc-123.ngrok-free.app/api/payment/vnpay/ipn
```

**Thay đổi:**
- `YOUR_TMN_CODE` → TMN Code từ VNPay
- `YOUR_HASH_SECRET` → Hash Secret từ VNPay
- `abc-123.ngrok-free.app` → URL từ ngrok của bạn

### 9.4. Lưu Ý

- ⚠️ **Development:** Phải dùng ngrok vì VNPay cần HTTPS callback
- ⚠️ **Production:** Dùng domain thật, không cần ngrok
- ⚠️ **Testing:** Dùng thẻ test của VNPay Sandbox

---

## 10. Chạy và Kiểm Tra

### 10.1. Checklist Trước Khi Chạy

- [ ] MariaDB đã chạy
- [ ] Database `fashion_shop` đã tạo
- [ ] LM Studio đã chạy (nếu dùng AI Chatbot)
- [ ] Redis đã chạy (nếu dùng cache)
- [ ] application.properties đã cấu hình đúng
- [ ] ngrok đã chạy (nếu test VNPay)

### 10.2. Chạy Application

```bash
# Cách 1: Maven wrapper
./mvnw spring-boot:run

# Cách 2: Build JAR và run
./mvnw clean package -DskipTests
java -jar target/fashion-0.0.1-SNAPSHOT.jar

# Cách 3: Trong IDE
# IntelliJ: Right-click FashionApplication.java → Run
```

### 10.3. Kiểm Tra Logs

**Logs thành công:**

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.x.x)

...
Started FashionApplication in 8.5 seconds
```

### 10.4. Truy Cập Ứng Dụng

**URLs:**

| URL | Mô tả |
|-----|-------|
| http://localhost:8080 | Homepage |
| http://localhost:8080/login | Login page |
| http://localhost:8080/admin/products | Admin panel |
| http://localhost:8080/ai-chatbot | AI Chatbot |
| http://localhost:8080/api/products | REST API |

### 10.5. Test Login

**Admin account (mặc định):**
```
Email: admin@fashion.com
Password: Admin@123
```

**Test workflow:**
1. Vào http://localhost:8080
2. Click "Đăng nhập"
3. Nhập email và password
4. Click "Đăng nhập"
5. ✅ Nếu thành công → Redirect về homepage

### 10.6. Test AI Chatbot

1. Vào http://localhost:8080/ai-chatbot
2. Nhập: "Tìm áo thun nam"
3. ✅ AI sẽ trả lời về sản phẩm

### 10.7. Test Admin Panel

1. Login với admin account
2. Vào http://localhost:8080/admin/products
3. Click "Thêm sản phẩm"
4. ✅ Form thêm sản phẩm hiển thị

---

## 11. Troubleshooting

### 11.1. Database Connection Failed

**Lỗi:**
```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
```

**Giải pháp:**

```bash
# Kiểm tra MariaDB đã chạy chưa
sudo systemctl status mariadb  # Linux
net start MariaDB              # Windows
brew services list             # macOS

# Kiểm tra port
netstat -an | grep 3306

# Test connection
mysql -u fashion_user -p fashion_shop
```

### 11.2. Port 8080 Already in Use

**Lỗi:**
```
Web server failed to start. Port 8080 was already in use.
```

**Giải pháp:**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Hoặc đổi port
# application.properties: server.port=8081
```

### 11.3. LM Studio Connection Failed

**Lỗi:**
```
Error calling AI service
```

**Giải pháp:**

1. Kiểm tra LM Studio đã chạy:
   ```bash
   curl http://127.0.0.1:1234/v1/models
   ```

2. Nếu fail:
   - Mở LM Studio
   - Vào tab "Local Server"
   - Click "Start Server"
   - Đợi hiển thị "Server Running"

### 11.4. Redis Connection Failed

**Lỗi:**
```
Unable to connect to Redis
```

**Giải pháp:**

```bash
# Kiểm tra Redis
redis-cli -p 6380 ping

# Nếu không chạy
sudo systemctl start redis     # Linux
docker start fashion-redis     # Docker
brew services start redis      # macOS
```

### 11.5. Email Send Failed

**Lỗi:**
```
AuthenticationFailedException: 535-5.7.8 Username and Password not accepted
```

**Giải pháp:**

1. Kiểm tra App Password đúng chưa
2. Bật 2-Step Verification trong Google Account
3. Tạo lại App Password
4. Copy password CHÍNH XÁC (có hoặc không có spaces)

### 11.6. VNPay Invalid Signature

**Lỗi:**
```
Invalid signature
```

**Giải pháp:**

1. Kiểm tra `vnpay.hash-secret` đúng chưa
2. Kiểm tra `vnpay.tmn-code` đúng chưa
3. Đảm bảo return URL và IPN URL dùng HTTPS (ngrok)
4. Clear browser cache và test lại

### 11.7. Out of Memory

**Lỗi:**
```
java.lang.OutOfMemoryError: Java heap space
```

**Giải pháp:**

```bash
# Tăng heap size
java -Xmx2G -jar target/fashion-0.0.1-SNAPSHOT.jar

# Hoặc trong application.properties
# spring.jvm.options=-Xmx2G
```

---

## 📚 Tài Liệu Tham Khảo

- [README.md](README.md) - Tổng quan hệ thống
- [CONTRIBUTING.md](CONTRIBUTING.md) - Hướng dẫn contribute
- [docs/PAYMENT_SYNC_README.md](docs/PAYMENT_SYNC_README.md) - Payment integration
- [docs/REFUND_SYSTEM_GUIDE.md](docs/REFUND_SYSTEM_GUIDE.md) - Refund system
- [docs/SYSTEM_MONITORING_GUIDE.md](docs/SYSTEM_MONITORING_GUIDE.md) - System monitoring

---

## 🎯 Next Steps

Sau khi setup xong:

1. ✅ **Đọc README.md** để hiểu đầy đủ tính năng
2. ✅ **Test các tính năng chính:**
   - Đăng ký/Đăng nhập
   - Thêm sản phẩm vào giỏ
   - Đặt hàng
   - Thanh toán (test mode)
   - AI Chatbot
3. ✅ **Khám phá Admin Panel:**
   - Quản lý sản phẩm
   - Quản lý đơn hàng
   - Xem audit logs
   - Giám sát hệ thống
4. ✅ **Test API với Postman**
5. ✅ **Customize theo nhu cầu**

---

## 💡 Tips

### Development

- Use **IntelliJ IDEA** với Spring Boot plugin
- Enable **auto-reload** trong IDE
- Dùng **H2 in-memory database** cho testing nhanh
- Setup **hot-reload** cho Thymeleaf templates

### Production

- Đổi `jwt.secret` sang secret mạnh
- Dùng environment variables cho sensitive data
- Setup **proper logging** (file + monitoring)
- Enable **HTTPS**
- Setup **database backups**
- Use **production-grade cache** (Redis cluster)

### Performance

- Enable **Redis cache**
- Optimize **database indexes**
- Use **CDN** cho static files
- Enable **Gzip compression**
- Monitor với **Spring Boot Actuator**

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Kiểm tra logs** trong console
2. **Xem Troubleshooting** section trên
3. **Tìm trong docs/** folder
4. **Tạo issue** trên GitHub
5. **Liên hệ:** support@fashion.com

---

**Made with ❤️ by Fashion Team**

*Last Updated: November 24, 2025*

