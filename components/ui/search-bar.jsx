"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search solution stacks, OEM partners, frameworks...",
  className,
}) {
  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
        <span className="material-symbols-outlined text-lg select-none leading-none">
          search
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-neutral-300 bg-white py-2.5 pr-10 pl-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all",
          "dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/20"
        )}
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
