import React from "react";
import Link from "next/link";
import { MotionTestCard } from "@/components/ui/motion-test-card";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Motion AI Studio Test | iValue Center of Excellence",
  description: "Verification page for modern Motion (motion/react) spring physics and GPU-accelerated micro-interactions."
};

export default function MotionTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6 py-16 dark:bg-neutral-950 font-sans transition-colors duration-300">
      <div className="w-full max-w-xl text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return Home</span>
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
          Motion AI Studio <span className="highlight">Test Environment</span>
        </h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Testing spring physics, hover gestures, and compositor-only entrance animations using <code className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-xs text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">motion/react</code>.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <MotionTestCard
          title="Zero-Trust Architecture"
          description="Pre-validated micro-segmentation blueprint with real-time telemetry."
          tag="Blueprint 01"
        />
        <MotionTestCard
          title="Autonomous XDR Defense"
          description="High-velocity endpoint response stacks with continuous posture analytics."
          tag="Blueprint 02"
        />
      </div>
    </div>
  );
}
