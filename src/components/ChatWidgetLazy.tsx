"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { CHAT_CONFIG } from "@/lib/chat-config";

const ChatWidgetFull = dynamic(() => import("./ChatWidget"), {
  ssr: false,
  loading: () => null,
});

export default function ChatWidgetLazy() {
  const [activated, setActivated] = useState(false);

  const handleActivate = useCallback(() => {
    setActivated(true);
  }, []);

  if (activated) {
    return <ChatWidgetFull defaultOpen />;
  }

  return (
    <button
      onClick={handleActivate}
      aria-label="Open chat"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        height: "48px",
        borderRadius: "24px",
        padding: "0 20px",
        background: "#1a1a2e",
        color: "#F48B00",
        border: "2px solid #F48B00",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        zIndex: 9999,
        fontSize: "14px",
        fontWeight: 600,
        whiteSpace: "nowrap" as const,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span>{CHAT_CONFIG.buttonText}</span>
    </button>
  );
}
