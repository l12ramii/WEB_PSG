"use client";

import React, { useState, useEffect } from "react";
import { Plus, Shield, Check, Trophy } from "lucide-react";
import { getRivals, addRival } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { initialRivals } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function AdminRivalesPage() {
  const [rivals, setRivals] = useState<Rival[]>(initialRivals);
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Directorio de <span className="text-accent-cyan">Rivales</span>
          </h1>
          <p className="text-xs text-psg-300 sm:text-sm">
            Base de datos reutilizable de equipos rivales y sus escudos para los
            partidos.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="h-4 w-4" /> Añadir Nuevo Rival
        </Button>
      </div>

      {/* Rivals Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rivals.map((rival) => (
          <div
            key={rival.id}
            className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface p-6 shadow-card transition-colors hover:border-accent-cyan/40"
          >
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-surface-muted p-2">
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
              <h3 className="text-lg font-bold text-white">{rival.name}</h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Check className="h-3 w-3" /> Disponible en selector
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Añadir Rival */}
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
            placeholder="https://..."
            value={shieldUrl}
            onChange={(e) => setShieldUrl(e.target.value)}
          />

          {shieldUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-muted p-3">
              <img
                src={shieldUrl}
                alt="Vista previa del escudo"
                className="h-12 w-12 rounded-lg object-contain"
              />
              <span className="text-xs text-psg-300">
                Vista previa del escudo
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
