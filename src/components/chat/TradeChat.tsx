import { Bot, Check, Copy, Send, UserRound } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { getDefaultFeePct } from "../../data/fees";
import type { CalculatorFormState } from "../../features/calculator/formState";
import { toCalculatorInput } from "../../features/calculator/formState";
import { resultToText } from "../../features/calculator/resultText";
import { extractLeverage, isMarginQuestion } from "../../features/chat/chatFollowUp";
import { askGemini, type GeminiChatContext } from "../../features/chat/geminiTradeInterpreter";
import {
  localTradeInterpreter,
  type TradeIntent,
  type TradeInterpreter
} from "../../features/chat/tradeInterpreter";
import { calculateRisk } from "../../lib/calculateRisk";
import { formatCurrency, formatNumber } from "../../lib/format";
import type { CalculatorResult } from "../../types";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type TradeChatProps = {
  form: CalculatorFormState;
  interpreter?: TradeInterpreter;
};

const EXAMPLE = "BTC, quiero arriesgar $8, entrada en 61800, SL 62250";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: `Indícame activo, riesgo, entrada y stop. Por ejemplo:\n${EXAMPLE}`
  }
];

export function TradeChat({ form, interpreter = localTradeInterpreter }: TradeChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);
  const [lastResult, setLastResult] = useState<CalculatorResult | null>(null);
  const [lastIntent, setLastIntent] = useState<TradeIntent | null>(null);
  const [aiStatus, setAiStatus] = useState<"pending" | "connected" | "local">("pending");
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  async function copyMessage(message: ChatMessage) {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopiedMessageId(message.id);
      window.setTimeout(() => {
        setCopiedMessageId((current) => (current === message.id ? null : current));
      }, 1500);
    } catch {
      setCopiedMessageId(null);
    }
  }

  async function sendMessage() {
    const message = input.trim();
    if (!message || isThinking) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: message
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    const requestedLeverage = extractLeverage(message);
    const followUpLeverage =
      requestedLeverage ??
      (isMarginQuestion(message) ? 25 : null);

    if (lastResult && followUpLeverage) {
      const margin = lastResult.notionalEntry / followUpLeverage;

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `Margen estimado con ${formatNumber(followUpLeverage)}x

${formatCurrency(lastResult.notionalEntry)} / ${formatNumber(followUpLeverage)} = ${formatCurrency(margin)}

El size continúa en ${formatNumber(lastResult.sizeUnits)} ${lastResult.baseAsset}. El apalancamiento cambia el margen requerido, no el tamaño calculado por riesgo.`
        }
      ]);
      return;
    }

    setIsThinking(true);

    try {
      let intent: TradeIntent;
      const context: GeminiChatContext | undefined =
        lastResult && lastIntent
          ? {
              symbol: lastIntent.symbol,
              broker: lastResult.broker,
              market: lastResult.market,
              side: lastResult.side,
              risk: lastIntent.risk,
              entry: lastIntent.entry,
              stop: lastIntent.stop,
              sizeUnits: lastResult.sizeUnits,
              baseAsset: lastResult.baseAsset,
              notionalEntry: lastResult.notionalEntry,
              totalLossAtStop: lastResult.totalLossAtStop
            }
          : undefined;

      try {
        const aiResponse = await askGemini(message, context);
        setAiStatus("connected");

        if (aiResponse.kind === "answer") {
          setMessages((current) => [
            ...current,
            {
              id: Date.now() + 1,
              role: "assistant",
              text: aiResponse.answer
            }
          ]);
          return;
        }

        intent = aiResponse.intent;
      } catch {
        setAiStatus("local");
        intent = await interpreter.interpret(message);
      }

      const chatLeverage = requestedLeverage ?? 25;
      const tradeBroker = intent.broker ?? form.broker;
      const tradeMarket = intent.market ?? form.market;
      const useBrokerDefaults = Boolean(intent.broker || intent.market);
      const calculationForm: CalculatorFormState = {
        ...form,
        symbol: intent.symbol,
        broker: tradeBroker,
        market: tradeMarket,
        risk: String(intent.risk),
        entry: String(intent.entry),
        stop: String(intent.stop),
        feeInPct: useBrokerDefaults
          ? String(getDefaultFeePct(tradeBroker, tradeMarket, form.entryRole))
          : form.feeInPct,
        feeOutPct: useBrokerDefaults
          ? String(getDefaultFeePct(tradeBroker, tradeMarket, form.exitRole))
          : form.feeOutPct,
        leverage: String(chatLeverage)
      };
      const result = calculateRisk(toCalculatorInput(calculationForm));

      setLastResult(result);
      setLastIntent(intent);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: resultToText(result, calculationForm.feeInPct, calculationForm.feeOutPct, chatLeverage)
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: error instanceof Error ? error.message : "No pude interpretar el mensaje."
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <section
      className="panel min-w-0 scroll-mt-5 p-5 xl:sticky xl:top-5 xl:flex xl:h-[calc(100vh-2.5rem)] xl:flex-col xl:overflow-hidden min-[1700px]:col-start-4 min-[1700px]:row-span-3 min-[1700px]:row-start-1"
      id="assistant"
      aria-labelledby="trade-chat-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
            Asistente de size
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight" id="trade-chat-title">
            Describe tu operación
          </h2>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
            aiStatus === "connected"
              ? "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300"
              : aiStatus === "local"
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              aiStatus === "connected" ? "bg-teal-500" : aiStatus === "local" ? "bg-amber-500" : "bg-slate-400"
            }`}
          />
          {aiStatus === "connected" ? "Gemini" : aiStatus === "local" ? "Local" : "Conectando"}
        </span>
      </div>

      <p className="muted mt-2 text-xs leading-5">
        Describe la entrada y Gemini prepara el cálculo con tus fees.
      </p>

      <div
        className="scrollbar-none mt-4 max-h-96 min-h-56 space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100 xl:min-h-0 xl:max-h-none xl:flex-1 dark:bg-slate-950/70 dark:ring-slate-800"
        role="log"
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";

          return (
            <div
              className={`flex items-start gap-2 ${isAssistant ? "justify-start" : "justify-end"}`}
              key={message.id}
            >
              {isAssistant ? (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-700 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
              <div
                className={`group relative max-w-[85%] px-3 py-2 text-sm leading-6 ${
                  isAssistant
                    ? "rounded-2xl rounded-tl-md border border-slate-100 bg-white pr-11 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    : "rounded-2xl rounded-tr-md bg-slate-950 pr-11 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950"
                }`}
              >
                <p className="m-0 whitespace-pre-line">{message.text}</p>
                <button
                  aria-label={
                    copiedMessageId === message.id
                      ? "Mensaje copiado"
                      : isAssistant
                        ? "Copiar respuesta"
                        : "Copiar mi mensaje"
                  }
                  className={`absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                    isAssistant
                      ? "text-slate-400 hover:bg-slate-100 hover:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-teal-300"
                      : "text-white/60 hover:bg-white/10 hover:text-white dark:text-slate-700 dark:hover:bg-slate-950/10 dark:hover:text-slate-950"
                  }`}
                  onClick={() => void copyMessage(message)}
                  title={copiedMessageId === message.id ? "Copiado" : "Copiar mensaje"}
                  type="button"
                >
                  {copiedMessageId === message.id ? (
                    <Check
                      className={isAssistant ? "h-4 w-4 text-teal-600 dark:text-teal-300" : "h-4 w-4"}
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {!isAssistant ? (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-950 text-white dark:bg-slate-800">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          );
        })}
        {isThinking ? <p className="muted-soft text-xs">Interpretando operación...</p> : null}
      </div>

      <button
        className="muted-soft mt-3 w-fit text-left text-xs font-semibold transition hover:text-teal-700 dark:hover:text-teal-300"
        onClick={() => setInput(EXAMPLE)}
        type="button"
      >
        Usar ejemplo
      </button>

      <form
        className="mt-3 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-teal-400 dark:focus-within:ring-teal-400/10"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="trade-chat-message">
          Describe tu operación
        </label>
        <textarea
          aria-describedby="trade-chat-help"
          className="min-h-24 w-full resize-none bg-transparent px-4 pb-2 pt-4 text-sm font-medium leading-6 text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-600"
          disabled={isThinking}
          id="trade-chat-message"
          maxLength={1000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe tu operación o haz una pregunta..."
          rows={3}
          value={input}
        />

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-2 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="hidden truncate sm:inline" id="trade-chat-help">
              Enter para enviar · Shift + Enter para nueva línea
            </span>
            <span className={input.length >= 900 ? "font-bold text-amber-600 dark:text-amber-400" : ""}>
              {input.length}/1000
            </span>
          </div>

          <button
            aria-label="Enviar operación"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            disabled={!input.trim() || isThinking}
            type="submit"
          >
            <span>{isThinking ? "Procesando" : "Enviar"}</span>
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
