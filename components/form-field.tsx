import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  htmlFor?: string
  className?: string
}

export function FormField({
  label,
  required,
  error,
  children,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium"
        style={{ color: "#404653" }}
      >
        {label}
        {required && (
          <span className="text-[#E31F26] ml-0.5" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium" style={{ color: "#E31F26" }} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
