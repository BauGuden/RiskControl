import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CfdCopyButton({
  text,
  label = "Copiar resultado CFD",
  compact = false,
  disabled = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(
    null,
  );
  const current = status?.text === text ? status : null;
  return (
    <div className={compact ? "mt-4" : ""}>
      <button
        className={compact ? "icon-btn w-full" : "btn-secondary shrink-0"}
        type="button"
        disabled={disabled}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus({ text, ok: true });
          } catch {
            setStatus({ text, ok: false });
          }
        }}
      >
        {current?.ok ? <Check size={15} /> : <Copy size={15} />}
        {current?.ok ? "Copiado" : label}
      </button>
      {current && !current.ok && (
        <p
          role="status"
          className="mt-2 max-w-xs text-xs text-amber-700 dark:text-amber-300"
        >
          No se pudo acceder al portapapeles. Intenta copiar de nuevo.
        </p>
      )}
    </div>
  );
}
