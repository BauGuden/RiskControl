type MetricProps = {
  label: string;
  value: string;
  tone?: "default" | "accent" | "danger";
};

export function Metric({ label, value, tone = "default" }: MetricProps) {
  const valueClass = {
    default: "mt-1 text-lg font-bold text-slate-950 dark:text-slate-50",
    accent: "mt-1 text-lg font-bold text-teal-700 dark:text-teal-300",
    danger: "mt-1 text-lg font-bold text-red-700 dark:text-red-300"
  }[tone];

  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800">
      <p className="muted-soft text-xs font-semibold uppercase">{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}
