"use client";

import React, { useEffect, useRef } from "react";

/* ============================================================
   LIGHT-MODE PARTICLE & CONSTELLATION CONFIGURATION
   Easily tweak node opacity, stroke contrast, and connection values manually
   ============================================================ */
export const LIGHT_PARTICLE_CONFIG = {
  // Constellation connecting lines
  lineStrokeWidth: 1.15, // px stroke width for connecting lines in light mode (was 0.75)
  lineBaseAlpha: 0.38, // line opacity multiplier (increased from 0.22 for crisp stroke contrast)
  lineMaxDistance: 105, // max connection distance between nodes in px

  // Particle network nodes
  nodeAlphaMultiplier: 1.35, // boosts node visibility in light mode
  nodeGlowBlur: 3.5, // px shadow glow
};

/**
 * Antigravity Interactive Particle Canvas Background
 * A high-performance physics simulation featuring upward-floating particles
 * with interactive cursor repulsion and neural constellation connections.
 */
export function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animationFrameId = null;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Interactive pointer tracker
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
      isActive: false
    };

    // Calculate optimal particle density
    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);

    class AntigravityParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.radius = Math.random() * 2.2 + 1.2; // 1.2px to 3.4px
        // Negative velocity for upward antigravity buoyancy
        this.baseVy = -(Math.random() * 0.55 + 0.35); // -0.35 to -0.90 px/frame
        this.vy = this.baseVy;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.baseAlpha = Math.random() * 0.35 + 0.35; // 0.35 to 0.70
        this.alpha = this.baseAlpha;
        this.glow = Math.random() > 0.4;
      }

      update(isDark) {
        // Natural antigravity drift with subtle sine-wave sway
        this.angle += this.angleSpeed;
        this.x += this.vx + Math.sin(this.angle) * 0.35;
        this.y += this.vy;

        // Interactive mouse repulsion
        if (mouse.isActive) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius && distance > 0) {
            const force = (1 - distance / mouse.radius) * 3.2;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.5;
            this.vy += Math.sin(angle) * force * 0.5;
            // Flare up particle brightness during interaction
            this.alpha = Math.min(this.baseAlpha * 2.2, 0.95);
          }
        }

        // Smoothly return to natural buoyancy & drift
        this.vx *= 0.94;
        this.vy = this.vy * 0.95 + this.baseVy * 0.05;
        this.alpha = this.alpha * 0.97 + this.baseAlpha * 0.03;

        // Wrap particles when they float off the top
        if (this.y < -20) {
          this.reset(false);
        }
        if (this.x < -20) this.x = width + 15;
        if (this.x > width + 20) this.x = -15;
      }

      draw(isDark) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (isDark) {
          // Dark Mode: Luminous amber-gold & warm orange cyber glints
          const fill = this.glow
            ? `rgba(251, 146, 60, ${this.alpha})`
            : `rgba(245, 158, 11, ${this.alpha})`;
          ctx.fillStyle = fill;
          ctx.shadowBlur = this.radius * 3.5;
          ctx.shadowColor = "rgba(249, 115, 22, 0.6)";
        } else {
          // Light Mode: High-contrast rich amber-700 & orange-600 with boosted opacity & glow
          const alpha = Math.min(this.alpha * LIGHT_PARTICLE_CONFIG.nodeAlphaMultiplier, 0.95);
          const fill = this.glow
            ? `rgba(217, 119, 6, ${alpha})`
            : `rgba(180, 83, 9, ${alpha})`;
          ctx.fillStyle = fill;
          ctx.shadowBlur = this.radius * LIGHT_PARTICLE_CONFIG.nodeGlowBlur;
          ctx.shadowColor = "rgba(180, 83, 9, 0.45)";
        }

        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new AntigravityParticle());

    // Connect close particles with neural constellation hairlines
    const drawConstellations = (isDark) => {
      const maxDistance = isDark ? 95 : LIGHT_PARTICLE_CONFIG.lineMaxDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.18 : LIGHT_PARTICLE_CONFIG.lineBaseAlpha);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(245, 158, 11, ${lineAlpha})`
              : `rgba(180, 83, 9, ${lineAlpha})`;
            ctx.lineWidth = isDark ? 0.75 : LIGHT_PARTICLE_CONFIG.lineStrokeWidth;
            ctx.stroke();
          }
        }
      }
    };

    // Main animation loop
    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");

      drawConstellations(isDark);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(isDark);
        particles[i].draw(isDark);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Canvas resize handling with Device Pixel Ratio
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    render();

    // Mouse & Touch interaction tracking
    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Click pulse: gentle shockwave pushing particles outward
    const handlePointerDown = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 0) {
          const impulse = (1 - dist / 220) * 5.5;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * impulse;
          p.vy += Math.sin(angle) * impulse;
          p.alpha = 0.95;
        }
      });
    };

    // Pause when tab is not focused
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.body.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.body.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full select-none"
    />
  );
}
