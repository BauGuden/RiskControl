import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { searchSymbolPairs } from "../../data/symbolPairs";
import type { ValidationError } from "../../types";
import { FieldError } from "../ui/FieldError";

type SymbolPairInputProps = {
  value: string;
  onChange: (value: string) => void;
  errors: ValidationError[];
};

export function SymbolPairInput({ value, onChange, errors }: SymbolPairInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<number>();
  const pairs = useMemo(() => searchSymbolPairs(value), [value]);

  function handleBlur() {
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 120);
  }

  function handleFocus() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    setIsOpen(true);
  }

  function handleSelect(symbol: string) {
    onChange(symbol);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <label className="label" htmlFor="symbol">
        Par / simbolo
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="symbol-options"
          autoComplete="off"
          className="input pl-9"
          id="symbol"
          inputMode="text"
          onBlur={handleBlur}
          onChange={(event) => {
            onChange(event.target.value.toUpperCase());
            setIsOpen(true);
          }}
          onFocus={handleFocus}
          placeholder="BTCUSDT"
          type="text"
          value={value}
        />
      </div>

      {isOpen ? (
        <div
          className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-950"
          id="symbol-options"
          role="listbox"
        >
          {pairs.length > 0 ? (
            pairs.map((pair) => (
              <button
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:hover:bg-slate-900 dark:focus:bg-slate-900"
                key={pair.symbol}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(pair.symbol)}
                role="option"
                type="button"
              >
                <span className="min-w-0">
                  <span className="block font-bold text-slate-950 dark:text-slate-100">{pair.symbol}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                    {pair.name} - {pair.group}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-bold text-teal-700 dark:text-teal-300">{pair.baseAsset}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No esta en el diccionario. Puedes escribir el par manualmente.
            </div>
          )}
        </div>
      ) : null}

      <p className="muted-soft mt-2 text-xs">Busca pares comunes o escribe uno manualmente si no aparece.</p>
      <FieldError errors={errors} field="symbol" />
    </div>
  );
}
