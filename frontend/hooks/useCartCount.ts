"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch, hasStoredAuth } from "@/lib/auth-fetch";
import { readLocalCart } from "@/lib/cart-sync";

type CartPayload = {
  totalItems?: number;
  items?: { quantity?: number }[];
};

function unwrapCartPayload(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data as CartPayload | null;
  }
  return payload as CartPayload | null;
}

function countLocalCart() {
  return readLocalCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function countServerCart(cart: CartPayload | null) {
  const totalItems = Number(
    cart?.totalItems ?? cart?.items?.reduce((total, item) => total + Number(item.quantity || 0), 0) ?? 0,
  );

  return Number.isFinite(totalItems) ? totalItems : 0;
}

export function useCartCount(accessToken?: string | null) {
  const [cartCount, setCartCount] = useState(0);

  const syncCartCount = useCallback(async () => {
    if (!accessToken && !hasStoredAuth()) {
      setCartCount(countLocalCart());
      return;
    }

    const response = await authFetch("/api/cart").catch(() => null);

    if (!response?.ok) {
      setCartCount(countLocalCart());
      return;
    }

    const payload = await response.json().catch(() => null);
    setCartCount(countServerCart(unwrapCartPayload(payload)));
  }, [accessToken]);

  useEffect(() => {
    void syncCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("fashion-cart-updated", syncCartCount);
    window.addEventListener("fashion-auth-updated", syncCartCount);

    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("fashion-cart-updated", syncCartCount);
      window.removeEventListener("fashion-auth-updated", syncCartCount);
    };
  }, [syncCartCount]);

  return cartCount;
}
