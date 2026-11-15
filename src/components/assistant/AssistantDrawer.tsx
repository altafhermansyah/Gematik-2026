"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { getMessages } from "@/lib/i18n/messages";
import { localeHref } from "@/lib/i18n/urls";
import type { Locale } from "@/lib/i18n/localized";
import type {
  AssistantMessage,
  AssistantChatResponse,
} from "@/modules/assistant/types";

// Helper to render basic markdown formatting safely (bold, headers, bullets, links)
function renderFormattedContent(
  text: string,
  locale: Locale,
  onNavigate?: () => void
) {
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
          className="font-bold text-base mt-2 mb-1 display tracking-tight text-[#16211c]"
        >
          {parseInlineLinksAndBold(trimmed.slice(4), locale, onNavigate)}
        </h4>
      );
    }

    // Bullet list
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      return (
        <div key={idx} className="flex items-start gap-2 text-sm my-0.5">
          <span
            className="text-[#0c5e46] font-bold shrink-0 mt-0.5"
            aria-hidden="true"
          >
            •
          </span>
          <span className="leading-relaxed">
            {parseInlineLinksAndBold(trimmed.slice(2), locale, onNavigate)}
          </span>
        </div>
      );
    }

    return (
      <p key={idx} className="text-sm leading-relaxed my-1">
        {parseInlineLinksAndBold(trimmed, locale, onNavigate)}
      </p>
    );
  });
}

function parseInlineLinksAndBold(
  text: string,
  locale: Locale,
  onNavigate?: () => void
) {
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
              href={localeHref(url, locale)}
              onClick={onNavigate}
              className="font-semibold text-[#0c5e46] underline decoration-[#0c5e46]/65 decoration-1 underline-offset-2 hover:text-[#083f2f] hover:decoration-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff] rounded-xs"
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
            className="font-semibold text-[#0c5e46] underline decoration-[#0c5e46]/65 decoration-1 underline-offset-2 hover:text-[#083f2f] hover:decoration-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff] rounded-xs"
          >
            {label}
          </a>
        );
      }
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#16211c]">
          {token.slice(2, -2)}
        </strong>
      );
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeLocale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );

  const copy = getMessages(activeLocale).assistant;

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  // Auto scroll to bottom respecting prefers-reduced-motion
  useEffect(() => {
    if (!isOpen) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 160);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeDrawer();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

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
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        tabIndex={isOpen ? -1 : 0}
        aria-hidden={isOpen || undefined}
        aria-expanded={isOpen}
        aria-controls="assistant-drawer-panel"
        data-open={isOpen ? "true" : "false"}
        className="assistant-trigger fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 min-h-[44px] px-4.5 py-3 rounded-full bg-[#16211c] text-[#eceee2] border border-[#edf2ff]/35 shadow-[0_12px_30px_rgba(4,9,20,0.36)] hover:bg-[#1e2d26] hover:shadow-[0_16px_36px_rgba(4,9,20,0.48)] focus:outline-none focus-visible:ring-3 focus-visible:ring-[#1f4bff] focus-visible:ring-offset-2"
      >
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="assistant-ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
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
          <span className="sr-only">: {copy.triggerAria}</span>
        </span>
      </button>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={closeDrawer}
        aria-hidden="true"
        data-open={isOpen ? "true" : "false"}
        className="assistant-backdrop fixed inset-0 z-50 bg-black/45"
      />

      {/* Slide-over Drawer Panel */}
      <div
        id="assistant-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-title"
        aria-hidden={!isOpen}
        inert={!isOpen}
        data-open={isOpen ? "true" : "false"}
        data-lenis-prevent
        className="assistant-drawer fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#eceee2] text-[#16211c] shadow-[-20px_0_50px_rgba(0,0,0,0.22)] flex flex-col border-l border-[#16211c]/20"
      >
        {/* Drawer Header */}
        <header className="px-5 py-4 bg-[#f4f5ea] border-b border-[#16211c]/20 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full bg-[#0c5e46]"
                aria-hidden="true"
              />
              <h2
                id="assistant-title"
                className="text-base font-bold display leading-tight tracking-tight text-[#16211c]"
              >
                {copy.drawerTitle}
              </h2>
            </div>
            <p className="text-xs text-[#16211c]/80 mt-0.5">
              {copy.drawerSubtitle}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-[#0c5e46] border border-[#0c5e46]/30">
                {copy.badgeGrounded}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#dde3d2] text-[#16211c] border border-[#16211c]/25">
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
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-md border border-transparent text-[#16211c]/80 hover:text-[#16211c] hover:bg-[#dde3d2] hover:border-[#16211c]/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff]"
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
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={closeDrawer}
              title={copy.closeDrawer}
              className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-md border border-transparent text-[#16211c]/80 hover:text-[#16211c] hover:bg-[#dde3d2] hover:border-[#16211c]/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff]"
              aria-label={copy.closeDrawer}
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
                aria-hidden="true"
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
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain"
        >
          {messages.length === 0 ? (
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-lg bg-[#f4f5ea] border border-[#16211c]/15 text-center shadow-xs">
                <div
                  className="w-10 h-10 rounded-full bg-emerald-100 text-[#0c5e46] flex items-center justify-center mx-auto mb-2.5"
                  aria-hidden="true"
                >
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
                <p className="text-xs text-[#16211c]/80 mt-1 leading-relaxed">
                  {copy.emptySubtitle}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#16211c]/75 mb-2.5 uppercase tracking-wider">
                  {copy.suggestionsTitle}
                </p>
                <div className="flex flex-col gap-2">
                  {copy.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="group text-left text-xs p-3 min-h-[40px] rounded-lg bg-[#f4f5ea] border border-[#16211c]/25 hover:border-[#0c5e46] hover:bg-emerald-50/75 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:shadow-xs transition-all duration-200 text-[#16211c] shadow-2xs flex items-center justify-between gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff]"
                    >
                      <span className="leading-snug">{sug}</span>
                      <span
                        className="text-[#0c5e46] font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 transition-all duration-200 shrink-0"
                        aria-hidden="true"
                      >
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
                      : "bg-[#f4f5ea] text-[#16211c] border border-[#16211c]/20 rounded-bl-xs"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div>
                      {renderFormattedContent(m.content, activeLocale, () =>
                        setIsOpen(false)
                      )}

                      {/* Case Pill Links */}
                      {m.caseSlugs && m.caseSlugs.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#16211c]/15 flex flex-wrap gap-1.5">
                          {m.caseSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={localeHref(`/cases/${slug}`, activeLocale)}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded bg-[#dde3d2] border border-[#16211c]/20 hover:bg-emerald-100 hover:border-[#0c5e46]/50 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 text-[#16211c] text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff]"
                            >
                              <span aria-hidden="true">↗</span>
                              <span>{slug}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Local Fallback Notice */}
                      {m.isFallback && (
                        <div className="mt-2 text-[11px] text-[#16211c]/75 italic">
                          * {copy.badgeLocal}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[#16211c]/75 mt-1 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}

          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 text-xs text-[#16211c]/80 p-3 rounded-lg bg-[#f4f5ea] border border-[#16211c]/15 max-w-[75%]"
            >
              <span className="assistant-spinner" aria-hidden="true" />
              <span>{copy.loading}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-3 bg-[#f4f5ea] border-t border-[#16211c]/20 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="assistant-chat-input" className="sr-only">
              {copy.placeholder}
            </label>
            <input
              id="assistant-chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              disabled={isLoading}
              className="flex-1 min-h-[42px] px-3.5 py-2.5 text-sm rounded-lg bg-[#eceee2] border border-[#16211c]/50 text-[#16211c] placeholder:text-[#16211c]/70 focus:outline-none focus:border-[#0c5e46] focus:ring-2 focus:ring-[#0c5e46]/35 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label={copy.sendButton}
              className="min-h-[42px] min-w-[44px] inline-flex items-center justify-center px-3.5 py-2.5 rounded-lg bg-[#16211c] text-[#eceee2] hover:bg-[#22332c] hover:shadow-sm disabled:opacity-45 disabled:hover:bg-[#16211c] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4bff]"
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
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <p className="text-[11px] text-center text-[#16211c]/75 mt-2">
            {copy.disclaimer}
          </p>
        </footer>
      </div>
    </>
  );
}
