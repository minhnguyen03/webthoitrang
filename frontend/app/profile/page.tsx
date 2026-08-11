"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Home, LoaderCircle, LogOut, MapPin, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { authFetch, clearStoredAuth, hasStoredAuth } from "@/lib/auth-fetch";

type Address = {
  id: number;
  label?: string;
  receiverName: string;
  phone: string;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  city: string;
  country?: string;
  isDefault?: boolean;
};

type Profile = {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  loyaltyPoint?: number;
  addresses?: Address[];
  defaultAddress?: Address;
};

type AddressFormState = {
  id?: number;
  label: string;
  receiverName: string;
  phone: string;
  line1: string;
  line2: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
};

type ProfileFormState = {
  fullName: string;
  phone: string;
  gender: string;
  birthday: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyAddress: AddressFormState = {
  label: "",
  receiverName: "",
  phone: "",
  line1: "",
  line2: "",
  ward: "",
  district: "",
  city: "TP. Hồ Chí Minh",
  isDefault: false,
};

const emptyProfileForm: ProfileFormState = {
  fullName: "",
  phone: "",
  gender: "",
  birthday: "",
};

const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function payloadMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    return String(record.message || record.error || fallback);
  }
  return fallback;
}

function toFormState(address?: Address): AddressFormState {
  if (!address) return emptyAddress;
  return {
    id: address.id,
    label: address.label || "",
    receiverName: address.receiverName || "",
    phone: address.phone || "",
    line1: address.line1 || "",
    line2: address.line2 || "",
    ward: address.ward || "",
    district: address.district || "",
    city: address.city || "TP. Hồ Chí Minh",
    isDefault: Boolean(address.isDefault),
  };
}

function toProfileForm(profile?: Profile | null): ProfileFormState {
  return {
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    gender: profile?.gender || "",
    birthday: profile?.birthday || "",
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddress);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!hasStoredAuth()) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    const response = await authFetch("/api/profile", {}, { redirectOnFailure: true }).catch(() => null);

    if (!response?.ok) {
      clearStoredAuth();
      router.replace("/login");
      return;
    }

    const data = (await response.json()) as Profile;
    setProfile(data);
    setProfileForm(toProfileForm(data));
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function updateAddress(field: keyof AddressFormState, value: string | boolean) {
    setAddressForm((current) => ({ ...current, [field]: value }));
  }

  function updateProfile(field: keyof ProfileFormState, value: string) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function updatePassword(field: keyof PasswordFormState, value: string) {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasStoredAuth()) return;

    setSavingProfile(true);
    setMessage("");
    const response = await authFetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...profileForm,
        gender: profileForm.gender || null,
        birthday: profileForm.birthday || null,
      }),
    }, { redirectOnFailure: true }).catch(() => null);

    const payload = await response?.json().catch(() => null);
    setSavingProfile(false);
    if (!response?.ok) {
      setMessage(payloadMessage(payload, "Chưa cập nhật được hồ sơ. Vui lòng kiểm tra lại họ tên và số điện thoại."));
      return;
    }

    setMessage("Thông tin cá nhân đã được cập nhật.");
    await loadProfile();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasStoredAuth()) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setSavingPassword(true);
    setMessage("");
    const response = await authFetch("/api/profile/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordForm),
    }, { redirectOnFailure: true }).catch(() => null);

    const payload = await response?.json().catch(() => null);
    setSavingPassword(false);
    if (!response?.ok) {
      setMessage(payloadMessage(payload, "Chưa đổi được mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại."));
      return;
    }

    setPasswordForm(emptyPasswordForm);
    setMessage(payloadMessage(payload, "Mật khẩu đã được cập nhật."));
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasStoredAuth()) return;

    setSavingAddress(true);
    setMessage("");
    const url = addressForm.id ? `/api/profile/addresses/${addressForm.id}` : "/api/profile/addresses";
    const response = await authFetch(url, {
      method: addressForm.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...addressForm,
        country: "Vietnam",
      }),
    }, { redirectOnFailure: true }).catch(() => null);

    const payload = await response?.json().catch(() => null);
    setSavingAddress(false);
    if (!response?.ok) {
      setMessage(payloadMessage(payload, "Chưa lưu được địa chỉ. Vui lòng kiểm tra lại thông tin."));
      return;
    }

    setMessage("Địa chỉ đã được lưu.");
    setAddressForm(emptyAddress);
    await loadProfile();
  }

  async function setDefaultAddress(address: Address) {
    if (!hasStoredAuth()) return;
    const response = await authFetch(`/api/profile/addresses/${address.id}/default`, {
      method: "PUT",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      setMessage("Đã đặt địa chỉ mặc định.");
      await loadProfile();
    }
  }

  async function deleteAddress(address: Address) {
    if (!window.confirm("Xóa địa chỉ này?")) return;
    if (!hasStoredAuth()) return;
    const response = await authFetch(`/api/profile/addresses/${address.id}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      setMessage("Địa chỉ đã được xóa.");
      await loadProfile();
    }
  }

  function logout() {
    clearStoredAuth();
    router.replace("/login");
  }

  if (loading) {
    return (
      <section className="profileExperience">
        <div className="container profileShell">
          <div className="profileHeader">
            <LoaderCircle className="spinIcon" size={28} aria-hidden="true" />
            <h1>Đang tải hồ sơ...</h1>
          </div>
        </div>
      </section>
    );
  }

  const addresses = profile?.addresses || [];

  return (
    <section className="profileExperience">
      <div className="container profileShell">
        <header className="profileHeader">
          <div className="profileAvatar">
            <UserRound size={28} aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Tài khoản</p>
            <h1>{profile?.fullName || profile?.email}</h1>
            <p>{profile?.email}</p>
          </div>
          <button className="ghostButton profileLogout" type="button" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Đăng xuất
          </button>
        </header>

        {message ? <p className="ordersNotice" data-tone="success">{message}</p> : null}

        <div className="profileGrid">
          <section className="profileInfoList">
            <h2>Thông tin cá nhân</h2>
            <form className="checkoutForm" onSubmit={saveProfile}>
              <label className="checkoutField">
                <span>Họ tên</span>
                <input value={profileForm.fullName} onChange={(event) => updateProfile("fullName", event.target.value)} required />
              </label>
              <label className="checkoutField">
                <span>Số điện thoại</span>
                <input value={profileForm.phone} onChange={(event) => updateProfile("phone", event.target.value)} pattern="[0-9]{10}" required />
              </label>
              <div className="checkoutGrid">
                <label className="checkoutField">
                  <span>Giới tính</span>
                  <select value={profileForm.gender} onChange={(event) => updateProfile("gender", event.target.value)}>
                    <option value="">Chưa chọn</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </label>
                <label className="checkoutField">
                  <span>Ngày sinh</span>
                  <input type="date" value={profileForm.birthday} onChange={(event) => updateProfile("birthday", event.target.value)} />
                </label>
              </div>
              <p><span>Điểm tích lũy</span><strong>{profile?.loyaltyPoint ?? 0} điểm</strong></p>
              <button className="button profileAction" type="submit" disabled={savingProfile}>
                {savingProfile ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
                {savingProfile ? "Đang lưu" : "Lưu hồ sơ"}
              </button>
            </form>
            <Link className="button profileAction" href="/orders">Xem đơn hàng</Link>
          </section>

          <section className="profileSecurity">
            <h2>Sổ địa chỉ</h2>
            {addresses.length ? (
              <div className="adminRecordList">
                {addresses.map((address) => (
                  <div className="adminRecordRow" key={address.id}>
                    <MapPin size={16} aria-hidden="true" />
                    <div>
                      <strong>{address.label || address.receiverName}</strong>
                      <span>{address.line1}, {address.ward ? `${address.ward}, ` : ""}{address.district ? `${address.district}, ` : ""}{address.city}</span>
                      <span>{address.receiverName} · {address.phone}</span>
                    </div>
                    {address.isDefault ? <em data-tone="success">Mặc định</em> : null}
                    <button className="iconButton" type="button" title="Sửa" onClick={() => setAddressForm(toFormState(address))}>
                      <Home size={16} aria-hidden="true" />
                    </button>
                    {!address.isDefault ? (
                      <button className="iconButton" type="button" title="Đặt mặc định" onClick={() => void setDefaultAddress(address)}>
                        <Check size={16} aria-hidden="true" />
                      </button>
                    ) : null}
                    <button className="iconButton" type="button" title="Xóa" onClick={() => void deleteAddress(address)}>
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Chưa có địa chỉ. Thêm địa chỉ để checkout tự điền thông tin giao hàng.</p>
            )}
          </section>
        </div>

        <section className="adminModernPanel">
          <div className="adminPanelTitle">
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <h2>Đổi mật khẩu</h2>
              <p>Bảo vệ tài khoản bằng mật khẩu mới có tối thiểu 6 ký tự.</p>
            </div>
          </div>

          <form className="checkoutForm" onSubmit={changePassword}>
            <div className="checkoutGrid">
              <label className="checkoutField">
                <span>Mật khẩu hiện tại</span>
                <input type="password" value={passwordForm.currentPassword} onChange={(event) => updatePassword("currentPassword", event.target.value)} required />
              </label>
              <label className="checkoutField">
                <span>Mật khẩu mới</span>
                <input type="password" value={passwordForm.newPassword} onChange={(event) => updatePassword("newPassword", event.target.value)} minLength={6} required />
              </label>
            </div>
            <label className="checkoutField">
              <span>Xác nhận mật khẩu mới</span>
              <input type="password" value={passwordForm.confirmPassword} onChange={(event) => updatePassword("confirmPassword", event.target.value)} minLength={6} required />
            </label>
            <button className="button" type="submit" disabled={savingPassword}>
              {savingPassword ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
              {savingPassword ? "Đang đổi" : "Đổi mật khẩu"}
            </button>
          </form>
        </section>

        <section className="adminModernPanel">
          <div className="adminPanelTitle">
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <h2>{addressForm.id ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}</h2>
              <p>Địa chỉ mặc định sẽ được dùng trước trong trang thanh toán.</p>
            </div>
          </div>

          <form className="checkoutForm" onSubmit={saveAddress}>
            <div className="checkoutGrid">
              <label className="checkoutField">
                <span>Nhãn</span>
                <input value={addressForm.label} onChange={(event) => updateAddress("label", event.target.value)} placeholder="Nhà riêng, Công ty" />
              </label>
              <label className="checkoutField">
                <span>Người nhận</span>
                <input value={addressForm.receiverName} onChange={(event) => updateAddress("receiverName", event.target.value)} required />
              </label>
            </div>
            <div className="checkoutGrid">
              <label className="checkoutField">
                <span>Số điện thoại</span>
                <input value={addressForm.phone} onChange={(event) => updateAddress("phone", event.target.value)} required />
              </label>
              <label className="checkoutField">
                <span>Tỉnh/Thành</span>
                <input value={addressForm.city} onChange={(event) => updateAddress("city", event.target.value)} required />
              </label>
            </div>
            <label className="checkoutField">
              <span>Địa chỉ</span>
              <input value={addressForm.line1} onChange={(event) => updateAddress("line1", event.target.value)} required />
            </label>
            <div className="checkoutGrid">
              <label className="checkoutField">
                <span>Phường/Xã</span>
                <input value={addressForm.ward} onChange={(event) => updateAddress("ward", event.target.value)} />
              </label>
              <label className="checkoutField">
                <span>Quận/Huyện</span>
                <input value={addressForm.district} onChange={(event) => updateAddress("district", event.target.value)} />
              </label>
            </div>
            <label className="authRemember">
              <input type="checkbox" checked={addressForm.isDefault} onChange={(event) => updateAddress("isDefault", event.target.checked)} />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
            <button className="button" type="submit" disabled={savingAddress}>
              {savingAddress ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {savingAddress ? "Đang lưu" : addressForm.id ? "Lưu địa chỉ" : "Thêm địa chỉ"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
