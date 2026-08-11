import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Repeat2, ShieldCheck, Truck } from "lucide-react";
import { CategoryTiles } from "@/components/CategoryTiles";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { getBackendStatus, getFeaturedProducts, getStorefrontCategories } from "@/lib/api";
import { pickStorefrontCategories } from "@/lib/categories";
import { itemListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const [products, backendStatus, storefrontCategories] = await Promise.all([
    getFeaturedProducts(8),
    getBackendStatus(),
    getStorefrontCategories(),
  ]);
  const homepageCategories = pickStorefrontCategories(storefrontCategories);

  return (
    <>
      <JsonLd data={itemListJsonLd(products, "/")} />
      <section className="hero">
        <div className="heroMedia">
          <Image
            className="heroImage"
            src={siteConfig.heroImage}
            alt="Không gian mua sắm thời trang hiện đại"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="heroInner">
          <div className="apiPill" data-ok={String(backendStatus.ok)}>
            <span aria-hidden="true" />
            {backendStatus.ok ? "Bộ sưu tập mới đã lên kệ" : "Bộ sưu tập đang được cập nhật"}
          </div>
          <h1>Thời Trang công sở</h1>
          <p>
            Khám phá xu hướng mới nhất, chọn phong cách riêng của bạn và mua sắm trong không gian tinh gọn, dễ dùng hơn.
          </p>
          <div className="heroActions">
            <Link className="button buttonLight" href="/products">
              <Truck size={18} aria-hidden="true" /> Mua sắm ngay
            </Link>
            <Link className="ghostButton ghostButtonLight" href="/ai-chatbot">
              <Bot size={18} aria-hidden="true" /> Tư vấn AI
            </Link>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="sectionHeader">
            <h2>Danh Mục Sản Phẩm</h2>
            <p>Áo sơ mi · Chân váy · Set bộ</p>
          </div>
          <CategoryTiles categories={homepageCategories} linkToCategoryPage />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <h2>Sản Phẩm Nổi Bật</h2>
            <p>Những lựa chọn đang được yêu thích trong cửa hàng.</p>
          </div>

          {backendStatus.ok && products.length ? (
            <div className="productGrid">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="apiNotice">
              <div>
                <strong>Chưa tải được sản phẩm</strong>
                <p>Cửa hàng đang cập nhật dữ liệu. Vui lòng thử lại sau ít phút.</p>
              </div>
            </div>
          )}

          <div className="centerActions">
            <Link className="button" href="/products">
              Xem tất cả sản phẩm <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section sectionSoft">
        <div className="container featuresGrid">
          <div className="featureItem">
            <Truck aria-hidden="true" />
            <h3>Giao Hàng Miễn Phí</h3>
            <p>Miễn phí vận chuyển cho đơn hàng trên 500.000đ.</p>
          </div>
          <div className="featureItem">
            <Repeat2 aria-hidden="true" />
            <h3>Đổi Trả Dễ Dàng</h3>
            <p>Đổi trả miễn phí trong vòng 30 ngày.</p>
          </div>
          <div className="featureItem">
            <ShieldCheck aria-hidden="true" />
            <h3>Thanh Toán An Toàn</h3>
            <p>Bảo mật thông tin và hỗ trợ nhiều lựa chọn thanh toán tiện lợi.</p>
          </div>
        </div>
      </section>
    </>
  );
}
