"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * Animated Number Count-Up Effect
 * Smoothly animates numbers from 0 up to their target value over ~1 second
 * when scrolled into view, handling suffixes like '+', 'Cr', '%', etc.
 */
export function AnimatedCounter({
  value,
  duration = 1000,
  className = "",
  prefix = "",
  suffix = ""
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  // Parse numeric target and any embedded suffix if value is passed as string (e.g. "1800 +")
  let targetNumber = 0;
  let parsedSuffix = suffix;

  if (typeof value === "number") {
    targetNumber = value;
  } else if (typeof value === "string") {
    const match = value.match(/^([\d,.]+)\s*(.*)$/);
    if (match) {
      targetNumber = parseFloat(match[1].replace(/,/g, ""));
      if (!suffix && match[2]) {
        parsedSuffix = match[2];
      }
    } else {
      targetNumber = parseFloat(value) || 0;
    }
  }

  const isDecimal = targetNumber % 1 !== 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime = null;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutExpo for snappy, professional deceleration
            const easeProgress =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentVal = targetNumber * easeProgress;
            setDisplayValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(targetNumber);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetNumber, duration, hasAnimated]);

  const formattedValue = isDecimal
    ? displayValue.toFixed(1)
    : Math.floor(displayValue).toLocaleString("en-US");

  const isAttachedSuffix = /^[%xX+]/i.test(parsedSuffix);
  const renderedSuffix = parsedSuffix
    ? (isAttachedSuffix ? parsedSuffix : (parsedSuffix.startsWith(" ") ? parsedSuffix : ` ${parsedSuffix}`))
    : "";

  return (
    <span ref={ref} className={`inline-block tabular-nums whitespace-nowrap ${className}`}>
      {prefix}
      {hasAnimated ? formattedValue : "0"}
      {renderedSuffix}
    </span>
  );
}
