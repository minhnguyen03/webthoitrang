"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { storeAuthResponse } from "@/lib/auth-fetch";
import { mergeLocalCartToServer } from "@/lib/cart-sync";

type AuthUser = {
  role?: string;
  roles?: string[];
};

type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
};

async function readApiMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || "";
  } catch {
    return "";
  }
}

async function saveAuth(data: AuthResponse) {
  storeAuthResponse(data);
  await mergeLocalCartToServer();
}

export function RegisterForm() {
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
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const phone = String(formData.get("phone") || "").trim();

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: phone || null,
        password,
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      setLoading(false);
      setMessage((response && (await readApiMessage(response))) || "Chưa tạo được tài khoản. Vui lòng kiểm tra thông tin và thử lại.");
      return;
    }

    const data = (await response.json()) as AuthResponse;
    if (data.accessToken) {
      await saveAuth(data);
      setSuccess("Tạo tài khoản thành công. Đang chuyển sang cửa hàng...");
      setLoading(false);
      router.push("/products");
      return;
    }

    setSuccess("Tạo tài khoản thành công. Đang chuyển sang đăng nhập...");
    setLoading(false);
    window.setTimeout(() => router.push("/login"), 900);
  }

  return (
    <form className="authForm" onSubmit={onSubmit}>
      <label className="authField">
        <span>Họ và tên</span>
        <span className="authInputWrap">
          <UserRound size={18} aria-hidden="true" />
          <input name="fullName" required minLength={2} autoComplete="name" placeholder="Nguyễn Văn A" />
        </span>
      </label>

      <label className="authField">
        <span>Email</span>
        <span className="authInputWrap">
          <Mail size={18} aria-hidden="true" />
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        </span>
      </label>

      <label className="authField">
        <span>Số điện thoại</span>
        <span className="authInputWrap">
          <Phone size={18} aria-hidden="true" />
          <input name="phone" autoComplete="tel" placeholder="0901234567" />
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
            autoComplete="new-password"
            placeholder="Ít nhất 6 ký tự, có chữ và số"
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

      <label className="authField">
        <span>Xác nhận mật khẩu</span>
        <span className="authInputWrap">
          <LockKeyhole size={18} aria-hidden="true" />
          <input type={showPassword ? "text" : "password"} name="confirmPassword" required minLength={6} autoComplete="new-password" />
        </span>
      </label>

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
        {loading ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <UserRound size={18} aria-hidden="true" />}
        {loading ? "Đang tạo tài khoản" : "Tạo tài khoản"}
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.get("email") }),
    }).catch(() => null);

    setLoading(false);

    if (!response || !response.ok) {
      setMessage((response && (await readApiMessage(response))) || "Chưa gửi được yêu cầu đặt lại mật khẩu. Vui lòng thử lại.");
      return;
    }

    setSuccess("Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn.");
  }

  return (
    <form className="authForm" onSubmit={onSubmit}>
      <label className="authField">
        <span>Email tài khoản</span>
        <span className="authInputWrap">
          <Mail size={18} aria-hidden="true" />
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        </span>
      </label>

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
        {loading ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
        {loading ? "Đang gửi" : "Gửi hướng dẫn"}
      </button>

      <Link className="ghostButton authCreateLink" href="/login">
        Quay lại đăng nhập
      </Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
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
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: formData.get("token"),
        newPassword,
        confirmPassword,
      }),
    }).catch(() => null);

    setLoading(false);

    if (!response || !response.ok) {
      setMessage((response && (await readApiMessage(response))) || "Chưa đặt lại được mật khẩu. Liên kết có thể đã hết hạn.");
      return;
    }

    setSuccess("Mật khẩu đã được cập nhật. Đang chuyển về đăng nhập...");
    window.setTimeout(() => router.push("/login"), 900);
  }

  return (
    <form className="authForm" onSubmit={onSubmit}>
      <input type="hidden" name="token" value={token} />

      {!token ? (
        <p className="authMessage" role="status" data-visible="true">
          <AlertCircle size={16} aria-hidden="true" />
          Liên kết đặt lại mật khẩu thiếu token. Vui lòng mở đúng liên kết trong email.
        </p>
      ) : null}

      <label className="authField">
        <span>Mật khẩu mới</span>
        <span className="authInputWrap">
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Nhập mật khẩu mới"
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

      <label className="authField">
        <span>Xác nhận mật khẩu mới</span>
        <span className="authInputWrap">
          <LockKeyhole size={18} aria-hidden="true" />
          <input type={showPassword ? "text" : "password"} name="confirmPassword" required minLength={6} autoComplete="new-password" />
        </span>
      </label>

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

      <button className="button authSubmit" type="submit" disabled={loading || !token}>
        {loading ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <LockKeyhole size={18} aria-hidden="true" />}
        {loading ? "Đang cập nhật" : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
}
