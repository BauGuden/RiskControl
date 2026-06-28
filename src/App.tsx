import { CalculatorForm } from "./components/calculator/CalculatorForm";
import { TradeChat } from "./components/chat/TradeChat";
import { PageHeader } from "./components/layout/PageHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { useRiskCalculator } from "./features/calculator/useRiskCalculator";
import { useThemeMode } from "./features/theme/useThemeMode";

export default function App() {
  const { themeMode, setThemeMode } = useThemeMode();
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

  return (
    <main className="app-shell min-h-screen overflow-x-hidden text-slate-950 transition-colors dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] gap-5 px-4 py-3 sm:px-6 sm:py-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[250px_minmax(600px,1fr)_370px] min-[1700px]:grid-cols-[250px_minmax(560px,1fr)_340px_380px]">
        <Sidebar onThemeChange={setThemeMode} themeMode={themeMode} />

        <div className="min-w-0 space-y-6 lg:col-start-2 xl:contents xl:space-y-0">
          <div className="min-w-0 space-y-5 min-[1700px]:contents min-[1700px]:space-y-0">
            <div className="min-[1700px]:col-span-2 min-[1700px]:col-start-2 min-[1700px]:row-start-1">
              <PageHeader />
            </div>

            <div className="min-w-0 min-[1700px]:col-start-2 min-[1700px]:row-start-2">
              <CalculatorForm
                errors={errors}
                form={form}
                onCalculate={calculate}
                onClear={clear}
                onUpdate={updateForm}
              />
            </div>

            <div className="min-w-0 min-[1700px]:col-start-3 min-[1700px]:row-start-2">
              <ResultsPanel
                copyLabel={copyLabel}
                onCopy={copyResult}
                onShare={shareResult}
                result={result}
                shareLabel={shareLabel}
              />
            </div>

            <footer className="muted-soft pb-4 text-center text-xs min-[1700px]:col-span-2 min-[1700px]:col-start-2 min-[1700px]:row-start-3">
              Trading conlleva riesgos. Esta herramienta estima fees en USDT para comparar escenarios.
            </footer>
          </div>

          <TradeChat form={form} />
        </div>
      </div>
    </main>
  );
}
