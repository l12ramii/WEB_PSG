"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex animate-pulse items-center gap-2.5 rounded-2xl border-2 border-rose-500/50 bg-rose-500/20 px-4 py-2 font-display text-sm font-black uppercase tracking-wider text-rose-300 shadow-glow-crimson">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> ¡Partido en
        Directo / Disputándose!
      </div>
    );
  }

  const units = [
    { label: "DÍAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MINUTOS", value: timeLeft.minutes },
    { label: "SEGUNDOS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            {/* LED Card Box */}
            <div className="group relative flex h-16 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface-border bg-gradient-to-b from-surface to-psg-950 shadow-card sm:h-20 sm:w-20">
              {/* Top ambient highlight line */}
              <div className="absolute left-0 right-0 top-0 h-[1px] bg-accent-cyan/40" />

              {/* Number display */}
              <span className="text-glow font-display text-2xl font-black text-white transition-transform group-hover:scale-105 sm:text-4xl">
                {String(unit.value).padStart(2, "0")}
              </span>

              {/* Glass shine */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>

            {/* Label */}
            <span className="mt-2 font-display text-[10px] font-bold uppercase tracking-widest text-psg-300 sm:text-xs">
              {unit.label}
            </span>
          </div>

          {/* Separator Colons */}
          {index < units.length - 1 && (
            <span className="mb-6 animate-pulse font-display text-2xl font-black text-accent-cyan opacity-70 sm:text-3xl">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
