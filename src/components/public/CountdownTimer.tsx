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
      <div className="inline-flex animate-pulse items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
        <span className="h-2 w-2 rounded-full bg-rose-500" /> ¡Día de Partido /
        En Juego!
      </div>
    );
  }

  const units = [
    { label: "DÍAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEG", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-surface-border bg-surface-muted shadow-inner sm:h-16 sm:w-16">
              <span className="text-glow font-mono text-xl font-bold text-accent-cyan sm:text-2xl">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-psg-400 sm:text-[10px]">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="mb-4 text-xl font-bold text-psg-500">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
