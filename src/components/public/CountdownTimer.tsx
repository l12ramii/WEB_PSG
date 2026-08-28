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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider animate-pulse">
        <span className="w-2 h-2 rounded-full bg-rose-500" /> ¡Día de Partido / En Juego!
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
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center shadow-inner">
              <span className="font-mono text-xl sm:text-2xl font-bold text-accent-cyan text-glow">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-psg-400 mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="text-psg-500 font-bold text-xl mb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

