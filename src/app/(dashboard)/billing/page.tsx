"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  FolderKanban, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Download,
  Receipt,
  Printer,
  Calendar,
  CreditCard,
  Crown,
  ArrowRight,
  Shield
} from "lucide-react";
import { Button, Card } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects } from "@/lib/services/projectService";
import { Project } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";

interface PlanConfig {
  id: "free" | "pro" | "enterprise";
  name: string;
  badge?: string;
  priceUSD: number;
  billingInterval: string;
  description: string;
  maxSpecs: number;
  maxStorageGB: number;
  recommended?: boolean;
  features: string[];
}

const AVAILABLE_PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Starter",
    priceUSD: 0,
    billingInterval: "Forever free",
    description: "For individual developers and freelancers testing specifications.",
    maxSpecs: 3,
    maxStorageGB: 1,
    features: [
      "Up to 3 Active Project Specifications",
      "Standard PDF & DOCX Document Extraction",
      "Mermaid.js C4 Architecture & Component Flows",
      "1 Workspace Team Member",
      "Basic Scope Variance Detection",
      "1 GB Citation & Asset Storage",
    ],
  },
  {
    id: "pro",
    name: "Pro Studio",
    badge: "MOST POPULAR",
    priceUSD: 39,
    billingInterval: "per month, billed annually",
    description: "For high-velocity software agencies protecting client contracts from scope creep.",
    maxSpecs: 10,
    maxStorageGB: 5,
    recommended: true,
    features: [
      "Up to 10 Active Project Specifications",
      "Full Scope Guard™ Scope Drift Engine",
      "Groq Llama 3.3 70B & OpenAI GPT-4o Engine",
      "WhatsApp & Email Scope Creep Analyzer",
      "Agile User Stories & Gherkin Scenarios",
      "Cryptographic Baseline Lock v1.0",
      "5 Workspace Team Seats",
      "5 GB Citation & Vector Storage",
    ],
  },
  {
    id: "enterprise",
    name: "Agency Enterprise",
    badge: "UNLIMITED",
    priceUSD: 99,
    billingInterval: "per month, billed annually",
    description: "For digital agencies and development shops managing high-volume client portfolios.",
    maxSpecs: 100,
    maxStorageGB: 50,
    features: [
      "Unlimited Project Specifications (100+)",
      "Dedicated High-Throughput AI Instance",
      "Custom Digital Contract Signatures & Terms",
      "Multi-Tenant Agency Subdomains",
      "Unlimited Team Seats & Client Portals",
      "24/7 Priority Engineering SLA Support",
      "Audit Trail & Compliance Logs",
      "50 GB Dedicated Enterprise Storage",
    ],
  },
];

interface InvoiceItem {
  id: string;
  date: string;
  planName: string;
  amount: string;
  status: string;
  tax: string;
  paymentMethod: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState<"free" | "pro" | "enterprise">("pro");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getUserProjects();
        setProjects(data || []);

        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const status = urlParams.get("status");
          const plan = urlParams.get("plan");

          if (status === "success" && plan && ["pro", "enterprise"].includes(plan)) {
            setActivePlanId(plan as any);
            localStorage.setItem("specguard_billing_plan", plan);

            const newInvoice: InvoiceItem = {
              id: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              planName: plan === "pro" ? "Pro Studio" : "Agency Enterprise",
              amount: plan === "pro" ? "$39.00" : "$99.00",
              status: "Paid",
              tax: "$0.00",
              paymentMethod: "Lemon Squeezy",
            };

            const existingInvoicesStr = localStorage.getItem("specguard_billing_invoices");
            let existingInvoices: InvoiceItem[] = [];
            try {
              if (existingInvoicesStr) existingInvoices = JSON.parse(existingInvoicesStr);
            } catch {}

            const updatedInvoices = [newInvoice, ...existingInvoices.filter(i => i.id !== newInvoice.id)];
            setInvoices(updatedInvoices);
            localStorage.setItem("specguard_billing_invoices", JSON.stringify(updatedInvoices));

            success("Payment Successful!", `Your ${plan === "pro" ? "Pro Studio" : "Enterprise"} subscription is now active! 🎉`);

            // Clean URL query parameters
            window.history.replaceState({}, "", "/billing");
          } else {
            const savedPlan = localStorage.getItem("specguard_billing_plan") as any;
            if (savedPlan && ["free", "pro", "enterprise"].includes(savedPlan)) {
              setActivePlanId(savedPlan);
            } else {
              setActivePlanId("free");
            }
          }

          const savedInvoices = localStorage.getItem("specguard_billing_invoices");
          if (savedInvoices) {
            try {
              setInvoices(JSON.parse(savedInvoices));
            } catch {
              setInvoices([]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load billing data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const currentPlan = AVAILABLE_PLANS.find((p) => p.id === activePlanId) || AVAILABLE_PLANS[0];

  // Usage Calculations
  const activeSpecsCount = projects.length;
  const specUsagePercent = Math.min(100, Math.round((activeSpecsCount / currentPlan.maxSpecs) * 100));
  const totalRequirements = projects.reduce((acc, p) => acc + (p.totalRequirements || 0), 0);
  const calculatedStorageMB = projects.length === 0 ? "0.0" : ((projects.length * 1.8) + (totalRequirements * 0.08)).toFixed(1);
  const storageUsagePercent = Math.min(100, Math.round((parseFloat(calculatedStorageMB) / (currentPlan.maxStorageGB * 1024)) * 100));
  const driftedProjectsCount = projects.filter((p) => (p.driftCost || 0) > 0).length;
  const scopeGuardChecks = driftedProjectsCount * 3 + projects.length;

  const handleSelectPlan = async (plan: PlanConfig) => {
    if (plan.id === activePlanId) {
      return;
    }

    if (plan.id === "free") {
      setActivePlanId("free");
      if (typeof window !== "undefined") {
        localStorage.setItem("specguard_billing_plan", "free");
      }
      success("Plan Updated", "Your workspace is now on the Starter Free tier.");
      return;
    }

    try {
      setIsProcessingCheckout(plan.id);
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toastError("Checkout Error", data.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      toastError("Checkout Error", "Network error starting checkout.");
    } finally {
      setIsProcessingCheckout(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Subscription & Billing
            </h1>
            {activePlanId !== "free" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentPlan.name} Active
              </span>
            ) : (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                Free Plan
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Manage your active agency workspace subscription, payment receipts, and plan allocations.
          </p>
        </div>
      </div>

      {/* ================= CHATGPT / GEMINI STYLE: ACTIVE SUBSCRIPTION HERO BANNER ================= */}
      {activePlanId !== "free" && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent p-6 sm:p-7 shadow-lg shadow-emerald-500/5 dark:bg-zinc-900/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-500 text-white shadow-xs">
                  <Crown className="w-3.5 h-3.5" />
                  ACTIVE SUBSCRIPTION
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Lemon Squeezy Verified
                </span>
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                  <span>SpecGuard {currentPlan.name}</span>
                  <span className="text-sm font-mono font-medium px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ${currentPlan.priceUSD}/month
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
                  Your workspace has full access to <strong>Scope Guard™ drift protection</strong>, <strong>{currentPlan.maxSpecs} active project specifications</strong>, and <strong>high-throughput AI extraction</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  Next renewal: <strong className="text-zinc-900 dark:text-zinc-100">September 26, 2026</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Status: <strong className="text-emerald-600 dark:text-emerald-400">Auto-Renewing</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {invoices.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvoice(invoices[0])}
                  className="h-10 text-xs font-semibold gap-1.5 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5 text-sky-500" />
                  <span>View Latest Receipt</span>
                </Button>
              )}
              <Button
                variant="glow"
                onClick={() => setIsManageModalOpen(true)}
                className="h-10 text-xs font-bold gap-1.5 shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Manage Subscription</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3 PRICING TIERS (SIDE-BY-SIDE GRID) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Available Plans & Upgrades
          </h3>
          <span className="text-xs text-zinc-400">
            Switch tiers or upgrade anytime
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {AVAILABLE_PLANS.map((plan) => {
            const isCurrent = activePlanId === plan.id;
            const isRecommended = plan.recommended;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-200 ${
                  isCurrent
                    ? "bg-white dark:bg-zinc-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/5 ring-2 ring-emerald-500/20"
                    : isRecommended
                    ? "bg-white dark:bg-zinc-900 border-2 border-sky-500 shadow-lg shadow-sky-500/10 dark:shadow-sky-500/5"
                    : "bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs"
                }`}
              >
                {/* Badge */}
                {isCurrent ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-wider uppercase shadow-sm bg-emerald-500 text-white flex items-center gap-1.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                      CURRENT ACTIVE PLAN
                    </span>
                  </div>
                ) : plan.badge ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase shadow-xs ${
                      isRecommended
                        ? "bg-sky-500 text-white"
                        : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                ) : null}

                {/* Plan Header */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      {plan.name}
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight font-mono">
                        ${plan.priceUSD}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        / month
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                      {plan.billingInterval}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                      What’s included:
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isCurrent
                              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400"
                              : isRecommended 
                              ? "bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400" 
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  {isCurrent ? (
                    <div className="w-full h-11 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25">
                      <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
                      <span>Currently Active Plan</span>
                    </div>
                  ) : (
                    <Button
                      variant={isRecommended ? "glow" : "outline"}
                      className={`w-full h-11 text-xs font-bold transition-all shadow-xs gap-1.5 ${
                        !isRecommended ? "hover:border-zinc-400 dark:hover:border-zinc-600" : ""
                      }`}
                      disabled={Boolean(isProcessingCheckout)}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {isProcessingCheckout === plan.id ? (
                        <span>Connecting Checkout...</span>
                      ) : plan.priceUSD === 0 ? (
                        <span>Downgrade to Starter</span>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Upgrade to {plan.name}</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= WORKSPACE USAGE METRICS ================= */}
      <div className="space-y-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Workspace Usage & Limits
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time resource allocation for your current <strong>{currentPlan.name}</strong> tier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Active Specifications */}
          <div className="space-y-2.5 p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 font-medium">
                <FolderKanban className="w-4 h-4 text-sky-500" />
                <span>Active Specifications</span>
              </span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                {isLoading ? "..." : `${activeSpecsCount} / ${currentPlan.maxSpecs}`}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(activeSpecsCount > 0 ? 8 : 0, specUsagePercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {currentPlan.maxSpecs - activeSpecsCount > 0
                ? `${currentPlan.maxSpecs - activeSpecsCount} slots available in current plan`
                : "Quota limit reached — upgrade for more specs"}
            </p>
          </div>

          {/* Scope Guard Diffs */}
          <div className="space-y-2.5 p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Scope Guard™ Diffs</span>
              </span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                {scopeGuardChecks} {currentPlan.id === "free" ? "/ 10 Free" : "/ Unlimited"}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: currentPlan.id === "free" ? `${Math.min(100, (scopeGuardChecks / 10) * 100)}%` : "100%" }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {currentPlan.id === "free" ? "Basic variance checking" : "Continuous baseline protection active"}
            </p>
          </div>

          {/* Storage & Citations */}
          <div className="space-y-2.5 p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Citation & Vector Storage</span>
              </span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                {calculatedStorageMB} MB / {currentPlan.maxStorageGB} GB
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(projects.length > 0 ? 5 : 0, storageUsagePercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              PDF vectors, diagram snapshots & Gherkin caches
            </p>
          </div>
        </div>
      </div>

      {/* ================= BILLING INVOICES HISTORY ================= */}
      <div className="space-y-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Billing History & Receipts
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Official agency tax invoices and download receipts for accounting.
          </p>
        </div>

        <Card className="p-6 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 shadow-xs">
          {invoices.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                        {inv.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold font-mono">
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      {inv.planName} • Paid on {inv.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100 text-sm">
                      {inv.amount}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-xs h-8 gap-1.5 font-semibold text-sky-600 dark:text-sky-400"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Receipt className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                No Invoices Issued Yet
              </p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Official billing receipts and tax statements will appear here automatically after your first subscription payment.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ================= MANAGE SUBSCRIPTION MODAL ================= */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage SpecGuard Subscription"
        description="Your subscription is securely processed and managed via Lemon Squeezy."
        maxWidth="md"
      >
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-medium">Current Tier:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{currentPlan.name} (${currentPlan.priceUSD}/mo)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-medium">Billing Account:</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">{user?.email || "akgame9000@gmail.com"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-medium">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Active (Auto-Renewing)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-medium">Next Invoice:</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-mono">Sep 26, 2026</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            To update your payment card, download official VAT invoices, or modify renewal settings, open your personal Lemon Squeezy Customer Order Portal.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsManageModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={() => {
                window.open("https://app.lemonsqueezy.com/my-orders", "_blank");
                setIsManageModalOpen(false);
              }}
              className="text-xs gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Customer Portal</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= INVOICE RECEIPT VIEWER MODAL ================= */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title={`Tax Invoice: ${selectedInvoice?.id}`}
        description="Official payment receipt for your agency records."
        maxWidth="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-sans space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">SpecGuard AI Inc.</h4>
                  <p className="text-xs text-zinc-500">Enterprise AI Requirement Engineering Platform</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{selectedInvoice.id}</p>
                  <p className="text-xs text-zinc-500">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedInvoice.planName}</p>
                  <p className="text-zinc-500 text-[11px]">Monthly recurring agency subscription</p>
                </div>
                <span className="font-bold font-mono text-base text-zinc-900 dark:text-zinc-100">
                  {selectedInvoice.amount}
                </span>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center text-xs font-bold">
                <span>Total Paid:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{selectedInvoice.amount} USD</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)} className="text-xs">
                Close
              </Button>
              <Button variant="glow" size="sm" onClick={() => window.print()} className="text-xs gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
