# 📚 Fashion E-Commerce - Documentation Index

Chào mừng đến với tài liệu hướng dẫn của Fashion E-Commerce Platform!

## 📖 Tài Liệu Chính

### 📐 Kiến Trúc & Nghiệp Vụ (Deep Code Analysis)
- **[⭐ CODEBASE_ARCHITECTURE.md](CODEBASE_ARCHITECTURE.md)** — Phân tích chi tiết toàn bộ codebase Backend + Frontend:
  - Database Schema (27 entities, relationships, enums)
  - Business Logic Layer (10+ services, order/payment/loyalty flows)
  - Security & RBAC (4 roles, 10 permissions, JWT strategy)
  - AI Chatbot Architecture (15 intents, RAG pipeline, 18 AI sub-services)
  - Caching Strategy (Redis, 8 cache regions)
  - API Endpoints Map (50+ endpoints)
  - Data Flow Diagrams (Purchase, Admin, AI Chatbot)
- **[Backend Business Logic](BACKEND_BUSINESS_LOGIC.md)** — Logic nghiệp vụ Backend
- **[Frontend Business Logic](FRONTEND_BUSINESS_LOGIC.md)** — Logic nghiệp vụ Frontend

### 🚀 Getting Started
- **[QUICK_SETUP.md](../QUICK_SETUP.md)** - ⚡ Cài đặt nhanh trong 15 phút (Khuyến nghị bắt đầu ở đây)
- **[README.md](../README.md)** - Hướng dẫn cài đặt, cấu hình và sử dụng hệ thống
- **[SETUP.md](SETUP.md)** - Hướng dẫn cài đặt chi tiết từng bước

### 🛠️ Vận Hành & DevOps
- **[OPERATIONS_GUIDE.md](OPERATIONS_GUIDE.md)** - Hướng dẫn vận hành hàng ngày: khởi/dừng dịch vụ, giám sát, xử lý sự cố, backup
- **[DEVOPS_DEPLOYMENT.md](DEVOPS_DEPLOYMENT.md)** - Triển khai production: Docker, CI/CD, Nginx, SSL, rollback, go-live checklist

### 💳 Payment & Orders
- **[Payment Sync Guide](PAYMENT_SYNC_README.md)** - Hướng dẫn tích hợp thanh toán VNPay, MoMo, ZaloPay
- **[Refund System Guide](REFUND_SYSTEM_GUIDE.md)** - Hệ thống hủy đơn và hoàn tiền tự động
- **[Refund Quick Guide](REFUND_QUICK_GUIDE.md)** - Hướng dẫn nhanh xử lý hoàn tiền
- **[Refund Implementation](REFUND_IMPLEMENTATION_SUMMARY.md)** - Chi tiết kỹ thuật triển khai hoàn tiền

### 📊 System Monitoring
- **[System Monitoring Guide](SYSTEM_MONITORING_GUIDE.md)** - Giám sát hệ thống (RAM, CPU, Disk)
- **[Audit Logs Display](IMPROVE_AUDIT_LOGS_DISPLAY.md)** - Hệ thống logs và tracking

### 🎨 User Guides
- **[Setup Guide](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết
- **[User Guide](USER_GUIDE.md)** - Hướng dẫn sử dụng cho người dùng cuối
- **[RBAC Guide](RBAC_GUIDE.md)** - Quản lý phân quyền người dùng

## 📂 Cấu Trúc Tài Liệu

```
docs/
├── INDEX.md                              # File này
├── CODEBASE_ARCHITECTURE.md             # ⭐ Kiến trúc & nghiệp vụ (Deep Analysis)
├── BACKEND_BUSINESS_LOGIC.md            # Logic nghiệp vụ Backend
├── FRONTEND_BUSINESS_LOGIC.md           # Logic nghiệp vụ Frontend
├── PAYMENT_SYNC_README.md               # Thanh toán
├── PAYMENT_SYNC_INDEX.md                # Index thanh toán
├── PAYMENT_ORDER_SYNC_FIX.md            # Fix sync payment
├── REFUND_SYSTEM_GUIDE.md               # Hoàn tiền
├── REFUND_QUICK_GUIDE.md                # Quick guide hoàn tiền
├── REFUND_IMPLEMENTATION_SUMMARY.md     # Tóm tắt triển khai
├── SYSTEM_MONITORING_GUIDE.md           # Giám sát hệ thống
├── IMPROVE_AUDIT_LOGS_DISPLAY.md        # Audit logs
├── SETUP.md                             # Setup
├── SETUP_GUIDE.md                       # Setup (legacy)
├── USER_GUIDE.md                        # User guide
└── RBAC_GUIDE.md                        # RBAC
```

## 🎯 Quick Links

### Cho Developer
- [Cài đặt môi trường development](../README.md#-cài-đặt)
- [API Documentation](../README.md#-api-documentation)
- [Troubleshooting](../README.md#-troubleshooting)

### Cho Admin
- [Quản lý sản phẩm](../README.md#2-quản-lý-sản-phẩm)
- [Quản lý đơn hàng](../README.md#3-quản-lý-đơn-hàng)
- [Xử lý hoàn tiền](REFUND_QUICK_GUIDE.md)
- [Giám sát hệ thống](SYSTEM_MONITORING_GUIDE.md)

### Cho User
- [Hướng dẫn mua hàng](../README.md#2-mua-hàng)
- [Hủy đơn và hoàn tiền](../README.md#4-hủy-đơn-hàng)
- [Đánh giá sản phẩm](../README.md#5-đánh-giá-sản-phẩm)

## 📝 Ghi Chú

- Tất cả tài liệu được cập nhật thường xuyên
- Mọi thắc mắc vui lòng liên hệ team support
- Đóng góp cải thiện tài liệu luôn được hoan nghênh

---

**Last Updated**: March 5, 2026

