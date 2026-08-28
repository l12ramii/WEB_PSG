"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getPlayers, addPlayer, updatePlayer } from "@/lib/data";
import { Player, PlayerPosition } from "@/lib/supabase/types";
import { initialPlayers } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { getPositionName, getPositionBadgeColor } from "@/lib/utils";

export default function AdminJugadoresPage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
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

  useEffect(() => {
    getPlayers().then(setPlayers);
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
        prev.map((p) =>
          p.id === player.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !nickname || !dorsal) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setSaving(true);
    try {
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, {
          first_name: firstName,
          last_name: lastName || null,
          nickname,
          dorsal: Number(dorsal),
          position,
          photo_url: photoUrl || null,
          is_active: isActive,
        });
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === editingPlayer.id
              ? {
                  ...p,
                  first_name: firstName,
                  last_name: lastName || null,
                  nickname,
                  dorsal: Number(dorsal),
                  position,
                  photo_url: photoUrl || null,
                  is_active: isActive,
                }
              : p
          )
        );
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
        setPlayers((prev) => [...prev, newP]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Error al guardar el jugador");
    } finally {
      setSaving(false);
    }
  };

  const filteredPlayers = players.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.nickname.toLowerCase().includes(q) ||
      p.first_name.toLowerCase().includes(q) ||
      String(p.dorsal).includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-primary sm:text-5xl">
            Gestión de{" "}
            <span className="text-glow text-accent-cyan">Plantilla</span>
            <span className="text-glow-subtle text-accent-cyan">Plantilla</span>
          </h1>
          <p className="text-xs font-medium text-psg-300 sm:text-sm">
            Alta de fichajes, edición de dorsales, posiciones y fotos oficiales
          <p className="text-xs font-medium text-secondary sm:text-sm">
            Alta de fichajes, edición de dorsales, posiciones y galería de fotos oficiales
            de los jugadores.
          </p>
        </div>

        <Button onClick={openNewPlayerModal} size="lg" className="shadow-glow">
        <Button onClick={openNewPlayerModal} size="lg" className="shadow-glow-subtle">
          <UserPlus className="h-4 w-4" /> Añadir Jugador
        </Button>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-surface-border bg-surface p-4 shadow-card sm:flex-row">
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-psg-400" />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por apodo, nombre o dorsal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-muted py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-psg-400 focus:border-accent-cyan focus:outline-none"
            className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2.5 pl-10 pr-4 text-xs font-medium text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
          />
        </div>

        <span className="rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 font-display text-xs font-bold uppercase text-psg-300">
        <span className="rounded-lg border border-white/10 bg-surface-elevated px-3 py-1.5 font-display text-xs font-bold uppercase text-secondary">
          Total: {filteredPlayers.length} Jugadores
        </span>
      </div>

      {/* Players Table / Grid */}
      <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
        <div className="divide-y divide-surface-border">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="py-4.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface-border bg-psg-950 shadow-md">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-psg-400" />
                  )}
                </div>
      <div className="space-y-4 rounded-xl border border-white/10 bg-surface p-4 sm:p-6 inner-light">
        <div className="divide-y divide-white/10">
          {filteredPlayers.map((player) => {
            const playerPhotos = player.photo_url
              ? player.photo_url.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean)
              : [];
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

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg font-black text-accent-cyan">
                      #{player.dorsal}
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {player.nickname}
                    </h3>
                    <Badge variant={player.position} dot>
                      {getPositionName(player.position)}
                    </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-black text-accent-cyan">
                        #{player.dorsal}
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
                  <p className="text-xs font-medium text-psg-300">
                    {player.first_name} {player.last_name || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <button
                  onClick={() => handleToggleStatus(player)}
                  title={
                    player.is_active ? "Desactivar jugador" : "Activar jugador"
                  }
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-all ${
                    player.is_active
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-sm hover:bg-emerald-500/25"
                      : "border-surface-border bg-surface-muted text-psg-400 hover:text-white"
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{player.is_active ? "Activo" : "Baja Temporal"}</span>
                </button>
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
                  <Button
                    onClick={() => openEditModal(player)}
                    variant="secondary"
                    size="sm"
                  >
                    <Edit className="h-3.5 w-3.5" /> Editar Ficha
                  </Button>
                </div>
              </div>
            </div>
          ))}
            );
          })}
        </div>
      </div>

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
              label="Dorsal Oficial *"
              type="number"
              min="1"
              max="99"
              value={dorsal}
              onChange={(e) => setDorsal(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-psg-200">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Posición Táctica
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-sm font-medium text-white focus:border-accent-cyan focus:outline-none"
              className="w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-2.5 text-sm font-medium text-primary focus-ring focus:border-accent-cyan focus:outline-none"
            >
              <option value="portero">Portero</option>
              <option value="defensa">Defensa</option>
              <option value="medio">Centrocampista / Medio</option>
              <option value="delantero">Delantero</option>
            </select>
          </div>

          <Input
            label="URL de Foto Oficial (o enlace de Supabase Storage)"
            placeholder="https://images.unsplash.com/..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold uppercase tracking-wider text-secondary">
              URLs de Fotos Oficiales (Separa con comas o saltos de línea para el carrusel)
            </label>
            <textarea
              rows={3}
              placeholder="https://images.unsplash.com/foto1...&#10;https://images.unsplash.com/foto2..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-elevated p-3 text-xs font-medium text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
            />
          </div>

          {photoUrl && (
            <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-muted p-3">
              <img
                src={photoUrl}
                alt="Vista previa"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <span className="text-xs font-medium text-psg-300">
                Vista previa de la foto oficial
          {/* Live Photo Gallery Preview */}
          {photoUrl.trim() && (
            <div className="space-y-2 rounded-xl border border-white/10 bg-surface-elevated/40 p-3">
              <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-secondary">
                Vista previa del carrusel ({photoUrl.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean).length} fotos):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {photoUrl
                  .split(/[\n,]+/)
                  .map((u) => u.trim())
                  .filter(Boolean)
                  .map((url, idx) => (
                    <div
                      key={idx}
                      className="relative flex aspect-[3/4] w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-surface-elevated shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 py-0.2 font-display text-[8px] font-bold text-accent-cyan">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={saving}>
              <Check className="h-4 w-4" /> Guardar Jugador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
