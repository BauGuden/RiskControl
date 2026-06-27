import { useEffect, useMemo, useState } from "react";
import { getDefaultFeePct } from "../../data/fees";
import { calculateRisk, validateInput } from "../../lib/calculateRisk";
import type { CalculatorResult, ValidationError } from "../../types";
import { initialCalculatorForm, toCalculatorInput, type CalculatorFormState } from "./formState";
import { resultToText } from "./resultText";

export function useRiskCalculator() {
  const [form, setForm] = useState<CalculatorFormState>(initialCalculatorForm);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copiar");
  const [shareLabel, setShareLabel] = useState("Compartir");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      feeInPct: String(getDefaultFeePct(current.broker, current.market, current.entryRole)),
      feeOutPct: String(getDefaultFeePct(current.broker, current.market, current.exitRole))
    }));
  }, [form.broker, form.market, form.entryRole, form.exitRole]);

  const calculatorInput = useMemo(() => toCalculatorInput(form), [form]);

  function updateForm<K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function calculate() {
    const nextErrors = validateInput(calculatorInput);
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setResult(null);
      return;
    }

    setResult(calculateRisk(calculatorInput));
  }

  function clear() {
    setForm(initialCalculatorForm);
    setErrors([]);
    setResult(null);
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(resultToText(result, form.feeInPct, form.feeOutPct, form.leverage));
      setCopyLabel("Copiado");
    } catch {
      setCopyLabel("No se pudo");
    } finally {
      window.setTimeout(() => setCopyLabel("Copiar"), 1000);
    }
  }

  async function shareResult() {
    if (!result) return;

    const text = resultToText(result, form.feeInPct, form.feeOutPct, form.leverage);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Risk Control · ${result.symbol}`,
          text
        });
        setShareLabel("Compartido");
      } else {
        await navigator.clipboard.writeText(text);
        setShareLabel("Copiado");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareLabel("No se pudo");
    } finally {
      window.setTimeout(() => setShareLabel("Compartir"), 1000);
    }
  }

  return {
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
  };
}
