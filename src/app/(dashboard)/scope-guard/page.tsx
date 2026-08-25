"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  ArrowRight, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Layers, 
  FolderKanban, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Download,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button, Card, Input } from "@/lib/ui-index";
import { Project } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { getUserProjects } from "@/lib/services/projectService";

import { WhatsAppAnalyzerModal } from "@/components/scopeguard/WhatsAppAnalyzerModal";
import { MessageSquare } from "lucide-react";

export default function ScopeGuardHubPage() {
  const { success } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "DRIFT_ONLY" | "CLEAN_ONLY">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedProjectForAnalysis, setSelectedProjectForAnalysis] = useState<Project | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getUserProjects();
        setProjects(data || []);
        if (data && data.length > 0) {
          setSelectedProjectForAnalysis(data[0]);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Calculate agency-wide statistics
  const totalProjects = projects.length;
  const driftedProjects = projects.filter((p) => p.driftCost > 0);
  const cleanProjects = projects.filter((p) => p.driftCost === 0);
  const totalDriftCost = projects.reduce((sum, p) => sum + (p.driftCost || 0), 0);
  const totalDriftHours = projects.reduce((sum, p) => sum + (p.driftHours || 0), 0);

  // Filter and sort projects: Severe Drift -> Minor Drift -> Clean
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMode === "DRIFT_ONLY") {
      return matchesSearch && project.driftCost > 0;
    }
    if (filterMode === "CLEAN_ONLY") {
      return matchesSearch && project.driftCost === 0;
    }
    return matchesSearch;
  }).sort((a, b) => (b.driftCost || 0) - (a.driftCost || 0));

  const handleExportSummary = () => {
    success(
      "Agency Drift Report Exported",
      `Exported summary for ${driftedProjects.length} drifted projects ($${totalDriftCost.toLocaleString()} unbilled).`
    );
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Scope Guard™ Hub
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Track scope drift and unbilled feature requests across all active client projects
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsWhatsAppModalOpen(true)} 
            className="text-xs gap-1.5 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Analyze Client WhatsApp</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportSummary} className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export Agency Drift Report</span>
          </Button>
          <Link href="/projects/new">
            <Button variant="glow" size="sm" className="text-xs gap-1.5">
              <span>Ingest New Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <WhatsAppAnalyzerModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        project={selectedProjectForAnalysis || projects[0]}
      />

      {/* ================= 4 COMPACT AGENCY-WIDE STAT CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Projects */}
        <Card className="p-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Total Active Projects
          </span>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {totalProjects} Projects
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Across 4 client accounts</p>
        </Card>

        {/* Card 2: Projects with Drift Detected */}
        <Card className="p-4 bg-amber-50/50 dark:bg-zinc-900/80 border-amber-200 dark:border-amber-900/40 space-y-1 shadow-xs">
          <span className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            Projects with Scope Drift
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
            {driftedProjects.length} of {totalProjects}
          </div>
          <p className="text-[10px] text-amber-800/70 dark:text-amber-300/70 font-medium">
            1 Severe · 1 Minor drift
          </p>
        </Card>

        {/* Card 3: Total Unbilled Variance ($) */}
        <Card className="p-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Total Unbilled Variance
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalDriftCost)}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Ready for change-order recovery</p>
        </Card>

        {/* Card 4: Hours at Risk */}
        <Card className="p-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Engineering Hours at Risk
          </span>
          <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
            +{totalDriftHours} hrs
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Unapproved overtime volume</p>
        </Card>
      </div>

      {/* ================= SEARCH & FILTER TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search by project name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="h-8 text-xs bg-zinc-50 dark:bg-zinc-950"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              onClick={() => setFilterMode("ALL")}
              className={cn(
                "px-3 py-1 rounded-md transition-colors font-medium",
                filterMode === "ALL"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              All Projects ({totalProjects})
            </button>
            <button
              onClick={() => setFilterMode("DRIFT_ONLY")}
              className={cn(
                "px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1",
                filterMode === "DRIFT_ONLY"
                  ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Drift Only ({driftedProjects.length})
            </button>
            <button
              onClick={() => setFilterMode("CLEAN_ONLY")}
              className={cn(
                "px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1",
                filterMode === "CLEAN_ONLY"
                  ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Clean ({cleanProjects.length})
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN PROJECT DRIFT LIST / TABLE ================= */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              All projects are within their approved baseline.
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Nice work! There are no unbilled scope changes detected matching your current filter.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterMode("ALL");
            }}
            className="text-xs"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-200">
              <thead className="bg-zinc-50 dark:bg-zinc-950/80 font-semibold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Client & Project</th>
                  <th className="py-3.5 px-4">Scope Status</th>
                  <th className="py-3.5 px-4">Baseline Date</th>
                  <th className="py-3.5 px-4">Version Drift</th>
                  <th className="py-3.5 px-4">Eng. Impact</th>
                  <th className="py-3.5 px-4">Unbilled Variance</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredProjects.map((project) => {
                  const hasSevereDrift = project.driftCost >= 3000;
                  const hasMinorDrift = project.driftCost > 0 && project.driftCost < 3000;
                  const isClean = project.driftCost === 0;

                  return (
                    <tr
                      key={project.id}
                      className={cn(
                        "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors",
                        hasSevereDrift && "bg-amber-50/30 dark:bg-amber-950/10"
                      )}
                    >
                      {/* Column 1: Client & Project */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/projects/${project.id}?tab=scopeguard`}
                          className="flex items-start gap-3 group"
                        >
                          <span className="text-2xl mt-0.5">{project.clientAvatar || "📁"}</span>
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                              <span>{project.name}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {project.clientName}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Column 2: Scope Status Badge */}
                      <td className="py-4 px-4">
                        {hasSevereDrift ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Severe Drift
                          </span>
                        ) : hasMinorDrift ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Minor Drift
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            No Drift (Clean)
                          </span>
                        )}
                      </td>

                      {/* Column 3: Baseline Signed Date */}
                      <td className="py-4 px-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                        {project.baselineLockedAt ? (
                          formatDate(project.baselineLockedAt)
                        ) : (
                          <span className="text-zinc-400 italic">Pending Sign-off</span>
                        )}
                      </td>

                      {/* Column 4: Version Drift */}
                      <td className="py-4 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {project.baselineVersion || "v1.0"}
                          </span>
                          <span className="text-zinc-400">→</span>
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded font-bold border",
                              project.driftCost > 0
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                            )}
                          >
                            {project.currentVersion}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Engineering Impact */}
                      <td className="py-4 px-4 font-mono text-xs">
                        {project.driftHours > 0 ? (
                          <span className="text-amber-700 dark:text-amber-400 font-bold">
                            +{project.driftHours} hrs
                          </span>
                        ) : (
                          <span className="text-zinc-400">0 hrs</span>
                        )}
                      </td>

                      {/* Column 6: Financial Variance */}
                      <td className="py-4 px-4 font-mono text-xs">
                        {project.driftCost > 0 ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                            +{formatCurrency(project.driftCost)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">$0.00</span>
                        )}
                      </td>

                      {/* Column 7: Action Button */}
                      <td className="py-4 px-4 text-right">
                        {project.driftCost > 0 ? (
                          <Link href={`/projects/${project.id}?tab=scopeguard`}>
                            <Button variant="glow" size="sm" className="h-7 text-xs gap-1">
                              <span>Review Drift</span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/projects/${project.id}?tab=matrix`}>
                            <Button variant="secondary" size="sm" className="h-7 text-xs">
                              <span>View Blueprint</span>
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= BOTTOM GUIDANCE BANNER ================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-sky-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scope Guard™ Automated Workflow</span>
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Whenever clients email addendums, upload them directly to the project to automatically generate formal change orders.
          </p>
        </div>

        <Link href="/projects/demo-fintech?tab=scopeguard">
          <Button variant="outline" size="sm" className="text-xs shrink-0 bg-white dark:bg-zinc-800">
            <span>Explore PayPulse Diff Simulator</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
