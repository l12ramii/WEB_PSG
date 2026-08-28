"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
        // Fallback for demo/development mode if Supabase keys aren't connected yet
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
    <div className="bg-grid-pattern flex min-h-screen items-center justify-center bg-hero-pattern p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="relative space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-surface p-8 shadow-2xl backdrop-blur-md">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent-cyan/10 blur-2xl" />

          {/* Logo Header */}
          <div className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-gradient-to-br from-psg-500 to-accent-electric shadow-glow">
              <Flame className="phoenix-glow h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-black uppercase tracking-wider text-white sm:text-3xl">
              PSG <span className="text-accent-cyan">BACKOFFICE</span>
            </h1>
            <p className="text-xs text-psg-300">
              Acceso exclusivo para el Community Manager del club.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/20 p-3 text-xs text-rose-300">
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
              className="w-full"
              size="lg"
            >
              <Lock className="h-4 w-4" /> Entrar al Panel
            </Button>
          </form>

          {/* Demo Instant Access Button */}
          <div className="space-y-3 border-t border-surface-border/80 pt-4 text-center">
            <span className="block text-[11px] text-psg-400">
              ¿Quieres probar el panel de administración de inmediato?
            </span>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-cyan shadow-sm transition-all hover:bg-surface-active hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" /> Acceso Directo de
              Demostración (CM)
            </button>
          </div>
        </div>

        {/* Return to Public Web */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-psg-400 transition-colors hover:text-accent-cyan"
          >
            ← Volver a la web oficial
          </a>
        </div>
      </div>
    </div>
  );
}
