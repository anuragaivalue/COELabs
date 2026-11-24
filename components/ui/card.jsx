import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "card-chai relative flex flex-col overflow-hidden p-6 text-card-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn("text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("mt-auto flex items-center pt-4", className)} {...props}>
      {children}
    </div>
  );
}
