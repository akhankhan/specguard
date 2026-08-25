"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FolderKanban, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Layers, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle,
  TrendingUp,
  Activity,
  DollarSign,
  FileCheck2,
  Lock,
  GitPullRequest,
  Check,
  Building2,
  ExternalLink,
  ShieldCheck,
  UploadCloud,
  ChevronRight,
  FileCode,
  Trash2
} from "lucide-react";
import { Button, Card } from "@/lib/ui-index";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { getUserProjects, deleteProject } from "@/lib/services/projectService";
import { Project } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { success, error: toastError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getUserProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to load projects from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const displayName = profile?.fullName || user?.email?.split("@")[0] || "Agency Partner";
  const agencyName = profile?.companyName && profile.companyName !== "Login" 
    ? profile.companyName 
    : "Apex Digital Studio";

  const totalSpecs = projects.length;
  const lockedSpecs = projects.filter((p) => p.status === "Baseline Locked").length;
  const driftedProjects = projects.filter((p) => p.status === "Scope Drift Detected");
  const totalDriftCost = projects.reduce((acc, p) => acc + (p.driftCost || 0), 0);
  const totalClarifications = projects.reduce((acc, p) => acc + (p.pendingClarifications || 0), 0);

  return (
    <div className="space-y-7">
      {/* ================= EXECUTIVE GREETING BANNER ================= */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 lg:p-8 shadow-lg border border-sky-700/30 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{agencyName} • Enterprise Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed pt-0.5">
              {totalSpecs > 0
                ? `You have ${totalSpecs} active software specifications protected. Scope Guard™ is actively monitoring contracts for billable creep.`
                : "No software specifications ingested yet. Upload your first client RFP or contract brief to generate structured blueprints in seconds."
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/projects/new">
              <Button 
                variant="primary" 
                size="md" 
                className="bg-white text-sky-950 hover:bg-sky-50 border-0 font-bold shadow-md gap-2 text-xs h-10 px-5 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Ingest Client Brief</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button 
                variant="outline" 
                size="md" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-xs h-10 px-4 rounded-xl font-medium"
              >
                <FolderKanban className="w-4 h-4" />
                <span>All Specs ({totalSpecs})</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 CORE EXECUTIVE METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Specs */}
        <Card className="p-5 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs hover:border-sky-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Active Specs
            </span>
            <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              {isLoading ? "..." : totalSpecs}
            </div>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {lockedSpecs} Locked Baselines
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 2: Unbilled Scope Drift */}
        <Card className="p-5 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs hover:border-amber-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Unbilled Scope Drift
            </span>
            <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {isLoading ? "..." : formatCurrency(totalDriftCost)}
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400/80 font-mono font-medium pt-0.5">
              {driftedProjects.length} projects drifted
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 3: Baseline Integrity */}
        <Card className="p-5 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs hover:border-emerald-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Baseline Protection
            </span>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {totalSpecs > 0 ? "98.4%" : "100%"}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono pt-0.5">
              Zero Unsigned Scope
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 4: Clarification Queue */}
        <Card className="p-5 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs hover:border-indigo-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Clarifications
            </span>
            <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {isLoading ? "..." : totalClarifications}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono pt-0.5">
              Pending client reply
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* ================= ZERO STATE OR REAL PROJECTS ================= */}
      {projects.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-10 lg:p-12 text-center shadow-xs">
          {/* Symmetrical Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 inline-flex items-center justify-center shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
          </div>

          {/* Heading and Subtitle */}
          <div className="max-w-lg mx-auto space-y-2 mb-7">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              No Project Specifications Ingested Yet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Upload client requirement PDFs, DOCX contracts, or paste raw meeting notes. SpecGuard AI will instantly extract your requirement matrix, Gherkin acceptance criteria, and C4 architecture diagrams.
            </p>
          </div>

          {/* Generous Padding on CTA Button */}
          <div className="flex justify-center mb-9">
            <Link href="/projects/new">
              <Button 
                variant="glow" 
                size="md" 
                className="gap-2.5 font-semibold text-xs h-11 px-7 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Ingest Your First Client Brief</span>
              </Button>
            </Link>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left max-w-3xl mx-auto border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 hover:border-sky-500/30 transition-all">
              <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 w-fit">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. Ingest Raw Briefs</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">PDFs, Word docs, emails, and client RFPs parsed with citations.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 hover:border-emerald-500/30 transition-all">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 w-fit">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. Lock Baseline v1.0</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Get client digital counter-signatures before building sprint 1.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 hover:border-amber-500/30 transition-all">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 w-fit">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">3. Scope Guard™</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Automatically catch client mid-sprint feature creep and billing drift.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Real Projects Section */
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-sky-500" />
              <span>Active Specifications ({projects.length})</span>
            </h2>
            <Link href="/projects" className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <Card 
                key={proj.id}
                className="p-5 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-2xl p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                      {proj.clientAvatar || "📁"}
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-medium border",
                      proj.status === "Baseline Locked" && "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
                      proj.status === "Scope Drift Detected" && "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 animate-pulse",
                      proj.status === "In Review" && "bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60",
                      proj.status === "Draft" && "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200"
                    )}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{proj.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{proj.clientName}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {proj.totalRequirements} Requirements
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(proj)}
                      title="Delete Specification"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <Link href={`/projects/${proj.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs font-semibold gap-1 h-8 px-3">
                        <span>Open Spec</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        title="Delete Specification"
        description="Are you sure you want to permanently delete this project specification?"
        maxWidth="md"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1 text-xs">
            <p className="font-bold text-rose-900 dark:text-rose-200">
              {projectToDelete?.name}
            </p>
            <p className="text-rose-700 dark:text-rose-300">
              Client: {projectToDelete?.clientName} • {projectToDelete?.totalRequirements} Requirements
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
              This will remove all associated user stories, diagrams, acceptance criteria, and baseline snapshots.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProjectToDelete(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={async () => {
                if (!projectToDelete) return;
                try {
                  setIsDeleting(true);
                  await deleteProject(projectToDelete.id);
                  setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
                  success("Specification Deleted", `"${projectToDelete.name}" has been permanently removed.`);
                  setProjectToDelete(null);
                } catch (err) {
                  toastError("Delete Failed", "Could not delete specification.");
                } finally {
                  setIsDeleting(false);
                }
              }}
              isLoading={isDeleting}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-rose-600/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
