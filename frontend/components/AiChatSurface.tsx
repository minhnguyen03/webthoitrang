"use client";

import { Bot, Copy, ExternalLink, LoaderCircle, Mic, Send, Sparkles, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { authFetch, getStoredAccessToken, hasStoredAuth, refreshAccessToken } from "@/lib/auth-fetch";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  intent?: string;
};

type AiAction = {
  id?: string;
  label?: string;
  message?: string;
  href?: string;
};

type AiProduct = {
  id?: number;
  slug?: string;
  name?: string;
  brand?: string;
  price?: number;
  availableSizes?: string[];
  availableColors?: string[];
  stockStatus?: string;
};

type AiResponse = {
  messageId?: string;
  conversationId?: string;
  intent?: string;
  answer?: string;
  response?: string;
  actions?: AiAction[];
  products?: AiProduct[];
  error?: boolean;
};

type AiChatSurfaceProps = {
  compact?: boolean;
  onClose?: () => void;
};

const HISTORY_KEY = "fashion-ai-history";
const CONVERSATION_KEY = "fashion-ai-conversation-id";

const starterActions: AiAction[] = [
  { id: "recommend", label: "Gợi ý sản phẩm", message: "Gợi ý sản phẩm phù hợp cho tôi" },
  { id: "size", label: "Tư vấn size", message: "Tư vấn chọn size cho người cao 1m70 nặng 65kg" },
  { id: "promo", label: "Khuyến mãi", message: "Có mã giảm giá nào không?" },
  { id: "order", label: "Đơn hàng", message: "Xem đơn hàng của tôi", href: "/orders" },
];

function createId(prefix = "msg") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readConversationId() {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem(CONVERSATION_KEY);
  if (existing) return existing;
  const next = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem(CONVERSATION_KEY, next);
  return next;
}

function formatMoney(value?: number) {
  if (!value) return "";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[2]) {
      nodes.push(<strong key={`${match.index}-b`}>{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      const href = match[4];
      nodes.push(
        href.startsWith("/") ? (
          <Link key={`${match.index}-l`} className="aiTextLink" href={href}>
            {match[3]}
          </Link>
        ) : (
          <a key={`${match.index}-l`} className="aiTextLink" href={href} target="_blank" rel="noreferrer">
            {match[3]}
          </a>
        ),
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function parseStreamPayload(data: string) {
  try {
    const parsed = JSON.parse(data) as { text?: string };
    return typeof parsed.text === "string" ? parsed.text : data;
  } catch {
    return data;
  }
}

function renderMessageLine(line: string, index: number) {
  const ordered = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
  if (ordered) {
    return (
      <div className="aiTextListItem" key={`${index}-${line.slice(0, 12)}`}>
        <span>{ordered[1]}.</span>
        <p>{renderInline(ordered[2])}</p>
      </div>
    );
  }

  const bullet = line.match(/^\s*[-*]\s+(.+)$/);
  if (bullet) {
    return (
      <div className="aiTextListItem" key={`${index}-${line.slice(0, 12)}`}>
        <span>•</span>
        <p>{renderInline(bullet[1])}</p>
      </div>
    );
  }

  return <p key={`${index}-${line.slice(0, 12)}`}>{renderInline(line || " ")}</p>;
}

function ChatText({ text }: { text: string }) {
  return (
    <div className="aiMessageText">
      {text.split("\n").map((line, index) => renderMessageLine(line, index))}
    </div>
  );
}

export function AiChatSurface({ compact = false, onClose }: AiChatSurfaceProps) {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Xin chào, mình là trợ lý AI thời trang. Mình có thể tư vấn sản phẩm, size, phối đồ, khuyến mãi, thanh toán và tra cứu đơn hàng khi bạn đăng nhập.",
    },
  ]);
  const [actions, setActions] = useState<AiAction[]>(starterActions);
  const [products, setProducts] = useState<AiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const title = compact ? "Fashion AI" : "Tư vấn mua sắm cùng Fashion AI";

  useEffect(() => {
    setConversationId(readConversationId());
    try {
      const raw = window.sessionStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (parsed.length) setMessages(parsed);
      }
    } catch {
      // Ignore broken local session state.
    }

    const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechCtor) {
      const recognition = new SpeechCtor();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        setDraft(event.results[0][0].transcript);
        setListening(false);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  const canUseVoice = useMemo(() => Boolean(recognitionRef.current), [recognitionRef.current]);

  async function submitMessage(message: string) {
    const clean = message.trim();
    if (!clean || loading) return;

    const userMessage: ChatMessage = { id: createId("user"), role: "user", text: clean };
    const assistantId = createId("assistant");
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", text: "" }]);
    setDraft("");
    setLoading(true);
    setProducts([]);

    const token = getStoredAccessToken() || (await refreshAccessToken()) || "";
    const params = new URLSearchParams({ message: clean, conversationId: conversationId || readConversationId() });
    if (token) params.set("token", token);

    try {
      await streamResponse(params, assistantId);
    } catch {
      await fallbackPost(clean, assistantId);
    } finally {
      setLoading(false);
    }
  }

  async function streamResponse(params: URLSearchParams, assistantId: string) {
    await new Promise<void>((resolve, reject) => {
      const eventSource = new EventSource(`/api/ai/chat/stream?${params.toString()}`);
      let fullText = "";
      let messageId = assistantId;

      eventSource.addEventListener("meta", (event) => {
        try {
          const meta = JSON.parse((event as MessageEvent).data) as AiResponse;
          if (meta.conversationId) {
            setConversationId(meta.conversationId);
            window.sessionStorage.setItem(CONVERSATION_KEY, meta.conversationId);
          }
          if (meta.messageId) messageId = meta.messageId;
          if (meta.actions?.length) setActions(meta.actions);
          if (meta.products) setProducts(meta.products);
        } catch {
          // Meta is optional for legacy-compatible streams.
        }
      });

      eventSource.addEventListener("chunk", (event) => {
        fullText += parseStreamPayload((event as MessageEvent).data);
        setMessages((current) => current.map((msg) => (msg.id === assistantId ? { ...msg, id: messageId, text: fullText } : msg)));
      });

      eventSource.addEventListener("error", (event) => {
        const data = parseStreamPayload((event as MessageEvent).data);
        if (data) {
          fullText = data;
          setMessages((current) => current.map((msg) => (msg.id === assistantId ? { ...msg, text: data } : msg)));
          eventSource.close();
          resolve();
        } else {
          eventSource.close();
          reject(new Error("SSE failed"));
        }
      });

      eventSource.addEventListener("done", () => {
        eventSource.close();
        resolve();
      });
    });
  }

  async function fallbackPost(message: string, assistantId: string) {
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, conversationId }),
    };
    const response = hasStoredAuth()
      ? await authFetch("/api/ai/chat", requestInit)
      : await fetch("/api/ai/chat", requestInit);
    if (!response) throw new Error("Auth failed");
    const data = (await response.json()) as AiResponse;
    if (data.conversationId) {
      setConversationId(data.conversationId);
      window.sessionStorage.setItem(CONVERSATION_KEY, data.conversationId);
    }
    setActions(data.actions?.length ? data.actions : starterActions);
    setProducts(data.products || []);
    setMessages((current) =>
      current.map((msg) =>
        msg.id === assistantId
          ? { ...msg, id: data.messageId || msg.id, text: data.answer || data.response || "Mình chưa có câu trả lời phù hợp.", intent: data.intent }
          : msg,
      ),
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMessage(draft);
  }

  function clearChat() {
    const next = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(CONVERSATION_KEY, next);
    window.sessionStorage.removeItem(HISTORY_KEY);
    setConversationId(next);
    setProducts([]);
    setActions(starterActions);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Mình đã mở cuộc trò chuyện mới. Bạn muốn tìm sản phẩm, hỏi size hay kiểm tra khuyến mãi?",
      },
    ]);
  }

  async function sendFeedback(messageId: string, rating: "POSITIVE" | "NEGATIVE") {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, conversationId, rating }),
    };
    if (hasStoredAuth()) {
      await authFetch("/api/ai/feedback", requestInit).catch(() => null);
      return;
    }
    await fetch("/api/ai/feedback", requestInit).catch(() => null);
  }

  function toggleVoice() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  }

  return (
    <section className={compact ? "aiChatSurface aiChatSurfaceCompact" : "aiChatSurface"}>
      <header className="aiChatHeader">
        <div>
          <p className="eyebrow">Local-first assistant</p>
          <h1>
            <Bot size={compact ? 18 : 26} aria-hidden="true" />
            {title}
          </h1>
        </div>
        <div className="aiChatHeaderActions">
          <button type="button" className="iconButton" onClick={clearChat} title="Xóa cuộc trò chuyện" aria-label="Xóa cuộc trò chuyện">
            <Trash2 size={17} aria-hidden="true" />
          </button>
          {onClose ? (
            <button type="button" className="iconButton" onClick={onClose} title="Đóng" aria-label="Đóng">
              <X size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="aiQuickActions">
        {actions.map((action) =>
          action.href ? (
            <Link key={`${action.id}-${action.label}`} href={action.href}>
              {action.label} <ExternalLink size={13} aria-hidden="true" />
            </Link>
          ) : (
            <button key={`${action.id}-${action.label}`} type="button" onClick={() => submitMessage(action.message || action.label || "")}>
              <Sparkles size={14} aria-hidden="true" />
              {action.label}
            </button>
          ),
        )}
      </div>

      <div className="aiMessages" aria-live="polite">
        {messages.map((message) => (
          <article className="aiMessage" data-role={message.role} key={message.id}>
            <div className="aiBubble">
              {message.text ? <ChatText text={message.text} /> : <span className="aiTyping">Đang trả lời...</span>}
              {message.role === "assistant" && message.id !== "welcome" ? (
                <div className="aiMessageTools">
                  <button type="button" onClick={() => navigator.clipboard?.writeText(message.text)} title="Sao chép">
                    <Copy size={14} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => sendFeedback(message.id, "POSITIVE")} title="Hữu ích">
                    <ThumbsUp size={14} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => sendFeedback(message.id, "NEGATIVE")} title="Chưa tốt">
                    <ThumbsDown size={14} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
        {products.length ? (
          <div className="aiProductStrip">
            {products.slice(0, compact ? 2 : 4).map((product) => (
              <Link className="aiProductCard" href={`/products/${product.slug || product.id}`} key={`${product.id}-${product.slug}`}>
                <strong>{product.name}</strong>
                <span>{product.brand || "Fashion Shop"}</span>
                <b>{formatMoney(product.price)}</b>
                {product.availableColors?.length ? <small>Mau: {product.availableColors.slice(0, 3).join(", ")}</small> : null}
                {product.availableSizes?.length ? <small>Size: {product.availableSizes.slice(0, 4).join(", ")}</small> : null}
                <small>{product.stockStatus === "OUT_OF_STOCK" ? "Hết hàng" : "Còn hàng"}</small>
              </Link>
            ))}
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <form className="aiComposer" onSubmit={submit}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Nhập câu hỏi của bạn..." maxLength={2000} />
        {canUseVoice ? (
          <button type="button" className={listening ? "iconButton isActive" : "iconButton"} onClick={toggleVoice} title="Nhập bằng giọng nói" aria-label="Nhập bằng giọng nói">
            <Mic size={17} aria-hidden="true" />
          </button>
        ) : null}
        <button className="button" type="submit" disabled={loading || !draft.trim()}>
          {loading ? <LoaderCircle className="spinIcon" size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
          {compact ? "" : "Gửi"}
        </button>
      </form>
    </section>
  );
}
