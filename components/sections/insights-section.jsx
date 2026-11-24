import React from "react";
import { articles } from "@/data/articles";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, Calendar, Clock, ArrowUpRight } from "lucide-react";

export function InsightsSection() {
  return (
    <section id="newsBlog" className="section-divider py-20 md:py-28 bg-neutral-50/50 dark:bg-neutral-900/40 border-t border-neutral-200/80 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
              <Newspaper className="size-3 text-amber-600 dark:text-orange-400" />
              <span>Cyber Threat Intelligence & Bulletins</span>
            </div>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Cyber Security News
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans">
              Latest cybersecurity updates and architectural advisories from the <span className="highlight">iValue threat research team</span>.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-1 font-display text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-orange-400 dark:hover:text-orange-300"
          >
            Subscribe to Security Updates <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((art, idx) => (
            <div
              key={art.id}
              className="card-reveal"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <Card
                className="group flex h-full flex-col justify-between overflow-hidden p-0 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.image}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                    {art.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <CardTitle className="mt-3 text-base leading-snug group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                    {art.title}
                  </CardTitle>

                  <CardDescription className="mt-2 text-xs line-clamp-3">
                    {art.summary}
                  </CardDescription>

                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-white/5">
                    <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-neutral-900 group-hover:text-amber-600 dark:text-neutral-200 dark:group-hover:text-orange-400 transition-colors">
                      Read Report <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
