import { useCallback, useState } from "react";
import { FeesSection } from "./components/landing/FeesSection";
import { HeroSection } from "./components/landing/HeroSection";
import { LearningSection } from "./components/landing/LearningSection";
import { MethodSection } from "./components/landing/MethodSection";
import { SiteFooter } from "./components/landing/SiteFooter";
import { SiteHeader } from "./components/landing/SiteHeader";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { TradingWorkspace } from "./components/tool/TradingWorkspace";
import { useRiskCalculator } from "./features/calculator/useRiskCalculator";
import { useThemeMode } from "./features/theme/useThemeMode";
import { CfdReferenceTable, CfdWorkspace } from "./features/cfd/CfdWorkspace";
import { ArrowDownUp, Bitcoin } from "lucide-react";

export default function App() {
  const { themeMode, setThemeMode } = useThemeMode();
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<"cfd" | "crypto">("cfd");
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
    shareResult,
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
      <SiteHeader onThemeChange={setThemeMode} themeMode={themeMode} />
      <HeroSection />
      <section
        className="workspace-section scroll-mt-20 py-10 sm:py-12"
        id="herramienta"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="workspace-toolbar mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="section-kicker">01 / ESPACIO DE TRABAJO</p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                Planifica tu próxima operación
              </h2>
            </div>
            <div
              className="tool-mode grid grid-cols-2 gap-1"
              role="group"
              aria-label="Tipo de calculadora"
            >
              <button
                type="button"
                aria-pressed={calculatorMode === "cfd"}
                className={`flex items-center justify-center gap-2 ${calculatorMode === "cfd" ? "segmented-active" : "segmented"}`}
                onClick={() => {
                  setCalculatorMode("cfd");
                  closeResult();
                }}
              >
                <ArrowDownUp size={15} /> CFDs / MT5
              </button>
              <button
                type="button"
                aria-pressed={calculatorMode === "crypto"}
                className={`flex items-center justify-center gap-2 ${calculatorMode === "crypto" ? "segmented-active" : "segmented"}`}
                onClick={() => setCalculatorMode("crypto")}
              >
                <Bitcoin size={15} /> Cripto
              </button>
            </div>
          </div>
          <div hidden={calculatorMode !== "cfd"}>
            <CfdWorkspace />
          </div>
          <div hidden={calculatorMode !== "crypto"}>
            <TradingWorkspace
              errors={errors}
              form={form}
              onCalculate={handleCalculate}
              onClear={handleClear}
              onUpdate={updateForm}
            />
          </div>
          <div className="mt-6">
            <CfdReferenceTable />
          </div>
        </div>
      </section>
      <MethodSection />
      <FeesSection />
      <LearningSection />
      <SiteFooter />

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
