# TAI LIEU GIAI THICH NGHIEP VU BACKEND - FASHION E-COMMERCE

## MUC LUC

1. Tong quan kien truc
2. He thong xac thuc va phan quyen
3. Quan ly san pham
4. Quan ly gio hang
5. Quan ly don hang
6. He thong thanh toan
7. He thong diem thuong
8. AI Chatbot
9. Audit Log va giam sat

---

## 1. TONG QUAN KIEN TRUC

### 1.1 Cong nghe su dung

Backend:
- Java 25 voi Spring Boot 3.x
- Spring Security cho xac thuc va phan quyen
- Spring Data JPA lam ORM
- MariaDB hoac MySQL lam co so du lieu
- Redis lam cache
- JWT cho xac thuc token

### 1.2 Cau truc package

fit.iuh.edu.fashion
├── config          Cau hinh ung dung
├── controllers     REST API endpoints
├── dto             Data Transfer Objects
│   ├── request     Dto nhan du lieu tu client
│   └── response    Dto tra ve cho client
├── exception       Xu ly ngoai le
├── models          Entity JPA
├── repositories    Truy van database
├── security        Xac thuc JWT
├── services        Logic nghiep vu
└── utils           Cac tien ich

### 1.3 Luong xu ly request

1. Request tu client den
2. Di qua RateLimitFilter kiem tra gioi han
3. Di qua JwtAuthenticationFilter kiem tra token
4. Den Controller tuong ung
5. Controller goi Service xu ly nghiep vu
6. Service goi Repository truy van DB
7. Ket qua tra ve qua cac lop nguoc lai

---

## 2. HE THONG XAC THUC VA PHAN QUYEN

### 2.1 Cau hinh bao mat (SecurityConfig.java)

Muc dich: Cau hinh Spring Security cho toan bo ung dung

Cac thanh phan chinh:

a) PasswordEncoder:
- Su dung BCryptPasswordEncoder
- Ma hoa mat khau truoc khi luu vao database
- Do manh 10 rounds mac dinh

b) AuthenticationProvider:
- Su dung DaoAuthenticationProvider
- Ket noi voi CustomUserDetailsService
- Kiem tra mat khau voi PasswordEncoder

c) SecurityFilterChain:
- Tat CSRF vi su dung JWT
- Cau hinh CORS cho phep frontend truy cap
- Dinh nghia cac endpoint public va protected

Cac endpoint public khong can dang nhap:
- /api/auth/** - Dang nhap dang ky
- /api/products/** GET - Xem san pham
- /api/categories/** GET - Xem danh muc
- /api/brands/** GET - Xem thuong hieu
- /payment/** - Callback thanh toan
- /ai-chatbot - Tro chuyen AI

Cac endpoint can quyen CUSTOMER:
- /api/cart/** - Quan ly gio hang
- /api/orders/my/** - Don hang ca nhan
- POST /api/orders - Tao don hang

Cac endpoint can quyen STAFF_PRODUCT:
- POST PUT DELETE /api/products/**
- POST PUT DELETE /api/categories/**
- POST PUT DELETE /api/brands/**

Cac endpoint can quyen STAFF_SALES:
- /api/orders/** - Quan ly tat ca don hang

Cac endpoint can quyen ADMIN:
- /api/admin/** - Quan tri he thong
- /api/users/** - Quan ly nguoi dung

### 2.2 JWT Token Provider (JwtTokenProvider.java)

Muc dich: Tao va xac thuc JWT token

Cac phuong thuc chinh:

a) generateAccessToken(email):
- Tao access token tu email
- Thoi han 24 gio (cau hinh trong properties)
- Ky bang HMAC SHA256

b) generateRefreshToken(email):
- Tao refresh token tu email
- Thoi han 7 ngay
- Dung de lay access token moi khi het han

c) extractUsername(token):
- Giai ma token lay email nguoi dung

d) validateToken(token):
- Kiem tra token hop le
- Kiem tra chua het han
- Kiem tra chu ky dung

### 2.3 JWT Authentication Filter (JwtAuthenticationFilter.java)

Muc dich: Filter kiem tra JWT tren moi request

Luong xu ly:

1. Lay header Authorization tu request
2. Kiem tra co bat dau bang Bearer khong
3. Tach lay token tu header
4. Goi validateToken kiem tra
5. Neu hop le lay email tu token
6. Load UserDetails tu database
7. Tao Authentication object
8. Dat vao SecurityContext

### 2.4 Auth Service (AuthService.java)

Muc dich: Xu ly nghiep vu dang nhap dang ky

a) Dang nhap login():

Buoc 1: Nhan LoginRequest gom email va password
Buoc 2: Goi AuthenticationManager xac thuc
Buoc 3: Neu thanh cong tao access va refresh token
Buoc 4: Luu refresh token vao database
Buoc 5: Cap nhat lastLoginAt cua user
Buoc 6: Ghi audit log
Buoc 7: Tra ve AuthResponse gom token va thong tin user

Xu ly loi:
- Sai mat khau nem BadCredentialsException
- User khong ton tai nem RuntimeException
- Ghi audit log that bai

b) Dang ky register():

Buoc 1: Nhan RegisterRequest gom email password fullName phone
Buoc 2: Kiem tra email da ton tai chua
Buoc 3: Kiem tra phone da ton tai chua
Buoc 4: Ma hoa password bang BCrypt
Buoc 5: Tao User moi voi role CUSTOMER
Buoc 6: Tao CustomerProfile voi loyaltyPoint = 0
Buoc 7: Tao Cart rong cho user
Buoc 8: Tao token va tra ve

c) Lam moi token refreshToken():

Buoc 1: Nhan refresh token tu client
Buoc 2: Validate token
Buoc 3: Kiem tra token co trong database khong
Buoc 4: Kiem tra chua het han
Buoc 5: Tao cap token moi
Buoc 6: Xoa token cu luu token moi
Buoc 7: Tra ve token moi

d) Quen mat khau forgotPassword():

Buoc 1: Nhan email tu client
Buoc 2: Tim user theo email
Buoc 3: Tao PasswordResetToken random
Buoc 4: Luu token vao database het han 1 gio
Buoc 5: Gui email chua link reset

e) Dat lai mat khau resetPassword():

Buoc 1: Nhan token va password moi
Buoc 2: Tim PasswordResetToken trong database
Buoc 3: Kiem tra chua het han
Buoc 4: Ma hoa password moi
Buoc 5: Cap nhat user
Buoc 6: Xoa token da dung

### 2.5 He thong vai tro RBAC

Cac vai tro trong he thong:

ADMIN:
- Toan quyen quan tri
- Quan ly nguoi dung
- Xem audit log
- Giam sat he thong

STAFF_PRODUCT:
- Quan ly san pham
- Quan ly danh muc
- Quan ly thuong hieu
- Quan ly mau sac kich thuoc

STAFF_SALES:
- Quan ly don hang
- Cap nhat trang thai don
- Xu ly hoan tien

CUSTOMER:
- Xem san pham
- Quan ly gio hang
- Dat hang
- Xem don hang ca nhan
- Danh gia san pham

---

## 3. QUAN LY SAN PHAM

### 3.1 Mo hinh du lieu san pham

Product (San pham):
- Thong tin chung: ten, mo ta, chat lieu, xuat xu
- Trang thai isActive
- Lien ket thuong hieu brand
- Lien ket nhieu danh muc categories

ProductVariant (Bien the):
- La to hop cua san pham + mau + size
- Co SKU rieng biet
- Co gia rieng
- Co ton kho rieng stock
- Mot san pham co nhieu bien the

ProductImage (Hinh anh):
- Lien ket san pham hoac bien the
- URL hinh anh
- Thu tu sap xep sortOrder

### 3.2 Product Service (ProductService.java)

a) Lay danh sach san pham getAllProducts():

- Nhan Pageable de phan trang
- Goi repository.findAll()
- Map sang ProductResponse
- Khong cache vi Page khong serialize duoc

b) Lay san pham theo ID getProductById():

- Co cache voi key "products::id_X"
- Goi repository.findById()
- Nem exception neu khong tim thay
- Map sang ProductResponse

c) Lay san pham theo slug getProductBySlug():

- Co cache voi key "products::slug_X"
- Dung cho URL than thien

d) Tim kiem san pham searchProducts():

- Tim theo keyword trong ten va mo ta
- Ho tro phan trang

e) Tao san pham createProduct():

- Yeu cau quyen ADMIN hoac STAFF_PRODUCT
- Nhan ProductRequest tu client
- Tao entity Product
- Gan brand neu co brandId
- Gan categories neu co categoryIds
- Luu vao database
- Xoa cache products
- Ghi audit log
- Tra ve ProductResponse

f) Cap nhat san pham updateProduct():

- Tuong tu tao moi nhung update entity co san
- Ghi audit log voi gia tri cu va moi

g) Xoa san pham deleteProduct():

- Soft delete bang cach dat isActive = false
- Khong xoa that du lieu
- Ghi audit log

h) Kiem tra ton kho checkStock():

- Nhan variantId va quantity can mua
- Kiem tra variant con active khong
- Kiem tra stock du khong
- Tra ve StockCheckResponse voi thong bao phu hop

i) Cap nhat trang thai ton kho checkAndUpdateStockStatus():

- Duoc goi sau khi ban hang
- Neu stock = 0 thi tu dong dat isActive = false
- Dam bao san pham het hang khong hien thi

### 3.3 Product Variant Service (ProductVariantService.java)

a) Lay bien the theo san pham getVariantsByProduct():

- Tra ve danh sach bien the cua mot san pham
- Bao gom thong tin mau size gia stock

b) Tao bien the createVariant():

- Nhan productId va thong tin bien the
- Sinh SKU tu dong neu khong co
- Kiem tra SKU duy nhat
- Lien ket color va size
- Luu vao database

c) Cap nhat ton kho updateStock():

- Yeu cau quyen ADMIN hoac STAFF_PRODUCT
- Cap nhat so luong stock
- Tao InventoryMovement ghi lai thay doi

### 3.4 Quan ly hinh anh (ProductImageService.java)

a) Upload hinh anh uploadImage():

- Nhan file tu client
- Kiem tra dinh dang jpg png webp
- Kiem tra kich thuoc toi da 10MB
- Sinh ten file duy nhat bang UUID
- Luu vao thu muc static/image_product
- Tao entity ProductImage
- Tra ve URL truy cap

b) Xoa hinh anh deleteImage():

- Tim hinh theo ID
- Xoa file vat ly
- Xoa record trong database

---

## 4. QUAN LY GIO HANG

### 4.1 Mo hinh du lieu

Cart:
- Moi user co duy nhat mot cart
- Duoc tao tu dong khi dang ky
- Chua danh sach CartItem

CartItem:
- Lien ket cart va variant
- Luu so luong quantity
- Bi xoa khi dat hang thanh cong

### 4.2 Cart Service (CartService.java)

a) Lay gio hang getCart():

- Nhan userId tu token
- Tim cart theo user
- Neu chua co thi tao moi
- Map sang CartResponse
- Tinh subtotal va grandTotal

b) Them vao gio addToCart():

Buoc 1: Tim user va cart
Buoc 2: Tim variant theo variantId
Buoc 3: Kiem tra stock du so luong can them
Buoc 4: Kiem tra variant da co trong gio chua
Buoc 5a: Neu da co tang quantity
Buoc 5b: Neu chua co tao CartItem moi
Buoc 6: Luu va tra ve CartResponse

Xu ly loi:
- Variant khong ton tai nem exception
- Khong du stock nem exception

c) Cap nhat so luong updateCartItem():

Buoc 1: Tim cart cua user
Buoc 2: Tim CartItem theo itemId
Buoc 3: Kiem tra item thuoc cart cua user
Buoc 4: Kiem tra stock du quantity moi
Buoc 5: Cap nhat quantity
Buoc 6: Tra ve CartResponse

d) Xoa khoi gio removeCartItem():

- Tim va xoa CartItem
- Kiem tra quyen so huu truoc khi xoa

e) Xoa toan bo gio clearCart():

- Xoa tat ca CartItem cua user
- Duoc goi sau khi dat hang thanh cong

f) Lay items de dat hang getCartItemsForOrder():

- Chuyen CartItem sang OrderItemRequest
- Dung khi tao don hang

### 4.3 Cart Response

Cau truc CartResponse tra ve:
- id: ID gio hang
- items: Danh sach CartItemResponse
- subtotal: Tong tien hang
- discountTotal: Tong giam gia
- grandTotal: Tong thanh toan
- totalItems: Tong so luong san pham

CartItemResponse bao gom:
- variant: Thong tin bien the
- productName: Ten san pham
- colorName sizeName: Thuoc tinh
- imageUrl: Hinh anh
- quantity: So luong
- unitPrice: Don gia
- lineTotal: Thanh tien
- availableStock: Ton kho hien tai
- outOfStock: Het hang chua
- insufficientStock: Thieu hang chua

---

## 5. QUAN LY DON HANG

### 5.1 Mo hinh du lieu

Order:
- code: Ma don hang duy nhat tu sinh
- customer: Khach dat hang
- status: Trang thai don
- Cac truong tien: subtotal discountTotal shippingFee grandTotal
- Thong tin giao hang: shipName shipPhone shipLine1...
- Thong tin thanh toan: paymentMethod paymentStatus
- Diem thuong: loyaltyPointsUsed loyaltyPointsEarned

OrderItem:
- Lien ket order va variant
- Luu snapshot thong tin: sku productName colorName sizeName
- quantity unitPrice lineTotal

Trang thai don hang OrderStatus:
- PENDING: Cho xu ly
- CONFIRMED: Da xac nhan
- PACKING: Dang dong goi
- SHIPPING: Dang giao
- COMPLETED: Hoan thanh
- CANCELLED: Da huy
- REFUNDED: Da hoan tien

Trang thai thanh toan PaymentStatus:
- UNPAID: Chua thanh toan
- PAID: Da thanh toan
- REFUNDED: Da hoan tien
- FAILED: That bai

### 5.2 Order Service (OrderService.java)

a) Tao don hang createOrder():

Buoc 1: Tim user tu userId
Buoc 2: Tao Order moi voi trang thai PENDING
Buoc 3: Gan thong tin giao hang tu request
Buoc 4: Vong lap xu ly tung item:
   4a: Tim variant voi pessimistic lock tranh race condition
   4b: Goi decreaseStock giam ton kho atomic
   4c: Neu khong du stock nem exception
   4d: Tao OrderItem voi snapshot thong tin
   4e: Cong vao subtotal
   4f: Goi checkAndUpdateStockStatus

Buoc 5: Ap dung coupon neu co:
   5a: Tim coupon con hieu luc
   5b: Kiem tra don dat minOrderAmount
   5c: Tinh discount theo PERCENT hoac FIXED
   5d: Ap dung maxDiscount neu vuot
   5e: Tang usedCount cua coupon

Buoc 6: Ap dung diem thuong neu co:
   6a: Lay CustomerProfile
   6b: Tinh diem co the dung (1 diem = 1000 VND)
   6c: Tru diem khoi tai khoan
   6d: Luu loyaltyPointsUsed

Buoc 7: Tinh toan cuoi:
   7a: grandTotal = subtotal - discount - loyaltyDiscount + shipping
   7b: Tinh diem tich luy = 1% grandTotal
   7c: Luu loyaltyPointsEarned

Buoc 8: Luu Order
Buoc 9: Tao Payment record cho COD
Buoc 10: Tao InventoryMovement cho moi item
Buoc 11: Xoa gio hang cua user
Buoc 12: Ghi audit log
Buoc 13: Tra ve OrderResponse

Xu ly dong thoi:
- Su dung findByIdWithLock lay variant voi FOR UPDATE
- decreaseStock la UPDATE ... WHERE stock >= quantity
- Neu rowsAffected = 0 nghia la khong du hang
- Dam bao khong ban vuot so luong

b) Cap nhat trang thai don updateOrderStatus():

Chuyen sang COMPLETED:
- Cap nhat paymentStatus = PAID neu chua
- Cap nhat paymentTime
- Cong diem tich luy cho khach

Chuyen sang CANCELLED hoac REFUNDED:
- Goi restoreOrderStock hoan lai ton kho
- Cap nhat paymentStatus tuong ung
- Hoan lai diem da su dung
- Tru diem da tich luy neu tu COMPLETED

c) Huy don hang cancelOrder():

Buoc 1: Tim don theo ID
Buoc 2: Kiem tra don thuoc user dang dang nhap
Buoc 3: Kiem tra trang thai cho phep huy (chi PENDING hoac CONFIRMED)
Buoc 4: Goi updateOrderStatus(CANCELLED)

d) Xu ly hoan tien processRefund():

- Yeu cau quyen ADMIN hoac STAFF_SALES
- Kiem tra don da thanh toan
- Cap nhat trang thai REFUNDED
- Hoan lai ton kho
- Hoan lai diem thuong
- Ghi audit log

e) Doi phuong thuc thanh toan updatePaymentMethod():

- Chi cho phep voi don PENDING hoac CONFIRMED
- Chi cho phep khi chua thanh toan
- Cap nhat paymentMethod
- Huy Payment record cu neu co
- Tao Payment record moi

### 5.3 Sinh ma don hang

generateOrderCode():
- Format: ORDyyyyMMddHHmmssSSS + 3 so random
- Vi du: ORD20241210143052123456
- Dam bao duy nhat bang timestamp + random

---

## 6. HE THONG THANH TOAN

### 6.1 VNPay Service (VNPayService.java)

a) Tao URL thanh toan createPaymentUrl():

Buoc 1: Lay cau hinh tu VNPayConfig
Buoc 2: Chuan bi cac tham so:
   - vnp_Version: 2.1.0
   - vnp_Command: pay
   - vnp_TmnCode: Ma website
   - vnp_Amount: So tien nhan 100
   - vnp_TxnRef: Ma don hang
   - vnp_OrderInfo: Thong tin don
   - vnp_ReturnUrl: URL callback
   - vnp_IpAddr: IP khach hang
   - vnp_CreateDate: Thoi gian tao
   - vnp_ExpireDate: Het han 15 phut

Buoc 3: Sap xep tham so theo alphabet
Buoc 4: Tao hashData tu cac tham so
Buoc 5: Ky bang HMAC SHA512 voi hashSecret
Buoc 6: Ghep thanh URL day du
Buoc 7: Tra ve URL de redirect

b) Xu ly callback processCallback():

Buoc 1: Lay vnp_SecureHash tu params
Buoc 2: Tinh lai hash tu cac tham so
Buoc 3: So sanh 2 hash
Buoc 4: Neu khop thi:
   4a: Lay orderCode tu vnp_TxnRef
   4b: Tim Order theo code
   4c: Neu vnp_ResponseCode = 00 thanh cong
   4d: Cap nhat paymentStatus = PAID
   4e: Cap nhat status = CONFIRMED
   4f: Luu transactionId
Buoc 5: Neu khong khop tra ve loi

c) Xu ly IPN processIpn():

- Tuong tu callback nhung tu VNPay server goi
- Phai tra ve dung format RspCode va Message
- Kiem tra amount khop voi don hang
- Kiem tra don chua duoc xu ly (idempotent)

### 6.2 Payment Service (PaymentService.java)

a) Tao payment COD createCODPayment():

- Tao Payment voi status PENDING
- paymentMethod = COD
- amount = grandTotal cua don

b) Cap nhat trang thai updatePaymentStatus():

- Tim Payment theo ID
- Cap nhat status moi
- Neu COMPLETED cap nhat completedAt

c) Lay payment theo don getPaymentsByOrder():

- Tra ve danh sach Payment cua don
- Mot don co the co nhieu Payment (khi doi phuong thuc)

### 6.3 Luong thanh toan COD

1. Khach dat hang chon COD
2. He thong tao Order va Payment PENDING
3. Admin xac nhan don chuyen CONFIRMED
4. Nhan vien dong goi chuyen PACKING
5. Giao hang chuyen SHIPPING
6. Giao thanh cong thu tien chuyen COMPLETED
7. Payment tu dong chuyen COMPLETED

### 6.4 Luong thanh toan VNPay

1. Khach dat hang chon VNPay
2. He thong tao Order PENDING
3. He thong tao URL VNPay
4. Redirect khach sang VNPay
5. Khach nhap thong tin the
6. VNPay xu ly giao dich
7. VNPay redirect ve callback URL
8. He thong xac thuc chu ky
9. Neu thanh cong:
   - Order chuyen CONFIRMED
   - paymentStatus chuyen PAID
   - Luu transactionId
10. Redirect khach ve trang thanh cong

---

## 7. HE THONG DIEM THUONG

### 7.1 Quy tac tich diem

- Moi don hang duoc tich 1% gia tri grandTotal
- Vi du don 1.000.000 VND duoc 10 diem
- Diem chi duoc cong khi don COMPLETED
- Diem luu trong CustomerProfile.loyaltyPoint

### 7.2 Quy tac su dung diem

- 1 diem = 1.000 VND giam gia
- Khach nhap so diem muon dung khi checkout
- He thong kiem tra diem kha dung
- Tru diem ngay khi dat hang
- Neu huy don diem duoc hoan lai

### 7.3 Xu ly trong OrderService

Khi tao don:
- Lay availablePoints tu CustomerProfile
- pointsUsed = min(requested, available)
- loyaltyDiscount = pointsUsed * 1000
- Tru diem khoi tai khoan ngay

Khi hoan thanh don:
- Cong loyaltyPointsEarned vao tai khoan

Khi huy don:
- Hoan lai loyaltyPointsUsed
- Tru loyaltyPointsEarned neu da cong

---

## 8. AI CHATBOT

### 8.1 Cau hinh AI (AiConfiguration.java)

- Su dung Spring AI voi OpenAI compatible API
- Ket noi LM Studio chay local
- Model mặc định: lmstudio-community/qwen3.5-2b
- Temperature: 0.35
- Max tokens: 2048

### 8.2 AI Assistant Service (AiAssistantService.java)

a) Phan tich y dinh nguoi dung:

- Su dung UserIntentAnalyzer
- Phan loai thanh cac loai:
  - PRODUCT_SEARCH: Tim kiem san pham
  - PRODUCT_RECOMMENDATION: Goi y san pham
  - PRODUCT_COMPARE: So sanh san pham
  - INFORMATION_QUERY: Hoi thong tin
  - GENERAL_CHAT: Tro chuyen chung

b) Tim kiem san pham thong minh:

- Phan tich cau hoi lay productType category brand
- Tim san pham phu hop trong database
- Tra ve ket qua kem goi y tu AI

c) Contract API mới:

- POST /api/ai/chat nhận JSON: message, conversationId, stream, pageContext
- Response trả messageId, conversationId, intent, answer, sources, products, actions, model, latencyMs
- GET /api/ai/chat/stream phát SSE event: meta, chunk, error, done
- Dashboard vận hành: /api/ai/admin/dashboard

### 8.3 Catalog Cache Service

- Cache du lieu catalog (categories, brands, sizes, colors)
- Tao system prompt tu du lieu catalog
- Giup AI hieu context san pham

---

## 9. AUDIT LOG VA GIAM SAT

### 9.1 Audit Service (AuditService.java)

a) Ghi log hanh dong logAction():

- entityType: Loai doi tuong (User, Product, Order...)
- action: Hanh dong (CREATE, UPDATE, DELETE, LOGIN...)
- entityId: ID doi tuong
- oldValue: Gia tri cu
- newValue: Gia tri moi
- Lay userId va username tu SecurityContext
- Lay IP va UserAgent tu request

b) Ghi log that bai logFailedAction():

- Ghi lai cac hanh dong that bai
- status = FAILED
- Luu errorMessage

### 9.2 System Monitor Service (SystemMonitorService.java)

Thu thap thong tin he thong:
- CPU usage
- Memory usage (heap va non-heap)
- Disk usage
- Database connections
- Uptime

Tra ve SystemHealthResponse cho dashboard admin

### 9.3 Rate Limit Filter (RateLimitFilter.java)

- Gioi han so request moi IP
- Tranh tan cong DDoS
- Cau hinh so request va thoi gian

---

## 10. XU LY NGOAI LE

### 10.1 Global Exception Handler

Cac loai exception:

ResourceNotFoundException:
- HTTP 404
- Khi khong tim thay tai nguyen

DuplicateResourceException:
- HTTP 409
- Khi trung du lieu duy nhat

BusinessException:
- HTTP 400
- Loi nghiep vu chung

InsufficientStockException:
- HTTP 400
- Khi khong du ton kho

### 10.2 Error Response

Cau truc ErrorResponse:
- timestamp: Thoi gian loi
- status: Ma HTTP
- error: Ten loi
- message: Thong bao chi tiet
- path: Duong dan request

---

## 11. CACHE

### 11.1 Cau hinh Redis (CacheConfig.java)

- Su dung Redis lam cache store
- TTL mac dinh 1 gio
- Khong cache gia tri null

### 11.2 Cac loai cache

products: Cache thong tin san pham
- Key: id_X hoac slug_X
- Evict khi tao sua xoa san pham

aiResponses: Cache phan hoi AI
- Key: message + systemPrompt
- Tranh goi AI lap lai

catalogData: Cache du lieu catalog
- Categories, brands, sizes, colors
- Dung cho AI context

### 11.3 Cache Eviction

- Su dung @CacheEvict khi thay doi du lieu
- allEntries = true xoa toan bo cache
- Dam bao du lieu nhat quan

---

Ket thuc tai lieu. Cap nhat ngay 10/12/2024.

