import { useId } from "react";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Symbole du CIM, redessiné d'après le logo: l'anneau du scanner, la table
 * qui y entre et le patient (le point). Dessiné en currentColor.
 */
export function BrandMark({ size = 28, className = "" }: BrandMarkProps) {
  const maskId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <mask id={maskId}>
        <rect width="32" height="32" fill="white" />
        <rect x="1" y="15.6" width="9.9" height="8.8" rx="2.5" fill="black" />
      </mask>
      <circle cx="18" cy="15" r="10.5" stroke="currentColor" strokeWidth="3.5" mask={`url(#${maskId})`} />
      <rect x="2" y="17.75" width="14.5" height="4.5" rx="2.25" fill="currentColor" />
      <circle cx="20.6" cy="20" r="2.4" fill="currentColor" />
    </svg>
  );
}
