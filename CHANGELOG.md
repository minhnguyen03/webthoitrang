# 📝 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-24

### 🎉 Initial Release

#### ✨ Added
- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Role-based access control (Admin, Staff, Customer)
  - Secure password encryption with BCrypt
  - Email verification (optional)

- **Product Management**
  - CRUD operations for products
  - Product variants (color, size, stock)
  - Multiple image upload
  - Category and brand management
  - Product search and filtering
  - Inventory tracking

- **Shopping Cart**
  - Add/update/remove items
  - Real-time price calculation
  - Session persistence
  - Stock validation

- **Order Management**
  - Create orders from cart
  - Order status tracking (Pending → Confirmed → Packing → Shipping → Completed)
  - Order cancellation with automatic refund
  - Admin order processing
  - Loyalty points earning and redemption

- **Payment Integration**
  - VNPay payment gateway
  - MoMo e-wallet
  - ZaloPay e-wallet
  - Cash on Delivery (COD)
  - Payment status synchronization
  - Automatic refund marking

- **Refund System**
  - Automatic refund for cancelled paid orders
  - Admin manual refund processing
  - Inventory restoration on refund
  - Loyalty points refund
  - Payment status update

- **Coupon System**
  - Percentage and fixed amount discounts
  - Minimum order value requirement
  - Maximum discount cap
  - Usage limit per coupon
  - Time-based activation

- **User Management**
  - Customer registration and profile
  - Admin user management
  - Role assignment
  - Profile update
  - Password change

- **Reviews & Ratings**
  - 5-star rating system
  - Text reviews with title
  - Edit own reviews
  - Admin approval (optional)

- **Admin Dashboard**
  - Sales statistics
  - Revenue charts
  - Order metrics
  - Top products
  - Recent activities

- **System Monitoring**
  - Real-time system health
  - RAM and Disk usage
  - CPU metrics
  - Database statistics
  - Active users tracking
  - Auto-refresh every 30 seconds

- **Audit Logs**
  - Comprehensive activity tracking
  - User action logging
  - Entity change tracking
  - IP address and user agent capture
  - Filterable log viewer

- **AI Chatbot**
  - 24/7 customer support
  - Product recommendations
  - Order tracking assistance
  - FAQ responses

#### 🔧 Technical Features
- Spring Boot 3.x framework
- MySQL database with JPA
- Thymeleaf template engine
- Bootstrap 5 responsive UI
- RESTful API architecture
- Database migration with Flyway
- Comprehensive error handling
- Input validation
- CORS configuration
- Rate limiting
- XSS protection

#### 📚 Documentation
- Comprehensive README
- API documentation
- Setup guide
- User guide
- Contributing guidelines
- Payment integration guide
- Refund system guide
- System monitoring guide

#### 🛡️ Security
- JWT token authentication
- BCrypt password hashing
- CSRF protection
- XSS prevention
- Role-based access control
- Secure payment handling
- Audit logging

#### 🎨 UI/UX
- Responsive design (mobile-friendly)
- Professional admin panel
- User-friendly shopping interface
- Smooth animations and transitions
- Loading states and spinners
- Toast notifications
- Modal dialogs

---

## [Unreleased]

### 🚀 Planned Features
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Product comparison
- [ ] Wishlist functionality
- [ ] Advanced search filters
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Social media login (Google, Facebook)
- [ ] Advanced analytics dashboard
- [ ] Inventory forecasting
- [ ] Customer segmentation
- [ ] Marketing automation

### 🔄 Improvements in Progress
- [ ] Performance optimization
- [ ] Database indexing
- [ ] Caching implementation (Redis)
- [ ] API rate limiting enhancements
- [ ] Search engine optimization (SEO)
- [ ] Accessibility improvements (WCAG)

---

## Version History

### [1.0.0] - 2025-11-24
- Initial production release
- Full e-commerce functionality
- Payment gateway integration
- Admin panel with monitoring
- Comprehensive documentation

---

## Migration Notes

### From 0.x to 1.0.0
Not applicable - first production release.

---

## Breaking Changes

None in this release.

---

## Contributors

- Development Team
- QA Team
- UI/UX Designers

---

**Format**: [Version] - Date
**Types**: Added, Changed, Deprecated, Removed, Fixed, Security

*Last Updated: November 24, 2025*

