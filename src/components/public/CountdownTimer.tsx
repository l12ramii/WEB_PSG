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
      <div className="inline-flex animate-pulse items-center gap-2 rounded-xl border border-danger/40 bg-danger/15 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-danger shadow-glow-crimson">
        <span className="h-2 w-2 rounded-full bg-danger" /> ¡Partido en
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
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 max-w-full">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            {/* LED Card Box */}
            <div className="group relative flex h-14 w-12 items-center justify-center overflow-hidden rounded-lg sm:rounded-xl border border-white/10 bg-surface-elevated inner-light sm:h-18 sm:w-16 md:h-20 md:w-20">
              {/* Top ambient highlight line */}
              <div className="absolute left-0 right-0 top-0 h-[1px] bg-accent-cyan/40" />

              {/* Number display */}
              <span className="text-glow-subtle font-display text-xl sm:text-3xl md:text-4xl font-black text-primary transition-transform group-hover:scale-105">
                {String(unit.value).padStart(2, "0")}
              </span>

              {/* Glass shine */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>

            {/* Label */}
            <span className="mt-1.5 font-display text-[9px] sm:text-xs font-bold uppercase tracking-widest text-secondary">
              {unit.label}
            </span>
          </div>

          {/* Separator Colons */}
          {index < units.length - 1 && (
            <span className="mb-4 sm:mb-6 animate-pulse font-display text-lg sm:text-2xl md:text-3xl font-black text-accent-cyan opacity-70">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
