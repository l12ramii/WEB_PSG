"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-hero-pattern bg-grid-pattern">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="rounded-3xl bg-surface border border-surface-border p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-psg-500 to-accent-electric mx-auto flex items-center justify-center border border-accent-cyan/40 shadow-glow mb-4">
              <Flame className="w-8 h-8 text-white phoenix-glow" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wider">
              PSG <span className="text-accent-cyan">BACKOFFICE</span>
            </h1>
            <p className="text-xs text-psg-300">
              Acceso exclusivo para el Community Manager del club.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
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

            <Button type="submit" isLoading={loading} className="w-full" size="lg">
              <Lock className="w-4 h-4" /> Entrar al Panel
            </Button>
          </form>

          {/* Demo Instant Access Button */}
          <div className="pt-4 border-t border-surface-border/80 text-center space-y-3">
            <span className="text-[11px] text-psg-400 block">
              ¿Quieres probar el panel de administración de inmediato?
            </span>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-muted hover:bg-surface-active border border-surface-border text-accent-cyan hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Acceso Directo de Demostración (CM)
            </button>
          </div>
        </div>

        {/* Return to Public Web */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-psg-400 hover:text-accent-cyan transition-colors"
          >
            ← Volver a la web oficial
          </a>
        </div>
      </div>
    </div>
  );
}

