"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MultiplierView } from "@/components/multipliers/multiplier-view";
import multipliersData from "@/data/multipliers-data.json";
import { LuChevronLeft } from "react-icons/lu";

export default function MultiplierDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug || "bfsimultiplier";

  // Case-insensitive slug matching
  const multiplierData = useMemo(() => {
    const key = Object.keys(multipliersData).find(
      (k) => k.toLowerCase() === rawSlug.toLowerCase()
    );
    return key ? multipliersData[key] : multipliersData["bfsimultiplier"];
  }, [rawSlug]);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-foreground transition-colors duration-900 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 md:py-16 w-full">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <LuChevronLeft className="size-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-neutral-400">Accelerators</span>
            <span>/</span>
            <span className="text-neutral-500 dark:text-neutral-400">Revenue Multipliers</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">
              {multiplierData?.title || "Multiplier"}
            </span>
          </div>

          {/* Multiplier Interactive View */}
          <Suspense fallback={<div className="w-full h-96 flex items-center justify-center text-sm text-neutral-500">Loading multiplier...</div>}>
            <MultiplierView key={multiplierData?.slug} data={multiplierData} />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
