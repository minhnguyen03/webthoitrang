"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Grid3X3,
  Home,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Search,
  ShoppingBag,
  Tags,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useCartCount } from "@/hooks/useCartCount";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home, matchPath: "/" },
  { href: "/products", label: "Sản phẩm", icon: Grid3X3, matchPath: "/products" },
  { href: "/categories", label: "Danh mục", icon: Tags, matchPath: "/categories" },
  { href: "/ai-chatbot", label: "Tư vấn AI", icon: Bot, matchPath: "/ai-chatbot" },
];

function SearchForm() {
  return (
    <form className="headerSearch" action="/products">
      <input type="search" name="keyword" placeholder="Tìm kiếm sản phẩm..." aria-label="Tìm kiếm sản phẩm" />
      <button type="submit" title="Tìm kiếm">
        <Search size={17} aria-hidden="true" />
      </button>
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { accessToken, userName, isStaffUser } = useAuthSession();
  const cartCount = useCartCount(accessToken);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="topBar">Miễn phí vận chuyển cho đơn hàng trên 500.000đ · Đổi trả dễ dàng trong 30 ngày</div>
      <header className="header">
        <div className="container">
          <nav className="nav" aria-label="Điều hướng chính">
            <Link className="brandMark" href="/" aria-label="Fashion Shop">
               <img
                  src="/logo2.png"
                  alt="ELIMAZ"
                  style={{
                    width: "100px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                />
              ELIMAZ SHOP
            </Link>

            <div className="navLinks">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = Boolean(item.matchPath && pathname === item.matchPath);
                const content = (
                  <>
                    <Icon size={15} aria-hidden="true" /> {item.label}
                  </>
                );

                return item.href.startsWith("http") ? (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="navActions">
              <SearchForm />
              {isStaffUser ? (
                <Link className="iconButton accountLink" href="/dashboard" title="Dashboard" aria-label="Dashboard">
                  <LayoutDashboard size={18} aria-hidden="true" />
                </Link>
              ) : null}
              <Link className="iconButton accountLink" href={userName ? "/profile" : "/login"} title={userName || "Đăng nhập"} aria-label={userName || "Đăng nhập"}>
                <UserRound size={18} aria-hidden="true" />
              </Link>
              <Link className="iconButton cartLink" href="/cart" title="Giỏ hàng" aria-label="Giỏ hàng">
                <ShoppingBag size={18} aria-hidden="true" />
                {cartCount > 0 ? <span className="cartCount">{cartCount}</span> : null}
              </Link>
              <button
                className="iconButton mobileToggle"
                type="button"
                title="Menu"
                aria-label="Menu"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
              >
                {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </button>
            </div>
          </nav>

          <div className="mobilePanel" hidden={!open}>
            <SearchForm />
            {navItems.map((item) =>
              item.href.startsWith("http") ? (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ),
            )}
            <Link href="/cart">
              <ShoppingBag size={16} aria-hidden="true" /> Giỏ hàng
            </Link>
            <Link href={userName ? "/profile" : "/login"}>
              <UserRound size={16} aria-hidden="true" /> {userName || "Đăng nhập"}
            </Link>
            <Link href={userName ? "/orders" : "/login"}>
              <ReceiptText size={16} aria-hidden="true" /> Đơn hàng
            </Link>
            {isStaffUser ? <Link href="/dashboard">Dashboard</Link> : null}
          </div>
        </div>
      </header>
    </>
  );
}
