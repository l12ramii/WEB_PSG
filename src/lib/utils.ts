import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { PlayerPosition, CompetitionType } from "./supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchDate(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, "EEEE, d 'de' MMMM · HH:mm 'hs'", { locale: es });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, "dd/MM/yyyy · HH:mm", { locale: es });
  } catch {
    return dateString;
  }
}

export function getRelativeTime(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch {
    return dateString;
  }
}

export function getPositionName(pos: PlayerPosition): string {
  switch (pos) {
    case "portero":
      return "Portero";
    case "defensa":
      return "Defensa";
    case "medio":
      return "Centrocampista";
    case "delantero":
      return "Delantero";
    default:
      return pos;
  }
}

export function getPositionShort(pos: PlayerPosition): string {
  switch (pos) {
    case "portero":
      return "POR";
    case "defensa":
      return "DEF";
    case "medio":
      return "MED";
    case "delantero":
      return "DEL";
    default:
      return pos;
  }
}

export function getPositionBadgeColor(pos: PlayerPosition): string {
  switch (pos) {
    case "portero":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "defensa":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "medio":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "delantero":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

export function getCompetitionLabel(comp: CompetitionType): string {
  switch (comp) {
    case "liga":
      return "Liga F7";
    case "copa":
      return "Copa F7";
    case "amistoso":
      return "Amistoso";
    default:
      return comp;
  }
}

