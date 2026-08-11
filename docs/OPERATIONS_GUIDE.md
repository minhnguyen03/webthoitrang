# 🛠️ Hướng Dẫn Vận Hành Hệ Thống — Fashion E-Commerce

> **Dành cho:** System Admin, DevOps, Tech Lead  
> **Cập nhật:** 05/2026  
> **Phiên bản hệ thống:** Spring Boot 3.x + Next.js 16 + MariaDB + Redis

---

## 📋 Mục Lục

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Khởi Động & Dừng Dịch Vụ](#2-khởi-động--dừng-dịch-vụ)
3. [Giám Sát Hệ Thống](#3-giám-sát-hệ-thống)
4. [Quản Lý Database](#4-quản-lý-database)
5. [Quản Lý Cache Redis](#5-quản-lý-cache-redis)
6. [Quản Lý AI Chatbot](#6-quản-lý-ai-chatbot)
7. [Xử Lý Sự Cố Thường Gặp](#7-xử-lý-sự-cố-thường-gặp)
8. [Backup & Recovery](#8-backup--recovery)
9. [Bảo Mật & Bảo Trì](#9-bảo-mật--bảo-trì)

---

## 1. Tổng Quan Hệ Thống

### 1.1 Kiến Trúc Dịch Vụ

```
┌───────────────────────────────────────────────────┐
│                  FASHION E-COMMERCE                │
│                                                   │
│  [Next.js Frontend :3000] ──▶ [Spring Boot API :8080]
│                                     │             │
│                           ┌─────────┼─────────┐  │
│                           ▼         ▼         ▼  │
│                       [MariaDB] [Redis :6380] [LM Studio :1234]
└───────────────────────────────────────────────────┘
```

### 1.2 Danh Sách Dịch Vụ

| Dịch Vụ | Port | Vai Trò | Bắt Buộc |
|---------|------|---------|----------|
| Spring Boot Backend | 8080 | API Server + Thymeleaf SSR | ✅ Bắt buộc |
| Next.js Frontend | 3000 | Admin UI (React) | ✅ Bắt buộc |
| MariaDB | 3306 | Database chính | ✅ Bắt buộc |
| Redis | 6380 | Cache + Session | ⚠️ Khuyến nghị |
| LM Studio | 1234 | AI Chatbot (local LLM) | 🔧 Optional |
| ngrok | - | HTTPS tunnel (dev/test) | 🔧 Dev only |

### 1.3 Tài Khoản Mặc Định

| Role | Email | Password | Quyền |
|------|-------|----------|-------|
| Admin | `admin@fashion.com` | `Admin@123` | Toàn quyền |
| Staff Product | `staff.product@fashion.com` | `Staff@123` | Quản lý sản phẩm |
| Staff Sales | `staff.sales@fashion.com` | `Staff@123` | Quản lý đơn hàng |

> ⚠️ **QUAN TRỌNG:** Đổi tất cả password mặc định ngay sau khi triển khai production!

---

## 2. Khởi Động & Dừng Dịch Vụ

### 2.1 Thứ Tự Khởi Động (BẮT BUỘC)

```
1. MariaDB  →  2. Redis  →  3. LM Studio  →  4. Spring Boot  →  5. Next.js
```

> ⚠️ Không tuân thủ thứ tự này có thể gây lỗi khởi động!

### 2.2 Khởi Động Thủ Công (Windows)

```powershell
# 1. Khởi động MariaDB
net start MariaDB

# 2. Khởi động Redis (nếu dùng Docker)
docker start fashion-redis
# Hoặc nếu cài native:
# redis-server --port 6380

# 3. Khởi động LM Studio (GUI app)
# Mở LM Studio → Local Server → Start Server

# 4. Khởi động Spring Boot Backend
cd D:\Project\fashion
mvn spring-boot:run
# Hoặc chạy JAR:
java -jar target/fashion-0.0.1-SNAPSHOT.jar

# 5. Khởi động Next.js Frontend
cd D:\Project\fashion\frontend
npm run dev
```

### 2.3 Khởi Động Thủ Công (Linux/macOS)

```bash
# 1. MariaDB
sudo systemctl start mariadb

# 2. Redis
sudo systemctl start redis
# Hoặc Docker:
docker start fashion-redis

# 3. Spring Boot
cd /opt/fashion
java -jar fashion-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  > logs/backend.log 2>&1 &

# 4. Next.js
cd /opt/fashion/frontend
npm run build && npm start > logs/frontend.log 2>&1 &
```

### 2.4 Dừng Dịch Vụ

```powershell
# Windows - Dừng Spring Boot (tìm PID)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Dừng Next.js
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Dừng Redis
docker stop fashion-redis

# Dừng MariaDB
net stop MariaDB
```

```bash
# Linux - Dừng Spring Boot
pkill -f "fashion.*\.jar"

# Dừng Next.js
pkill -f "next"

# Dừng dịch vụ hệ thống
sudo systemctl stop mariadb
sudo systemctl stop redis
```

### 2.5 Kiểm Tra Trạng Thái

```bash
# Kiểm tra Backend đang chạy
curl http://localhost:8080/api/products?size=1
# Kết quả mong đợi: JSON với danh sách sản phẩm

# Kiểm tra Frontend
curl http://localhost:3000
# Kết quả mong đợi: HTML page

# Kiểm tra Redis
redis-cli -p 6380 ping
# Kết quả: PONG

# Kiểm tra AI Chatbot
curl http://127.0.0.1:1234/v1/models
# Kết quả: JSON với danh sách model

# Kiểm tra Database
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
```

---

## 3. Giám Sát Hệ Thống

### 3.1 Admin Dashboard (Built-in)

Truy cập tại: **http://localhost:8080/admin/system-monitor**

Thông tin hiển thị:
- **RAM**: Used / Total / Max (Alert: >90% = CRITICAL)
- **CPU**: Load average, cores, threads
- **Disk**: Total / Free / Usable space
- **Database**: Số lượng Users, Orders, Products, Logs
- **App**: Đơn hàng hôm nay, Users active 24h

### 3.2 Spring Boot Actuator

```bash
# Health check tổng quát
curl http://localhost:8080/actuator/health

# Thông tin ứng dụng
curl http://localhost:8080/actuator/info

# Metrics
curl http://localhost:8080/actuator/metrics
```

### 3.3 Kiểm Tra Logs

```bash
# Windows - Xem logs Spring Boot (nếu chạy trong terminal)
# Logs xuất hiện trực tiếp trên console

# Linux - Theo dõi logs real-time
tail -f logs/backend.log

# Lọc lỗi
grep -i "ERROR\|WARN" logs/backend.log | tail -50

# Lọc theo thời gian
grep "2026-05-19" logs/backend.log | grep ERROR
```

### 3.4 Log Levels

File: `src/main/resources/application.properties`

```properties
# Development (verbose)
logging.level.fit.iuh.edu.fashion=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# Production (chỉ INFO trở lên)
logging.level.fit.iuh.edu.fashion=INFO
logging.level.org.hibernate.SQL=WARN
logging.level.root=WARN
```

### 3.5 Audit Logs (Admin)

Xem tại: **http://localhost:8080/admin/audit-logs**

- Ghi lại tất cả hành động: LOGIN, LOGOUT, CREATE, UPDATE, DELETE
- Có thể filter theo: User, Action, Entity, Date range
- Xuất báo cáo CSV

---

## 4. Quản Lý Database

### 4.1 Kết Nối Database

```bash
# Kết nối MariaDB CLI
mysql -u root -p fashion_shop

# Hoặc với user riêng
mysql -u fashion_user -p fashion_shop
```

### 4.2 Backup Database

```bash
# Backup toàn bộ database
mysqldump -u root -p fashion_shop > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup chỉ schema (không có data)
mysqldump -u root -p --no-data fashion_shop > schema_backup.sql

# Backup chỉ data (không có schema)
mysqldump -u root -p --no-create-info fashion_shop > data_backup.sql

# Backup với compression
mysqldump -u root -p fashion_shop | gzip > backup_$(date +%Y%m%d).sql.gz
```

### 4.3 Restore Database

```bash
# Restore từ file SQL
mysql -u root -p fashion_shop < backup_20260519.sql

# Restore từ file nén
gunzip -c backup_20260519.sql.gz | mysql -u root -p fashion_shop
```

### 4.4 Kiểm Tra Sức Khỏe Database

```sql
-- Kiểm tra kích thước database
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'fashion_shop'
GROUP BY table_schema;

-- Kiểm tra số lượng records
SELECT 
    'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items;

-- Kiểm tra connections đang hoạt động
SHOW PROCESSLIST;

-- Kiểm tra slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

### 4.5 Tối Ưu Hóa Database

```sql
-- Phân tích và tối ưu bảng
ANALYZE TABLE orders, products, order_items;
OPTIMIZE TABLE orders, products, order_items;

-- Kiểm tra và sửa bảng
CHECK TABLE orders;
REPAIR TABLE orders;

-- Xem indexes
SHOW INDEX FROM orders;
SHOW INDEX FROM products;
```

### 4.6 Xử Lý Dữ Liệu Cũ

```sql
-- Xóa audit logs cũ hơn 90 ngày (cần thực hiện định kỳ)
DELETE FROM audit_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Xóa refresh tokens hết hạn
DELETE FROM refresh_tokens WHERE expires_at < NOW();

-- Xóa password reset tokens đã dùng hoặc hết hạn
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() OR used = TRUE;

-- Xem đơn hàng PENDING quá 7 ngày (có thể cần xử lý thủ công)
SELECT id, code, created_at, grand_total 
FROM orders 
WHERE status = 'PENDING' 
  AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 5. Quản Lý Cache Redis

### 5.1 Kiểm Tra Redis

```bash
# Kết nối Redis CLI
redis-cli -p 6380

# Kiểm tra tất cả keys
KEYS *

# Kiểm tra keys theo pattern
KEYS products:*
KEYS chat:memory:*

# Xem số lượng keys
DBSIZE

# Thông tin Redis server
INFO server
INFO memory
INFO stats
```

### 5.2 Cache Regions

| Cache Name | TTL | Mô Tả |
|-----------|-----|--------|
| `products` | 1 giờ | Product details, stock info |
| `catalogData` | 5 phút | Brands, categories, colors, sizes |
| `topProducts` | 2 phút | Top products cho AI |
| `productSearch` | 1 giờ | Search results |
| `userContext` | 10 phút | User personalization cho AI |
| `chat:memory:*` | 60 phút | Conversation history |

### 5.3 Xóa Cache

```bash
# Xóa tất cả cache (CẢNH BÁO: chỉ dùng khi cần thiết)
redis-cli -p 6380 FLUSHALL

# Xóa theo pattern cụ thể
redis-cli -p 6380 --scan --pattern "products:*" | xargs redis-cli -p 6380 DEL

# Xóa conversation memory cũ
redis-cli -p 6380 --scan --pattern "chat:memory:*" | xargs redis-cli -p 6380 DEL
```

### 5.4 Giám Sát Redis

```bash
# Xem memory usage
redis-cli -p 6380 INFO memory | grep used_memory_human

# Xem hit rate
redis-cli -p 6380 INFO stats | grep keyspace

# Monitor commands real-time (dùng để debug, không để lâu)
redis-cli -p 6380 MONITOR
```

---

## 6. Quản Lý AI Chatbot

### 6.1 Kiểm Tra Trạng Thái AI

```bash
# Health check AI
curl http://localhost:8080/api/ai/health

# Kiểm tra RAG status
curl http://localhost:8080/api/ai/rag/status

# Admin AI dashboard
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8080/api/ai/admin/dashboard
```

### 6.2 LM Studio Operations

**Khởi động:**
1. Mở LM Studio application
2. Tab "Local Server" → chọn model `lmstudio-community/qwen3.5-2b`
3. Click "Start Server" → đợi hiện "Server Running"
4. Verify: `curl http://127.0.0.1:1234/v1/models`

**Thay đổi model:**
1. Download model mới trong LM Studio (tab Search)
2. Dừng server hiện tại
3. Chọn model mới → Start Server
4. Cập nhật `application.properties`:
   ```properties
   spring.ai.openai.chat.options.model=<tên-model-mới>
   ```
5. Restart Spring Boot

### 6.3 Vector Store & Embedding

- **Auto-index**: Tự động index tất cả products khi startup (sau 10 giây delay)
- **Re-index**: Tự động mỗi 30 phút
- **Manual re-index**: Restart Spring Boot để trigger re-index

### 6.4 Feedback & Monitoring

Xem tại: **http://localhost:8080/api/ai/feedback/stats**

```bash
# Thống kê feedback
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  http://localhost:8080/api/ai/feedback/stats
```

---

## 7. Xử Lý Sự Cố Thường Gặp

### 7.1 Backend Không Khởi Động Được

**Triệu chứng:** `Started FashionApplication` không xuất hiện trong logs

```bash
# Kiểm tra port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Kiểm tra database connection
mysql -u root -p -e "SELECT 1;"

# Chạy với verbose logging
java -jar fashion.jar --logging.level.root=DEBUG 2>&1 | head -100
```

**Giải pháp phổ biến:**
- MariaDB chưa chạy → `net start MariaDB`
- Port 8080 bị chiếm → đổi `server.port=8081` trong `application.properties`
- Sai credentials DB → kiểm tra `DB_USERNAME`, `DB_PASSWORD` env vars

### 7.2 Redis Connection Error

**Triệu chứng:** `Unable to connect to Redis; nested exception is...`

```bash
# Kiểm tra Redis
redis-cli -p 6380 ping

# Hệ thống sẽ fallback sang in-memory cache, vẫn chạy được
# Nhưng chat memory sẽ bị mất khi restart
```

> ℹ️ Hệ thống được thiết kế để hoạt động ngay cả khi không có Redis (fallback in-memory).

### 7.3 AI Chatbot Không Phản Hồi

**Triệu chứng:** Timeout hoặc "Error calling AI service"

```bash
# Kiểm tra LM Studio server
curl http://127.0.0.1:1234/v1/models

# Nếu không có kết quả:
# 1. Mở LM Studio
# 2. Vào Local Server tab
# 3. Click Start Server

# Kiểm tra model đã load
curl http://127.0.0.1:1234/v1/models | python -m json.tool
```

### 7.4 VNPay Callback Lỗi

**Triệu chứng:** Thanh toán thành công nhưng đơn hàng vẫn UNPAID

```bash
# Kiểm tra ngrok đang chạy
curl https://<your-ngrok-url>/api/payment/vnpay/ipn

# Kiểm tra URL trong application.properties
# vnpay.return-url=https://abc-123.ngrok-free.app/api/payment/vnpay/callback
# vnpay.ipn-url=https://abc-123.ngrok-free.app/api/payment/vnpay/ipn
```

**Nguyên nhân thường gặp:**
- ngrok URL thay đổi sau khi restart → cập nhật lại URL
- ngrok session hết hạn → chạy lại ngrok

### 7.5 Database Slow Queries

```sql
-- Bật slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- Log queries > 2 giây

-- Kiểm tra slow queries
SHOW FULL PROCESSLIST;

-- Kill query đang chạy lâu
KILL QUERY <process_id>;
```

### 7.6 Out of Memory (OOM)

```bash
# Kiểm tra JVM memory usage
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# Tăng heap size khi khởi động
java -Xms512m -Xmx2048m -jar fashion.jar

# Hoặc set trong environment
export JAVA_OPTS="-Xms512m -Xmx2048m"
```

### 7.7 Email Không Gửi Được

**Triệu chứng:** `AuthenticationFailedException: 535-5.7.8`

Giải pháp:
1. Kiểm tra Gmail App Password còn hiệu lực
2. Kiểm tra "2-Step Verification" vẫn bật
3. Tạo lại App Password nếu cần
4. Cập nhật `spring.mail.password` trong application.properties

---

## 8. Backup & Recovery

### 8.1 Lịch Backup Khuyến Nghị

| Loại Backup | Tần Suất | Lưu Giữ | Ghi Chú |
|------------|---------|---------|---------|
| Database Full | Hàng ngày | 30 ngày | Chạy lúc 2:00 AM |
| Database Schema | Hàng tuần | 12 tuần | |
| Application Config | Sau mỗi thay đổi | Mãi mãi | Git version control |
| Product Images | Hàng tuần | 4 tuần | `/static/image_product/` |
| Redis Snapshot | Hàng ngày | 7 ngày | RDB dump |

### 8.2 Script Backup Tự Động (Linux)

```bash
#!/bin/bash
# File: /opt/fashion/scripts/backup.sh

BACKUP_DIR="/opt/backups/fashion"
DATE=$(date +%Y%m%d_%H%M%S)
DB_USER="root"
DB_PASS="your_password"
DB_NAME="fashion_shop"

# Tạo thư mục backup
mkdir -p "$BACKUP_DIR"

# Backup database
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | \
  gzip > "$BACKUP_DIR/db_${DATE}.sql.gz"

# Backup product images
tar -czf "$BACKUP_DIR/images_${DATE}.tar.gz" \
  /opt/fashion/src/main/resources/static/image_product/

# Xóa backup cũ hơn 30 ngày
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "[$(date)] Backup completed: $BACKUP_DIR"
```

```bash
# Đặt lịch chạy tự động lúc 2 AM
crontab -e
# Thêm dòng:
0 2 * * * /opt/fashion/scripts/backup.sh >> /var/log/fashion-backup.log 2>&1
```

### 8.3 Recovery Procedure

```bash
# 1. Dừng ứng dụng
sudo systemctl stop fashion-backend

# 2. Restore database
mysql -u root -p fashion_shop < backup_20260519.sql

# 3. Restore images (nếu cần)
tar -xzf images_20260519.tar.gz -C /

# 4. Khởi động lại
sudo systemctl start fashion-backend

# 5. Kiểm tra
curl http://localhost:8080/actuator/health
```

---

## 9. Bảo Mật & Bảo Trì

### 9.1 Checklist Bảo Mật Định Kỳ

**Hàng tuần:**
- [ ] Xem xét audit logs bất thường
- [ ] Kiểm tra accounts đăng nhập thất bại nhiều lần
- [ ] Xem xét permissions người dùng

**Hàng tháng:**
- [ ] Rotate JWT secret key
- [ ] Đổi Gmail App Password
- [ ] Cập nhật VNPay credentials nếu cần
- [ ] Review và xóa tài khoản không còn hoạt động
- [ ] Kiểm tra cập nhật bảo mật cho dependencies

**Hàng quý:**
- [ ] Penetration testing cơ bản
- [ ] Review CORS configuration
- [ ] Kiểm tra SSL certificates (production)

### 9.2 Cập Nhật Hệ Thống

```bash
# Cập nhật dependencies Maven (kiểm tra trước khi apply)
mvn versions:display-dependency-updates

# Build và test trước khi deploy
mvn clean test
mvn clean package -DskipTests

# Cập nhật frontend dependencies
cd frontend
npm audit
npm update
```

### 9.3 Rate Limiting

Hệ thống đã tích hợp **Bucket4j** rate limiting. Cấu hình mặc định:
- API requests bị giới hạn theo IP
- Login attempts bị giới hạn để chống brute-force

Kiểm tra `RateLimitFilter.java` để xem/điều chỉnh giới hạn.

### 9.4 Quản Lý Credentials

```properties
# Không bao giờ commit credentials vào Git!
# Sử dụng environment variables:

# Production environment variables
DB_USERNAME=fashion_user
DB_PASSWORD=<strong_password>
JWT_SECRET=<base64_encoded_256bit_key>
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=<gmail_app_password>
VNPAY_TMN_CODE=<from_vnpay_dashboard>
VNPAY_HASH_SECRET=<from_vnpay_dashboard>
```

```bash
# Generate JWT secret mạnh
openssl rand -base64 64

# Set environment variables (Linux)
export JWT_SECRET="your-generated-secret"

# Set environment variables (Windows PowerShell)
$env:JWT_SECRET="your-generated-secret"
```

---

## 📞 Liên Hệ & Escalation

| Vấn Đề | Người Xử Lý | SLA |
|--------|------------|-----|
| Hệ thống down | DevOps Lead | 30 phút |
| Database corruption | DBA | 2 giờ |
| Payment issue | Tech Lead + Finance | 1 giờ |
| Security breach | Security Team + CTO | Ngay lập tức |
| AI Chatbot lỗi | Backend Dev | 4 giờ |

---

*Xem thêm:*
- [DEVOPS_DEPLOYMENT.md](DEVOPS_DEPLOYMENT.md) — Hướng dẫn triển khai production
- [CODEBASE_ARCHITECTURE.md](CODEBASE_ARCHITECTURE.md) — Kiến trúc kỹ thuật
- [SETUP.md](SETUP.md) — Cài đặt môi trường development
