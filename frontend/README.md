# Fashion Shop Next.js UI

Storefront Next.js mới cho Spring Boot Fashion backend. UI bám tinh thần Thymeleaf gốc, hiện đại hơn, có SEO metadata và gọi API backend thật.

## Chạy local

1. Chạy backend từ thư mục gốc:

```powershell
.\mvnw spring-boot:run
```

2. Cài dependency và chạy Next.js:

```powershell
cd frontend
npm install
npm run dev
```

3. Mở `http://localhost:3000`.

## Environment

Copy `.env.example` sang `.env.local` khi cần đổi URL backend hoặc site URL.

```env
FASHION_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## API đang dùng

- `GET /api/products`
- `GET /api/products/search`
- `GET /api/products/category/{categoryId}`
- `GET /api/products/brand/{brandId}`
- `GET /api/products/slug/{slug}`
- `GET /api/categories`
- `GET /api/brands`
- `POST /api/auth/login`
- `POST /api/cart/items` khi đã có access token

Nếu Spring Boot chưa chạy, UI sẽ hiện trạng thái “Backend API offline” thay vì dùng mock product.

Trong DevTools Network, các request catalog/login/cart sẽ hiện trực tiếp tới `http://localhost:8080/api/...`.

## SEO Included

- App Router metadata for the homepage, catalog, category pages, and product pages.
- Product JSON-LD and ItemList JSON-LD.
- Dynamic `sitemap.xml` and `robots.txt`.
- Canonical URLs and Open Graph/Twitter metadata.
- Server-rendered catalog pages backed by the existing Spring Boot API.
