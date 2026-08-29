"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerPhotoCarouselProps {
  photos: string[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
  isModal?: boolean;
}

export function PlayerPhotoCarousel({
  photos,
  alt,
  className,
  showThumbnails = false,
  isModal = false,
}: PlayerPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const safeIndex = photos.length > 0 && currentIndex >= photos.length ? 0 : currentIndex;
  const currentPhoto = photos[safeIndex] || "";
  const hasMultiple = photos.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev <= 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev >= photos.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      // Swiped left
      handleNext();
    } else if (diff < -40) {
      // Swiped right
      handlePrev();
    }
    setTouchStart(null);
  };

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          "relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-surface-elevated text-muted",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center text-muted">
          <User className={cn(isModal ? "h-16 w-16" : "h-14 w-14", "text-muted transition-transform duration-300 group-hover:scale-105")} />
          <span className="mt-2 font-display text-xs font-bold uppercase tracking-wider text-secondary">
            PSG F7
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Main Image Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "group/carousel relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-surface-elevated/40",
          className
        )}
      >
        {/* Current Photo - Always in 100% full color */}
        <img
          src={currentPhoto}
          alt={`${alt} (Foto ${safeIndex + 1})`}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover/carousel:scale-105"
        />

        {/* Multiple Photos Badge Indicator */}
        {hasMultiple && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-surface-elevated/85 px-2 py-0.5 font-display text-[10px] font-bold text-accent-cyan shadow-sm backdrop-blur-md">
            <Images className="h-3 w-3" />
            <span>
              {safeIndex + 1}/{photos.length}
            </span>
          </div>
        )}

        {/* Prev / Next Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface/90 text-primary shadow-md backdrop-blur-md transition-all duration-200 hover:border-accent-cyan hover:bg-surface-elevated hover:text-accent-cyan hover:scale-110 active:scale-95 focus-ring opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface/90 text-primary shadow-md backdrop-blur-md transition-all duration-200 hover:border-accent-cyan hover:bg-surface-elevated hover:text-accent-cyan hover:scale-110 active:scale-95 focus-ring opacity-90 sm:opacity-0 sm:group-hover/carousel:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Optional Thumbnail Strip (ideal for detailed modal) */}
      {showThumbnails && hasMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className={cn(
                "relative aspect-[3/4] w-12 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200 focus-ring",
                idx === currentIndex
                  ? "border-accent-cyan ring-1 ring-accent-cyan scale-105"
                  : "border-white/10 opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={photo}
                alt={`${alt} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

