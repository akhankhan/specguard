"use client";

import React from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Clock, 
  DollarSign, 
  Check, 
  Terminal, 
  Code, 
  FileCode, 
  Lock, 
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Zap
} from "lucide-react";
import { Button, Card } from "@/lib/ui-index";
import { Navbar } from "@/components/landing/Navbar";
import { BeforeAfterDemo } from "@/components/landing/BeforeAfterDemo";
import { ScopeDiffSimulator } from "@/components/landing/ScopeDiffSimulator";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-sky-500/30 selection:text-sky-800 dark:selection:text-sky-200 transition-colors">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 space-y-20 sm:space-y-28 pb-24">
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-12 sm:pt-20 pb-6 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[480px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="font-medium">The Intelligent Spec Engine for Agencies & Freelancers</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            </div>

            {/* Main Headline */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1]">
                Turn unclear client documents into an{" "}
                <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 dark:from-sky-400 dark:via-cyan-300 dark:to-sky-500 bg-clip-text text-transparent">
                  approved blueprint
                </span>
                —with every requirement traced to its source.
              </h1>
              <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Ingest messy PDFs, DOCX, and client emails. Extract airtight requirement matrices,
                auto-generate C4 architecture diagrams, and stop scope creep with built-in diff protection.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/signup">
                <Button variant="glow" size="lg" className="h-12 px-8 text-base gap-2">
                  <span>Start Free Spec Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/projects/demo-fintech">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base gap-2 bg-white dark:bg-zinc-900/60">
                  <span>Explore Live Interactive Matrix</span>
                </Button>
              </Link>
            </div>

            {/* Social proof bar */}
            <div className="pt-4 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-center gap-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Zero Hallucinations Policy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" /> 100% Citation Linked
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Automated Change Orders
              </span>
            </div>

            {/* ================= BEFORE → AFTER ONBOARDING HERO SECTION ================= */}
            <div className="pt-6 text-left">
              <BeforeAfterDemo />
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE SCOPE GUARD SIMULATOR SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="scope-guard">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Scope Guard™ Protection
            </h2>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Never Work Unpaid Overtime Again
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              When clients introduce scope creep via emails or new briefs, SpecGuard quantifies hour and dollar variance in real-time.
            </p>
          </div>

          <div className="max-w-5xl mx-auto text-left">
            <ScopeDiffSimulator />
          </div>
        </section>

        {/* ================= PROBLEM / SOLUTION COMPARISON ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The Agency & Freelancer Dilemma
            </h2>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Why 68% of Software Contracts Suffer Unpaid Scope Creep
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Messy briefs create ambiguous promises. When the client changes their mind, you eat the cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <Card className="border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 dark:text-red-200">The Traditional Workflow</h4>
                  <p className="text-xs text-red-700/80 dark:text-red-300/70">Unstructured, ambiguous & dispute-prone</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
                  <span>20-page messy PDF briefs with conflicting paragraphs scattered across email chains</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
                  <span>Developers guess acceptance criteria, leading to rework during sprint demos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
                  <span>Client sends "quick add-ons" at 11 PM claiming "it was always in the scope"</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
                  <span>No paper trail to justify change requests; you work weekends for free</span>
                </li>
              </ul>
            </Card>

            {/* The SpecGuard Way */}
            <Card className="border-sky-200 dark:border-sky-900/50 bg-sky-50/40 dark:bg-sky-950/10 p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/80 text-sky-600 dark:text-sky-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-sky-900 dark:text-sky-200">The SpecGuard Platform</h4>
                  <p className="text-xs text-sky-700/80 dark:text-sky-300/70">100% Traceability & Automated Scope Protection</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Instantly turns PDFs & text into structured tables with page & paragraph citations</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Auto-generates Gherkin acceptance criteria (Given/When/Then) and C4 Mermaid diagrams</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Locks baseline v1.0 specifications with client electronic timestamp sign-off</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Scope Guard™ automatically calculates dollar & hour variance for 1-click change orders</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The 4-Step Intelligence Engine
            </h2>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              From Messy Raw Document to Developer-Ready Spec in Minutes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Upload & Ingest",
                description: "Drop PDFs, Word documents, RFPs, or paste raw emails. SpecGuard parses structure and OCR coordinates.",
                icon: <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
              },
              {
                step: "02",
                title: "Clarify & Calibrate",
                description: "AI flags ambiguities and asks targeted questions. If skipped, assumptions are explicitly tagged.",
                icon: <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
              },
              {
                step: "03",
                title: "Synthesize Blueprint",
                description: "Generates requirement matrices, Gherkin acceptance criteria, and interactive Mermaid.js architecture diagrams.",
                icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
              },
              {
                step: "04",
                title: "Track Scope Drift",
                description: "When revisions arrive, compare against the signed baseline and generate formal change orders in 1 click.",
                icon: <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">{item.icon}</div>
                  <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-600">{item.step}</span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= FEATURE HIGHLIGHTS GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="features">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Engineered for Serious Agencies & Senior Engineers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <FileCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Source Traceability</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every functional and non-functional requirement links directly to exact page and paragraph
                citations in the original client document.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Scope Guard™ Diff Engine</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Detects additions, removals, and modifications between the signed baseline and subsequent revisions,
                calculating hour and dollar variance automatically.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Hierarchical Tech Calibrator</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Calibrates non-functional specs (latency, encryption, database schema) based on your chosen platform
                and cloud infrastructure rails.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Live Mermaid.js Diagrams</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Renders System Context C4 topology, User Flow state machines, and relational ERD schemas
                with zoom, pan, and vector SVG exports.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Multi-Format Export</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Export to full Markdown PRD, formal signed Client PDF, Jira/Linear CSV issues,
                and OpenAPI YAML specifications in one click.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Electronic Sign-Off Timestamp</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Locks specifications with verifiable cryptographic timestamps to eliminate client disputes
                before engineering begins.
              </p>
            </Card>
          </div>
        </section>

        {/* ================= PRICING SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="pricing">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Simple, Transparent Pricing
            </h2>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Protect Your First Project for Free
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              One stopped scope creep pays for 2 years of SpecGuard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Starter Freelancer</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For solo developers testing the waters</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">$0</span>
                  <span className="text-xs text-zinc-500">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>2 Active Project Specs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>PDF & DOCX Extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Markdown PRD Export</span>
                  </li>
                </ul>
              </div>

              <Link href="/signup">
                <Button variant="outline" className="w-full text-xs">
                  Get Started Free
                </Button>
              </Link>
            </Card>

            {/* Pro - Highlighted */}
            <div className="relative flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-sky-600/25 border border-sky-300/40">
                  <Sparkles className="w-3 h-3 text-sky-200" />
                  Most Popular for Agencies
                </span>
              </div>
              <Card className="p-6 pt-7 bg-white dark:bg-zinc-900 border-2 border-sky-500 shadow-xl shadow-sky-500/10 flex-1 flex flex-col justify-between space-y-6 rounded-2xl relative">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Pro Studio</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For active freelancers and boutique agencies</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400">$39</span>
                    <span className="text-xs text-zinc-500">/month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-zinc-800 dark:text-zinc-200">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="font-semibold">Unlimited Active Specifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="font-semibold">Scope Guard™ Automated Diff Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>1-Click Change Request Notices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>Interactive Mermaid.js Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>Jira & Linear CSV Import</span>
                    </li>
                  </ul>
                </div>

                <Link href="/signup">
                  <Button variant="glow" className="w-full text-xs">
                    Start 14-Day Pro Trial
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Team / Agency */}
            <Card className="p-6 bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Agency Scale</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For growing development shops & consulting firms</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">$99</span>
                  <span className="text-xs text-zinc-500">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Custom Agency Branding on PDF Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Team Workspaces & Role Permissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Priority Processing & SLA</span>
                  </li>
                </ul>
              </div>

              <Link href="/signup">
                <Button variant="outline" className="w-full text-xs">
                  Contact Agency Sales
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-300">SpecGuard AI</span>
            <span>— The AI Requirement Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/scope-guard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
              Scope Guard™ Hub
            </Link>
            <Link href="/projects/demo-fintech" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
              Live Spec Blueprint
            </Link>
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
              Sign In
            </Link>
            <span>© 2026 SpecGuard Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
