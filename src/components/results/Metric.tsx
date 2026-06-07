type MetricProps = {
  label: string;
  value: string;
  tone?: "default" | "accent";
};

export function Metric({ label, value, tone = "default" }: MetricProps) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800">
      <p className="muted-soft text-xs font-semibold uppercase">{label}</p>
      <p
        className={
          tone === "accent"
            ? "mt-1 text-lg font-bold text-teal-700 dark:text-teal-300"
            : "mt-1 text-lg font-bold text-slate-950 dark:text-slate-50"
        }
      >
        {value}
      </p>
    </div>
  );
}
