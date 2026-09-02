"use client";

import { useChat } from "@ai-sdk/react";
import type { ChatUIMessage } from "@/app/api/chat/route";
import { useState, useRef, useEffect, useCallback } from "react";
import { CHAT_CONFIG } from "@/lib/chat-config";

// Returned fresh per mount, not shared. The chat state stores this array by
// reference (only its setter copies), so a module-level constant would be
// live state shared across mounts. Typed as ChatUIMessage[] so the message
// type stays the full union — an untyped literal narrows `role` to
// "assistant" and every `role === "user"` check below becomes a compile error.
function createWelcomeMessages(): ChatUIMessage[] {
  return [
    {
      id: "welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: CHAT_CONFIG.welcomeMessage,
        },
      ],
    },
  ];
}

export default function ChatWidget({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // useState initialiser runs once per mount, matching the per-mount literal
  // this replaced.
  const [welcomeMessages] = useState<ChatUIMessage[]>(createWelcomeMessages);

  const { messages, sendMessage, status, error } = useChat<ChatUIMessage>({
    messages: welcomeMessages,
    onError: (err) => {
      console.error("[ChatWidget] Error:", err);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";
  const hasUserMessages = messages.some((m) => m.role === "user");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput("");
      sendMessage({ text });
    },
    [input, isLoading, sendMessage]
  );

  const handleQuickStart = useCallback(
    (text: string) => {
      if (isLoading) return;
      sendMessage({ text });
    },
    [isLoading, sendMessage]
  );

  function renderMessageContent(msg: ChatUIMessage) {
    if (!msg.parts || msg.parts.length === 0) return null;

    return msg.parts.map((part, i) => {
      if (part.type === "text") {
        return (
          <span key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {part.text}
          </span>
        );
      }

      // Booking button. The part type is `tool-<toolName>` and the output only
      // exists once the tool has run — anything earlier has no link to render.
      // capture_lead is a background operation, so it deliberately renders
      // nothing and falls through.
      if (part.type === "tool-suggest_booking" && part.state === "output-available") {
        return (
          <a
            key={i}
            href={part.output.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              color: "#1a1a2e",
              backgroundColor: "#F48B00",
              textDecoration: "none",
              textAlign: "center",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {part.output.label} →
          </a>
        );
      }

      return null;
    });
  }

  return (
    <>
      {/* Chat Toggle — pill with text when closed, circle X when open */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          height: "48px",
          borderRadius: isOpen ? "50%" : "24px",
          width: isOpen ? "48px" : "auto",
          padding: isOpen ? "0" : "0 20px",
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
          transition: "all 0.2s",
          fontSize: "14px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{CHAT_CONFIG.buttonText}</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            right: "24px",
            width: "380px",
            maxWidth: "calc(100vw - 48px)",
            height: "520px",
            maxHeight: "calc(100vh - 120px)",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            zIndex: 9998,
            border: "1px solid #F48B00",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#1a1a2e",
              color: "#ffffff",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>{CHAT_CONFIG.headerTitle}</div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                {CHAT_CONFIG.headerSubtitle}
              </div>
            </div>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4ade80",
                flexShrink: 0,
              }}
            />
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              background: "#f9f9fb",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 2px 12px"
                        : "12px 12px 12px 2px",
                    background: msg.role === "user" ? "#1a1a2e" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#1a1a1a",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}

            {/* Quick-start buttons — show only before any user messages */}
            {!hasUserMessages && !isLoading && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  paddingTop: "4px",
                }}
              >
                {CHAT_CONFIG.quickStarts.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickStart(label)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      border: "1px solid #F48B00",
                      background: "transparent",
                      color: "#1a1a2e",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F48B00";
                      e.currentTarget.style.color = "#1a1a2e";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#1a1a2e";
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "#ffffff",
                    fontSize: "14px",
                    color: "#999",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  ...
                </div>
              </div>
            )}
            {error && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "#fff0f0",
                    fontSize: "14px",
                    color: "#b91c1c",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  The assistant is temporarily unavailable. Please try again.
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              padding: "12px",
              background: "#ffffff",
              borderTop: "1px solid #e0e0e0",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your team..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d0d0d0",
                fontSize: "14px",
                outline: "none",
                background: "#f9f9fb",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#F48B00")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d0d0d0")}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: isLoading || !input.trim() ? "#ccc" : "#F48B00",
                color: "#1a1a2e",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              background: "#ffffff",
              padding: "6px 12px",
              textAlign: "center",
              fontSize: "11px",
              color: "#999",
              borderTop: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
          >
            Powered by Learn2
          </div>
        </div>
      )}
    </>
  );
}
