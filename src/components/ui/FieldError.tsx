import type { ValidationError } from "../../types";

type FieldErrorProps = {
  errors: ValidationError[];
  field: string;
};

export function FieldError({ errors, field }: FieldErrorProps) {
  const error = errors.find((item) => item.field === field);
  if (!error) return null;
  return <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-300">{error.message}</p>;
}
