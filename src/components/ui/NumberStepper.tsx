import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function NumberStepper({ value, onChange, min = 0, max = 99, disabled }: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-text-muted transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Diminuer"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className="w-10 rounded-md border border-border bg-white py-1 text-center text-sm tabular-nums focus:border-primary-500 focus:outline-none disabled:opacity-40"
      />
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-text-muted transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Augmenter"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
