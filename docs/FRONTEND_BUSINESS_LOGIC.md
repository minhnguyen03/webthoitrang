# TAI LIEU GIAI THICH NGHIEP VU FRONTEND - FASHION E-COMMERCE

## MUC LUC

1. Tong quan kien truc Frontend
2. Quan ly xac thuc phia client
3. Trang chu va hien thi san pham
4. Chi tiet san pham
5. Gio hang
6. Dat hang va thanh toan
7. Quan ly don hang
8. Trang quan tri Admin
9. AI Chatbot
10. Cac component dung chung

---

## 1. TONG QUAN KIEN TRUC FRONTEND

### 1.1 Cong nghe su dung

- Thymeleaf: Template engine render HTML phia server
- Bootstrap 5: Framework CSS responsive
- JavaScript ES6: Xu ly tuong tac phia client
- AJAX Fetch API: Goi REST API bat dong bo
- Bootstrap Icons: Thu vien icon
- LocalStorage: Luu token va thong tin user

### 1.2 Cau truc thu muc templates

templates/
├── index.html              Trang chu
├── dashboard.html          Dashboard tong quan
├── cart.html               Gio hang
├── profile.html            Thong tin ca nhan
├── ai-chatbot.html         Tro chuyen AI
├── auth/
│   ├── login.html          Dang nhap
│   ├── register.html       Dang ky
│   ├── forgot-password.html Quen mat khau
│   └── reset-password.html  Dat lai mat khau
├── products/
│   ├── list.html           Danh sach san pham
│   ├── list-modern.html    Danh sach hien dai
│   └── detail.html         Chi tiet san pham
├── orders/
│   └── list.html           Danh sach don hang
├── payment/
│   ├── success.html        Thanh toan thanh cong
│   ├── failed.html         Thanh toan that bai
│   ├── error.html          Loi thanh toan
│   └── redirect.html       Chuyen huong thanh toan
├── admin/
│   ├── products.html       Quan ly san pham
│   ├── categories.html     Quan ly danh muc
│   ├── brands.html         Quan ly thuong hieu
│   ├── orders.html         Quan ly don hang
│   ├── payments.html       Quan ly thanh toan
│   ├── users.html          Quan ly nguoi dung
│   ├── coupons.html        Quan ly ma giam gia
│   ├── audit-logs.html     Nhat ky hoat dong
│   └── system-monitor.html Giam sat he thong
└── fragments/
    └── navbar.html         Thanh dieu huong dung chung

### 1.3 Cau truc thu muc static

static/
├── css/
│   ├── style.css           Style chung toan ung dung
│   ├── navbar.css          Style thanh dieu huong
│   ├── admin-sidebar.css   Style sidebar admin
│   ├── ai-chatbot-enhanced.css Style chatbot
│   └── product-search.css  Style tim kiem san pham
├── js/
│   └── auth.js             Xu ly xac thuc
└── image_product/          Hinh anh san pham upload

### 1.4 Nguyen tac thiet ke

a) Server Side Rendering voi Thymeleaf:
- HTML duoc render o server truoc khi gui ve client
- Su dung th:each de lap danh sach
- Su dung th:if th:unless de hien thi co dieu kien
- Su dung th:href th:src de gan duong dan dong

b) Client Side Interaction voi JavaScript:
- Goi API bang Fetch de lay du lieu
- Cap nhat DOM dong khi co ket qua
- Xu ly form submit bang AJAX
- Hien thi thong bao bang alert hoac toast

c) Responsive Design voi Bootstrap:
- Su dung grid system col-md col-lg
- Su dung d-none d-md-block an hien theo man hinh
- Su dung navbar-expand-lg cho menu responsive

---

## 2. QUAN LY XAC THUC PHIA CLIENT

### 2.1 Luu tru token (auth.js va cac trang)

Luu vao LocalStorage:
- accessToken: JWT access token
- refreshToken: JWT refresh token
- user: Thong tin nguoi dung dang JSON

Ham luu token saveTokens(authResponse):
- Lay accessToken refreshToken user tu response
- Luu vao localStorage
- Cap nhat giao dien nguoi dung

Ham lay token getAccessToken():
- Doc tu localStorage
- Tra ve token hoac null

Ham xoa token clearTokens():
- Xoa accessToken refreshToken user
- Redirect ve trang login

### 2.2 Kiem tra dang nhap

Ham isLoggedIn():
- Kiem tra co accessToken trong localStorage khong
- Tra ve true hoac false

Ham getCurrentUser():
- Doc user tu localStorage
- Parse JSON va tra ve object

Ham hasRole(role):
- Lay user hien tai
- Kiem tra roles co chua role can thiet khong
- Dung de hien thi menu theo quyen

### 2.3 Gui request co xac thuc

Ham authenticatedFetch(url, options):
- Lay accessToken tu localStorage
- Them header Authorization: Bearer token
- Goi fetch voi options da bo sung
- Neu 401 thi goi refreshToken
- Neu refresh thanh cong thi retry request
- Neu refresh that bai thi logout

Ham refreshAccessToken():
- Goi POST /api/auth/refresh voi refreshToken
- Neu thanh cong luu token moi
- Neu that bai xoa token va redirect login

### 2.4 Trang dang nhap (login.html)

Cau truc giao dien:
- Form voi email va password
- Nut hien mat khau
- Link quen mat khau
- Link dang ky

Xu ly form submit:
1. Ngan chan submit mac dinh
2. Lay gia tri email va password
3. Validate co trong khong
4. Goi POST /api/auth/login
5. Neu thanh cong luu token va redirect
6. Neu that bai hien thong bao loi

Redirect sau dang nhap:
- Neu la ADMIN hoac STAFF redirect ve /dashboard
- Neu la CUSTOMER redirect ve trang truoc do hoac /

### 2.5 Trang dang ky (register.html)

Cau truc giao dien:
- Form voi fullName email phone password confirmPassword
- Validation phia client
- Link quay ve dang nhap

Xu ly form submit:
1. Validate tat ca truong bat buoc
2. Kiem tra password va confirmPassword khop
3. Kiem tra do dai password toi thieu 6 ky tu
4. Goi POST /api/auth/register
5. Neu thanh cong tu dong dang nhap
6. Neu that bai hien loi (email da ton tai...)

### 2.6 Quen mat khau (forgot-password.html)

Luong xu ly:
1. Nguoi dung nhap email
2. Goi POST /api/auth/forgot-password
3. Hien thong bao da gui email
4. Nguoi dung nhan link trong email
5. Redirect ve reset-password.html voi token

### 2.7 Dat lai mat khau (reset-password.html)

Luong xu ly:
1. Lay token tu URL query string
2. Nguoi dung nhap password moi va xac nhan
3. Goi POST /api/auth/reset-password voi token va password
4. Neu thanh cong redirect ve login
5. Neu token het han hien thong bao

---

## 3. TRANG CHU VA HIEN THI SAN PHAM

### 3.1 Trang chu (index.html)

Cac thanh phan chinh:

a) Hero Banner:
- Hinh anh lon gioi thieu thuong hieu
- Tieu de va mo ta ngan
- Nut CTA Mua sam ngay va Kham pha

b) Phan danh muc noi bat:
- Hien thi cac danh muc chinh
- Moi danh muc co hinh anh va ten
- Click chuyen sang trang san pham theo danh muc

c) San pham noi bat:
- Lay tu API /api/products?size=8
- Hien thi dang grid 4 cot
- Moi san pham la card voi hinh ten gia
- Co badge New hoac Sale

d) Footer:
- Thong tin lien he
- Link nhanh
- Mang xa hoi

### 3.2 Danh sach san pham (products/list.html)

Cac thanh phan:

a) Thanh loc va tim kiem:
- Input tim kiem theo ten
- Dropdown chon danh muc
- Dropdown chon thuong hieu
- Dropdown sap xep gia cao thap moi nhat
- Nut loc

b) Luoi san pham:
- Hien thi dang grid responsive
- 4 cot tren desktop 2 cot tren mobile
- Moi san pham la ProductCard

c) Phan trang:
- Hien thi so trang
- Nut Previous Next
- Thong tin tong so san pham

Xu ly JavaScript:

Ham loadProducts(page, filters):
1. Xay dung query string tu filters
2. Goi GET /api/products?page=X&size=20&...
3. Render danh sach san pham
4. Cap nhat phan trang

Ham renderProduct(product):
- Tao HTML cho ProductCard
- Hien thi hinh anh dau tien
- Hien thi ten va gia
- Tinh gia thap nhat tu variants
- Them link chi tiet

Ham applyFilters():
- Lay gia tri tu cac input filter
- Reset ve trang 1
- Goi loadProducts

### 3.3 ProductCard Component

Cau truc HTML:
- Div boc ngoai voi class card
- Hinh anh san pham phan tren
- Body chua ten gia nut
- Badge giam gia neu co compareAtPrice

Thong tin hien thi:
- Hinh anh dau tien hoac placeholder
- Ten thuong hieu (nho)
- Ten san pham (dam)
- Gia thap nhat tu cac variant
- Gia goc neu co giam gia
- Nut Xem chi tiet

---

## 4. CHI TIET SAN PHAM (products/detail.html)

### 4.1 Cau truc trang

a) Phan hinh anh:
- Hinh lon chinh giua
- Danh sach thumbnail phia duoi
- Click thumbnail doi hinh lon
- Ho tro zoom khi hover

b) Phan thong tin:
- Ten san pham
- Thuong hieu
- Danh gia sao trung binh
- Gia (thay doi theo variant chon)
- Mo ta ngan

c) Phan chon variant:
- Chon mau sac (hien mau thuc te)
- Chon kich thuoc
- Hien thi ton kho cua variant duoc chon
- Thong bao het hang neu stock = 0

d) Phan so luong va mua:
- Input so luong voi nut tang giam
- Nut Them vao gio
- Nut Mua ngay

e) Phan mo ta chi tiet:
- Tabs: Mo ta, Chat lieu, Huong dan
- Noi dung tuy theo san pham

f) Phan danh gia:
- Danh sach review cua khach
- Form viet danh gia (neu da mua)
- Chon so sao va noi dung

g) San pham lien quan:
- Lay san pham cung danh muc
- Hien thi 4 san pham

### 4.2 Xu ly JavaScript

Ham loadProduct(slugOrId):
1. Goi GET /api/products/slug/X hoac /api/products/X
2. Render thong tin san pham
3. Render danh sach hinh anh
4. Render cac tuy chon mau va size
5. Load danh gia

Ham selectColor(colorId):
- Danh dau mau duoc chon
- Loc danh sach size kha dung cho mau do
- Cap nhat hinh anh theo mau
- Cap nhat gia

Ham selectSize(sizeId):
- Danh dau size duoc chon
- Tim variant tuong ung (product + color + size)
- Cap nhat gia cua variant
- Cap nhat ton kho

Ham getSelectedVariant():
- Lay colorId va sizeId da chon
- Tim variant trong danh sach
- Tra ve variant hoac null

Ham updatePrice():
- Lay variant duoc chon
- Hien thi gia cua variant
- Neu co compareAtPrice hien gia goc

Ham checkStock():
1. Lay variant va quantity
2. Goi GET /api/products/variants/X/stock?quantity=Y
3. Neu du hien thong bao xanh
4. Neu thieu hien thong bao do
5. Vo hieu hoa nut them gio neu het hang

Ham addToCart():
1. Kiem tra da dang nhap chua
2. Lay variantId va quantity
3. Goi POST /api/cart/items
4. Neu thanh cong hien thong bao
5. Cap nhat so luong tren icon gio hang

Ham buyNow():
1. Goi addToCart
2. Neu thanh cong redirect ve /cart

### 4.3 Danh gia san pham

Ham loadReviews(productId):
1. Goi GET /api/product-reviews/product/X
2. Render danh sach review
3. Tinh va hien thi diem trung binh

Ham submitReview():
1. Kiem tra dang nhap
2. Lay rating va comment
3. Goi POST /api/product-reviews
4. Reload danh sach review

---

## 5. GIO HANG (cart.html)

### 5.1 Cau truc giao dien

a) Danh sach san pham trong gio:
- Moi item la mot row
- Hinh anh nho
- Ten san pham, mau, size
- Don gia
- Input so luong voi nut tang giam
- Thanh tien
- Nut xoa

b) Phan tom tat don hang:
- Input ma giam gia
- Nut ap dung coupon
- Phan diem tich luy (neu co)
- Tam tinh
- Giam gia
- Tong cong
- Nut Tien hanh dat hang

### 5.2 Xu ly JavaScript

Ham loadCart():
1. Kiem tra dang nhap
2. Goi GET /api/cart
3. Render danh sach items
4. Tinh toan va hien thi tong

Ham renderCartItem(item):
- Tao HTML cho item
- Hien thi thong tin variant
- Hien thi canh bao neu thieu hang
- Gan su kien cho cac nut

Ham updateQuantity(itemId, quantity):
1. Validate quantity > 0
2. Goi PUT /api/cart/items/X?quantity=Y
3. Reload gio hang
4. Hien thi thong bao

Ham removeItem(itemId):
1. Xac nhan xoa
2. Goi DELETE /api/cart/items/X
3. Reload gio hang

Ham applyCoupon():
1. Lay ma coupon tu input
2. Luu vao bien toan cuc
3. Tinh lai tong (goi API validate coupon)
4. Hien thi thong bao thanh cong hoac loi

Ham applyLoyaltyPoints():
1. Lay so diem muon dung
2. Kiem tra khong vuot qua diem kha dung
3. Tinh giam gia (1 diem = 1000 VND)
4. Cap nhat tong

Ham proceedToCheckout():
1. Kiem tra gio khong rong
2. Kiem tra khong co item het hang
3. Luu thong tin vao sessionStorage
4. Redirect ve buoc checkout

### 5.3 Hien thi diem tich luy

Ham loadLoyaltyPoints():
1. Goi GET /api/profile
2. Lay loyaltyPoints tu response
3. Hien thi so diem kha dung
4. Tinh gia tri quy doi ra VND

---

## 6. DAT HANG VA THANH TOAN

### 6.1 Form dat hang (trong cart.html)

Sau khi nhan Tien hanh dat hang:

Modal hoac phan mo rong hien thi:
- Form thong tin giao hang
- Chon phuong thuc thanh toan
- Xac nhan dat hang

Cac truong thong tin giao hang:
- Ho ten nguoi nhan (shipName)
- So dien thoai (shipPhone)
- Dia chi (shipLine1)
- Dia chi bo sung (shipLine2)
- Phuong xa (shipWard)
- Quan huyen (shipDistrict)
- Tinh thanh (shipCity)
- Ghi chu (note)

Phuong thuc thanh toan:
- COD: Thanh toan khi nhan hang
- VNPay: Thanh toan truc tuyen

### 6.2 Xu ly dat hang

Ham placeOrder():

Buoc 1: Thu thap du lieu
- Lay thong tin giao hang tu form
- Lay danh sach items tu gio hang
- Lay couponCode neu co
- Lay loyaltyPointsToUse neu co
- Lay paymentMethod

Buoc 2: Validate
- Kiem tra cac truong bat buoc
- Kiem tra so dien thoai hop le
- Kiem tra gio hang khong rong

Buoc 3: Tao request body
- items: mang variantId va quantity
- Thong tin giao hang
- couponCode
- loyaltyPointsToUse
- paymentMethod

Buoc 4: Goi API
- POST /api/orders voi body
- Cho response

Buoc 5: Xu ly thanh cong
- Neu COD: Redirect ve trang cam on
- Neu VNPay: Redirect sang cong thanh toan

Buoc 6: Xu ly loi
- Hien thi thong bao loi cu the
- Het hang, coupon het han...

### 6.3 Thanh toan VNPay

Luong xu ly:

1. Sau khi tao don thanh cong voi VNPay
2. Goi GET /api/payment/vnpay/create?orderId=X
3. Nhan URL thanh toan tu response
4. Redirect nguoi dung sang URL do
5. Nguoi dung thao tac tren VNPay
6. VNPay redirect ve /api/payment/vnpay/callback
7. Backend xu ly va redirect ve frontend

### 6.4 Trang ket qua thanh toan

success.html:
- Hien thi thong bao thanh cong
- Ma don hang
- Tong tien da thanh toan
- Nut xem don hang
- Nut tiep tuc mua sam

failed.html:
- Hien thi thong bao that bai
- Ly do (neu co)
- Nut thu lai
- Nut quay ve gio hang

error.html:
- Hien thi loi he thong
- Huong dan lien he ho tro

---

## 7. QUAN LY DON HANG (orders/list.html)

### 7.1 Danh sach don hang khach hang

Cau truc giao dien:
- Bang danh sach don hang
- Cot: Ma don, Ngay dat, Trang thai, Tong tien, Thao tac
- Loc theo trang thai
- Phan trang

### 7.2 Xu ly JavaScript

Ham loadMyOrders(page, status):
1. Goi GET /api/orders/my?page=X&status=Y
2. Render bang don hang
3. Cap nhat phan trang

Ham renderOrder(order):
- Tao row trong bang
- Hien thi ma don
- Hien thi ngay dat format dd/MM/yyyy
- Badge trang thai mau sac khac nhau
- Tong tien format VND
- Nut xem chi tiet, huy (neu duoc)

Ham viewOrderDetail(orderId):
- Mo modal chi tiet
- Goi GET /api/orders/X
- Hien thi danh sach san pham
- Hien thi thong tin giao hang
- Hien thi lich su trang thai

Ham cancelOrder(orderId):
1. Xac nhan huy don
2. Goi POST /api/orders/X/cancel
3. Reload danh sach
4. Hien thi thong bao

### 7.3 Trang thai don hang va mau sac

PENDING: Vang - Cho xu ly
CONFIRMED: Xanh duong - Da xac nhan
PACKING: Tim - Dang dong goi
SHIPPING: Cam - Dang giao
COMPLETED: Xanh la - Hoan thanh
CANCELLED: Do - Da huy
REFUNDED: Xam - Da hoan tien

### 7.4 Cho phep huy don

Chi cho phep huy khi:
- Trang thai la PENDING hoac CONFIRMED
- Chua thanh toan hoac da thanh toan (se hoan tien)

Khi huy don:
- Neu da thanh toan hien thong bao se hoan tien
- Diem tich luy se duoc hoan lai

---

## 8. TRANG QUAN TRI ADMIN

### 8.1 Sidebar chung (admin-sidebar.css)

Cau truc:
- Logo va ten ung dung
- Thong tin user dang nhap
- Menu dieu huong theo nhom
- Link dang xuat

Cac muc menu:
- Dashboard
- Quan ly San pham
- Quan ly Danh muc
- Quan ly Thuong hieu
- Quan ly Don hang
- Quan ly Thanh toan
- Quan ly Ma giam gia
- Quan ly Nguoi dung
- Nhat ky hoat dong
- Giam sat He thong

Phan quyen hien thi menu:
- ADMIN: Thay tat ca
- STAFF_PRODUCT: San pham, Danh muc, Thuong hieu
- STAFF_SALES: Don hang, Thanh toan

### 8.2 Quan ly san pham (admin/products.html)

a) Danh sach san pham:
- Bang voi cot: ID, Hinh, Ten, Thuong hieu, Danh muc, Bien the, Trang thai, Ngay tao, Thao tac
- Tim kiem theo ten
- Loc theo thuong hieu, trang thai
- Phan trang

b) Them sua san pham:
- Modal form
- Cac truong: Ten, Slug, Thuong hieu, Danh muc, Mo ta, Chat lieu, Xuat xu, Trang thai
- Nut luu

c) Quan ly bien the:
- Modal rieng khi click vao so bien the
- Danh sach bien the cua san pham
- Them bien the moi: Mau, Size, SKU, Gia, Ton kho
- Sua xoa bien the

d) Quan ly hinh anh:
- Modal rieng
- Upload nhieu hinh
- Keo tha sap xep thu tu
- Xoa hinh

Cac ham JavaScript:

loadProducts(page, filters):
- Goi GET /api/products
- Render bang

openAddProductModal():
- Reset form
- Mo modal them moi

openEditProductModal(id):
- Goi GET /api/products/id
- Dien du lieu vao form
- Mo modal sua

saveProduct():
- Thu thap du lieu form
- POST hoac PUT tuy theo mode
- Reload danh sach

deleteProduct(id):
- Xac nhan xoa
- Goi DELETE /api/products/id
- Reload danh sach

openVariantsModal(productId):
- Goi GET /api/product-variants/product/id
- Render danh sach bien the
- Mo modal

saveVariant():
- Thu thap du lieu
- POST /api/product-variants
- Reload danh sach bien the

openImagesModal(productId):
- Goi GET /api/product-images/product/id
- Render danh sach hinh
- Mo modal

uploadImage(file):
- Tao FormData
- POST /api/product-images/upload
- Reload danh sach hinh

### 8.3 Quan ly danh muc (admin/categories.html)

Tuong tu san pham nhung don gian hon:
- Bang danh sach danh muc
- Form them sua: Ten, Slug, Danh muc cha, Mo ta, Hinh anh
- Ho tro cau truc cay (parent-child)

### 8.4 Quan ly thuong hieu (admin/brands.html)

- Bang danh sach thuong hieu
- Form them sua: Ten, Slug, Mo ta, Logo URL
- Bat tat trang thai

### 8.5 Quan ly don hang (admin/orders.html)

a) Danh sach don hang:
- Bang day du thong tin
- Loc theo trang thai, ngay
- Tim kiem theo ma don

b) Cap nhat trang thai:
- Dropdown chon trang thai moi
- Chi cho phep chuyen trang thai hop le
- PENDING -> CONFIRMED -> PACKING -> SHIPPING -> COMPLETED
- PENDING/CONFIRMED -> CANCELLED
- COMPLETED (da thanh toan) -> REFUNDED

c) Xem chi tiet don:
- Modal hien thi toan bo thong tin
- Danh sach san pham
- Thong tin khach hang
- Thong tin giao hang
- Lich su trang thai

d) Xu ly hoan tien:
- Nut hoan tien cho don da thanh toan
- Nhap ly do hoan tien
- Goi POST /api/orders/id/refund

### 8.6 Quan ly thanh toan (admin/payments.html)

- Danh sach giao dich thanh toan
- Loc theo trang thai, phuong thuc
- Xem chi tiet giao dich VNPay
- Doi chieu so tien

### 8.7 Quan ly nguoi dung (admin/users.html)

Chi danh cho ADMIN:
- Danh sach nguoi dung
- Tim kiem theo email, ten
- Loc theo vai tro, trang thai
- Them nguoi dung moi
- Gan vai tro
- Khoa mo tai khoan

### 8.8 Quan ly ma giam gia (admin/coupons.html)

- Danh sach coupon
- Them sua coupon: Ma, Loai (% hoac co dinh), Gia tri, Don toi thieu, Giam toi da, Gioi han su dung, Thoi han
- Bat tat trang thai
- Xem so lan da su dung

### 8.9 Nhat ky hoat dong (admin/audit-logs.html)

Chi danh cho ADMIN:
- Bang nhat ky cac hanh dong
- Loc theo nguoi dung, loai hanh dong, doi tuong
- Loc theo khoang thoi gian
- Xem chi tiet thay doi (gia tri cu va moi)

### 8.10 Giam sat he thong (admin/system-monitor.html)

Chi danh cho ADMIN:
- Thong tin CPU usage
- Thong tin Memory usage
- Thong tin Disk usage
- So ket noi database
- Uptime he thong
- Tu dong refresh dinh ky

---

## 9. AI CHATBOT (ai-chatbot.html)

### 9.1 Cau truc giao dien

- Khung chat o goc phai man hinh
- Header voi ten AI Assistant
- Vung hien thi tin nhan
- Input nhap tin nhan
- Nut gui

### 9.2 Xu ly JavaScript

Ham sendMessage():
1. Lay noi dung tu input
2. Hien thi tin nhan nguoi dung
3. Hien thi trang thai dang tra loi
4. Goi POST /api/ai/chat voi message
5. Nhan response va hien thi

Ham renderMessage(content, isUser):
- Tao div tin nhan
- Style khac nhau cho user va AI
- Them vao vung chat
- Scroll xuong cuoi

Ham renderProductSuggestions(products):
- Neu AI tra ve san pham goi y
- Hien thi dang card nho
- Click de xem chi tiet

### 9.3 Tinh nang

- Hoi ve san pham
- Goi y san pham theo nhu cau
- Tra loi cau hoi ve size mau
- Huong dan mua hang
- Ho tro 24/7

---

## 10. CAC COMPONENT DUNG CHUNG

### 10.1 Navbar (fragments/navbar.html)

Cau truc:
- Logo ben trai
- Menu chinh giua: Trang chu, San pham
- Menu phai: Gio hang, Don hang, User dropdown

Xu ly trang thai dang nhap:
- Neu chua dang nhap: Hien Dang nhap, Dang ky
- Neu da dang nhap: Hien ten user, dropdown voi Profile, Don hang, Dang xuat
- Neu la Admin/Staff: Them link Dashboard

Cap nhat so luong gio hang:
- Ham updateCartBadge()
- Goi GET /api/cart
- Hien thi tong so item tren icon

### 10.2 Toast Notification

Ham showToast(message, type):
- type: success, error, warning, info
- Hien thi thong bao goc tren phai
- Tu dong an sau 3 giay

### 10.3 Loading Spinner

Ham showLoading():
- Hien thi overlay voi spinner
- Chan tuong tac trong khi cho

Ham hideLoading():
- An overlay

### 10.4 Confirm Dialog

Ham confirmAction(message, callback):
- Hien dialog xac nhan
- Neu OK goi callback
- Neu Cancel khong lam gi

### 10.5 Format Utilities

Ham formatCurrency(amount):
- Format so thanh tien VND
- Vi du: 1000000 -> 1.000.000 VND

Ham formatDate(dateString):
- Format ngay thanh dd/MM/yyyy
- Format ngay gio thanh dd/MM/yyyy HH:mm

Ham formatOrderStatus(status):
- Tra ve ten tieng Viet cua trang thai
- PENDING -> Cho xu ly

---

## 11. RESPONSIVE DESIGN

### 11.1 Breakpoints

- xs: < 576px (Mobile)
- sm: >= 576px (Mobile ngang)
- md: >= 768px (Tablet)
- lg: >= 992px (Desktop)
- xl: >= 1200px (Desktop lon)

### 11.2 San pham grid

- Desktop: 4 cot
- Tablet: 3 cot
- Mobile: 2 cot

### 11.3 Navbar

- Desktop: Menu ngang day du
- Mobile: Menu hamburger thu gon

### 11.4 Admin sidebar

- Desktop: Sidebar co dinh ben trai
- Mobile: Sidebar an, hien khi nhan nut menu

---

Ket thuc tai lieu Frontend. Cap nhat ngay 10/12/2025.

