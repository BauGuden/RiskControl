import { CalculatorForm } from "../calculator/CalculatorForm";
import { TradeChat } from "../chat/TradeChat";
import { PageHeader } from "../layout/PageHeader";
import type { CalculatorFormState } from "../../features/calculator/formState";
import type { ValidationError } from "../../types";

type TradingWorkspaceProps = {
  form: CalculatorFormState;
  errors: ValidationError[];
  onUpdate: <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => void;
  onCalculate: () => void;
  onClear: () => void;
};

export function TradingWorkspace({ form, errors, onUpdate, onCalculate, onClear }: TradingWorkspaceProps) {
  return (
    <section className="scroll-mt-20 py-20 sm:py-24" id="herramienta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="section-kicker">Herramienta operativa</p>
          <h2 className="section-title">Convierte tu riesgo en números concretos</h2>
          <p className="section-copy">
            Completa el formulario o conversa con Gemini. El resultado siempre se calcula localmente con fórmulas deterministas.
          </p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-5">
            <PageHeader />
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
