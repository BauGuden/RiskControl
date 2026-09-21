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
      <SiteHeader onThemeChange={setThemeMode} themeMode={themeMode} />
      <HeroSection />
      <TradingWorkspace
        errors={errors}
        form={form}
        onCalculate={handleCalculate}
        onClear={handleClear}
        onUpdate={updateForm}
      />
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
