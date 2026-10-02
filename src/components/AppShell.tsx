"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CalendarDays, Coins, LogOut, Users, type LucideIcon } from "lucide-react";
import { logout } from "@/app/login/actions";
import { BrandMark } from "./BrandMark";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Calendrier", icon: CalendarDays },
  { href: "/employees", label: "Employés", icon: Users },
  { href: "/rates", label: "Tarifs", icon: Coins },
];

function BrandTile({ size = 32 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[7px] bg-accent text-white"
      style={{ width: size, height: size }}
    >
      <BrandMark size={size * 0.72} />
    </span>
  );
}

export function AppShell({ children, canLogout }: { children: ReactNode; canLogout: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-dvh md:pl-60">
      {/* Barre latérale (tablette / ordinateur) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-ink text-paper md:flex">
        <Link href="/" className="flex items-center gap-3 px-5 pb-8 pt-6">
          <BrandTile />
          <span className="leading-tight">
            <span className="block font-display text-[22px] text-white">Présences</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-paper/50">CIM Dr Merad</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-0.5 px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/[0.07] text-white" : "text-paper/60 hover:bg-white/[0.04] hover:text-paper"
                }`}
              >
                <span
                  className={`absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {canLogout && (
          <form action={logout} className="mt-auto border-t border-white/[0.08] px-3 py-4">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-paper/50 transition-colors hover:bg-white/[0.04] hover:text-paper"
            >
              <LogOut size={17} strokeWidth={1.8} />
              Déconnexion
            </button>
          </form>
        )}
      </aside>

      {/* Barre du haut (téléphone) */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-paper md:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandTile size={28} />
          <span className="font-display text-xl text-white">Présences</span>
        </Link>
        {canLogout && (
          <form action={logout}>
            <button
              type="submit"
              aria-label="Déconnexion"
              className="flex h-9 w-9 items-center justify-center rounded-md text-paper/60 transition-colors hover:bg-white/[0.06] hover:text-paper"
            >
              <LogOut size={18} />
            </button>
          </form>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:px-10 md:pb-12 md:pt-9">{children}</main>

      {/* Onglets du bas (téléphone) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 pb-2.5 pt-2 text-[11px] font-semibold transition-colors ${
                active ? "text-accent" : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <span
                className={`absolute inset-x-8 top-0 h-[2px] rounded-b-full bg-accent transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
