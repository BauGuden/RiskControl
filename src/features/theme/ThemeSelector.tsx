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
    <div className="mt-8">
      <label className="label">Tema</label>
      <div className="grid grid-cols-3 border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              aria-pressed={active}
              className={
                active
                  ? "flex h-10 items-center justify-center gap-2 bg-slate-950 px-2 text-xs font-bold text-white dark:bg-teal-500 dark:text-slate-950"
                  : "flex h-10 items-center justify-center gap-2 px-2 text-xs font-bold text-slate-600 transition hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
              }
              key={option.value}
              onClick={() => onChange(option.value)}
              title={`Tema ${option.label.toLowerCase()}`}
              type="button"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline lg:hidden xl:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
