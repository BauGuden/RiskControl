import { CalculatorForm } from "../calculator/CalculatorForm";
import { TradeChat } from "../chat/TradeChat";
import type { CalculatorFormState } from "../../features/calculator/formState";
import type { ValidationError } from "../../types";

type TradingWorkspaceProps = {
  form: CalculatorFormState;
  errors: ValidationError[];
  onUpdate: <K extends keyof CalculatorFormState>(
    key: K,
    value: CalculatorFormState[K],
  ) => void;
  onCalculate: () => void;
  onClear: () => void;
};

export function TradingWorkspace({
  form,
  errors,
  onUpdate,
  onCalculate,
  onClear,
}: TradingWorkspaceProps) {
  return (
    <section aria-label="Calculadora cripto">
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">SPOT / FUTURES</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              Tu riesgo, antes de entrar.
            </h2>
            <p className="mt-2 text-sm muted">
              Tamaño, comisiones y objetivos para tus operaciones cripto.
            </p>
          </div>
          <span className="terminal-badge">ASISTENTE GEMINI</span>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-5">
            <CalculatorForm
              errors={errors}
              form={form}
              onCalculate={onCalculate}
              onClear={onClear}
              onUpdate={onUpdate}
            />
          </div>
          <TradeChat form={form} />
        </div>
      </div>
    </section>
  );
}
