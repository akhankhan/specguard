"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  ShieldCheck,
  Clock, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  Layers,
  Code2,
  ExternalLink,
  Lock,
  FileCheck,
  Download,
  AlertTriangle
} from "lucide-react";
import { Button, Card } from "@/lib/ui-index";
import { cn } from "@/lib/utils";
import { ChangeRequestModal } from "@/components/scopeguard/ChangeRequestModal";

const LANDING_PREVIEW_DIFF = {
  summary: {
    baselineVersion: "v1.0",
    baselineLockedDate: "2026-07-28T16:00:00Z",
    currentVersion: "v1.3",
    currentRevisionDate: "2026-08-21T14:30:00Z",
    addedCount: 2,
    removedCount: 0,
    modifiedCount: 1,
    totalRequirementsCount: 24,
    netHours: 36,
    hourlyRate: 120,
    netCost: 4320,
    estimatedDaysDelay: 5,
    riskRating: "Severe Drift" as const,
  },
  items: [
    {
      id: "diff-1",
      type: "added" as const,
      reqCode: "REQ-CRYPTO-01",
      title: "Direct Crypto-to-Fiat Escrow On-Ramp",
      category: "Payments & Escrow",
      diffSummary: "New stablecoin payment rail added outside initial scope",
      newDescription: "Enable buyers to fund freelance milestones using USDT & USDC with automatic stablecoin settlement.",
      hoursImpact: 24,
      costImpact: 2880,
      impactLevel: "Critical" as const,
      reasonForChange: "Client requested cryptocurrency checkout during mid-sprint Slack conversation.",
      affectedComponents: ["Payment Gateway", "Settlement Engine", "Compliance Audit"]
    },
    {
      id: "diff-2",
      type: "modified" as const,
      reqCode: "REQ-AUTH-01",
      title: "Biometric & Hardware Token Authentication",
      category: "Authentication",
      diffSummary: "Hardware YubiKey token requirement added to existing biometric flow",
      oldDescription: "Standard biometric Face ID and 6-digit numeric PIN fallback.",
      newDescription: "Mandate physical FIDO2 YubiKey hardware token verification for transfers exceeding $10,000.",
      hoursImpact: 12,
      costImpact: 1440,
      impactLevel: "High" as const,
      reasonForChange: "Enterprise compliance security mandate submitted after baseline sign-off.",
      affectedComponents: ["Auth Service", "Mobile SDK", "WebAuthn Layer"]
    }
  ]
};

export function ScopeDiffSimulator() {
  const [activeVersion, setActiveVersion] = useState<"baseline" | "revision">("revision");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>("REQ-CRYPTO-01");

  const toggleExpand = (id: string) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-8 lg:p-9 shadow-2xl shadow-sky-500/5 space-y-7 relative overflow-hidden transition-all">
      {/* Ambient background glows */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-gradient-to-tr from-amber-500/10 to-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ================= SIMULATOR HEADER & INTERACTIVE TOGGLE ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-zinc-100 dark:border-zinc-800/80 pb-6 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[11px] font-semibold text-sky-700 dark:text-sky-300 font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Interactive Scope Guard™ Diff Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            See How SpecGuard Traps Scope Drift in Real-Time
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Compare locked baseline contracts against new client emails to protect your team from unbilled work.
          </p>
        </div>

        {/* Segmented Version Switcher */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs self-start lg:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveVersion("baseline")}
            className={cn(
              "px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2",
              activeVersion === "baseline"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/60 dark:border-zinc-700"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>1. Signed Baseline (v1.0)</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveVersion("revision")}
            className={cn(
              "px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2",
              activeVersion === "revision"
                ? "bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200 shadow-sm border border-amber-300 dark:border-amber-800/80"
                : "text-zinc-500 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-300"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span>2. Client Email Addendum (v1.3)</span>
          </button>
        </div>
      </div>

      {/* ================= 4 METRIC IMPACT CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {/* Card 1: Scope Variance */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Scope Drift Hours
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {activeVersion === "revision" ? (
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">+36 hrs</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">0 hrs</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {activeVersion === "revision" ? "+32.5% developer load" : "100% on approved budget"}
          </p>
        </div>

        {/* Card 2: Financial Adjustment */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Unbilled Financials
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {activeVersion === "revision" ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">+$4,320 USD</span>
            ) : (
              <span className="text-zinc-500 font-extrabold">$0.00</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {activeVersion === "revision" ? "@ $120/hr blended rate" : "Zero change order required"}
          </p>
        </div>

        {/* Card 3: Schedule Delay */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Timeline Variance
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {activeVersion === "revision" ? (
              <span className="text-sky-600 dark:text-sky-400 font-extrabold">+5 Days</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">On Schedule</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {activeVersion === "revision" ? "Sprint 4 milestone shifted" : "Sprint milestones aligned"}
          </p>
        </div>

        {/* Card 4: Drift Status */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Scope Guard Status
            </span>
          </div>
          <div className="pt-0.5">
            {activeVersion === "revision" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Severe Scope Drift
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Baseline Locked
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {activeVersion === "revision" ? "2 unapproved additions" : "Cryptographic sign-off"}
          </p>
        </div>
      </div>

      {/* ================= MAIN DIFF CONTENT / INTERACTIVE CARDS ================= */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            {activeVersion === "revision"
              ? "Detected Scope Changes Requiring Client Approval (2)"
              : "Signed Baseline Spec Snapshot (v1.0)"}
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            Project: PayPulse Banking Mobile App
          </span>
        </div>

        {activeVersion === "revision" ? (
          <div className="space-y-3">
            {/* Diff Card 1: REQ-CRYPTO-01 */}
            <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950/80 overflow-hidden shadow-sm transition-all">
              <div 
                onClick={() => toggleExpand("REQ-CRYPTO-01")}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-mono font-bold">
                      + ADDED OUT OF SCOPE
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-bold">
                      REQ-CRYPTO-01
                    </span>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      USDC Stablecoin Wallet Top-Up via Polygon
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="italic">
                      "Hey team, we really need users to be able to deposit USDC on Polygon before next week's demo!"
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200 dark:border-amber-900/40">
                  <div className="text-right font-mono">
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">+32 hrs</span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">+$3,840 USD</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    {expandedItem === "REQ-CRYPTO-01" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Gherkin & Architecture Preview */}
              {expandedItem === "REQ-CRYPTO-01" && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-amber-200/80 dark:border-amber-900/40 space-y-3 bg-white/80 dark:bg-zinc-950/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Gherkin Specs */}
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 font-mono">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                        Auto-Generated Acceptance Criteria (Gherkin)
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                        <strong className="text-purple-600 dark:text-purple-400">GIVEN</strong> an authenticated wallet user<br />
                        <strong className="text-sky-600 dark:text-sky-400">WHEN</strong> they initiate a Polygon USDC deposit<br />
                        <strong className="text-emerald-600 dark:text-emerald-400">THEN</strong> credit balance within 12 block confirmations.
                      </p>
                    </div>

                    {/* Architecture Impact */}
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                        Impacted Architectural Components
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-mono border border-sky-300 dark:border-sky-800">
                          PolygonRPCBridge.ts
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-mono border border-purple-300 dark:border-purple-800">
                          WebhookConfirmationWorker
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono border border-emerald-300 dark:border-emerald-800">
                          CustodyVaultSchema
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Diff Card 2: REQ-TAX-01 */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 overflow-hidden shadow-sm transition-all">
              <div 
                onClick={() => toggleExpand("REQ-TAX-01")}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-mono font-bold">
                      + ADDED OUT OF SCOPE
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-bold">
                      REQ-TAX-01
                    </span>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Automated Form 1099-K IRS Tax Reporting & CSV
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="italic">
                      "Client legal counsel request: Need automated 1099-K reporting ready for payouts over $600."
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-right font-mono">
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">+20 hrs</span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">+$2,400 USD</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    {expandedItem === "REQ-TAX-01" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Gherkin & Architecture Preview */}
              {expandedItem === "REQ-TAX-01" && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 font-mono">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                        Auto-Generated Acceptance Criteria (Gherkin)
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                        <strong className="text-purple-600 dark:text-purple-400">GIVEN</strong> year-end gross settlement exceeding $600<br />
                        <strong className="text-sky-600 dark:text-sky-400">WHEN</strong> tax reporting cycle closes on Dec 31<br />
                        <strong className="text-emerald-600 dark:text-emerald-400">THEN</strong> generate IRS compliant 1099-K PDF and CSV.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                        Impacted Architectural Components
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700">
                          IRS1099Generator.service.ts
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 text-[10px] font-mono border border-zinc-200 dark:border-zinc-700">
                          AnnualLedgerAggregator
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= BASELINE SIGNED SPEC CARD ================= */
          <div className="p-7 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border border-emerald-300/80 dark:border-emerald-900/60 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-lg mx-auto">
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Baseline Specification v1.0 Cryptographically Locked
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                All 24 baseline requirements were approved and signed off by <strong>Dave Sterling (Client CTO)</strong> on July 28, 2026.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>SHA-256: 8f4b29a1e03c7d1e8471bb92f58e4c02</span>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveVersion("revision")}
                className="text-xs gap-1.5 border-emerald-300 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50"
              >
                <span>Simulate Client Addendum Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM ACTION BAR ================= */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
          <span>
            {activeVersion === "revision" 
              ? "AI Action: Ready to generate official change-order documentation for client sign-off."
              : "Status: All requirements match the signed statement of work with zero billable drift."}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link href="/projects/demo-fintech?tab=scopeguard">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 w-full sm:w-auto">
              <span>Inspect Full Engine</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs gap-1.5 font-semibold w-full sm:w-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Client Change-Order Notice</span>
          </Button>
        </div>
      </div>

      {/* Change Request Modal */}
      <ChangeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={LANDING_PREVIEW_DIFF.summary}
        diffItems={LANDING_PREVIEW_DIFF.items}
        projectName="PayPulse Mobile Banking & Escrow"
        clientName="PayPulse Financial Technologies LLC"
      />
    </div>
  );
}
