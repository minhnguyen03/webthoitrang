"use client";

import { authFetch, hasStoredAuth } from "@/lib/auth-fetch";

export type LocalCartItem = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
};

export function readLocalCart(): LocalCartItem[] {
  try {
    const raw = window.localStorage.getItem("fashion-cart");
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalCart(items: LocalCartItem[]) {
  window.localStorage.setItem("fashion-cart", JSON.stringify(items));
  window.dispatchEvent(new Event("fashion-cart-updated"));
}

export async function mergeLocalCartToServer() {
  const items = readLocalCart();
  if (!items.length || !hasStoredAuth()) return false;

  const response = await authFetch("/api/cart/merge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items.map((item) => ({ variantId: item.variantId, quantity: item.quantity }))),
  }).catch(() => null);

  if (response?.ok) {
    writeLocalCart([]);
    return true;
  }

  return false;
}
