"use client";

import React from "react";

/**
 * Official iValue Company Emblem
 * Renders the official iValue emblem symbol with proper vector scaling,
 * alignment, and fallback handling.
 */
export function IValueEmblem({ className = "size-6", alt = "iValue Emblem" }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/favicon.png"
        alt={alt}
        className="h-full w-full object-contain select-none"
        onError={(e) => {
          // Fallback to stylized vector emblem if image path is unavailable
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = "inline-block";
        }}
      />
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden h-full w-full"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="url(#ivalue-grad)" />
        <circle cx="16" cy="10" r="3.2" fill="#ffffff" />
        <path
          d="M13 16C13 14.8954 13.8954 14 15 14H17C18.1046 14 19 14.8954 19 16V24C19 25.1046 18.1046 26 17 26H15C13.8954 26 13 25.1046 13 24V16Z"
          fill="#ffffff"
        />
        <defs>
          <linearGradient id="ivalue-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Official iValue Full Brand Wordmark / Header Logo
 * Matches the official logo on https://coe.ivaluegroup.com
 */
export function IValueLogo({ className = "h-7 sm:h-8", showCoe = true }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/ivalue.png"
        alt="iValue Group"
        className={`w-auto shrink-0 object-contain transition-all duration-300 dark:brightness-0 dark:invert ${className}`}
        onError={(e) => {
          // Fallback to text & emblem
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="hidden items-center gap-2 shrink-0">
        <IValueEmblem className="size-7 sm:size-8" />
        <span className="font-brand text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          iValue
        </span>
      </div>

      {showCoe && (
        <span className="shrink-0 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-display text-[10px] sm:text-xs font-bold tracking-wider text-amber-700 uppercase dark:border-orange-400/30 dark:bg-orange-500/15 dark:text-orange-300">
          COE
        </span>
      )}
    </div>
  );
}
