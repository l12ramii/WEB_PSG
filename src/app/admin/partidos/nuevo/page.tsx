"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, ArrowLeft, Shield, Plus } from "lucide-react";
import { getRivals, addMatch } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { initialRivals } from "@/lib/mock-data";

export default function NuevoPartidoPage() {
  const router = useRouter();
  const [rivals, setRivals] = useState<Rival[]>(initialRivals);
  const [rivalId, setRivalId] = useState<string>(initialRivals[0]?.id || "");
  const [isHome, setIsHome] = useState<boolean>(true);
  const [matchDate, setMatchDate] = useState<string>("");
  const [competition, setCompetition] = useState<"liga" | "copa" | "amistoso">(
    "liga"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set default match date to next Saturday 18:00
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    d.setHours(18, 0, 0, 0);
    setMatchDate(d.toISOString().slice(0, 16));

    // Fetch rivals
    getRivals().then((data) => {
      setRivals(data);
      if (data.length > 0) setRivalId(data[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rivalId || !matchDate) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setIsLoading(true);
    try {
      await addMatch({
        rival_id: rivalId,
        is_home: isHome,
        match_date: new Date(matchDate).toISOString(),
        competition,
      });

      router.push("/admin/partidos");
      router.refresh();
    } catch (err) {
      alert("Error al programar el partido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16">
      {/* Back Button */}
      <Link
        href="/admin/partidos"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a partidos
      </Link>

      <div className="space-y-6 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
        <div className="space-y-1 border-b border-surface-border pb-4">
          <h1 className="font-display text-2xl font-black uppercase tracking-wider text-white sm:text-3xl">
            Programar <span className="text-accent-cyan">Nuevo Partido</span>
          </h1>
          <p className="text-xs text-psg-300">
            Añade un nuevo encuentro al calendario del PSG Fútbol 7.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rival Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-psg-200">
                Equipo Rival
              </label>
              <Link
                href="/admin/rivales"
                className="flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Crear nuevo rival
              </Link>
            </div>

            <select
              value={rivalId}
              onChange={(e) => setRivalId(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-white focus:border-accent-cyan focus:outline-none"
              required
            >
              {rivals.map((rival) => (
                <option key={rival.id} value={rival.id}>
                  {rival.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition: Local / Away */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-psg-200">
              Condición
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsHome(true)}
                className={`rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  isHome
                    ? "border-accent-cyan bg-accent-electric text-white shadow-glow"
                    : "border-surface-border bg-surface-muted text-psg-300 hover:text-white"
                }`}
              >
                Local (Campo PSG)
              </button>
              <button
                type="button"
                onClick={() => setIsHome(false)}
                className={`rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  !isHome
                    ? "border-accent-cyan bg-accent-electric text-white shadow-glow"
                    : "border-surface-border bg-surface-muted text-psg-300 hover:text-white"
                }`}
              >
                Visitante
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-psg-200">
              Fecha y Hora del Partido
            </label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-white focus:border-accent-cyan focus:outline-none"
              required
            />
          </div>

          {/* Competición */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-psg-200">
              Competición
            </label>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value as any)}
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-white focus:border-accent-cyan focus:outline-none"
            >
              <option value="liga">Liga Oficial F7</option>
              <option value="copa">Copa</option>
              <option value="amistoso">Partido Amistoso</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
            <Link href="/admin/partidos">
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" isLoading={isLoading} size="lg">
              <CalendarPlus className="h-4 w-4" /> Guardar Partido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
