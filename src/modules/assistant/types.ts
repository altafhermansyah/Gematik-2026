import type { Locale } from "@/lib/i18n/localized";

export type AssistantMessageRole = "user" | "assistant" | "system";

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  content: string;
  timestamp: number;
  caseSlugs?: string[];
  isFallback?: boolean;
};

export type AssistantChatRequest = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  locale?: Locale;
};

export type AssistantChatResponse = {
  reply: string;
  caseSlugs?: string[];
  isFallback?: boolean;
  isInContext?: boolean;
};
