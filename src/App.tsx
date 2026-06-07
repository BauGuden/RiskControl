import { CalculatorForm } from "./components/calculator/CalculatorForm";
import { PageHeader } from "./components/layout/PageHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { useRiskCalculator } from "./features/calculator/useRiskCalculator";
import { useThemeMode } from "./features/theme/useThemeMode";

export default function App() {
  const { themeMode, setThemeMode } = useThemeMode();
  const { form, errors, result, copyLabel, updateForm, calculate, clear, copyResult } = useRiskCalculator();

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <Sidebar onThemeChange={setThemeMode} themeMode={themeMode} />

        <div className="min-w-0 space-y-6">
          <PageHeader />

          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
            <CalculatorForm
              errors={errors}
              form={form}
              onCalculate={calculate}
              onClear={clear}
              onUpdate={updateForm}
            />
            <ResultsPanel copyLabel={copyLabel} onCopy={copyResult} result={result} />
          </div>

          <footer className="muted-soft pb-4 text-center text-xs">
            Trading conlleva riesgos. Esta herramienta estima fees en USDT para comparar escenarios.
          </footer>
        </div>
      </div>
    </main>
  );
}
