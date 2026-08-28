"use client";

import React, { useState, useEffect } from "react";
import { Plus, Shield, Check, Trophy, Search } from "lucide-react";
import { getRivals, addRival } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { initialRivals } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function AdminRivalesPage() {
  const [rivals, setRivals] = useState<Rival[]>(initialRivals);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [shieldUrl, setShieldUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRivals().then(setRivals);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Por favor introduce el nombre del equipo.");
      return;
    }

    setSaving(true);
    try {
      const newRival = await addRival(name, shieldUrl);
      setRivals((prev) => [...prev, newRival]);
      setName("");
      setShieldUrl("");
      setIsModalOpen(false);
    } catch (err) {
      alert("Error al guardar el rival");
    } finally {
      setSaving(false);
    }
  };

  const filteredRivals = rivals.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Directorio de{" "}
            <span className="text-glow text-accent-cyan">Rivales</span>
          </h1>
          <p className="text-xs font-medium text-psg-300 sm:text-sm">
            Base de datos reutilizable de equipos rivales y sus escudos para
            vincularlos a los partidos.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4" /> Añadir Nuevo Rival
        </Button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-surface-border bg-surface p-4 shadow-card sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-psg-400" />
          <input
            type="text"
            placeholder="Buscar rival por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-muted py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-psg-400 focus:border-accent-cyan focus:outline-none"
          />
        </div>

        <span className="rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 font-display text-xs font-bold uppercase text-psg-300">
          {filteredRivals.length} Rivales en Base de Datos
        </span>
      </div>

      {/* Rivals Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRivals.map((rival) => (
          <div
            key={rival.id}
            className="group flex select-none items-center gap-4 rounded-3xl border border-surface-border bg-card-gradient p-6 shadow-card transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-glow"
          >
            <div className="w-18 h-18 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface-border bg-surface-muted p-2.5 shadow-inner transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
              {rival.shield_url ? (
                <img
                  src={rival.shield_url}
                  alt={rival.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Shield className="h-8 w-8 text-psg-400" />
              )}
            </div>

            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white transition-colors group-hover:text-accent-cyan">
                {rival.name}
              </h3>
              <span className="mt-1 flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Check className="h-3.5 w-3.5" /> Disponible en Partidos
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Rival */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir Equipo Rival"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nombre del Equipo Rival *"
            placeholder="Ej: Barrio Norte F7"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="URL del Escudo (o enlace de imagen de Supabase Storage)"
            placeholder="https://images.unsplash.com/..."
            value={shieldUrl}
            onChange={(e) => setShieldUrl(e.target.value)}
          />

          {shieldUrl && (
            <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-muted p-3">
              <img
                src={shieldUrl}
                alt="Vista previa del escudo"
                className="h-12 w-12 rounded-xl object-contain"
              />
              <span className="text-xs font-medium text-psg-300">
                Vista previa del escudo del equipo
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={saving}>
              <Check className="h-4 w-4" /> Guardar Rival
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
