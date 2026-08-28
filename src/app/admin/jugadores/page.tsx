"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Edit, Check, X, Shield, User, Power } from "lucide-react";
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
    setDorsal(players.length > 0 ? Math.max(...players.map((p) => p.dorsal)) + 1 : 1);
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
    const updated = await updatePlayer(player.id, { is_active: !player.is_active });
    if (updated) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, is_active: !p.is_active } : p))
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Gestión de <span className="text-accent-cyan">Plantilla</span>
          </h1>
          <p className="text-xs sm:text-sm text-psg-300">
            Añade nuevos jugadores, edita sus dorsales y actualiza sus fichas y fotos oficiales.
          </p>
        </div>

        <Button onClick={openNewPlayerModal} size="md">
          <UserPlus className="w-4 h-4" /> Añadir Jugador
        </Button>
      </div>

      {/* Players Table / Grid */}
      <div className="rounded-3xl bg-surface border border-surface-border p-6 shadow-card space-y-4">
        <div className="divide-y divide-surface-border">
          {players.map((player) => (
            <div
              key={player.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-psg-900 border border-surface-border overflow-hidden flex items-center justify-center flex-shrink-0">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-psg-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-accent-cyan">
                      #{player.dorsal}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {player.nickname}
                    </h3>
                    <Badge className={getPositionBadgeColor(player.position)}>
                      {getPositionName(player.position)}
                    </Badge>
                  </div>
                  <p className="text-xs text-psg-300">
                    {player.first_name} {player.last_name || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleStatus(player)}
                  title={player.is_active ? "Desactivar jugador" : "Activar jugador"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    player.is_active
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-surface-muted text-psg-400 border-surface-border hover:text-white"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{player.is_active ? "Activo" : "Baja Temporal"}</span>
                </button>

                <Button
                  onClick={() => openEditModal(player)}
                  variant="secondary"
                  size="sm"
                >
                  <Edit className="w-3.5 h-3.5" /> Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Alta/Edición Jugador */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlayer ? "Editar Ficha de Jugador" : "Alta de Nuevo Jugador"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Apodo en Camiseta *"
              placeholder="Ej: El Muro"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <Input
              label="Dorsal *"
              type="number"
              min="1"
              max="99"
              value={dorsal}
              onChange={(e) => setDorsal(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-psg-200">
              Posición
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              className="w-full rounded-lg bg-surface-muted border border-surface-border px-4 py-2.5 text-sm text-white focus:border-accent-cyan focus:outline-none"
            >
              <option value="portero">Portero</option>
              <option value="defensa">Defensa</option>
              <option value="medio">Centrocampista / Medio</option>
              <option value="delantero">Delantero</option>
            </select>
          </div>

          <Input
            label="URL de Foto Oficial (o enlace de Supabase Storage)"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          {photoUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-surface-border">
              <img
                src={photoUrl}
                alt="Vista previa"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="text-xs text-psg-300">Vista previa de la foto</span>
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
              <Check className="w-4 h-4" /> Guardar Jugador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

