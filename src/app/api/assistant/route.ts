import { NextResponse } from "next/server";
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

async function fetchGeminiWithTimeout(
  modelName: string,
  apiKey: string,
  payload: unknown,
  timeoutMs = 12000
): Promise<Response> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: Request) {
  let body: AssistantChatRequest | null = null;
  try {
    body = (await req.json()) as AssistantChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { messages, locale = "id" } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];
  const userQuery = (lastMessage?.content ?? "").trim();

  try {
    // 1. Programmatic Guardrail: Quick pre-filter for out-of-context queries
    if (!isQueryInDomain(userQuery)) {
      const fallback = generateLocalFallback(userQuery, locale);
      return NextResponse.json<AssistantChatResponse>(fallback);
    }

    // 2. Check for server-only Gemini API key
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

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

    let res = await fetchGeminiWithTimeout("gemini-2.0-flash", apiKey, payload);

    // If 2.0-flash fails (e.g. 404), attempt gemini-1.5-flash with timeout
    if (!res.ok && res.status === 404) {
      res = await fetchGeminiWithTimeout("gemini-1.5-flash", apiKey, payload);
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
    // On any exception, reuse already-parsed userQuery & locale without calling req.clone()
    const fallback = generateLocalFallback(userQuery, locale);
    return NextResponse.json<AssistantChatResponse>(fallback);
  }
}
