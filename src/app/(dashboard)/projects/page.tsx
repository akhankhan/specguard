"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Layers, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  LayoutGrid, 
  List,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Shield,
  FileCode,
  DollarSign,
  UploadCloud,
  Trash2
} from "lucide-react";
import { Button, Card, Input } from "@/lib/ui-index";
import { Project, ProjectStatus } from "@/lib/types";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { getUserProjects, deleteProject } from "@/lib/services/projectService";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function ProjectsPage() {
  const { success, error: toastError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
        console.error("Failed to load projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Statistics calculation
  const totalActive = projects.length;
  const lockedCount = projects.filter((p) => p.status === "Baseline Locked").length;
  const driftCount = projects.filter((p) => p.status === "Scope Drift Detected").length;
  const totalClarifications = projects.reduce((acc, p) => acc + (p.pendingClarifications || 0), 0);
  const totalDriftCost = projects.reduce((acc, p) => acc + (p.driftCost || 0), 0);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & New Spec CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Projects & Specifications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/60">
              {projects.length} Specs
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your active client requirement blueprints, baseline sign-offs, and Scope Guard™ change orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/projects/new">
            <Button variant="glow" size="sm" className="gap-1.5 font-semibold text-xs h-9 px-4 rounded-xl shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Client Brief</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Active</span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{totalActive} Specs</div>
          <span className="text-[10px] text-zinc-400 font-mono">Live in Workspace</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Baseline Locked</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{lockedCount} Signed</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Protected from Creep</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Scope Drift Active</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{driftCount} Alerts</div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-medium">
            {formatCurrency(totalDriftCost)} Unbilled
          </span>
        </Card>
        <Card className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Clarifications</span>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{totalClarifications} Pending</div>
          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono">Requires Client Answer</span>
        </Card>
      </div>

      {/* Zero State if no projects in database */}
      {projects.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-10 lg:p-12 text-center shadow-xs">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 inline-flex items-center justify-center shadow-xs">
              <FolderKanban className="w-7 h-7" />
            </div>
          </div>
          <div className="max-w-lg mx-auto space-y-2 mb-7">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              No Specifications in Catalog
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              You haven&apos;t ingested any client briefs or software requirement documents yet. Ingest your first brief to automatically generate a structured blueprint.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/projects/new">
              <Button variant="glow" size="md" className="gap-2.5 font-semibold text-xs h-11 px-7 rounded-xl shadow-md transition-all hover:scale-[1.02]">
                <Plus className="w-4 h-4" />
                <span>Ingest First Client Brief</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Real Projects Catalog */
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/70 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search projects, client names, tech tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="h-10 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Statuses ({projects.length})</option>
                <option value="Baseline Locked">Baseline Locked</option>
                <option value="Scope Drift Detected">Scope Drift Active</option>
                <option value="In Review">In Review</option>
                <option value="Draft">Draft</option>
              </select>

              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors",
                    viewMode === "grid" && "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors",
                    viewMode === "list" && "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  )}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className={cn(
                    "p-6 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-6 hover:shadow-md transition-all group",
                    project.status === "Scope Drift Detected" && "border-amber-400/60 dark:border-amber-500/40 shadow-xs shadow-amber-500/5"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 shrink-0">
                        {project.clientAvatar || "📁"}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {project.status === "Baseline Locked" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Baseline Locked
                          </span>
                        )}
                        {project.status === "Scope Drift Detected" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1 animate-pulse">
                            <ShieldAlert className="w-3 h-3" />
                            Scope Drift Active
                          </span>
                        )}
                        {project.status === "In Review" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                            In Review
                          </span>
                        )}
                        {project.status === "Draft" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                        {project.clientName}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {project.totalRequirements} Requirements
                      </span>
                      {project.status === "Scope Drift Detected" ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          +{project.driftHours}h Drift ({formatCurrency(project.driftCost)})
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                          Updated {formatDate(project.updatedAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full text-xs font-semibold gap-1.5 justify-center">
                          <span>Open Spec Matrix</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                      {project.pendingClarifications > 0 && (
                        <Link href={`/projects/${project.id}/clarify`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 px-2.5 font-mono font-semibold"
                            title={`${project.pendingClarifications} unanswered clarification items`}
                          >
                            <span>{project.pendingClarifications} Qs</span>
                          </Button>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(project)}
                        title="Delete Specification"
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start md:items-center gap-3.5">
                    <div className="text-2xl p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 shrink-0">
                      {project.clientAvatar || "📁"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{project.name}</h3>
                        <span className="text-xs text-zinc-400 font-normal">· {project.clientName}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 font-mono">
                        <span>{project.totalRequirements} Requirements</span>
                        <span>•</span>
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {project.status === "Scope Drift Detected" && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono mr-2">
                        +{project.driftHours}h Drift ({formatCurrency(project.driftCost)})
                      </span>
                    )}

                    <Link href={`/projects/${project.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                        <span>Open Spec Matrix</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project)}
                      title="Delete Specification"
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
