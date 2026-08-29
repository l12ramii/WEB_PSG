"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Shield, Check, Trophy, Search, Upload, X, Loader2 } from "lucide-react";
import { getRivals, addRival } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { compressImageFile } from "@/lib/utils";

export default function AdminRivalesPage() {
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [shieldUrl, setShieldUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRivals = async () => {
    try {
      const data = await getRivals();
      setRivals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRivals();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageFile(file, 600, 600, 0.9);
      if (compressed) setShieldUrl(compressed);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
    } catch (err: any) {
      alert("Error al guardar el rival en Supabase: " + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const filteredRivals = rivals.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary sm:text-5xl">
            Directorio de{" "}
            <span className="text-glow-subtle text-accent-cyan">Rivales</span>
          </h1>
          <p className="text-xs font-medium text-secondary sm:text-sm">
            Base de datos reutilizable de equipos rivales y sus escudos en Supabase
            para vincularlos a los partidos.
          </p>
        </div>

        <Button
          onClick={() => {
            setName("");
            setShieldUrl("");
            setIsModalOpen(true);
          }}
          size="lg"
          className="shadow-glow-subtle px-5 py-3"
        >
          <Plus className="h-4 w-4" /> Añadir Nuevo Rival
        </Button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar rival por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2.5 pl-10 pr-4 text-xs font-medium text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
          />
        </div>

        <span className="rounded-lg border border-white/10 bg-surface-elevated px-3 py-1.5 font-display text-xs font-bold uppercase text-secondary">
          {filteredRivals.length} Rivales en Base de Datos
        </span>
      </div>

      {/* Rivals Grid or Loading / Empty */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent-cyan" />
          <p className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-secondary">
            Cargando...
          </p>
        </div>
      ) : filteredRivals.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface py-16 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted" />
          <h4 className="mt-3 font-display text-lg font-bold text-primary">
            No hay rivales registrados
          </h4>
          <p className="mt-1 text-sm text-secondary">
            Añade rivales para poder programar partidos contra ellos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRivals.map((rival) => (
            <div
              key={rival.id}
              className="group flex select-none items-center gap-4 rounded-xl border border-white/10 bg-surface p-6 inner-light transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent-cyan/50 hover:shadow-glow-subtle min-w-0"
            >
              <div className="h-16 w-16 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-surface-elevated p-2 shadow-inner transition-transform duration-200 group-hover:scale-105 sm:h-18 sm:w-18">
                {rival.shield_url ? (
                  <img
                    src={rival.shield_url}
                    alt={rival.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Shield className="h-8 w-8 text-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  title={rival.name}
                  className="truncate font-display text-xl font-bold uppercase tracking-wide text-primary transition-colors group-hover:text-accent-cyan"
                >
                  {rival.name}
                </h3>
                <span className="mt-1 flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-success">
                  <Check className="h-3.5 w-3.5" /> Disponible en Partidos
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Rival */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir Equipo Rival"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Nombre del Equipo Rival *"
            placeholder="Ej: Barrio Norte F7"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Shield Upload / URL Section */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Escudo del Equipo (Subir archivo o pegar enlace)
            </label>

            {/* Direct File Upload Dropzone */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-surface-elevated/50 p-4 text-xs font-bold uppercase tracking-wider text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors focus-ring"
              >
                <Upload className="h-4 w-4" />
                <span>Subir imagen local</span>
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="O pega URL (https://...)"
                  value={shieldUrl.startsWith("data:") ? "Imagen cargada localmente" : shieldUrl}
                  onChange={(e) => setShieldUrl(e.target.value)}
                  className="w-full h-full rounded-xl border border-white/10 bg-surface-elevated px-3 py-2.5 text-xs text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Live Shield Preview */}
            {shieldUrl && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface-elevated p-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg border border-white/10 bg-background/50 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={shieldUrl}
                      alt="Vista previa del escudo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-primary">
                      Escudo cargado
                    </span>
                    <span className="text-[11px] text-secondary">
                      Listo para vincular al equipo
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShieldUrl("")}
                  className="rounded-lg p-1.5 text-secondary hover:bg-white/10 hover:text-danger focus-ring"
                  title="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px]"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px]"
              isLoading={saving}
            >
              <Check className="h-4 w-4" /> Guardar Rival
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
