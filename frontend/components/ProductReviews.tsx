"use client";

import Link from "next/link";
import { Check, LoaderCircle, MessageSquare, Star, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { authFetch } from "@/lib/auth-fetch";

type ReviewUser = {
  id?: number;
  fullName?: string | null;
  username?: string | null;
};

type ProductReview = {
  id: number;
  rating: number;
  title?: string | null;
  comment: string;
  user?: ReviewUser | null;
  createdAt?: string | null;
};

type ProductReviewsProps = {
  productId: number;
  averageRating?: number | null;
  totalReviews?: number | null;
};

function unwrapApiPayload(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function reviewDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function Stars({ value, interactive, onChange }: { value: number; interactive?: boolean; onChange?: (value: number) => void }) {
  return (
    <div className="reviewStars" aria-label={`${value}/5 sao`}>
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button key={star} type="button" aria-pressed={star <= value} onClick={() => onChange?.(star)}>
            <Star size={18} fill={star <= value ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        ) : (
          <Star key={star} size={18} fill={star <= value ? "currentColor" : "none"} aria-hidden="true" />
        ),
      )}
    </div>
  );
}

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, currentUserId } = useAuthSession();

  const resolvedAverage = useMemo(() => {
    if (reviews.length) {
      return reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length;
    }
    return Number(averageRating || 0);
  }, [averageRating, reviews]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/products/${productId}/reviews`).catch(() => null);
    const payload = await response?.json().catch(() => null);
    const data = unwrapApiPayload(payload);
    setReviews(Array.isArray(data) ? (data as ProductReview[]) : []);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) return;
    setSubmitting(true);
    setMessage("");

    const response = await authFetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, title: title.trim(), comment: comment.trim() }),
    }, { redirectOnFailure: true }).catch(() => null);

    setSubmitting(false);
    if (!response?.ok) {
      setMessage("Chưa gửi được đánh giá. Vui lòng kiểm tra nội dung và thử lại.");
      return;
    }

    setTitle("");
    setComment("");
    setRating(5);
    setMessage("Đánh giá của bạn đã được ghi nhận.");
    await loadReviews();
  }

  async function deleteReview(reviewId: number) {
    if (!isAuthenticated) return;
    if (!window.confirm("Xóa đánh giá này?")) return;
    const response = await authFetch(`/api/products/reviews/${reviewId}`, {
      method: "DELETE",
    }, { redirectOnFailure: true }).catch(() => null);
    if (response?.ok) {
      setMessage("Đánh giá đã được xóa.");
      await loadReviews();
    } else {
      setMessage("Chưa xóa được đánh giá.");
    }
  }

  return (
    <section className="reviewsSection" aria-labelledby="product-reviews">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Đánh giá</p>
          <h2 id="product-reviews">Khách hàng nói gì</h2>
        </div>
        <span className="rating">
          <Star size={17} fill="currentColor" aria-hidden="true" />
          {resolvedAverage ? resolvedAverage.toFixed(1) : "0.0"} ({reviews.length || totalReviews || 0})
        </span>
      </div>

      {isAuthenticated ? (
        <form className="reviewForm" onSubmit={submitReview}>
          <div className="checkoutBlockTitle">
            <MessageSquare size={18} aria-hidden="true" />
            <span>Viết đánh giá</span>
          </div>
          <Stars value={rating} interactive onChange={setRating} />
          <label className="checkoutField">
            <span>Tiêu đề</span>
            <input value={title} maxLength={200} onChange={(event) => setTitle(event.target.value)} placeholder="Ví dụ: Vừa vặn và chất vải đẹp" />
          </label>
          <label className="checkoutField">
            <span>Nội dung</span>
            <textarea value={comment} minLength={10} maxLength={2000} onChange={(event) => setComment(event.target.value)} rows={4} required />
          </label>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="spinIcon" size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
            Gửi đánh giá
          </button>
        </form>
      ) : (
        <div className="reviewLoginHint">
          <MessageSquare size={18} aria-hidden="true" />
          <span>Đăng nhập để viết đánh giá sau khi mua hàng.</span>
          <Link href="/login">Đăng nhập</Link>
        </div>
      )}

      {message ? <p className="checkoutHint">{message}</p> : null}

      <div className="reviewsList">
        {loading ? (
          <p className="checkoutHint">Đang tải đánh giá...</p>
        ) : reviews.length ? (
          reviews.map((review) => (
            <article className="reviewCard" key={review.id}>
              <div>
                <Stars value={review.rating} />
                <strong>{review.title || "Đánh giá sản phẩm"}</strong>
                <p>{review.comment}</p>
                <span>
                  {review.user?.fullName || review.user?.username || "Khách hàng"}
                  {reviewDate(review.createdAt) ? ` · ${reviewDate(review.createdAt)}` : ""}
                </span>
              </div>
              {currentUserId && review.user?.id === currentUserId ? (
                <button className="iconButton" type="button" title="Xóa đánh giá" onClick={() => void deleteReview(review.id)}>
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="checkoutHint">Sản phẩm chưa có đánh giá.</p>
        )}
      </div>
    </section>
  );
}
