import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Users, Coins } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo CIM Dr MERAD"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          <span className="text-sm font-semibold text-text-primary sm:text-base">
            Gestion des présences
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">Calendrier</span>
          </Link>
          <Link
            href="/employees"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          >
            <Users size={16} />
            <span className="hidden sm:inline">Employés</span>
          </Link>
          <Link
            href="/rates"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          >
            <Coins size={16} />
            <span className="hidden sm:inline">Tarifs</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
