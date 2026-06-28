import { Monitor, Moon, Sun } from "lucide-react";
import type { ThemeMode } from "./theme";

const themeOptions = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor }
] satisfies Array<{ value: ThemeMode; label: string; icon: typeof Sun }>;

type ThemeSelectorProps = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="mt-6">
      <label className="label">Tema</label>
      <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              aria-pressed={active}
              className={
                active
                  ? "flex h-9 items-center justify-center gap-1 rounded-lg bg-slate-950 px-1 text-[11px] font-bold text-white shadow-sm dark:bg-teal-400 dark:text-slate-950"
                  : "flex h-9 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
              }
              key={option.value}
              onClick={() => onChange(option.value)}
              title={`Tema ${option.label.toLowerCase()}`}
              type="button"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
