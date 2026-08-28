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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Gestión de <span className="text-accent-cyan">Plantilla</span>
          </h1>
          <p className="text-xs text-psg-300 sm:text-sm">
            Añade nuevos jugadores, edita sus dorsales y actualiza sus fichas y
            fotos oficiales.
          </p>
        </div>

        <Button onClick={openNewPlayerModal} size="md">
          <UserPlus className="h-4 w-4" /> Añadir Jugador
        </Button>
      </div>

      {/* Players Table / Grid */}
      <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="divide-y divide-surface-border">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-psg-900">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-psg-400" />
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
                  title={
                    player.is_active ? "Desactivar jugador" : "Activar jugador"
                  }
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    player.is_active
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "border-surface-border bg-surface-muted text-psg-400 hover:text-white"
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
                  <Edit className="h-3.5 w-3.5" /> Editar
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
              className="w-full rounded-lg border border-surface-border bg-surface-muted px-4 py-2.5 text-sm text-white focus:border-accent-cyan focus:outline-none"
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
            <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-muted p-3">
              <img
                src={photoUrl}
                alt="Vista previa"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="text-xs text-psg-300">
                Vista previa de la foto
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
              <Check className="h-4 w-4" /> Guardar Jugador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
