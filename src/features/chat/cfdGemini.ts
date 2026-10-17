import {
  normalizeCfdChatPatch,
  type CfdChatPatch,
  type CfdChatPlan,
} from "../cfd/cfdChat";
import type { GeminiHistoryMessage } from "./geminiTradeInterpreter";

export async function askCfdGemini(
  message: string,
  context: CfdChatPlan | undefined,
  history: GeminiHistoryMessage[],
): Promise<
  | { kind: "answer"; answer: string }
  | { kind: "cfd-trade"; patch: CfdChatPatch }
> {
  const response = await fetch("/api/interpret-trade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode: "cfd", context, history }),
    signal: AbortSignal.timeout(15000),
  });
  const body: unknown = await response.json();
  if (!response.ok || !body || typeof body !== "object")
    throw new Error("Gemini no está disponible.");
  const data = body as Record<string, unknown>;
  if (
    data.kind === "answer" &&
    typeof data.answer === "string" &&
    data.answer.trim()
  )
    return { kind: "answer", answer: data.answer };
  if (data.kind === "cfd-trade")
    return { kind: "cfd-trade", patch: normalizeCfdChatPatch(data) };
  throw new Error("Respuesta CFD inválida.");
}
