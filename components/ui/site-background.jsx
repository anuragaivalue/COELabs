"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

/* ============================================================
   BACKGROUND SCROLL MOTION CONFIGURATION
   Control how the background moves when user scrolls up and down
   ============================================================ */
export const BG_SCROLL_CONFIG = {
  // Speed multiplier: how fast the background translates relative to page scroll
  // 0.0 = static/fixed
  // 0.20 - 0.40 = balanced, noticeable, cinematic motion that moves with the content
  speedFactor: 0.28,

  // Maximum vertical travel in pixels to ensure the image glides smoothly across long scrolls
  maxOffsetPx: 800,

  // Extra height headroom (in px) added to the container so translation never reveals seams or empty gaps
  headroomPx: 850,

  // Smooth scroll easing: true = fluid interpolation, false = direct 1:1 scroll lock
  smoothEasing: true,
};

/* ============================================================
   LIGHT-MODE BACKGROUND CONFIGURATION CONSTANTS
   Easily tweak background opacity, stroke contrast, and veil overlays manually
   ============================================================ */
export const LIGHT_BG_CONFIG = {
  // 1. Base Artwork (/assets/img/site-bg.jpg)
  // Increased opacity reveals the world map, network nodes, and server racks clearly
  artworkOpacity: 0.72, // range 0.50 - 0.90 (previously 0.35)

  // Contrast & saturation filters to give nodes, connecting lines, and geometry crisp definition
  artworkContrast: 1.10, // boost stroke & line contrast
  artworkSaturation: 1.15, // vibrant warm amber/gold tones
  artworkBrightness: 0.98, // balanced brightness

  // 2. Atmospheric Gradient Veil
  // Significantly reduced opacity to eliminate the milky/overly pale wash muting the artwork
  veilOpacity: 0.40, // range 0.20 - 0.55 (previously 1.0 with heavy white)
  veilGradient: "from-white/50 via-white/20 to-[#FFF1E6]/40",

  // 3. Ambient Glow Highlights
  // Warm peach & golden radiance matching the light theme
  glowOpacity: 0.75, // range 0.50 - 1.0
  glowRadial:
    "radial-gradient(ellipse 75% 55% at 80% 90%, rgba(249, 115, 22, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255, 237, 213, 0.45), transparent 65%)",
};

/**
 * SiteBackground Component
 * Provides a dynamic, scroll-reactive background motion in both Light Mode
 * and Dark Mode, seamlessly translating as the user scrolls up and down.
 *
 * Light Theme: High-visibility network nodes, connecting lines, and server racks
 *              with warm gold-on-white balance.
 * Dark Theme: Deep obsidian black with glowing copper-orange telemetry and server infrastructure.
 */
export function SiteBackground() {
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : false;
  const movingLayerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user's reduced motion accessibility preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let targetOffset = 0;
    let currentOffset = 0;
    let animationFrameId = null;
    let isRunning = false;

    const updateTarget = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetOffset = Math.min(scrollY * BG_SCROLL_CONFIG.speedFactor, BG_SCROLL_CONFIG.maxOffsetPx);

      if (!isRunning) {
        isRunning = true;
        renderLoop();
      }
    };

    const renderLoop = () => {
      if (BG_SCROLL_CONFIG.smoothEasing) {
        currentOffset += (targetOffset - currentOffset) * 0.12;
      } else {
        currentOffset = targetOffset;
      }

      if (movingLayerRef.current) {
        movingLayerRef.current.style.transform = `translate3d(0, -${currentOffset.toFixed(2)}px, 0)`;
      }

      // Continue animating while there is noticeable difference between current and target
      if (Math.abs(targetOffset - currentOffset) > 0.1) {
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        currentOffset = targetOffset;
        if (movingLayerRef.current) {
          movingLayerRef.current.style.transform = `translate3d(0, -${currentOffset.toFixed(2)}px, 0)`;
        }
        isRunning = false;
      }
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    updateTarget(); // initial position on mount

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Scroll-Reactive Moving Container: Translates vertically when user scrolls up & down */}
      <div
        ref={movingLayerRef}
        style={{
          height: `calc(100vh + ${BG_SCROLL_CONFIG.headroomPx}px)`,
          willChange: "transform",
        }}
        className="absolute inset-x-0 top-0 w-full"
      >
        {/* ========================================================
            1. LIGHT MODE ARTWORK LAYER (/assets/img/site-bg.jpg)
           ======================================================== */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/img/site-bg.jpg"
          alt=""
          style={{
            opacity: isDark ? 0 : LIGHT_BG_CONFIG.artworkOpacity,
            filter: isDark
              ? "none"
              : `contrast(${LIGHT_BG_CONFIG.artworkContrast}) saturate(${LIGHT_BG_CONFIG.artworkSaturation}) brightness(${LIGHT_BG_CONFIG.artworkBrightness})`,
          }}
          className="absolute inset-0 h-full w-full object-cover object-bottom sm:object-right-bottom transition-opacity duration-700 ease-in-out"
        />

        {/* Light Mode Soft Peach & White Atmospheric Veil (Toned down to eliminate pale wash) */}
        <div
          style={{
            opacity: isDark ? 0 : LIGHT_BG_CONFIG.veilOpacity,
          }}
          className={`absolute inset-0 bg-gradient-to-b ${LIGHT_BG_CONFIG.veilGradient} transition-opacity duration-700 ease-in-out ${
            isDark ? "pointer-events-none" : ""
          }`}
        />

        {/* Light Mode Radial Glows (Soft peach & warm gold highlights) */}
        <div
          style={{
            backgroundImage: LIGHT_BG_CONFIG.glowRadial,
            opacity: isDark ? 0 : LIGHT_BG_CONFIG.glowOpacity,
          }}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            isDark ? "pointer-events-none" : ""
          }`}
        />

        {/* ========================================================
            2. DARK MODE ARTWORK LAYER (/assets/img/site-bg-dark.jpg)
            STRICT: Preserved dark mode styling, moves together with Light Mode
           ======================================================== */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/img/site-bg-dark.jpg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-bottom sm:object-right-bottom
      transition-all duration-1000 ease-in-out
      ${
        isDark
          ? "opacity-65 blur-[3px] scale-[1.04]"
          : "opacity-0 blur-0 scale-100"
      }`}
        />

        {/* Premium Dark Mode - Ambient Orange Bokeh */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out
      bg-[radial-gradient(ellipse_at_85%_85%,rgba(249,115,22,0.20),transparent_45%),radial-gradient(ellipse_at_15%_20%,rgba(234,88,12,0.12),transparent_50%),radial-gradient(circle_at_55%_55%,rgba(249,115,22,0.06),transparent_35%)]
      ${isDark ? "opacity-100" : "opacity-0"}`}
        />

        {/* Obsidian Cinematic Vignette */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000
      bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]
      ${isDark ? "opacity-100" : "opacity-0"}`}
        />

        {/* Premium Bokeh Light Particles */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000
      ${isDark ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `
        radial-gradient(circle at 18% 35%, rgba(249,115,22,0.16) 0px, transparent 5px),
        radial-gradient(circle at 75% 25%, rgba(255,160,70,0.13) 0px, transparent 7px),
        radial-gradient(circle at 88% 65%, rgba(249,115,22,0.18) 0px, transparent 6px),
        radial-gradient(circle at 42% 78%, rgba(255,180,100,0.10) 0px, transparent 8px),
        radial-gradient(circle at 60% 15%, rgba(249,115,22,0.12) 0px, transparent 4px)
      `,
            filter: "blur(8px)",
          }}
        />

        {/* Subtle Top Ambient Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000
      bg-[radial-gradient(circle_at_25%_15%,rgba(249,115,22,0.10),transparent_40%)]
      ${isDark ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}

export default SiteBackground;
