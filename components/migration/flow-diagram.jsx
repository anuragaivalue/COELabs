"use client";

import React from "react";
import {
  LuCrown,
  LuWorkflow,
  LuShieldCheck,
  LuServer,
  LuLock,
  LuAppWindow,
  LuArrowRight,
  LuCircleCheck
} from "react-icons/lu";

const ICONS = [
  LuCrown,
  LuWorkflow,
  LuShieldCheck,
  LuServer,
  LuLock,
  LuAppWindow
];

export function MigrationFlowDiagram({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full my-8">
      {/* Header Badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-display">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Project Governance & Execution Flow (Left-to-Right Workflow)</span>
        </div>
        <span className="text-[11px] font-medium text-neutral-400 hidden sm:inline-block">
          Sequential Escalation & Sign-Off Path
        </span>
      </div>

      {/* Horizontal Flow Container */}
      <div className="relative overflow-x-auto pb-4 custom-gold-scrollbar">
        <div className="flex items-stretch gap-3 min-w-[920px] py-2">
          {steps.map((step, idx) => {
            const Icon = ICONS[idx % ICONS.length] || LuShieldCheck;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={idx}>
                {/* Step Card */}
                <div className="group relative flex-1 flex flex-col justify-between rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-4 shadow-sm hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-200 backdrop-blur-sm">
                  {/* Step Top Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center justify-center size-6 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                        0{step.step || idx + 1}
                      </span>
                      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-colors">
                        <Icon className="size-4" />
                      </div>
                    </div>

                    {/* Role Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white font-display leading-snug">
                      {step.role}
                    </h4>

                    {/* Role Details */}
                    {step.details && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        {step.details}
                      </span>
                    )}

                    {/* Description */}
                    <p className="mt-2 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-white/5 flex items-center gap-1 text-[10px] text-neutral-400">
                    <LuCircleCheck className="size-3 text-amber-500" />
                    <span>Stage {idx + 1} Vetted</span>
                  </div>
                </div>

                {/* Arrow Connector between steps */}
                {!isLast && (
                  <div className="flex items-center justify-center shrink-0 text-amber-500/60 dark:text-amber-400/60">
                    <div className="flex flex-col items-center">
                      <div className="h-0.5 w-3 bg-amber-400/40 dark:bg-amber-500/30" />
                      <LuArrowRight className="size-4 -mx-1" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
