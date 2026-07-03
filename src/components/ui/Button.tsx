import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed",
  secondary:
    "border border-border bg-surface text-text hover:bg-surface-muted disabled:opacity-50",
  ghost: "text-brand-600 hover:bg-brand-50 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-button px-4 py-2 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
