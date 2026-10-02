interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  /** Purement visuel: l'élément parent (ex: toute une ligne) porte le rôle "switch". */
  decorative?: boolean;
}

export function Toggle({ checked, onChange, label, disabled, decorative }: ToggleProps) {
  const track = `relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
    checked ? "border-accent bg-accent" : "border-line bg-paper"
  }`;
  const knob = (
    <span
      className={`inline-block h-5 w-5 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform duration-200 ${
        checked ? "translate-x-[22px]" : "translate-x-[3px]"
      }`}
    />
  );

  if (decorative) {
    return (
      <span aria-hidden className={track}>
        {knob}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`${track} hover:border-ink-faint/60 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {knob}
    </button>
  );
}
