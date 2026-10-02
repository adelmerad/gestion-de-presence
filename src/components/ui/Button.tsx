import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "sm" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-[inset_0_-1px_0_rgb(0_0_0/0.15)] hover:bg-accent-strong disabled:bg-accent/40",
  secondary: "border border-line bg-surface text-ink hover:border-ink-faint/60 hover:bg-paper/60 disabled:text-ink-faint",
  danger: "border border-danger/30 bg-surface text-danger hover:border-danger/50 hover:bg-danger-wash",
  ghost: "text-ink-soft hover:bg-paper hover:text-ink",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "h-9 px-3.5 text-sm",
  sm: "h-8 px-2.5 text-[13px]",
  icon: "h-9 w-9",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-semibold transition-[background-color,border-color,color,transform] active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    />
  );
}
