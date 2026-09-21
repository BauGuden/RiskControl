import { Laptop, Moon, Sun } from "lucide-react";
import type { ThemeMode } from "./theme";

type ThemeSelectorProps = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  compact?: boolean;
};

const options = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop }
] satisfies Array<{ value: ThemeMode; label: string; icon: typeof Sun }>;

export function ThemeSelector({ value, onChange, compact = false }: ThemeSelectorProps) {
  return (
    <fieldset className={compact ? "m-0" : "mt-5"}>
      <legend
        className={
          compact
            ? "sr-only"
            : "mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500"
        }
      >
        Apariencia
      </legend>
      <div
        className={`grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950 ${
          compact ? "w-fit" : ""
        }`}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <button
              aria-pressed={selected}
              className={`flex min-w-0 items-center justify-center rounded-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                compact ? "h-8 w-8" : "flex-col gap-1 px-1.5 py-2 text-[10px]"
              } ${
                selected
                  ? "bg-white text-teal-800 shadow-sm dark:bg-slate-800 dark:text-teal-300"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
              title={option.label}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className={compact ? "sr-only" : "truncate"}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
