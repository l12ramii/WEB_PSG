import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PsgShieldProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: { box: "h-6 w-6", px: 24 },
  sm: { box: "h-8 w-8", px: 32 },
  md: { box: "h-11 w-11", px: 44 },
  lg: { box: "h-14 w-14 sm:h-16 sm:w-16", px: 64 },
  xl: { box: "h-16 w-16 sm:h-24 sm:w-24", px: 96 },
  hero: { box: "h-24 w-24 sm:h-32 sm:w-32", px: 128 },
};

export function PsgShield({
  size = "md",
  className,
  imageClassName,
  priority = false,
  ...props
}: PsgShieldProps) {
  const currentSize = sizeMap[size];

  return (
    <div
      className={cn(
        "relative flex flex-shrink-0 items-center justify-center select-none",
        currentSize.box,
        className
      )}
      {...props}
    >
      <Image
        src="/images/escudo_psg.png"
        alt="Escudo Oficial PSG Fútbol 7"
        width={currentSize.px}
        height={currentSize.px}
        priority={priority}
        className={cn(
          "h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
          imageClassName
        )}
      />
    </div>
  );
}

