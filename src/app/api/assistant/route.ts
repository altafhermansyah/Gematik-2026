import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n/localized";
import { buildSystemPrompt } from "@/modules/assistant/knowledge";
import {
  generateLocalFallback,
  isQueryInDomain,
} from "@/modules/assistant/local-engine";
import type {
  AssistantChatRequest,
  AssistantChatResponse,
} from "@/modules/assistant/types";
import { getPublishedCases } from "@/modules/content/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AssistantChatRequest;
    const { messages, locale = "id" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content.trim();

    // 1. Programmatic Guardrail: Quick pre-filter for out-of-context queries
    if (!isQueryInDomain(userQuery)) {
      const fallback = generateLocalFallback(userQuery, locale);
      return NextResponse.json<AssistantChatResponse>(fallback);
    }

    // 2. Check for Gemini API key
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Offline / Local Mode (100% resilient fallback)
      const fallback = generateLocalFallback(userQuery, locale);
      return NextResponse.json<AssistantChatResponse>(fallback);
    }

    // 3. Call Gemini REST API
    const systemPrompt = buildSystemPrompt(locale);

    // Build Gemini contents history
    const geminiContents = messages.slice(-6).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Preferred model: gemini-2.0-flash, fallback to gemini-1.5-flash
    const modelName = "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.2, // Low temperature for high factual accuracy and strict grounding
        maxOutputTokens: 1200,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    let res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If 2.0-flash fails (e.g. 404), attempt gemini-1.5-flash
    if (!res.ok && res.status === 404) {
      const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      res = await fetch(fallbackEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      console.warn(
        `Gemini API returned status ${res.status}, falling back to local engine.`
      );
      const fallback = generateLocalFallback(userQuery, locale);
      return NextResponse.json<AssistantChatResponse>(fallback);
    }

    const data = await res.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!replyText) {
      const fallback = generateLocalFallback(userQuery, locale);
      return NextResponse.json<AssistantChatResponse>(fallback);
    }

    // Extract any referenced case slugs
    const allCases = getPublishedCases();
    const mentionedSlugs = allCases
      .filter((c) => replyText.toLowerCase().includes(c.slug.toLowerCase()))
      .map((c) => c.slug);

    return NextResponse.json<AssistantChatResponse>({
      reply: replyText,
      caseSlugs: mentionedSlugs.length > 0 ? mentionedSlugs : undefined,
      isFallback: false,
      isInContext: true,
    });
  } catch (err) {
    console.warn("Assistant API error caught, triggering local fallback:", err);
    // On any exception, always return local fallback instead of breaking the UI
    const body = (await req.clone().json().catch(() => ({}))) as AssistantChatRequest;
    const lastMessage = body.messages?.[body.messages.length - 1]?.content || "";
    const locale: Locale = body.locale || "id";
    const fallback = generateLocalFallback(lastMessage, locale);
    return NextResponse.json<AssistantChatResponse>(fallback);
  }
}
