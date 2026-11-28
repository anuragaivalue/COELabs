"use client";

import React, { useState } from "react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";

export function OemImage({
  src,
  darkSrc,
  alt,
  className = "h-10 w-auto object-contain",
  placeholderClassName
}) {
  const [error, setError] = useState(false);
  const [darkError, setDarkError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-center dark:border-white/20 dark:bg-neutral-800/60 ${placeholderClassName || ""}`}
        title={`OEM Logo Placeholder for: ${alt}`}
      >
        <IValueEmblem className="size-3.5 mr-1.5 shrink-0" />
        <span className="font-display text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[120px]">
          {alt || "OEM"}
        </span>
      </div>
    );
  }

  if (darkSrc && darkSrc !== src && !darkError) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || "OEM Partner"}
          onError={() => setError(true)}
          loading="lazy"
          className={`${className} dark:hidden`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={darkSrc}
          alt={alt || "OEM Partner"}
          onError={() => setDarkError(true)}
          loading="lazy"
          className={`${className} hidden dark:block`}
        />
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || "OEM Partner"}
      onError={() => setError(true)}
      loading="lazy"
      className={className}
    />
  );
}
