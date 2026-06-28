import { useCallback, useState } from "react";
import { CalculatorForm } from "./components/calculator/CalculatorForm";
import { TradeChat } from "./components/chat/TradeChat";
import { PageHeader } from "./components/layout/PageHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { useRiskCalculator } from "./features/calculator/useRiskCalculator";
import { useThemeMode } from "./features/theme/useThemeMode";

export default function App() {
  const { themeMode, setThemeMode } = useThemeMode();
  const [isResultOpen, setIsResultOpen] = useState(false);
  const closeResult = useCallback(() => setIsResultOpen(false), []);
  const {
    form,
    errors,
    result,
    copyLabel,
    shareLabel,
    updateForm,
    calculate,
    clear,
    copyResult,
    shareResult
  } = useRiskCalculator();

  function handleCalculate() {
    setIsResultOpen(calculate());
  }

  function handleClear() {
    clear();
    setIsResultOpen(false);
  }

  return (
    <main className="app-shell min-h-screen overflow-x-clip text-slate-950 transition-colors dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-5 px-4 py-3 sm:px-6 sm:py-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[250px_minmax(600px,1fr)_380px]">
        <Sidebar onThemeChange={setThemeMode} themeMode={themeMode} />

        <div className="min-w-0 space-y-6 lg:col-start-2 xl:contents xl:space-y-0">
          <div className="min-w-0 space-y-5">
            <PageHeader />

            <CalculatorForm
              errors={errors}
              form={form}
              onCalculate={handleCalculate}
              onClear={handleClear}
              onUpdate={updateForm}
            />

            <footer className="muted-soft pb-4 text-center text-xs">
              Trading conlleva riesgos. Esta herramienta estima fees en USDT para comparar escenarios.
            </footer>
          </div>

          <TradeChat form={form} />
        </div>
      </div>

      {isResultOpen && result ? (
        <ResultsPanel
          copyLabel={copyLabel}
          onClose={closeResult}
          onCopy={copyResult}
          onShare={shareResult}
          result={result}
          shareLabel={shareLabel}
        />
      ) : null}
    </main>
  );
}
