import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";

// Le centre travaille du samedi au jeudi et se repose le vendredi:
// on démarre donc la grille le samedi pour que "Repos" tombe toujours
// en fin de ligne, comme un week-end classique.
const WEEK_STARTS_ON = 6 as const;

export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

export function isFridayISO(dateISO: string): boolean {
  return isFriday(parseISO(dateISO));
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseISO(dateISO: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function monthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export interface MonthGrid {
  weeks: Date[][];
  monthDate: Date;
}

export function buildMonthGrid(monthDate: Date): MonthGrid {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: WEEK_STARTS_ON });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: WEEK_STARTS_ON });
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return { weeks, monthDate };
}

export const WEEKDAY_LABELS_SAT_START = ["Sam", "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven"];

export function formatMonthYear(date: Date): string {
  const label = format(date, "LLLL yyyy", { locale: fr });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDayLong(date: Date): string {
  const label = format(date, "EEEE d MMMM yyyy", { locale: fr });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export { isSameMonth, isToday, addMonths, subMonths };
