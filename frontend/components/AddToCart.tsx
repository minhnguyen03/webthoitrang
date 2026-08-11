"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  CreditCard,
  LoaderCircle,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  TicketPercent,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/api";
import { authFetch, clearStoredAuth, getStoredAccessToken, hasStoredAuth } from "@/lib/auth-fetch";
import { type LocalCartItem, mergeLocalCartToServer, readLocalCart, writeLocalCart } from "@/lib/cart-sync";
import { formatMoney, getActiveVariants, getProductImage } from "@/lib/format";

type AddToCartProps = {
  product: Product;
  selectedVariantId?: number;
  onVariantChange?: (variant: ProductVariant | undefined) => void;
};

type ShippingState = {
  shipName: string;
  shipPhone: string;
  shipLine1: string;
  shipLine2: string;
  shipWard: string;
  shipDistrict: string;
  shipCity: string;
  note: string;
};

type CartViewItem = {
  cartItemId?: number;
  productId?: number;
  slug?: string;
  name: string;
  image: string;
  variantId: number;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  availableStock?: number;
};

type ServerCartResponse = {
  items?: Array<{
    id: number;
    productName?: string;
    colorName?: string;
    sizeName?: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number | string;
    availableStock?: number;
    variant?: {
      id: number;
      color?: { name?: string };
      size?: { name?: string };
      sku?: string;
    };
  }>;
  subtotal?: number | string;
  totalItems?: number;
};

type CheckoutQuote = {
  subtotal?: number | string;
  discountTotal?: number | string;
  loyaltyDiscount?: number | string;
  shippingFee?: number | string;
  taxTotal?: number | string;
  grandTotal?: number | string;
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  coupon?: {
    valid?: boolean;
    message?: string;
    discountAmount?: number | string;
    finalAmount?: number | string;
  };
  messages?: string[];
};

type AddressRecord = {
  id?: number;
  receiverName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
};

function unwrapApiPayload(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function payloadMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    return String(record.message || record.error || fallback);
  }
  return fallback;
}

function toNumber(value: unknown) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function variantLabel(variant?: ProductVariant) {
  if (!variant) return "Mặc định";
  return [variant.color?.name, variant.size?.name].filter(Boolean).join(" / ") || variant.sku || "Mặc định";
}

function serverVariantLabel(item: NonNullable<ServerCartResponse["items"]>[number]) {
  return [item.colorName || item.variant?.color?.name, item.sizeName || item.variant?.size?.name]
    .filter(Boolean)
    .join(" / ") || item.variant?.sku || "Mặc định";
}

function resolveCartImage(url?: string) {
  if (!url) return "/placeholder.svg";
  if (/^(https?:|data:|blob:)/i.test(url) || url.startsWith("/backend-assets/")) return url;
  return `/backend-assets/${url.replace(/^\/+/, "")}`;
}

function mapServerCartItem(item: NonNullable<ServerCartResponse["items"]>[number]): CartViewItem {
  return {
    cartItemId: item.id,
    name: item.productName || "Sản phẩm",
    image: resolveCartImage(item.imageUrl),
    variantId: Number(item.variant?.id || 0),
    variantLabel: serverVariantLabel(item),
    quantity: Number(item.quantity || 0),
    unitPrice: toNumber(item.unitPrice),
    availableStock: item.availableStock,
  };
}

function mapLocalCartItem(item: LocalCartItem): CartViewItem {
  return {
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    image: item.image,
    variantId: item.variantId,
    variantLabel: item.variantLabel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  };
}

function variantColorKey(variant?: ProductVariant) {
  return variant?.color?.id ?? 0;
}

function variantSizeKey(variant?: ProductVariant) {
  return variant?.size?.id ?? 0;
}

function variantImage(product: Product, variant?: ProductVariant) {
  const sortedImages = [...(product.images || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const exactImage = variant ? sortedImages.find((image) => image.variantId === variant.id) : undefined;
  const fallbackImage = sortedImages.find((image) => !image.variantId) || sortedImages[0];
  const image = exactImage || fallbackImage;
  return image ? getProductImage({ ...product, images: [image] }) : getProductImage(product);
}

function uniqueByKey<T extends { key: number }>(items: T[]) {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}

export function AddToCart({ product, selectedVariantId, onVariantChange }: AddToCartProps) {
  const router = useRouter();
  const variants = useMemo(() => getActiveVariants(product), [product]);
  const initialVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) || variants[0],
    [selectedVariantId, variants],
  );
  const [selectedColorKey, setSelectedColorKey] = useState(() => variantColorKey(initialVariant));
  const [selectedSizeKey, setSelectedSizeKey] = useState(() => variantSizeKey(initialVariant));
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "added" | "syncing" | "error">("idle");
  const colorOptions = useMemo(
    () =>
      uniqueByKey(
        variants.map((variant) => ({
          key: variantColorKey(variant),
          name: variant.color?.name || "Mặc định",
          code: variant.color?.code || null,
        })),
      ),
    [variants],
  );
  const sizeOptions = useMemo(
    () =>
      uniqueByKey(
        variants
          .filter((variant) => variantColorKey(variant) === selectedColorKey)
          .map((variant) => ({
            key: variantSizeKey(variant),
            name: variant.size?.name || "Mặc định",
          })),
      ),
    [selectedColorKey, variants],
  );
  const selectedVariant =
    variants.find((variant) => variantColorKey(variant) === selectedColorKey && variantSizeKey(variant) === selectedSizeKey) ||
    variants.find((variant) => variantColorKey(variant) === selectedColorKey) ||
    initialVariant;
  const stock = selectedVariant?.stock ?? 0;

  useEffect(() => {
    if (!initialVariant) return;
    setSelectedColorKey(variantColorKey(initialVariant));
    setSelectedSizeKey(variantSizeKey(initialVariant));
  }, [initialVariant]);

  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [onVariantChange, selectedVariant]);

  function selectColor(colorKey: number) {
    const nextVariant =
      variants.find((variant) => variantColorKey(variant) === colorKey && (variant.stock ?? 0) > 0) ||
      variants.find((variant) => variantColorKey(variant) === colorKey);
    setSelectedColorKey(colorKey);
    setSelectedSizeKey(variantSizeKey(nextVariant));
    setQuantity(1);
  }

  function variantForSize(sizeKey: number) {
    return variants.find((variant) => variantColorKey(variant) === selectedColorKey && variantSizeKey(variant) === sizeKey);
  }

  async function addItem(options?: { redirectToCart?: boolean }) {
    if (!selectedVariant) return;

    const localItem: LocalCartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: variantImage(product, selectedVariant),
      variantId: selectedVariant.id,
      variantLabel: variantLabel(selectedVariant),
      quantity,
      unitPrice: Number(selectedVariant.price || 0),
    };

    function addToLocalCart() {
      const current = readLocalCart();
      const existing = current.find((cartItem) => cartItem.variantId === localItem.variantId);
      const next = existing
        ? current.map((cartItem) =>
            cartItem.variantId === localItem.variantId
              ? { ...cartItem, quantity: Math.min(cartItem.quantity + quantity, stock || 999) }
              : cartItem,
          )
        : [...current, localItem];

      writeLocalCart(next);
    }

    if (hasStoredAuth()) {
      setStatus("syncing");
      const response = await authFetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId: selectedVariant.id, quantity }),
      }).catch(() => null);

      const authUnavailable = response?.status === 401 || response?.status === 403 || !response;
      if (authUnavailable) {
        clearStoredAuth();
        addToLocalCart();
        setStatus("added");
        if (options?.redirectToCart) {
          router.push("/cart");
          return;
        }
        window.setTimeout(() => setStatus("idle"), 1800);
        return;
      }

      setStatus(response.ok ? "added" : "error");
      window.dispatchEvent(new Event("fashion-cart-updated"));
      if (response?.ok && options?.redirectToCart) {
        router.push("/cart");
        return;
      }
      window.setTimeout(() => setStatus("idle"), 1800);
      return;
    }

    addToLocalCart();
    setStatus("added");
    if (options?.redirectToCart) {
      router.push("/cart");
      return;
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <div>
      {variants.length > 0 ? (
        <div className="variantPicker">
          <strong>Chọn phân loại</strong>
          <div className="variantGroup">
            <span>Màu sắc</span>
            <div className="variantList">
              {colorOptions.map((color) => (
                <button
                  key={color.key}
                  className="variantButton colorOptionButton"
                  type="button"
                  aria-pressed={color.key === selectedColorKey}
                  onClick={() => selectColor(color.key)}
                >
                  <span className="colorSwatch" style={{ backgroundColor: color.code || "#f3f4f6" }} aria-hidden="true" />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="variantGroup">
            <span>Kích cỡ</span>
            <div className="variantList">
              {sizeOptions.map((size) => {
                const variant = variantForSize(size.key);
                const disabled = !variant || (variant.stock ?? 0) <= 0;
                return (
                  <button
                    key={size.key}
                    className="variantButton"
                    type="button"
                    aria-pressed={size.key === selectedSizeKey}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedSizeKey(size.key);
                      setQuantity(1);
                    }}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="checkoutHint">
            {selectedVariant ? `${variantLabel(selectedVariant)} · ${stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}` : "Chưa có phân loại khả dụng."}
          </p>
        </div>
      ) : null}

      <div className="productFooter">
        <div className="quantityStepper" aria-label="Số lượng">
          <button type="button" title="Giảm số lượng" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus size={16} aria-hidden="true" />
          </button>
          <span>{quantity}</span>
          <button type="button" title="Tăng số lượng" onClick={() => setQuantity((value) => Math.min(stock || 1, value + 1))}>
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>

        <button className="button" type="button" onClick={() => void addItem()} disabled={!selectedVariant || stock <= 0}>
          {status === "syncing" ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : status === "added" ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
          {status === "syncing" ? "Đang đồng bộ" : status === "added" ? "Đã thêm" : status === "error" ? "Thử lại" : stock <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>

        <button className="ghostButton" type="button" onClick={() => void addItem({ redirectToCart: true })} disabled={!selectedVariant || stock <= 0}>
          <ShoppingBag size={18} aria-hidden="true" />
          Mua ngay
        </button>
      </div>
    </div>
  );
}

export function CartClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartViewItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingState>({
    shipName: "",
    shipPhone: "",
    shipLine1: "",
    shipLine2: "",
    shipWard: "",
    shipDistrict: "",
    shipCity: "TP. Hồ Chí Minh",
    note: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [loadingCart, setLoadingCart] = useState(true);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchServerCart = useCallback(async () => {
    const response = await authFetch("/api/cart").catch(() => null);
    if (!response?.ok) return false;

    const payload = await response.json().catch(() => null);
    const cart = unwrapApiPayload(payload) as ServerCartResponse | null;
    setItems((cart?.items || []).map(mapServerCartItem).filter((item) => item.variantId));
    return true;
  }, []);

  const hydrate = useCallback(async () => {
    setLoadingCart(true);
    const token = getStoredAccessToken();
    setAccessToken(token);

    if (!hasStoredAuth()) {
      setItems(readLocalCart().map(mapLocalCartItem));
      setQuote(null);
      setLoadingCart(false);
      return;
    }

    await mergeLocalCartToServer();
    await fetchServerCart();
    setAccessToken(getStoredAccessToken());

    const response = await authFetch("/api/profile").catch(() => null);

    if (response?.ok) {
      const payload = await response.json().catch(() => null);
      const profile = unwrapApiPayload(payload) as Record<string, unknown> | null;
      if (profile) {
        setAvailablePoints(Number(profile.loyaltyPoint || 0));
        const addresses = Array.isArray(profile.addresses) ? (profile.addresses as AddressRecord[]) : [];
        const address = (((profile.defaultAddress as AddressRecord | undefined) || addresses[0]) ?? {}) as AddressRecord;
        setShipping((current) => ({
          ...current,
          shipName: String(address.receiverName || profile.fullName || current.shipName || ""),
          shipPhone: String(address.phone || profile.phone || current.shipPhone || ""),
          shipLine1: String(address.line1 || current.shipLine1 || ""),
          shipLine2: String(address.line2 || current.shipLine2 || ""),
          shipWard: String(address.ward || current.shipWard || ""),
          shipDistrict: String(address.district || current.shipDistrict || ""),
          shipCity: String(address.city || current.shipCity || "TP. Hồ Chí Minh"),
        }));
      }
    }

    setLoadingCart(false);
  }, [fetchServerCart]);

  useEffect(() => {
    void hydrate();
    window.addEventListener("fashion-auth-updated", hydrate);
    return () => {
      window.removeEventListener("fashion-auth-updated", hydrate);
    };
  }, [hydrate]);

  function updateShipping(field: keyof ShippingState, value: string) {
    setShipping((current) => ({ ...current, [field]: value }));
  }

  function buildOrderBody() {
    return {
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shipName: shipping.shipName,
      shipPhone: shipping.shipPhone,
      shipLine1: shipping.shipLine1,
      shipLine2: shipping.shipLine2,
      shipWard: shipping.shipWard,
      shipDistrict: shipping.shipDistrict,
      shipCity: shipping.shipCity,
      shipCountry: "Vietnam",
      couponCode: couponCode.trim().toUpperCase(),
      loyaltyPointsToUse,
      note: shipping.note,
      paymentMethod,
    };
  }

  async function updateQuantity(item: CartViewItem, quantity: number) {
    const nextQuantity = Math.max(1, Math.min(quantity, item.availableStock || 999));
    if (!hasStoredAuth() || !item.cartItemId) {
      const next = items.map((current) => (current.variantId === item.variantId ? { ...current, quantity: nextQuantity } : current));
      setItems(next);
      writeLocalCart(next.map((current) => ({
        productId: current.productId || 0,
        slug: current.slug || "",
        name: current.name,
        image: current.image,
        variantId: current.variantId,
        variantLabel: current.variantLabel,
        quantity: current.quantity,
        unitPrice: current.unitPrice,
      })));
      return;
    }

    const response = await authFetch(`/api/cart/items/${item.cartItemId}?quantity=${nextQuantity}`, {
      method: "PUT",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      await fetchServerCart();
      setAccessToken(getStoredAccessToken());
      window.dispatchEvent(new Event("fashion-cart-updated"));
    }
  }

  async function removeItem(item: CartViewItem) {
    if (!hasStoredAuth() || !item.cartItemId) {
      const next = items.filter((current) => current.variantId !== item.variantId);
      setItems(next);
      writeLocalCart(next.map((current) => ({
        productId: current.productId || 0,
        slug: current.slug || "",
        name: current.name,
        image: current.image,
        variantId: current.variantId,
        variantLabel: current.variantLabel,
        quantity: current.quantity,
        unitPrice: current.unitPrice,
      })));
      return;
    }

    const response = await authFetch(`/api/cart/items/${item.cartItemId}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      await fetchServerCart();
      setAccessToken(getStoredAccessToken());
      window.dispatchEvent(new Event("fashion-cart-updated"));
    }
  }

  async function refreshQuote(options?: { showCouponMessage?: boolean }) {
    if (!hasStoredAuth()) return null;
    if (!shipping.shipName || !shipping.shipPhone || !shipping.shipLine1 || !shipping.shipCity) {
      if (options?.showCouponMessage) setCouponMessage("Vui lòng nhập thông tin giao hàng trước khi kiểm tra ưu đãi.");
      return null;
    }

    const response = await authFetch("/api/checkout/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildOrderBody()),
    }, { redirectOnFailure: true }).catch(() => null);

    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      const message = payloadMessage(payload, "Không thể tạo đơn vì dữ liệu giỏ hàng đã thay đổi.");
      setCheckoutMessage(message);
      if (options?.showCouponMessage) setCouponMessage(message);
      return null;
    }

    const nextQuote = unwrapApiPayload(payload) as CheckoutQuote;
    setQuote(nextQuote);
    setCheckoutMessage("");
    if (options?.showCouponMessage) {
      const messages = [
        nextQuote.coupon?.message,
        ...(Array.isArray(nextQuote.messages) ? nextQuote.messages : []),
      ].filter(Boolean);
      setCouponMessage(messages.join(" ") || "Tổng tiền đã được kiểm tra.");
    }
    return nextQuote;
  }

  async function validateCoupon() {
    const code = couponCode.trim().toUpperCase();
    setCouponMessage("");
    if (!code) {
      setCouponMessage("Nhập mã giảm giá trước khi kiểm tra.");
      return;
    }
    setCouponCode(code);
    setValidatingCoupon(true);
    await refreshQuote({ showCouponMessage: true });
    setValidatingCoupon(false);
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutMessage("");
    setCheckoutSuccess("");

    if (!hasStoredAuth()) {
      router.push("/login");
      return;
    }

    if (!items.length) {
      setCheckoutMessage("Không thể tạo đơn vì dữ liệu giỏ hàng đã thay đổi.");
      return;
    }
    if (!shipping.shipName || !shipping.shipPhone || !shipping.shipLine1 || !shipping.shipCity) {
      setCheckoutMessage("Vui lòng điền đầy đủ tên, số điện thoại, địa chỉ và tỉnh/thành giao hàng.");
      return;
    }

    setSubmitting(true);
    setCheckoutMessage("Đang kiểm tra tồn kho và tổng tiền...");
    const latestQuote = await refreshQuote();
    if (!latestQuote) {
      setSubmitting(false);
      return;
    }

    const response = await authFetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildOrderBody()),
    }, { redirectOnFailure: true }).catch(() => null);

    const payload = await response?.json().catch(() => null);
    if (!response?.ok) {
      setSubmitting(false);
      setCheckoutMessage(payloadMessage(payload, "Không thể tạo đơn vì dữ liệu giỏ hàng đã thay đổi."));
      return;
    }

    const order = unwrapApiPayload(payload) as Record<string, unknown> | null;
    const orderId = Number(order?.id || 0);
    writeLocalCart([]);
    setItems([]);
    window.dispatchEvent(new Event("fashion-cart-updated"));
    setCheckoutSuccess("Đặt hàng thành công.");

    if (paymentMethod === "VNPAY" && orderId) {
      setCheckoutMessage("Đang chuyển sang VNPay...");
      const paymentResponse = await authFetch(`/api/payment/vnpay/create?orderId=${orderId}`, {
        method: "POST",
      }, { redirectOnFailure: true }).catch(() => null);

      const paymentPayload = await paymentResponse?.json().catch(() => null);
      const paymentData = unwrapApiPayload(paymentPayload) as Record<string, unknown> | null;
      const paymentUrl = String(paymentData?.paymentUrl || paymentData?.url || "");
      setSubmitting(false);

      if (paymentResponse?.ok && paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      setCheckoutMessage("Thanh toán chưa hoàn tất, bạn có thể thử lại trong đơn hàng.");
      router.push("/orders");
      return;
    }

    setSubmitting(false);
    router.push("/orders");
  }

  const subtotal = quote ? toNumber(quote.subtotal) : items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  const discountTotal = quote ? toNumber(quote.discountTotal) : 0;
  const loyaltyDiscount = quote ? toNumber(quote.loyaltyDiscount) : 0;
  const estimatedTotal = quote ? toNumber(quote.grandTotal) : Math.max(0, subtotal - discountTotal - loyaltyDiscount);

  if (loadingCart) {
    return (
      <div className="emptyState">
        <div>
          <LoaderCircle className="spinIcon" size={42} aria-hidden="true" />
          <h2>Đang tải giỏ hàng...</h2>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="emptyState">
        <div>
          <ShoppingBag size={42} aria-hidden="true" />
          <h2>Giỏ hàng của bạn đang trống.</h2>
          <p>Khám phá catalog và thêm sản phẩm để bắt đầu mua sắm.</p>
          <Link className="button" href="/products">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cartLayout">
      <div className="cartList">
        {items.map((item) => (
          <article className="cartItem" key={item.cartItemId || item.variantId}>
            <Link className="cartThumb" href={item.slug ? `/products/${item.slug}` : "/products"}>
              <Image src={item.image} alt={item.name} fill sizes="112px" />
            </Link>
            <div>
              <h3>{item.name}</h3>
              <p>
                {item.variantLabel} · {formatMoney(item.unitPrice)}
              </p>
              {item.availableStock !== undefined && item.quantity > item.availableStock ? (
                <p className="checkoutHint">Chỉ còn {item.availableStock} sản phẩm cho lựa chọn này.</p>
              ) : null}
              <div className="quantityStepper">
                <button type="button" title="Giảm số lượng" onClick={() => void updateQuantity(item, item.quantity - 1)}>
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span>{item.quantity}</span>
                <button type="button" title="Tăng số lượng" onClick={() => void updateQuantity(item, item.quantity + 1)}>
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="cartItemMeta">
              <strong>{formatMoney(item.quantity * item.unitPrice)}</strong>
              <button className="iconButton" type="button" title="Xóa" onClick={() => void removeItem(item)}>
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="cartSummary">
        <h2>Tóm tắt đơn hàng</h2>
        <ol className="checkoutSteps" aria-label="Tiến trình thanh toán">
          {["Giỏ hàng", "Giao hàng", "Thanh toán", "Hoàn tất"].map((step, index) => (
            <li key={step} data-active={index < 3 || Boolean(checkoutSuccess)}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
        <div className="summaryRow">
          <span>Tạm tính</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <div className="summaryRow">
          <span>Giảm giá</span>
          <strong>{discountTotal ? `-${formatMoney(discountTotal)}` : formatMoney(0)}</strong>
        </div>
        <div className="summaryRow">
          <span>Điểm tích lũy</span>
          <strong>{loyaltyDiscount ? `-${formatMoney(loyaltyDiscount)}` : `${availablePoints} điểm khả dụng`}</strong>
        </div>
        <div className="summaryRow">
          <span>Vận chuyển</span>
          <strong>{quote ? formatMoney(toNumber(quote.shippingFee)) : "Tính theo địa chỉ"}</strong>
        </div>
        <div className="summaryRow">
          <span>Tổng dự kiến</span>
          <strong>{formatMoney(estimatedTotal)}</strong>
        </div>
        {quote ? (
          <div className="checkoutQuoteExplanation">
            <p>{quote.coupon?.message || (discountTotal ? "Mã giảm giá đã được áp dụng vào đơn hàng." : "Chưa áp dụng mã giảm giá.")}</p>
            <p>
              {quote.loyaltyPointsUsed ? `Dùng ${quote.loyaltyPointsUsed} điểm để giảm ${formatMoney(loyaltyDiscount)}.` : `${availablePoints} điểm khả dụng.`}
              {" "}
              {quote.loyaltyPointsEarned ? `Dự kiến nhận ${quote.loyaltyPointsEarned} điểm sau khi hoàn tất.` : ""}
            </p>
          </div>
        ) : null}

        {!accessToken ? (
          <Link className="button" href="/login">
            Đăng nhập để thanh toán
          </Link>
        ) : (
          <form className="checkoutForm" onSubmit={submitOrder}>
            <div className="checkoutBlockTitle">
              <MapPin size={18} aria-hidden="true" />
              <span>Thông tin giao hàng</span>
            </div>

            <label className="checkoutField">
              <span>Người nhận</span>
              <input value={shipping.shipName} onChange={(event) => updateShipping("shipName", event.target.value)} required />
            </label>

            <label className="checkoutField">
              <span>Số điện thoại</span>
              <input value={shipping.shipPhone} onChange={(event) => updateShipping("shipPhone", event.target.value)} required />
            </label>

            <label className="checkoutField">
              <span>Địa chỉ</span>
              <input value={shipping.shipLine1} onChange={(event) => updateShipping("shipLine1", event.target.value)} required />
            </label>

            <div className="checkoutGrid">
              <label className="checkoutField">
                <span>Phường/Xã</span>
                <input value={shipping.shipWard} onChange={(event) => updateShipping("shipWard", event.target.value)} />
              </label>
              <label className="checkoutField">
                <span>Quận/Huyện</span>
                <input value={shipping.shipDistrict} onChange={(event) => updateShipping("shipDistrict", event.target.value)} />
              </label>
            </div>

            <label className="checkoutField">
              <span>Tỉnh/Thành</span>
              <input value={shipping.shipCity} onChange={(event) => updateShipping("shipCity", event.target.value)} required />
            </label>

            <label className="checkoutField">
              <span>Ghi chú</span>
              <textarea value={shipping.note} onChange={(event) => updateShipping("note", event.target.value)} rows={3} />
            </label>

            <div className="checkoutBlockTitle">
              <TicketPercent size={18} aria-hidden="true" />
              <span>Ưu đãi</span>
            </div>

            <div className="couponRow">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Mã giảm giá"
                aria-label="Mã giảm giá"
              />
              <button className="ghostButton" type="button" onClick={validateCoupon} disabled={validatingCoupon}>
                {validatingCoupon ? <LoaderCircle className="spinIcon" size={16} aria-hidden="true" /> : <TicketPercent size={16} aria-hidden="true" />}
                Kiểm tra
              </button>
            </div>

            {couponMessage ? <p className="checkoutHint">{couponMessage}</p> : null}

            <label className="checkoutField">
              <span>Điểm tích lũy muốn dùng</span>
              <input
                type="number"
                min={0}
                max={availablePoints}
                value={loyaltyPointsToUse}
                onChange={(event) => setLoyaltyPointsToUse(Math.floor(Math.max(0, Number(event.target.value) || 0)))}
              />
            </label>

            <div className="checkoutBlockTitle">
              <CreditCard size={18} aria-hidden="true" />
              <span>Thanh toán</span>
            </div>

            <div className="paymentOptions">
              <button type="button" aria-pressed={paymentMethod === "COD"} onClick={() => setPaymentMethod("COD")}>
                <Truck size={17} aria-hidden="true" />
                COD
              </button>
              <button type="button" aria-pressed={paymentMethod === "VNPAY"} onClick={() => setPaymentMethod("VNPAY")}>
                <Wallet size={17} aria-hidden="true" />
                VNPay
              </button>
            </div>

            <p className="authMessage" role="status" aria-live="polite" data-visible={Boolean(checkoutMessage || checkoutSuccess)}>
              {checkoutMessage ? (
                <>
                  <AlertCircle size={16} aria-hidden="true" />
                  {checkoutMessage}
                </>
              ) : checkoutSuccess ? (
                <>
                  <Check size={16} aria-hidden="true" />
                  {checkoutSuccess}
                </>
              ) : null}
            </p>

            <button className="button" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
              {submitting ? "Đang tạo đơn" : "Đặt hàng"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
