"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PsgShield } from "@/components/ui/PsgShield";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
        ) {
          router.push("/admin");
          return;
        }
        setError(authError.message || "Credenciales incorrectas");
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    router.push("/admin");
  };

  return (
    <div className="bg-soccer-mesh relative flex min-h-screen items-center justify-center bg-stadium-spotlight p-4">
      {/* Stadium Light Aura */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-cyan/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Card */}
        <div className="relative space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Top ambient illumination */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

          {/* Logo Header */}
          <div className="space-y-3 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-accent-cyan/50 bg-surface-elevated p-2 shadow-glow">
              <PsgShield size="lg" priority />
            </div>
            <h1 className="font-display text-3xl font-black uppercase tracking-wider text-white">
              PSG <span className="text-glow text-accent-cyan">BACKOFFICE</span>
            </h1>
            <p className="text-xs font-medium text-psg-300">
              Acceso exclusivo para el Community Manager del club.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/20 p-3.5 text-xs font-medium text-rose-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="cm@psgf7.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full shadow-glow"
              size="lg"
            >
              <Lock className="h-4 w-4" /> Iniciar Sesión CM
            </Button>
          </form>

          {/* Demo Instant Access Button */}
          <div className="space-y-3 border-t border-surface-border/80 pt-4 text-center">
            <span className="block text-[11px] font-medium text-psg-400">
              ¿Quieres explorar el panel sin credenciales de Supabase?
            </span>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3 font-display text-xs font-black uppercase tracking-wider text-accent-cyan shadow-sm transition-all hover:bg-surface-active hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-accent-cyan" /> Acceso de
              Demostración Inmediato
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="font-display text-xs font-bold uppercase tracking-wider text-psg-400 transition-colors hover:text-accent-cyan"
          >
            ← Volver a la web oficial
          </a>
        </div>
      </div>
    </div>
  );
}
