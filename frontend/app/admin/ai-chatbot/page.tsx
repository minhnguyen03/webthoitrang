"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, AlertCircle, ArrowLeft, Bot, Database, LoaderCircle, MessageSquare, RefreshCw, ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { authFetch, hasStoredAuth } from "@/lib/auth-fetch";

type DashboardPayload = {
  health?: {
    aiService?: string;
    model?: string;
    ragVectorStore?: string;
    indexedProducts?: number;
  };
  feedback?: {
    total?: number;
    positive?: number;
    negative?: number;
    satisfactionRate?: number;
    recentNegative?: Array<{ id?: number; messageId?: string; conversationId?: string; comment?: string; createdAt?: string }>;
  };
  metrics?: {
    totalRequests?: number;
    totalErrors?: number;
    errorRate?: number;
    averageLatencyMs?: number;
    intentCounts?: Record<string, number>;
    recentEvents?: Array<{ messageId?: string; conversationId?: string; intent?: string; latencyMs?: number; error?: boolean; createdAt?: string }>;
  };
};

function isStaffUser() {
  try {
    const raw = window.localStorage.getItem("user");
    const user = raw ? (JSON.parse(raw) as { role?: string; roles?: string[] }) : null;
    return [user?.role, ...(user?.roles || [])].filter(Boolean).join(" ").match(/ADMIN|STAFF/i);
  } catch {
    return false;
  }
}

function StatCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string | number; tone?: string }) {
  return (
    <article className="aiAdminStat" data-tone={tone || "neutral"}>
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default function AiAdminDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [data, setData] = useState<DashboardPayload>({});

  const loadData = useCallback(async () => {
    if (!hasStoredAuth()) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    setMessage("");
    const response = await authFetch("/api/ai/admin/dashboard", {}, { redirectOnFailure: true }).catch(() => null);

    if (!response) {
      setMessage("Chưa kết nối được dashboard AI.");
      setLoading(false);
      return;
    }

    const payload = (await response.json().catch(() => null)) as DashboardPayload | null;
    if (!response.ok || !payload) {
      setMessage("Bạn không có quyền hoặc API dashboard AI chưa sẵn sàng.");
      setLoading(false);
      return;
    }

    setData(payload);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!hasStoredAuth() || !isStaffUser()) {
      router.replace(hasStoredAuth() ? "/profile" : "/login");
      return;
    }
    setReady(true);
    void loadData();
  }, [loadData, router]);

  if (!ready) return null;

  const intentCounts = Object.entries(data.metrics?.intentCounts || {});

  return (
    <section className="adminExperience aiAdminExperience">
      <div className="container adminShell">
        <header className="adminHeader">
          <div>
            <p className="eyebrow">AI Operations</p>
            <h1>Dashboard AI Chatbot</h1>
            <p>Giám sát trợ lý local-first, RAG index, feedback và chất lượng phản hồi.</p>
          </div>
          <span className="adminRoleBadge">
            <ShieldCheck size={16} aria-hidden="true" />
            Admin
          </span>
        </header>

        <section className="adminPanel">
          <div className="adminToolbar">
            <div>
              <Bot size={20} aria-hidden="true" />
              <span>{data.health?.model || "Local model"}</span>
            </div>
            <button className="ghostButton" type="button" onClick={loadData} disabled={loading}>
              {loading ? <LoaderCircle className="spinIcon" size={16} aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}
              Làm mới
            </button>
          </div>

          {message ? (
            <p className="adminNotice">
              <AlertCircle size={16} aria-hidden="true" />
              {message}
            </p>
          ) : null}

          <div className="aiAdminStats">
            <StatCard icon={<Activity size={22} />} label="AI service" value={data.health?.aiService || "unknown"} tone={data.health?.aiService === "running" ? "good" : "bad"} />
            <StatCard icon={<Database size={22} />} label="RAG index" value={`${data.health?.ragVectorStore || "unknown"} · ${data.health?.indexedProducts || 0} SP`} />
            <StatCard icon={<MessageSquare size={22} />} label="Requests" value={data.metrics?.totalRequests || 0} />
            <StatCard icon={<AlertCircle size={22} />} label="Error rate" value={`${data.metrics?.errorRate || 0}%`} tone={(data.metrics?.totalErrors || 0) > 0 ? "bad" : "good"} />
            <StatCard icon={<ThumbsUp size={22} />} label="Positive" value={data.feedback?.positive || 0} tone="good" />
            <StatCard icon={<ThumbsDown size={22} />} label="Negative" value={data.feedback?.negative || 0} tone="bad" />
          </div>

          <div className="aiAdminGrid">
            <article className="aiAdminPanel">
              <h2>Intent distribution</h2>
              {intentCounts.length ? (
                <div className="aiIntentList">
                  {intentCounts.map(([intent, count]) => (
                    <div key={intent}>
                      <span>{intent}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có dữ liệu intent trong phiên chạy hiện tại.</p>
              )}
            </article>

            <article className="aiAdminPanel">
              <h2>Recent events</h2>
              {data.metrics?.recentEvents?.length ? (
                <div className="aiEventList">
                  {data.metrics.recentEvents.slice(0, 8).map((event, index) => (
                    <div key={`${event.messageId}-${index}`}>
                      <span>{event.intent || "UNKNOWN"}</span>
                      <small>{event.latencyMs || 0}ms {event.error ? "· lỗi" : ""}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có request nào được ghi nhận.</p>
              )}
            </article>

            <article className="aiAdminPanel">
              <h2>Negative feedback</h2>
              {data.feedback?.recentNegative?.length ? (
                <div className="aiEventList">
                  {data.feedback.recentNegative.map((feedback) => (
                    <div key={feedback.id || feedback.messageId}>
                      <span>{feedback.messageId}</span>
                      <small>{feedback.comment || feedback.conversationId || feedback.createdAt}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có feedback tiêu cực gần đây.</p>
              )}
            </article>
          </div>

          <div className="adminQuickActions">
            <Link href="/dashboard">
              <ArrowLeft size={16} aria-hidden="true" />
              Về dashboard
            </Link>
            <Link href="/ai-chatbot">
              <Bot size={16} aria-hidden="true" />
              Mở chatbot
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
