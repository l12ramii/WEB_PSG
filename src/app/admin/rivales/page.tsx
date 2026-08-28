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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Directorio de <span className="text-accent-cyan">Rivales</span>
          </h1>
          <p className="text-xs sm:text-sm text-psg-300">
            Base de datos reutilizable de equipos rivales y sus escudos para los partidos.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="w-4 h-4" /> Añadir Nuevo Rival
        </Button>
      </div>

      {/* Rivals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rivals.map((rival) => (
          <div
            key={rival.id}
            className="rounded-2xl bg-surface border border-surface-border p-6 shadow-card flex items-center gap-4 hover:border-accent-cyan/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center overflow-hidden flex-shrink-0 p-2">
              {rival.shield_url ? (
                <img
                  src={rival.shield_url}
                  alt={rival.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Shield className="w-8 h-8 text-psg-400" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{rival.name}</h3>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Disponible en selector
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
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-surface-border">
              <img
                src={shieldUrl}
                alt="Vista previa del escudo"
                className="w-12 h-12 rounded-lg object-contain"
              />
              <span className="text-xs text-psg-300">Vista previa del escudo</span>
            </div>
          )}

          <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={saving}>
              <Check className="w-4 h-4" /> Guardar Rival
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

