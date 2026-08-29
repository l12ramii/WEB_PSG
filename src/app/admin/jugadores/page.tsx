"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  Edit,
  Check,
  X,
  Shield,
  User,
  Power,
  Search,
  Sparkles,
  Upload,
  ImagePlus,
  Trash2,
  Loader2,
} from "lucide-react";
import { getPlayers, addPlayer, updatePlayer } from "@/lib/data";
import { Player, PlayerPosition } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  getPositionName,
  parsePhotoUrls,
  compressImageFile,
  sortPlayersByPositionAndDorsal,
} from "@/lib/utils";

export default function AdminJugadoresPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dorsal, setDorsal] = useState<number>(10);
  const [position, setPosition] = useState<PlayerPosition>("medio");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    try {
      const fileList = Array.from(files);
      const dataUrls = await Promise.all(
        fileList.map((file) => compressImageFile(file))
      );
      const validUrls = dataUrls.filter((u) => Boolean(u && u.trim().length > 0));

      if (validUrls.length > 0) {
        const currentUrls = parsePhotoUrls(photoUrl);
        const combined = [...currentUrls, ...validUrls];
        setPhotoUrl(combined.join("\n"));
      }
    } catch (err) {
      console.error("Error al procesar fotos:", err);
    } finally {
      setIsProcessingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const loadPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(sortPlayersByPositionAndDorsal(data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const openNewPlayerModal = () => {
    setEditingPlayer(null);
    setFirstName("");
    setLastName("");
    setNickname("");
    setDorsal(
      players.length > 0 ? Math.max(...players.map((p) => p.dorsal)) + 1 : 1
    );
    setPosition("medio");
    setPhotoUrl("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFirstName(player.first_name);
    setLastName(player.last_name || "");
    setNickname(player.nickname);
    setDorsal(player.dorsal);
    setPosition(player.position);
    setPhotoUrl(player.photo_url || "");
    setIsActive(player.is_active);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (player: Player) => {
    const updated = await updatePlayer(player.id, {
      is_active: !player.is_active,
    });
    if (updated) {
      setPlayers((prev) =>
        sortPlayersByPositionAndDorsal(
          prev.map((p) =>
            p.id === player.id ? { ...p, is_active: !p.is_active } : p
          )
        )
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !nickname || dorsal === undefined || isNaN(dorsal) || dorsal < 0) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setSaving(true);
    try {
      if (editingPlayer) {
        const updated = await updatePlayer(editingPlayer.id, {
          first_name: firstName,
          last_name: lastName || null,
          nickname,
          dorsal: Number(dorsal),
          position,
          photo_url: photoUrl || null,
          is_active: isActive,
        });
        if (updated) {
          setPlayers((prev) =>
            sortPlayersByPositionAndDorsal(
              prev.map((p) => (p.id === editingPlayer.id ? updated : p))
            )
          );
        }
      } else {
        const newP = await addPlayer({
          first_name: firstName,
          last_name: lastName || null,
          nickname,
          dorsal: Number(dorsal),
          position,
          photo_url: photoUrl || null,
          is_active: isActive,
        });
        setPlayers((prev) => sortPlayersByPositionAndDorsal([...prev, newP]));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Error al guardar el miembro en Supabase: " + (err?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const filteredPlayers = sortPlayersByPositionAndDorsal(
    players.filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.nickname?.toLowerCase().includes(q) ||
        p.first_name?.toLowerCase().includes(q) ||
        (p.last_name && p.last_name.toLowerCase().includes(q)) ||
        getPositionName(p.position).toLowerCase().includes(q) ||
        String(p.dorsal).includes(q)
      );
    })
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary sm:text-5xl">
            Gestión de{" "}
            <span className="text-glow-subtle text-accent-cyan">Plantilla</span>
          </h1>
          <p className="text-xs font-medium text-secondary sm:text-sm">
            Alta de fichajes, edición de dorsales, posiciones y fotos oficiales
            en la base de datos de Supabase.
          </p>
        </div>

        <Button onClick={openNewPlayerModal} size="lg" className="shadow-glow-subtle">
          <UserPlus className="h-4 w-4" /> Añadir Jugador
        </Button>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por apodo, nombre o dorsal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2.5 pl-10 pr-4 text-xs font-medium text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
          />
        </div>

        <span className="rounded-lg border border-white/10 bg-surface-elevated px-3 py-1.5 font-display text-xs font-bold uppercase text-secondary">
          Total: {filteredPlayers.length} Jugadores
        </span>
      </div>

      {/* Players Table / Grid or Loading / Empty */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent-cyan" />
          <p className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-secondary">
            Cargando...
          </p>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-white/10 bg-surface p-4 sm:p-6 inner-light">
          {filteredPlayers.length === 0 ? (
            <div className="py-12 text-center">
              <User className="mx-auto h-12 w-12 text-muted" />
              <h4 className="mt-3 font-display text-lg font-bold text-primary">
                No hay jugadores registrados
              </h4>
              <p className="mt-1 text-sm text-secondary">
                Haz clic en &quot;Añadir Jugador&quot; para registrar el primer jugador en Supabase.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredPlayers.map((player) => {
                const playerPhotos = parsePhotoUrls(player.photo_url);
                return (
                  <div
                    key={player.id}
                    className="py-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center min-w-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-surface-elevated shadow-md">
                        {playerPhotos.length > 0 ? (
                          <img
                            src={playerPhotos[0]}
                            alt={player.nickname}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <User className="h-7 w-7 text-muted" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-lg font-black text-accent-cyan">
                            {(player.position === "entrenador" ||
                              player.position === "utillero") &&
                            player.dorsal === 0
                              ? player.position === "entrenador"
                                ? "DT"
                                : "STAFF"
                              : `#${player.dorsal}`}
                          </span>
                          <h3 className="truncate font-display text-xl font-bold uppercase text-primary">
                            {player.nickname}
                          </h3>
                          <Badge variant={player.position} dot>
                            {getPositionName(player.position)}
                          </Badge>
                          {playerPhotos.length > 1 && (
                            <span className="rounded bg-accent-cyan/15 px-1.5 py-0.5 font-display text-[10px] font-bold text-accent-cyan">
                              {playerPhotos.length} fotos
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs font-medium text-secondary">
                          {player.first_name} {player.last_name || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(player)}
                        title={
                          player.is_active ? "Desactivar jugador" : "Activar jugador"
                        }
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-all focus-ring ${
                          player.is_active
                            ? "border-success/30 bg-success/15 text-success shadow-sm hover:bg-success/25"
                            : "border-white/10 bg-surface-elevated text-muted hover:text-primary"
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{player.is_active ? "Activo" : "Baja Temporal"}</span>
                      </button>

                      <Button
                        onClick={() => openEditModal(player)}
                        variant="secondary"
                        size="sm"
                      >
                        <Edit className="h-3.5 w-3.5" /> Editar Ficha
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingPlayer ? "Editar Ficha de Jugador" : "Alta de Nuevo Jugador"
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              placeholder="Ej: Álvaro"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Apellidos (Opcional)"
              placeholder="Ej: Ramos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Apodo en Camiseta *"
              placeholder="Ej: El Muro"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <Input
              label="Dorsal Oficial (0 para Cuerpo Técnico) *"
              type="number"
              min="0"
              max="99"
              value={dorsal}
              onChange={(e) => setDorsal(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Posición / Rol
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              className="w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-2.5 text-sm font-medium text-primary focus-ring focus:border-accent-cyan focus:outline-none"
            >
              <optgroup label="Plantilla de Jugadores (F7)">
                <option value="portero">Portero</option>
                <option value="defensa">Defensa</option>
                <option value="medio">Centrocampista / Medio</option>
                <option value="delantero">Delantero</option>
              </optgroup>
              <optgroup label="Cuerpo Técnico / Staff">
                <option value="entrenador">Entrenador (Director Técnico)</option>
                <option value="utillero">Utillero (Staff Técnico)</option>
              </optgroup>
            </select>
          </div>

          {/* Photo Upload & URL Section */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Fotos Oficiales (Subir archivos o pegar enlaces)
            </label>

            {/* Direct File Upload Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isProcessingPhotos}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-surface-elevated/50 p-4 text-xs font-bold uppercase tracking-wider text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors focus-ring disabled:opacity-50"
              >
                {isProcessingPhotos ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
                    <span>Optimizando fotos...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Subir fotos locales</span>
                  </>
                )}
              </button>

              <textarea
                rows={2}
                placeholder="O pega URLs separadas por saltos de línea o comas..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-surface-elevated p-2.5 text-xs text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Live Photo Gallery Preview with Deletion */}
          {(() => {
            const activePhotos = parsePhotoUrls(photoUrl);
            if (activePhotos.length === 0) return null;

            return (
              <div className="space-y-2 rounded-xl border border-white/10 bg-surface-elevated/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-secondary">
                    Fotos cargadas ({activePhotos.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl("")}
                    className="text-[10px] text-danger hover:underline font-bold uppercase"
                  >
                    Limpiar todas
                  </button>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {activePhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative flex aspect-[3/4] w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-surface-elevated shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 py-0.2 font-display text-[8px] font-bold text-accent-cyan">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = activePhotos
                            .filter((_, i) => i !== idx)
                            .join("\n");
                          setPhotoUrl(updated);
                        }}
                        className="absolute top-1 right-1 h-4 w-4 rounded-full bg-danger text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow-sm transition-opacity"
                        title="Eliminar foto"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
              <Check className="h-4 w-4" /> Guardar Jugador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
