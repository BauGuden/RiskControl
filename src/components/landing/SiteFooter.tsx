import { NAV_ITEMS } from "../../content/landing";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-black tracking-tight">DGBM Risk Control</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Herramientas y educación para operar con un plan.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Navegación del pie">
          {NAV_ITEMS.slice(1).map((item) => (
            <a className="text-xs font-bold text-slate-500 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300" href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>
        <p className="max-w-sm text-xs leading-5 text-slate-400 lg:text-right">
          Contenido educativo. No constituye asesoramiento financiero. Trading conlleva riesgo de pérdida.
        </p>
      </div>
    </footer>
  );
}
