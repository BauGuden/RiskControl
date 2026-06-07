import { FieldError } from "./FieldError";
import type { CalculatorFormState } from "../../features/calculator/formState";
import type { ValidationError } from "../../types";

type TextInputProps = {
  id: keyof CalculatorFormState;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  help?: string;
  errors: ValidationError[];
};

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  help,
  errors
}: TextInputProps) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        inputMode={type === "number" ? "decimal" : "text"}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step="any"
        type={type}
        value={value}
      />
      {help ? <p className="muted-soft mt-2 text-xs">{help}</p> : null}
      <FieldError errors={errors} field={id} />
    </div>
  );
}
