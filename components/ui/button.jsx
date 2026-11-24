import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function Button({
  children,
  className,
  variant = "soft",
  size = "md",
  iconRight = true,
  asChild = false,
  href,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-display text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    icon: "h-9 w-9 p-0",
  };

  const variantStyles = {
    solid:
      "btn-asym bg-neutral-900 text-white shadow-sm hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    outline:
      "btn-asym-mirror border border-neutral-300 bg-white/70 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400 dark:border-white/15 dark:bg-transparent dark:text-neutral-200 dark:hover:bg-white/5 dark:hover:border-white/25",
    soft:
      "rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-100 dark:hover:bg-neutral-800",
    ghost:
      "rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white",
    cardAction:
      "rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
  };

  const Comp = href ? "a" : "button";

  return (
    <Comp
      href={href}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
      {iconRight && variant === "solid" && (
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Comp>
  );
}
