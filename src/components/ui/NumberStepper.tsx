import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

const STEP_BUTTON =
  "flex h-full w-9 items-center justify-center text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";

export function NumberStepper({ value, onChange, min = 0, max = 99, disabled, label }: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="inline-flex h-9 items-stretch overflow-hidden rounded-md border border-line bg-surface focus-within:border-accent">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={STEP_BUTTON}
        aria-label="Diminuer"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className="w-10 border-x border-line bg-transparent text-center font-mono text-sm tabular-nums outline-none [appearance:textfield] disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={STEP_BUTTON}
        aria-label="Augmenter"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
