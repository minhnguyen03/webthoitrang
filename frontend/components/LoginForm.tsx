"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { storeAuthResponse } from "@/lib/auth-fetch";
import { mergeLocalCartToServer } from "@/lib/cart-sync";

type AuthUser = {
  role?: string;
  roles?: string[];
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
};

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    }).catch(() => null);

    if (!response?.ok) {
      setLoading(false);
      setMessage("Email hoặc mật khẩu không đúng.");
      return;
    }

    const data = (await response.json()) as AuthResponse;
    storeAuthResponse(data);
    await mergeLocalCartToServer();

    setSuccess("Đăng nhập thành công.");
    setLoading(false);
    router.push("/products");
  }

  return (
    <form className="authForm" onSubmit={onSubmit}>
      <label className="authField">
        <span>Email</span>
        <span className="authInputWrap">
          <Mail size={18} aria-hidden="true" />
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        </span>
      </label>

      <label className="authField">
        <span>Mật khẩu</span>
        <span className="authInputWrap">
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
          />
          <button
            className="authPasswordToggle"
            type="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </span>
      </label>

      <div className="authMetaRow">
        <label className="authRemember">
          <input type="checkbox" name="remember" />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        <Link href="/forgot-password">Quên mật khẩu?</Link>
      </div>

      <p className="authMessage" role="status" aria-live="polite" data-visible={Boolean(message || success)}>
        {message ? (
          <>
            <AlertCircle size={16} aria-hidden="true" />
            {message}
          </>
        ) : success ? (
          <>
            <CheckCircle2 size={16} aria-hidden="true" />
            {success}
          </>
        ) : null}
      </p>

      <button className="button authSubmit" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
        {loading ? "Đang đăng nhập" : "Đăng nhập"}
      </button>
    </form>
  );
}
