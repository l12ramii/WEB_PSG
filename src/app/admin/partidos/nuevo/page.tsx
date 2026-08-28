"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, ArrowLeft, Shield, Plus, Calendar } from "lucide-react";
import { getRivals, addMatch } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
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
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    d.setHours(18, 0, 0, 0);
    setMatchDate(d.toISOString().slice(0, 16));

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
    <div className="mx-auto max-w-2xl space-y-6 pb-20">
      {/* Back Button */}
      <Link
        href="/admin/partidos"
        className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
        className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary focus-ring rounded-lg px-2 py-1"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Partidos
      </Link>

      <div className="relative space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 shadow-2xl sm:p-10">
        {/* Top ambient illumination */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />

        <div className="space-y-1 border-b border-surface-border pb-4">
          <h1 className="font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
      <div className="relative space-y-6 overflow-hidden rounded-xl border border-white/10 bg-surface p-6 shadow-xl inner-light sm:p-10">
        <div className="space-y-1 border-b border-white/10 pb-4">
          <h1 className="font-display text-3xl font-black uppercase tracking-wide text-primary sm:text-4xl">
            Programar{" "}
            <span className="text-glow text-accent-cyan">Nuevo Encuentro</span>
            <span className="text-glow-subtle text-accent-cyan">Nuevo Encuentro</span>
          </h1>
          <p className="text-xs font-medium text-psg-300">
          <p className="text-xs font-medium text-secondary">
            Fija la fecha, hora, condición y rival para el próximo partido del
            PSG F7.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rival Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-display text-xs font-bold uppercase tracking-wider text-psg-200">
              <label className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                Equipo Rival *
              </label>
              <Link
                href="/admin/rivales"
                className="flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Crear nuevo rival
              </Link>
            </div>

            <select
              value={rivalId}
              onChange={(e) => setRivalId(e.target.value)}
              className="w-full rounded-2xl border border-surface-border bg-surface-muted px-4 py-3 text-sm font-medium text-white focus:border-accent-cyan focus:outline-none"
              className="w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-sm font-medium text-primary focus-ring focus:border-accent-cyan focus:outline-none"
              required
            >
              {rivals.map((rival) => (
                <option key={rival.id} value={rival.id}>
                  {rival.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition: Home / Away */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-psg-200">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Condición de Juego
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsHome(true)}
                className={`rounded-2xl border px-4 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all ${
                className={`rounded-xl border px-4 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all focus-ring ${
                  isHome
                    ? "border-accent-cyan bg-accent-electric text-white shadow-glow"
                    : "border-surface-border bg-surface-muted text-psg-300 hover:text-white"
                    ? "border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                    : "border-white/10 bg-surface-elevated/40 text-secondary hover:text-primary"
                }`}
              >
                Local (Campo PSG)
              </button>
              <button
                type="button"
                onClick={() => setIsHome(false)}
                className={`rounded-2xl border px-4 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all ${
                className={`rounded-xl border px-4 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all focus-ring ${
                  !isHome
                    ? "border-accent-cyan bg-accent-electric text-white shadow-glow"
                    : "border-surface-border bg-surface-muted text-psg-300 hover:text-white"
                    ? "border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                    : "border-white/10 bg-surface-elevated/40 text-secondary hover:text-primary"
                }`}
              >
                Visitante
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-psg-200">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Fecha y Hora del Encuentro
            </label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full rounded-2xl border border-surface-border bg-surface-muted px-4 py-3 text-sm font-medium text-white focus:border-accent-cyan focus:outline-none"
              className="w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-sm font-medium text-primary focus-ring focus:border-accent-cyan focus:outline-none"
              required
            />
          </div>

          {/* Competición */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-psg-200">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Competición
            </label>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value as any)}
              className="w-full rounded-2xl border border-surface-border bg-surface-muted px-4 py-3 text-sm font-medium text-white focus:border-accent-cyan focus:outline-none"
              className="w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-sm font-medium text-primary focus-ring focus:border-accent-cyan focus:outline-none"
            >
              <option value="liga">Liga Oficial F7</option>
              <option value="copa">Copa</option>
              <option value="amistoso">Partido Amistoso</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Link href="/admin/partidos">
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="shadow-glow"
              className="shadow-glow-subtle"
            >
              <CalendarPlus className="h-4 w-4" /> Guardar Partido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

