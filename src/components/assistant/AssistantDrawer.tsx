"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/localized";
import type {
  AssistantMessage,
  AssistantChatResponse,
} from "@/modules/assistant/types";

// Helper to render basic markdown formatting safely (bold, headers, bullets, links)
function renderFormattedContent(text: string) {
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Header 3
    if (trimmed.startsWith("### ")) {
      return (
        <h4
          key={idx}
          className="font-bold text-base mt-2 mb-1 display tracking-tight"
        >
          {parseInlineLinksAndBold(trimmed.slice(4))}
        </h4>
      );
    }

    // Bullet list
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      return (
        <div key={idx} className="flex items-start gap-2 text-sm my-0.5">
          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
          <span className="leading-relaxed">
            {parseInlineLinksAndBold(trimmed.slice(2))}
          </span>
        </div>
      );
    }

    return (
      <p key={idx} className="text-sm leading-relaxed my-1">
        {parseInlineLinksAndBold(trimmed)}
      </p>
    );
  });
}

function parseInlineLinksAndBold(text: string) {
  // Regex to split on [label](url) and **bold**
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const match = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, label, url] = match;
        const isInternal = url.startsWith("/");
        if (isInternal) {
          return (
            <Link
              key={i}
              href={url}
              className="font-medium text-emerald-700 underline decoration-emerald-400 hover:text-emerald-900 transition-colors"
            >
              {label}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline decoration-emerald-400 hover:text-emerald-900 transition-colors"
          >
            {label}
          </a>
        );
      }
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-semibold text-ink">{token.slice(2, -2)}</strong>;
    }

    return token;
  });
}

let messageSeq = 0;
function createAssistantMessage(
  role: "user" | "assistant",
  content: string,
  extra?: { caseSlugs?: string[]; isFallback?: boolean }
): AssistantMessage {
  messageSeq += 1;
  return {
    id: `${role}-${messageSeq}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}

export default function AssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeLocale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );

  const copy = getMessages(activeLocale).assistant;

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function handleSendMessage(queryToSend?: string) {
    const text = (queryToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMsg = createAssistantMessage("user", text);

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          locale: activeLocale,
        }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = (await res.json()) as AssistantChatResponse;

      const assistantMsg = createAssistantMessage("assistant", data.reply, {
        caseSlugs: data.caseSlugs,
        isFallback: data.isFallback,
      });

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg = createAssistantMessage("assistant", copy.errorText);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    setMessages([]);
  }

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={copy.triggerAria}
        className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-[#16211c] text-[#eceee2] shadow-xl hover:bg-[#22332c] hover:shadow-2xl active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus-visible:ring-3 focus-visible:ring-[#1f4bff] ${
          isOpen
            ? "opacity-0 scale-75 pointer-events-none translate-y-3"
            : "opacity-100 scale-100 pointer-events-auto translate-y-0"
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 7v2" />
          <path d="M12 13h.01" />
        </svg>
        <span className="text-sm font-medium tracking-tight display">
          {copy.triggerButton}
        </span>
      </button>

      {/* Silky Backdrop with graceful fade-in / fade-out */}
      <div
        role="presentation"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/45 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "opacity-100 pointer-events-auto backdrop-blur-xs"
            : "opacity-0 pointer-events-none backdrop-blur-none"
        }`}
      />

      {/* Slide-over Drawer Panel with fluid spring slide */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-title"
        data-lenis-prevent
        className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#eceee2] text-[#16211c] shadow-[-20px_0_50px_rgba(0,0,0,0.22)] flex flex-col border-l border-[#16211c]/15 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <header className="px-5 py-4 bg-[#f4f5ea] border-b border-[#16211c]/15 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <h2
                id="assistant-title"
                className="text-base font-bold display leading-tight tracking-tight text-[#16211c]"
              >
                {copy.drawerTitle}
              </h2>
            </div>
            <p className="text-xs text-[#16211c]/70 mt-0.5">
              {copy.drawerSubtitle}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {copy.badgeGrounded}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dde3d2] text-[#16211c]/80 border border-[#16211c]/15">
                {copy.outOfScopeNotice}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                title={copy.clearChat}
                className="p-1.5 rounded text-[#16211c]/60 hover:text-[#16211c] hover:bg-[#dde3d2] transition-colors"
                aria-label={copy.clearChat}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded text-[#16211c]/60 hover:text-[#16211c] hover:bg-[#dde3d2] transition-colors"
              aria-label="Tutup"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Message Thread */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-lg bg-[#f4f5ea] border border-[#16211c]/10 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm display text-[#16211c]">
                  {copy.emptyTitle}
                </h3>
                <p className="text-xs text-[#16211c]/70 mt-1 leading-relaxed">
                  {copy.emptySubtitle}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#16211c]/60 mb-2.5 uppercase tracking-wider">
                  {copy.suggestionsTitle}
                </p>
                <div className="flex flex-col gap-2">
                  {copy.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="group text-left text-xs p-3 rounded-lg bg-[#f4f5ea] border border-[#16211c]/12 hover:border-emerald-600 hover:bg-emerald-50/60 active:scale-[0.98] transition-all duration-200 text-[#16211c] shadow-2xs flex items-center justify-between gap-2"
                    >
                      <span className="leading-snug">{sug}</span>
                      <span className="text-emerald-600 font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col assistant-msg-bubble ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-4 py-3 text-sm shadow-xs ${
                    m.role === "user"
                      ? "bg-[#16211c] text-[#eceee2] rounded-br-xs"
                      : "bg-[#f4f5ea] text-[#16211c] border border-[#16211c]/15 rounded-bl-xs"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div>
                      {renderFormattedContent(m.content)}

                      {/* Case Pill Links */}
                      {m.caseSlugs && m.caseSlugs.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#16211c]/10 flex flex-wrap gap-1.5">
                          {m.caseSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={`/cases/${slug}`}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#dde3d2] hover:bg-emerald-200 text-[#16211c] text-xs font-semibold transition-colors"
                            >
                              <span>↗</span>
                              <span>{slug}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Local Fallback Notice */}
                      {m.isFallback && (
                        <div className="mt-2 text-[10px] text-[#16211c]/50 italic">
                          * {copy.badgeLocal}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#16211c]/40 mt-1 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#16211c]/60 p-3 rounded-lg bg-[#f4f5ea] border border-[#16211c]/10 max-w-[75%]">
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-[#16211c]/30 border-t-emerald-600 rounded-full" />
              <span>{copy.loading}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-3 bg-[#f4f5ea] border-t border-[#16211c]/15 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-sm rounded-lg bg-[#eceee2] border border-[#16211c]/20 text-[#16211c] placeholder:text-[#16211c]/45 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label={copy.sendButton}
              className="px-3.5 py-2.5 rounded-lg bg-[#16211c] text-[#eceee2] hover:bg-[#22332c] disabled:opacity-40 disabled:hover:bg-[#16211c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-center text-[#16211c]/50 mt-2">
            {copy.disclaimer}
          </p>
        </footer>
      </div>
    </>
  );
}
