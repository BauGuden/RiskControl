import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Bot, Send } from "lucide-react";
import { askCfdGemini } from "../chat/cfdGemini";
import { calculateCfd, type CfdInput } from "./calculateCfd";
import {
  isCfdFollowUp,
  parseCfdMessage,
  prepareCfdChatPlan,
  type CfdChatPatch,
  type CfdChatPlan,
} from "./cfdChat";
import { cfdResultToText } from "./cfdResultText";
import { CfdCopyButton } from "./CfdCopyButton";

const EXAMPLE =
  "Oro Exness Cent, riesgo $1, entrada 4100, SL 4080, TP 1:3, apalancamiento 1:100";
const localAnswer = (text: string): string | null => {
  if (/^(?:hola|buen[ao]s?\b|ayuda\b)/i.test(text.trim()))
    return "Puedo calcular lotes Standard/Cent, riesgo, margen y los TP 1:2 a 1:10. Indica activo, riesgo, entrada y SL; también puedes pedirme usar el formulario actual.";
  if (/(?:qu[eé]|explica|significa|diferencia)/i.test(text)) {
    if (/\bcent\b|\busc\b/i.test(text))
      return "USC son centavos: 1 USD = 100 USC. En este perfil 1 lote Cent tiene un contrato 100 veces menor que 1 lote Standard. La disponibilidad depende del activo y bróker; comprueba la especificación en MT5.";
    if (/\bspread\b/i.test(text))
      return "El spread es la distancia entre compra y venta. El cálculo suma un spread a la pérdida al SL y lo resta de la ganancia. Puedes incluirlo dentro del presupuesto o sumarlo como coste adicional. No lo cuentes dos veces si ya está en tus precios de ejecución.";
    if (/\btp\b|ratio|beneficio/i.test(text))
      return "Los TP CFD de 1:2 a 1:10 usan beneficio neto dividido por riesgo total al SL, incluido spread. Cada TP es una salida alternativa para toda la posición; no se suman sus ganancias.";
    if (/margen|apalanc/i.test(text))
      return "El margen estimado es exposición nocional dividida por apalancamiento efectivo. Con el mismo tamaño y SL, cambiar apalancamiento no cambia el riesgo al SL. Los límites del instrumento se aplican también en el chat.";
  }
  return null;
};

export function CfdTradeChat({
  input: formInput,
  onApply,
  targetRatio,
  tpMode,
}: {
  input: CfdInput;
  onApply: (plan: CfdChatPlan) => void;
  targetRatio: CfdChatPlan["targetRatio"];
  tpMode: CfdChatPlan["tpMode"];
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      text: `Soy tu asistente CFD para Exness y Vantage. Describe tu operación y actualizaré esta calculadora.\nEjemplo: ${EXAMPLE}`,
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Local + Gemini");
  const [pending, setPending] = useState<string[]>([]);
  const [lastPlan, setLastPlan] = useState<CfdChatPlan>();
  const counter = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, busy]);
  const append = (role: "user" | "assistant", text: string) => {
    const messageId = ++counter.current;
    setMessages((items) => [...items, { id: messageId, role, text }]);
  };

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setBusy(true);
    append("user", text);
    const history = [...pending, text].slice(-6);
    const useForm = /\bformulario\b|\bpantalla actual\b|\bestos datos\b/i.test(
      text,
    );
    const base = useForm
      ? { input: formInput, targetRatio, tpMode }
      : !pending.length && isCfdFollowUp(text)
        ? lastPlan
        : undefined;
    const patch = history.reduce<CfdChatPatch>((merged, item) => {
      const next = parseCfdMessage(
        item,
        merged.instrument ?? base?.input.instrument ?? formInput.instrument,
      );
      return next.instrument &&
        merged.instrument &&
        next.instrument !== merged.instrument
        ? next
        : { ...merged, ...next };
    }, {});
    function apply(nextPatch: CfdChatPatch) {
      const plan = prepareCfdChatPlan(nextPatch, formInput, base);
      const result = calculateCfd(plan.input);
      if (!result.ok) throw new Error(result.errors.join(" "));
      onApply(plan);
      setLastPlan(plan);
      setPending([]);
      append("assistant", cfdResultToText(plan.input, result));
    }
    try {
      if (
        /\b(?:binance|bybit|mexc|bitget|bitunix|spot|BTCUSDT|ETHUSDT)\b/i.test(
          text,
        )
      ) {
        append(
          "assistant",
          "Este chat está en modo CFD / MT5. Para operar unidades cripto con fees de exchanges, abre la pestaña Cripto y usa su asistente. Aquí BTCUSD corresponde al CFD de Exness o Vantage.",
        );
        return;
      }
      const answer = localAnswer(text);
      if (
        answer &&
        (!Object.keys(patch).length ||
          /^(?:[¿\s]*qu[eé]|explica|hola|buen[ao]s?\b|ayuda\b)/i.test(
            text.trim(),
          ))
      ) {
        append("assistant", answer);
        setStatus("Local");
        return;
      }
      if (Object.keys(patch).length || base) {
        try {
          apply(patch);
          setStatus("Local");
          return;
        } catch (error) {
          // Ask only for missing fields; invalid numbers/account settings are never sent to the model to repair silently.
          const reason =
            error instanceof Error
              ? error.message
              : "Revisa los datos de la operación.";
          setPending(history);
          append("assistant", reason);
          setStatus("Local");
          return;
        }
      }
      try {
        const remote = await askCfdGemini(
          text,
          lastPlan,
          pending.map((message) => ({ role: "user", text: message })),
        );
        setStatus("Gemini");
        if (remote.kind === "answer") append("assistant", remote.answer);
        else apply(remote.patch);
      } catch {
        append(
          "assistant",
          "Puedo calcular CFDs sin conexión a Gemini. Indica activo, riesgo, entrada y SL, o escribe «calcula con el formulario». Ejemplo: oro Exness riesgo 1 entrada 4100 SL 4080 TP 1:3.",
        );
        setStatus("Local");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="panel min-w-0 scroll-mt-24 p-5 sm:p-6"
      id="cfd-assistant"
      aria-label="Asistente CFD"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="feature-icon">
            <Bot size={20} />
          </span>
          <div>
            <p className="section-kicker">ASISTENTE CFD / MT5</p>
            <h3 className="mt-1 text-lg font-extrabold">
              Describe tu operación
            </h3>
          </div>
        </div>
        <span className="terminal-badge">{busy ? "Procesando…" : status}</span>
      </div>
      <p className="mt-3 text-xs leading-5 muted">
        Entiende lotes, cuentas Cent, margen y TP. Los cálculos se hacen
        localmente y se aplican al formulario.
      </p>
      <div
        ref={logRef}
        className="mt-4 max-h-[480px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50"
        role="log"
        aria-label="Conversación CFD"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border p-3 ${message.role === "assistant" ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" : "ml-8 border-teal-500/20 bg-teal-500/5"}`}
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-widest muted">
              {message.role === "assistant" ? "RiskControl / CFD" : "Tú"}
            </p>
            <p className="whitespace-pre-line break-words text-xs leading-6">
              {message.text}
            </p>
            {message.role === "assistant" && (
              <CfdCopyButton
                text={message.text}
                label="Copiar respuesta CFD"
                compact
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setDraft(EXAMPLE)}
        >
          Usar ejemplo CFD
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setDraft("Calcula con el formulario actual")}
        >
          Usar formulario
        </button>
      </div>
      <form className="mt-4" onSubmit={(event) => void send(event)}>
        <label className="label" htmlFor={id}>
          Mensaje para el asistente CFD
        </label>
        <textarea
          className="input h-auto min-h-24 resize-y py-3"
          id={id}
          value={draft}
          maxLength={1000}
          disabled={busy}
          placeholder="Oro Exness Cent, riesgo $1, entrada 4100, SL 4080, TP 1:3…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10px] muted">
            Enter envía · Shift + Enter crea una línea
          </span>
          <button
            className="btn-primary"
            type="submit"
            disabled={busy || !draft.trim()}
          >
            <Send size={14} />
            {busy ? "Procesando" : "Enviar CFD"}
          </button>
        </div>
      </form>
    </section>
  );
}
