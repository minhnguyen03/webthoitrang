"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import { AiChatSurface } from "@/components/AiChatSurface";

export function AiChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="aiWidget">
      {open ? (
        <div className="aiWidgetPanel">
          <AiChatSurface compact onClose={() => setOpen(false)} />
        </div>
      ) : null}
      <button className="aiWidgetButton" type="button" onClick={() => setOpen((current) => !current)} aria-label="Mở trợ lý AI">
        <Bot size={22} aria-hidden="true" />
        <span>AI</span>
      </button>
    </div>
  );
}
