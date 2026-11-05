import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils/cn"

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string | ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId
    const errorId = `${checkboxId}-error`

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className={cn(
              "mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-2",
              error && "border-[var(--color-danger)]",
              className
            )}
            ref={ref}
            id={checkboxId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm text-[var(--color-text)] cursor-pointer"
          >
            {label}
          </label>
        </div>
        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-sm text-[var(--color-danger)]"
          >
            {error}
          </span>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"