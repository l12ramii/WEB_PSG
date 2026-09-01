"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Check,
  Trophy,
  Search,
  Upload,
  X,
  Loader2,
  Edit,
  Trash2,
  AlertTriangle,
  Link as LinkIcon,
  Shield,
} from "lucide-react";
import { getRivals, addRival, updateRival, deleteRival } from "@/lib/data";
import { Rival } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { RivalShield } from "@/components/ui/RivalShield";
import { compressImageFile } from "@/lib/utils";

export default function AdminRivalesPage() {
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRival, setEditingRival] = useState<Rival | null>(null);
  const [name, setName] = useState("");
  const [shieldUrl, setShieldUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rivalToDelete, setRivalToDelete] = useState<Rival | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const openNewRivalModal = () => {
    setEditingRival(null);
    setName("");
    setShieldUrl("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditRivalModal = (rival: Rival) => {
    setEditingRival(rival);
    setName(rival.name);
    setShieldUrl(rival.shield_url || "");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.9);
      if (compressed) {
        setShieldUrl(compressed);
      }
    } catch (err) {
      console.error("Error al procesar el escudo:", err);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor introduce el nombre del equipo rival.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    const cleanShield = shieldUrl.trim() || null;

    try {
      if (editingRival) {
        const updated = await updateRival(editingRival.id, {
          name: name.trim(),
          shield_url: cleanShield,
        });

        if (updated) {
          setRivals((prev) =>
            prev.map((r) => (r.id === editingRival.id ? updated : r))
          );
        }
      } else {
        const newRival = await addRival(name.trim(), cleanShield);
        setRivals((prev) => [...prev, newRival]);
      }

      setIsModalOpen(false);
      setName("");
      setShieldUrl("");
      setEditingRival(null);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Error al guardar el rival en la base de datos."
      );
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (rival: Rival) => {
    setRivalToDelete(rival);
    setErrorMessage(null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!rivalToDelete) return;

    setDeleting(true);
    setErrorMessage(null);
    try {
      await deleteRival(rivalToDelete.id);
      setRivals((prev) => prev.filter((r) => r.id !== rivalToDelete.id));
      setDeleteModalOpen(false);
      setRivalToDelete(null);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "No se puede eliminar este rival. Es posible que tenga partidos asociados en el calendario o actas."
      );
    } finally {
      setDeleting(false);
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
            Gestión completa (crear, editar, eliminar) de equipos contrarios y sus escudos
            para el calendario y las actas de partido.
          </p>
        </div>

        <Button
          onClick={openNewRivalModal}
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
            Cargando directorio de rivales...
          </p>
        </div>
      ) : filteredRivals.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface py-16 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted" />
          <h4 className="mt-3 font-display text-lg font-bold text-primary">
            No se encontraron rivales
          </h4>
          <p className="mt-1 text-sm text-secondary">
            {search
              ? "No hay ningún rival que coincida con tu búsqueda."
              : "Añade rivales para poder programar partidos y registrar actas."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-bold uppercase text-accent-cyan hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRivals.map((rival) => (
            <div
              key={rival.id}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-surface p-5 inner-light transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent-cyan/50 hover:shadow-glow-subtle min-w-0"
            >
              {/* Rival Info */}
              <div className="flex items-center gap-4 min-w-0">
                <RivalShield
                  src={rival.shield_url}
                  name={rival.name}
                  size="lg"
                  className="transition-transform duration-200 group-hover:scale-105"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <h3
                    title={rival.name}
                    className="truncate font-display text-xl font-bold uppercase tracking-wide text-primary transition-colors group-hover:text-accent-cyan"
                  >
                    {rival.name}
                  </h3>
                  <span className="flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-success">
                    <Check className="h-3.5 w-3.5" /> Disponible en Partidos
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit / Delete */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <Button
                  onClick={() => openEditRivalModal(rival)}
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 text-xs font-bold"
                >
                  <Edit className="h-3.5 w-3.5 text-accent-cyan" /> Editar
                </Button>
                <button
                  onClick={() => promptDelete(rival)}
                  title="Eliminar rival"
                  className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-danger transition-colors hover:bg-danger/25 hover:text-white focus-ring"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Rival */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!saving && !isProcessingFile) {
            setIsModalOpen(false);
            setEditingRival(null);
          }
        }}
        title={editingRival ? `Editar Rival: ${editingRival.name}` : "Añadir Nuevo Rival"}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {errorMessage && (
            <div className="rounded-xl border border-danger/40 bg-danger/15 p-3.5 text-xs font-medium text-danger flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              Escudo Oficial (Subir archivo o pegar enlace)
            </label>

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
                disabled={isProcessingFile}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-surface-elevated/50 p-4 text-xs font-bold uppercase tracking-wider text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors focus-ring disabled:opacity-50"
              >
                {isProcessingFile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
                    <span>Optimizando escudo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Subir escudo local</span>
                  </>
                )}
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="O pega URL (https://...)"
                  value={shieldUrl.startsWith("data:") ? "" : shieldUrl}
                  onChange={(e) => setShieldUrl(e.target.value)}
                  className="w-full h-full rounded-xl border border-white/10 bg-surface-elevated px-3.5 py-2.5 text-xs text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Live Shield Preview */}
            {shieldUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface-elevated p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <RivalShield src={shieldUrl} name={name || "Vista previa"} size="sm" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-primary truncate">
                      {shieldUrl.startsWith("data:")
                        ? "Escudo cargado localmente (optimizado)"
                        : "Escudo vinculado por URL"}
                    </span>
                    <span className="text-[11px] text-secondary">
                      Listo para asociarse al equipo
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShieldUrl("")}
                  className="rounded-lg p-1.5 text-secondary hover:bg-white/10 hover:text-danger focus-ring flex-shrink-0"
                  title="Eliminar escudo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px]"
              disabled={saving}
              onClick={() => {
                setIsModalOpen(false);
                setEditingRival(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px]"
              isLoading={saving}
            >
              <Check className="h-4 w-4" />{" "}
              {editingRival ? "Guardar Cambios" : "Guardar Rival"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirm Delete */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setRivalToDelete(null);
          }
        }}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          {errorMessage ? (
            <div className="rounded-xl border border-danger/40 bg-danger/15 p-3.5 text-xs font-medium text-danger flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <p className="text-sm text-secondary">
              ¿Estás seguro de que deseas eliminar al rival{" "}
              <strong className="text-primary uppercase">
                {rivalToDelete?.name}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px]"
              disabled={deleting}
              onClick={() => {
                setDeleteModalOpen(false);
                setRivalToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className="flex items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger px-6 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-glow-crimson transition-all hover:bg-danger/80 disabled:opacity-50 min-h-[44px]"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar Definitivamente</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
