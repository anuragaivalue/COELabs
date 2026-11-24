"use client";

/**
 * Full Card Selection Section (homepage, complete self-contained section directly above Hero)
 *
 * HOW TO EDIT:
 * - Tweak speeds, card sizes, 3D stage heights, and redirect URL in the CONFIG block below.
 * - OEMs / products / logos live in @/data/marketplace-oems.js
 * - Follows strict naming: Full Card Selection (FullCardSelection)
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ChevronLeft, ChevronRight, Layers3, ArrowUpRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { IValueEmblem } from "@/components/ui/ivalue-logo";
import { MARKETPLACE_OEMS, TOTAL_AUDITED_PRODUCTS, TOTAL_AUDITED_OEMS } from "@/data/marketplace-oems";

/* ============================================================
   CONFIG — clearly named top-level constants for easy manual editing
   ============================================================ */

// Where a click on a card goes
const MARKETPLACE_HREF = "/portal/marketplace";

// Continuous glide speed in degrees per second (increased for smooth, dynamic motion)
const AUTO_ROTATE_DEG_PER_SEC = 2.0;

// Arrow navigation controls: how many cards one click advances
const BUTTON_STEP_CARDS = 1;
// Arrow navigation controls: while held, advance again every N milliseconds
const BUTTON_HOLD_REPEAT_MS = 1100;
// Arrow navigation controls: spring physics for smooth glide
const BUTTON_SPRING = { stiffness: 55, damping: 18, mass: 0.9 };

// Pointer drag / trackpad wheel sensitivity
const DRAG_DEG_PER_PX = 0.2;
const WHEEL_DEG_PER_PX = 0.08;
const DRAG_CLICK_THRESHOLD_PX = 6; // movement above this counts as drag, not click

// Total cards rendered around the visible front arc (odd number)
const VISIBLE_CARD_COUNT = 11;

// Responsive sizing: card dimensions, stage height, and cylinder radius (px)
// Reduced card height for sleek, proportionate cards with compact vertical footprint
const SIZES = {
  mobile: {
    cardWidth: 160,
    cardHeight: 240,
    radius: 680,
    stageHeight: 350,
    perspective: 1100
  },
  tablet: {
    cardWidth: 195,
    cardHeight: 285,
    radius: 860,
    stageHeight: 400,
    perspective: 1200
  },
  desktop: {
    cardWidth: 235,
    cardHeight: 320,
    radius: 1040,
    stageHeight: 460,
    perspective: 1300
  }
};

// Products popover dimensions & timing (rendered with highest z-index directly over the cards)
const POPOVER_WIDTH_PX = 380;
const POPOVER_CLOSE_DELAY_MS = 220;

/* ============================================================
   Helpers
   ============================================================ */

function getSizeForWidth(width) {
  if (width < 640) return SIZES.mobile;
  if (width < 1024) return SIZES.tablet;
  return SIZES.desktop;
}

/** Shortest distance (in cards) between two indexes on the ring */
function ringDistance(a, b, total) {
  const diff = Math.abs(a - b);
  return Math.min(diff, total - diff);
}

/* ============================================================
   Logo Badge (clean high-contrast tile for light & dark mode)
   ============================================================ */

function OemLogo({ oem }) {
  const [failed, setFailed] = useState(false);

  if (failed || !oem.logo) {
    return (
      <span className="font-display text-lg sm:text-xl font-extrabold text-neutral-800 dark:text-neutral-200">
        {oem.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={oem.logo}
      alt={`${oem.name} logo`}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="max-h-12 sm:max-h-14 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
}

/* ============================================================
   Individual Card: [ 1. Logo ]  [ 2. OEM Name ]  [ 3. Products ]
   Theme: Warm Off-White in Light Mode (#FAF8F5) with Gold/Amber Accents
   ============================================================ */

function SelectionCard({ oem, isFront, onCardClick, onProductsEnter, onProductsLeave }) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      role="link"
      tabIndex={0}
      aria-label={`${oem.name} - view in Marketplace`}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCardClick(e);
      }}
      className={`group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl border p-3.5 sm:p-4 shadow-md transition-all duration-200 ${isFront
        ? "border-amber-500 ring-2 ring-amber-500/30 shadow-xl scale-[1.01] bg-[#FBF9F5] dark:bg-neutral-900/95 dark:border-orange-500 dark:ring-orange-500/30"
        : "border-neutral-200/90 bg-[#FAF8F5] dark:border-orange-500/20 dark:bg-neutral-950/85 hover:border-amber-500 dark:hover:border-orange-500/60"
        } hover:shadow-xl`}
    >
      {/* 1. TOP: OEM Emblem / Logo Stage */}
      <div className="flex h-20 sm:h-22 items-center justify-center rounded-xl border border-neutral-200/70 bg-white/90 p-2.5 dark:border-white/10 dark:bg-neutral-800/60 shadow-2xs">
        <OemLogo oem={oem} />
      </div>

      {/* 2. MIDDLE: OEM Name & Category */}
      <div className="text-center px-1 my-1.5 sm:my-2">
        <h3 className="font-display text-sm sm:text-base font-extrabold leading-tight text-neutral-900 dark:text-white truncate">
          {oem.name}
        </h3>
        {oem.category && (
          <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
            {oem.category}
          </p>
        )}
      </div>

      {/* 3. BOTTOM: Products Button (hover/focus/tap reveals products popover displayed OVER the card) */}
      <button
        type="button"
        onMouseEnter={(e) => onProductsEnter(oem, cardRef.current || e.currentTarget)}
        onMouseLeave={onProductsLeave}
        onFocus={(e) => onProductsEnter(oem, cardRef.current || e.currentTarget)}
        onBlur={onProductsLeave}
        onClick={(e) => {
          e.stopPropagation(); // do not trigger the card's Marketplace redirect
          onProductsEnter(oem, cardRef.current || e.currentTarget); // tap support on touch devices
        }}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-amber-500/40 bg-amber-50/90 px-3 py-1.5 sm:py-2 text-xs font-bold text-neutral-900 transition-colors hover:bg-amber-500 hover:text-white dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500 dark:hover:text-black"
      >
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="size-3.5 shrink-0 text-amber-600 dark:text-orange-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
          <span>Products ({oem.products?.length || 0})</span>
        </span>
        <ArrowUpRight className="size-3.5 shrink-0" />
      </button>
    </div>
  );
}

/* ============================================================
   Products Popover (Rendered directly OVER the cards with z-index 999999)
   ============================================================ */

function ProductsPopover({ popover, onEnter, onLeave, onClose }) {
  if (typeof document === "undefined" || !document.body) return null;

  const { oem, rect } = popover;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const width = Math.min(POPOVER_WIDTH_PX, viewportW - 24);
  const left = Math.min(
    Math.max(rect.left + rect.width / 2 - width / 2, 12),
    viewportW - width - 12
  );

  // Position directly OVER the card in the viewport, clamped within screen bounds
  const targetTop = Math.max(16, Math.min(rect.top, viewportH - 420));
  const maxHeight = Math.min(viewportH - targetTop - 24, 420);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="dialog"
      aria-modal="false"
      aria-label={`${oem.name} products`}
      style={{
        width,
        left,
        top: targetTop,
        maxHeight,
        zIndex: 999999,
        isolation: "isolate"
      }}
      className="fixed z-[999999] flex flex-col overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-[#FAF8F5] shadow-2xl ring-4 ring-amber-500/15 backdrop-blur-xl dark:border-orange-500/80 dark:bg-neutral-950/95 dark:ring-orange-500/20 text-neutral-900 dark:text-white"
    >
      {/* 1. Header with OEM logo, name, product count, and close button */}
      <div className="flex items-center justify-between border-b border-neutral-200/90 bg-white/90 px-4 py-3 dark:border-orange-500/20 dark:bg-neutral-900/90">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl bg-[#FAF8F5] dark:bg-neutral-900 border border-amber-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
            {oem.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={oem.logo}
                alt={`${oem.name} logo`}
                className="max-h-7 max-w-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Layers3 className="size-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold text-neutral-900 dark:text-white leading-tight truncate">
              {oem.name}
            </p>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-orange-400 truncate">
              {oem.products.length} Lab-Verified Product{oem.products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close products preview"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0 ml-2"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 2. Scrollable Products List */}
      <ul className="overflow-y-auto p-2.5 space-y-1.5 divide-y divide-neutral-100 dark:divide-white/5">
        {oem.products.map((product, pIdx) => (
          <li key={product.name} className="pt-1.5 first:pt-0">
            <a
              href={product.link && product.link !== "#" ? product.link : MARKETPLACE_HREF}
              className="group/item flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-neutral-800 hover:bg-amber-500/10 hover:text-amber-800 dark:text-neutral-100 dark:hover:bg-orange-500/15 dark:hover:text-orange-300 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="size-5 rounded-full bg-amber-500/15 text-amber-700 dark:bg-orange-500/20 dark:text-orange-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                  {pIdx + 1}
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-neutral-900 dark:text-white font-medium">
                    {product.name}
                  </span>
                  {product.tag && (
                    <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                      {product.tag}
                    </span>
                  )}
                </div>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-amber-600 dark:text-orange-400 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" />
            </a>
          </li>
        ))}
      </ul>

      {/* 3. Footer */}
      <div className="border-t border-neutral-200/80 bg-white/90 px-4 py-2.5 dark:border-orange-500/20 dark:bg-neutral-900/90 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          <span>Audited from CoE Marketplace</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-bold text-amber-700 dark:text-orange-400 hover:underline cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </motion.div>,
    document.body
  );
}

/* ============================================================
   Main Full Card Selection Component (Complete Section)
   ============================================================ */

export function FullCardSelection({ oems = MARKETPLACE_OEMS }) {
  const router = useRouter();
  const total = oems.length;
  const angleStep = 360 / total;

  const [size, setSize] = useState(SIZES.desktop);
  const [frontIndex, setFrontIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [popover, setPopover] = useState(null); // { oem, rect } | null

  // rotation = target angle, smoothRotation = spring-eased angle that is drawn
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, BUTTON_SPRING);
  const cylinderRef = useRef(null);

  const dragRef = useRef({ startX: 0, startRotation: 0, moved: 0 });
  const closeTimerRef = useRef(null);
  const holdTimerRef = useRef(null);

  const isPaused = isHovered || isDragging || popover !== null;

  /* ---- responsive size updates ---- */
  useEffect(() => {
    const update = () => setSize(getSizeForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ---- update 3D cylinder transform & active center index ---- */
  useEffect(() => {
    const unsubscribe = smoothRotation.on("change", (angle) => {
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translateZ(-${size.radius}px) rotateY(${angle}deg)`;
      }
      const normalized = ((-angle % 360) + 360) % 360;
      setFrontIndex(Math.round(normalized / angleStep) % total);
    });
    if (cylinderRef.current) {
      cylinderRef.current.style.transform = `translateZ(-${size.radius}px) rotateY(${smoothRotation.get()}deg)`;
    }
    return unsubscribe;
  }, [smoothRotation, size.radius, angleStep, total]);

  /* ---- continuous auto-glide ---- */
  useEffect(() => {
    let frameId;
    let last = performance.now();
    const tick = (now) => {
      const deltaSeconds = (now - last) / 1000;
      last = now;
      if (!isPaused) {
        rotation.set(rotation.get() - AUTO_ROTATE_DEG_PER_SEC * deltaSeconds);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, rotation]);

  /* ---- popover hover handlers ---- */
  const openPopover = useCallback((oem, element) => {
    clearTimeout(closeTimerRef.current);
    setPopover({ oem, rect: element.getBoundingClientRect() });
  }, []);

  const scheduleClosePopover = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setPopover(null), POPOVER_CLOSE_DELAY_MS);
  }, []);

  const cancelClosePopover = useCallback(() => {
    clearTimeout(closeTimerRef.current);
  }, []);

  /* ---- arrow navigation controls (click = 1 step, hold = slow repeat) ---- */
  const stepCards = useCallback(
    (direction) => {
      const snapped = Math.round(rotation.get() / angleStep) * angleStep;
      rotation.set(snapped + direction * BUTTON_STEP_CARDS * angleStep);
    },
    [rotation, angleStep]
  );

  const startHold = (direction) => {
    stepCards(direction);
    const repeat = () => {
      holdTimerRef.current = setTimeout(() => {
        stepCards(direction);
        repeat();
      }, BUTTON_HOLD_REPEAT_MS);
    };
    repeat();
  };
  const stopHold = () => clearTimeout(holdTimerRef.current);

  useEffect(() => () => {
    clearTimeout(holdTimerRef.current);
    clearTimeout(closeTimerRef.current);
  }, []);

  /* ---- dismiss popover on Escape ---- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPopover(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ---- pointer drag handlers ---- */
  const handlePointerDown = (e) => {
    setPopover(null);
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startRotation: rotation.get(), moved: 0 };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));
    rotation.set(dragRef.current.startRotation + dx * DRAG_DEG_PER_PX);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // settle cleanly on the nearest card
    rotation.set(Math.round(rotation.get() / angleStep) * angleStep);
  };

  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (delta) rotation.set(rotation.get() - delta * WHEEL_DEG_PER_PX);
  };

  /* ---- card click -> Marketplace redirect (ignored on drag) ---- */
  const handleCardClick = () => {
    if (dragRef.current.moved > DRAG_CLICK_THRESHOLD_PX) return;
    router.push(MARKETPLACE_HREF);
  };

  // Jump directly to a specific card
  const handleJumpToIndex = (idx) => {
    const current = rotation.get();
    const target = -idx * angleStep;
    const diff = ((target - current + 180) % 360) - 180;
    rotation.set(current + diff);
  };

  const halfVisible = Math.floor(VISIBLE_CARD_COUNT / 2);

  return (
    <section
      id="full-card-selection"
      aria-label="Full Card Selection"
      className="relative z-10 w-full pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-6 select-none bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[460px] w-full max-w-6xl rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.11),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.2),transparent_70%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        {/* ========================================================
            COMPLETE SECTION HEADER & TOP-RIGHT "SEE ALL" ACTION
           ======================================================== */}
        <div className="relative mb-2 sm:mb-3">
          {/* Top-Right "See All" Button (Redirects to Marketplace) */}
          <div className="absolute right-0 top-0 sm:top-1 z-20">
            <Link
              href={MARKETPLACE_HREF}
              className="group inline-flex items-center gap-1.5 rounded-full border border-black bg-black px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:border-neutral-800 hover:shadow-sm dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:hover:border-neutral-200 cursor-pointer shadow-2xs"
            >
              <span>See All</span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>


        </div>

        {/* ========================================================
            3D STAGE CONTAINER (Explicit pixel height guarantees zero collapsing)
           ======================================================== */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onWheel={handleWheel}
          style={{
            height: `${size.stageHeight}px`,
            perspective: `${size.perspective}px`
          }}
          className={`relative mx-auto flex w-full max-w-[1500px] items-center justify-center touch-pan-y ${isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
          {/* 3D Cylinder Ring Container */}
          <div
            ref={cylinderRef}
            className="relative"
            style={{ width: 0, height: 0, transformStyle: "preserve-3d" }}
          >
            {oems.map((oem, index) => {
              const distance = ringDistance(index, frontIndex, total);
              if (distance > halfVisible) return null; // windowed arc: render only visible cards

              // smooth opacity falloff for outer rim cards
              const opacity = distance === halfVisible ? 0.35 : distance === halfVisible - 1 ? 0.75 : 1;

              return (
                <div
                  key={oem.id}
                  style={{
                    position: "absolute",
                    width: size.cardWidth,
                    height: size.cardHeight,
                    left: -size.cardWidth / 2,
                    top: -size.cardHeight / 2,
                    opacity,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: `rotateY(${index * angleStep}deg) translateZ(${size.radius}px)`
                  }}
                >
                  <SelectionCard
                    oem={oem}
                    isFront={index === frontIndex}
                    onCardClick={handleCardClick}
                    onProductsEnter={openPopover}
                    onProductsLeave={scheduleClosePopover}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            CENTERED CONTROLS: ARROW NAVIGATION & SCRUB PILLS
           ======================================================== */}
        <div className="mt-3 sm:mt-4 flex flex-col items-center justify-center gap-2.5">
          {/* Centered Arrow Navigation Controls (< and >) */}
          <div className="flex items-center justify-center gap-3">
            {[
              { direction: 1, label: "Previous", Icon: ChevronLeft },
              { direction: -1, label: "Next", Icon: ChevronRight }
            ].map(({ direction, label, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={`${label} OEM`}
                onPointerDown={(e) => {
                  e.stopPropagation(); // prevent initiating a drag
                  startHold(direction);
                }}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                onPointerCancel={stopHold}
                className="flex size-9 sm:size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-200/90 bg-[#FAF8F5]/95 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-amber-500 hover:bg-white dark:border-orange-500/30 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:border-orange-400 dark:hover:bg-neutral-800 active:scale-95"
              >
                <Icon className="size-4 sm:size-5" />
              </button>
            ))}
          </div>

          {/* Interactive Scrub Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-4xl mx-auto px-2">
            {oems.map((oem, idx) => {
              const isCenter = frontIndex === idx;
              return (
                <button
                  key={oem.id}
                  onClick={() => handleJumpToIndex(idx)}
                  title={`${oem.name} (${oem.products.length} products)`}
                  aria-label={`Jump to ${oem.name}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${isCenter
                    ? "w-8 bg-amber-600 dark:bg-amber-400"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    }`}
                />
              );
            })}
          </div>


        </div>
      </div>

      {/* Subtle section divider below */}
      <div className="mt-4 sm:mt-5 mx-auto max-w-6xl border-b border-neutral-200/60 dark:border-white/10" />

      {/* Unclipped Products Popover Overlay */}
      {popover && (
        <ProductsPopover
          popover={popover}
          onEnter={cancelClosePopover}
          onLeave={scheduleClosePopover}
          onClose={() => setPopover(null)}
        />
      )}
    </section>
  );
}

export default FullCardSelection;
