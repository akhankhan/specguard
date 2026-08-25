"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Cpu, 
  Check, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";
import { Button } from "@/lib/ui-index";
import { cn } from "@/lib/utils";

interface BeforeAfterDemoProps {
  className?: string;
  isDashboardEmptyState?: boolean;
}

export function BeforeAfterDemo({ 
  className,
  isDashboardEmptyState = false 
}: BeforeAfterDemoProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const rawSegments = [
    {
      id: 0,
      text: "Hey, so we need an app where customers can order food from restaurants near them. Should work on phone obviously.",
      reqId: "REQ-ORDER-01",
    },
    {
      id: 1,
      text: "Maybe riders can also see orders?",
      reqId: "REQ-RIDER-01",
    },
    {
      id: 2,
      text: "Oh and payment needs to work somehow.",
      reqId: "REQ-PAY-01",
    },
    {
      id: 3,
      text: "Can you also make it so restaurants get notified fast? Let's start simple I guess.",
      reqId: "REQ-REST-01",
    },
  ];

  return (
    <section className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      {/* Section Header */}
      {!isDashboardEmptyState && (
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Under 5-Second Intelligence Demo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            See How SpecGuard Structures Raw Chaos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Hover over any sentence to see how messy client words map to developer-ready specifications.
          </p>
        </div>
      )}

      {/* Main Split-Screen Container */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-5 sm:p-7 lg:p-8 shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden transition-colors">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center relative z-10">
          {/* ================= LEFT PANEL: "BEFORE" ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                What Clients Send You
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                Unstructured Brief
              </span>
            </div>

            {/* Email / Raw Chat Mockup Card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/70 p-5 space-y-4 font-mono text-xs shadow-inner flex-1 flex flex-col justify-between">
              {/* Fake Email Header */}
              <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-3 space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-sans font-medium text-zinc-700 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>From: Dave (Founder) &lt;dave@biteexpress.io&gt;</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">11:42 PM</span>
                </div>
                <div className="font-sans font-medium text-zinc-800 dark:text-zinc-200">
                  Subject: <span className="font-semibold">Quick app idea & scope notes!!!</span>
                </div>
              </div>

              {/* Email Body with Interactive Highlight Spans */}
              <div className="text-zinc-800 dark:text-zinc-300 text-xs sm:text-[13px] leading-relaxed space-y-2 font-sans">
                <p>
                  <span
                    onMouseEnter={() => setHighlightedIndex(0)}
                    onMouseLeave={() => setHighlightedIndex(null)}
                    className={cn(
                      "px-1 py-0.5 rounded transition-all cursor-pointer",
                      highlightedIndex === 0
                        ? "bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                  >
                    "Hey, so we need an app where customers can order food from restaurants near them. Should work on phone obviously.
                  </span>{" "}
                  <span
                    onMouseEnter={() => setHighlightedIndex(1)}
                    onMouseLeave={() => setHighlightedIndex(null)}
                    className={cn(
                      "px-1 py-0.5 rounded transition-all cursor-pointer",
                      highlightedIndex === 1
                        ? "bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                  >
                    Maybe riders can also see orders?
                  </span>{" "}
                  <span
                    onMouseEnter={() => setHighlightedIndex(2)}
                    onMouseLeave={() => setHighlightedIndex(null)}
                    className={cn(
                      "px-1 py-0.5 rounded transition-all cursor-pointer",
                      highlightedIndex === 2
                        ? "bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                  >
                    Oh and payment needs to work somehow.
                  </span>{" "}
                  <span
                    onMouseEnter={() => setHighlightedIndex(3)}
                    onMouseLeave={() => setHighlightedIndex(null)}
                    className={cn(
                      "px-1 py-0.5 rounded transition-all cursor-pointer",
                      highlightedIndex === 3
                        ? "bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    )}
                  >
                    Can you also make it so restaurants get notified fast?
                  </span>{" "}
                  <span>Let's start simple I guess."</span>
                </p>
              </div>

              {/* Caption */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>— Client email, unedited</span>
                <span className="text-rose-500 dark:text-rose-400 font-medium">0 formal acceptance criteria</span>
              </div>
            </div>
          </div>

          {/* ================= CENTER: TRANSFORMATION INDICATOR ================= */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
            <div className="flex lg:flex-col items-center gap-2.5">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 0 rgba(14,165,233,0)",
                    "0 0 20px rgba(14,165,233,0.35)",
                    "0 0 0 rgba(14,165,233,0)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>

              <div className="text-center">
                <span className="text-[11px] font-bold tracking-tight text-sky-600 dark:text-sky-400 whitespace-nowrap block">
                  AI structures it in seconds
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono hidden sm:inline-block">
                  100% citation traced
                </span>
              </div>

              <div className="hidden lg:flex items-center justify-center text-sky-500 dark:text-sky-400 pt-1">
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL: "AFTER" ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                What SpecGuard Gives You
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
                Developer-Ready Spec
              </span>
            </div>

            {/* Clean Structured Output Card */}
            <div className="rounded-2xl border border-sky-200/80 dark:border-sky-900/50 bg-white dark:bg-zinc-950/80 p-4 space-y-2.5 shadow-md flex-1 flex flex-col justify-between">
              {/* Row 1 */}
              <div
                onMouseEnter={() => setHighlightedIndex(0)}
                onMouseLeave={() => setHighlightedIndex(null)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-xs",
                  highlightedIndex === 0
                    ? "bg-sky-50 dark:bg-sky-950/70 border-sky-400 ring-1 ring-sky-400/40"
                    : "bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                      REQ-ORDER-01
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500">Functional</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Confirmed by client
                  </span>
                </div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] leading-snug">
                  Customer can browse nearby restaurants and place orders
                </p>
              </div>

              {/* Row 2 */}
              <div
                onMouseEnter={() => setHighlightedIndex(1)}
                onMouseLeave={() => setHighlightedIndex(null)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-xs",
                  highlightedIndex === 1
                    ? "bg-sky-50 dark:bg-sky-950/70 border-sky-400 ring-1 ring-sky-400/40"
                    : "bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                      REQ-RIDER-01
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500">Functional</span>
                  </div>
                  <span className="text-[10px] font-medium text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    AI-inferred
                  </span>
                </div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] leading-snug">
                  Riders receive real-time order notifications
                </p>
              </div>

              {/* Row 3 */}
              <div
                onMouseEnter={() => setHighlightedIndex(2)}
                onMouseLeave={() => setHighlightedIndex(null)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-xs",
                  highlightedIndex === 2
                    ? "bg-amber-50 dark:bg-amber-950/70 border-amber-400 ring-1 ring-amber-400/40"
                    : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 hover:border-amber-300"
                )}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                      REQ-PAY-01
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-amber-700 dark:text-amber-400">Payment</span>
                  </div>
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Needs clarification
                  </span>
                </div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] leading-snug">
                  Payment method — requires gateway selection (Stripe / Apple Pay)
                </p>
              </div>

              {/* Row 4: Recommended Tech Stack */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-zinc-500 dark:text-zinc-400 font-semibold font-mono text-[10px] uppercase">
                  Recommended:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-300 font-medium">
                  React Native
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-300 font-medium">
                  Node.js
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] text-zinc-800 dark:text-zinc-300 font-medium">
                  PostgreSQL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ACTION & SAMPLE CTA ================= */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Want to see the complete blueprint generated from this brief?
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              This is a sample. Upload your own client brief to try it live.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/projects/demo-food-delivery">
              <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                <span>See the full breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link href="/projects/new">
              <Button variant="glow" size="sm" className="text-xs gap-1.5">
                <span>Upload Your Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
