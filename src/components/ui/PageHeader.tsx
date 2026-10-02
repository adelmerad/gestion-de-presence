import { ReactNode } from "react";

/** En-tête de page: petite rubrique, grand titre serif, actions à droite. */
export function PageHeader({ eyebrow, title, actions }: { eyebrow: string; title: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-7">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{eyebrow}</p>
        <h1 className="font-display text-[34px] leading-none text-ink first-letter:uppercase md:text-[44px]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
