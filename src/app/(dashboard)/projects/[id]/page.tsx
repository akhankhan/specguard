"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  TableProperties, 
  Layers, 
  GitPullRequest, 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Lock, 
  Download, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight,
  Code2,
  Database,
  Cpu,
  ArrowLeft,
  FolderKanban,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/lib/ui-index";
import { RequirementTable } from "@/components/matrix/RequirementTable";
import { MermaidRenderer } from "@/components/diagrams/MermaidRenderer";
import { ScopeGuardView } from "@/components/scopeguard/ScopeGuardView";
import { ExportPanel } from "@/components/export/ExportPanel";
import { Requirement, Project, UserStory, MermaidDiagramData, ClarificationQuestion, ScopeGuardSummary, ScopeDiffItem } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { cn, formatDate } from "@/lib/utils";
import confetti from "canvas-confetti";
import { getProjectById, lockProjectBaseline, deleteProject } from "@/lib/services/projectService";
import { Modal } from "@/components/ui/Modal";

function ProjectDetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = (params.id as string) || "";
  const { success, info, error: toastError } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialTabParam = searchParams.get("tab");
  const validTabs = ["overview", "matrix", "stories", "diagrams", "scopeguard", "export"];
  const defaultTab = validTabs.includes(initialTabParam || "") 
    ? (initialTabParam as "overview" | "matrix" | "stories" | "diagrams" | "scopeguard" | "export")
    : "matrix";

  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [diagrams, setDiagrams] = useState<MermaidDiagramData[]>([]);
  const [clarifications, setClarifications] = useState<ClarificationQuestion[]>([]);
  const [scopeDiff, setScopeDiff] = useState<{ summary: ScopeGuardSummary; items: ScopeDiffItem[] } | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "stories" | "diagrams" | "scopeguard" | "export">(defaultTab);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjectData() {
      if (!projectId) return;
      try {
        setIsLoading(true);
        const data = await getProjectById(projectId);
        if (data.project) {
          setProject(data.project);
          setIsLocked(data.project.status === "Baseline Locked");
        }
        setRequirements(data.requirements || []);
        setUserStories(data.userStories || []);
        setDiagrams(data.diagrams || []);
        setClarifications(data.clarifications || []);
        setScopeDiff(data.scopeDiff || null);
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjectData();
  }, [projectId]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleUpdateRequirement = (updated: Requirement) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const handleAddRequirement = (newReq: Requirement) => {
    setRequirements((prev) => [...prev, newReq]);
    if (project) {
      setProject((prev) => prev ? ({
        ...prev,
        totalRequirements: prev.totalRequirements + 1,
      }) : null);
    }
  };

  const handleAppendDocumentData = (
    newReqs: Requirement[],
    newStories: UserStory[],
    newDiags: MermaidDiagramData[]
  ) => {
    setRequirements((prev) => [...prev, ...newReqs]);
    if (newStories.length > 0) {
      setUserStories((prev) => [...prev, ...newStories]);
    }
    if (newDiags.length > 0) {
      setDiagrams((prev) => [...prev, ...newDiags]);
    }
    if (project) {
      setProject((prev) => prev ? ({
        ...prev,
        totalRequirements: prev.totalRequirements + newReqs.length,
      }) : null);
    }
  };

  const handleLockBaseline = async () => {
    setIsLocked(true);
    if (project) {
      setProject((prev) => prev ? ({
        ...prev,
        status: "Baseline Locked",
        baselineLockedAt: new Date().toISOString(),
      }) : null);
    }

    await lockProjectBaseline(projectId);
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    success(
      "Baseline v1.0 Locked",
      "Cryptographic timestamp recorded. Scope Guard is now actively protecting this contract."
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Retrieving Specification</p>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Loading structured matrix & architecture from database...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 sm:p-12 text-center space-y-4 max-w-lg w-full shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Specification Not Found</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              The specification ID &quot;{projectId}&quot; does not exist in your database or was deleted.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/projects">
              <Button variant="secondary" size="sm" className="gap-2 text-xs font-semibold h-10 px-5 rounded-xl">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Projects Catalog</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview & Blueprint", icon: <FileText className="w-3.5 h-3.5" /> },
    { 
      id: "matrix", 
      label: "Requirement Matrix", 
      icon: <TableProperties className="w-3.5 h-3.5" />,
      badge: `${requirements.length}`
    },
    { 
      id: "stories", 
      label: "User Stories & Epics", 
      icon: <Layers className="w-3.5 h-3.5" />,
      badge: `${userStories.length}` 
    },
    { 
      id: "diagrams", 
      label: "Diagrams & C4", 
      icon: <Code2 className="w-3.5 h-3.5" />,
      badge: `${diagrams.length}` 
    },
    { 
      id: "scopeguard", 
      label: "Scope Guard™", 
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />,
      badge: project.driftHours > 0 ? `+${project.driftHours}h Drift` : undefined
    },
    { id: "export", label: "Export & Handoff", icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Top Project Header Card */}
      <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-2xl">{project.clientAvatar || "📁"}</span>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{project.name}</h1>
              {isLocked ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Baseline Locked ({project.baselineVersion})</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  <span>Scope Drift Active ({project.currentVersion})</span>
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Client: <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{project.clientName}</span> • Platform:{" "}
              <span className="text-sky-700 dark:text-sky-300 font-mono">{project.platform}</span>
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {clarifications.length > 0 && (
              <Link href={`/projects/${projectId}/clarify`}>
                <Button variant="secondary" size="sm" className="text-xs gap-1.5 border-orange-200 dark:border-orange-800/40 text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Clarifications ({clarifications.filter(c => c.status === "pending").length})</span>
                </Button>
              </Link>
            )}

            {!isLocked && (
              <Button
                variant="glow"
                size="sm"
                onClick={handleLockBaseline}
                className="text-xs gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign & Lock Baseline</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("export")}
              className="text-xs gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-xs gap-1.5 text-zinc-500 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="Delete Specification"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-zinc-100 dark:border-zinc-800/80 -mx-2 px-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0",
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/40"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded text-[10px] font-mono",
                      isActive
                        ? "bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-200"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW & BLUEPRINT ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Executive Scope Summary Card */}
          <Card className="p-6 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Executive Scope Summary</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {project.executiveSummary || project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Approved Scope Objectives</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {(project.scopeObjectives || []).map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Explicitly Out of Scope</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {(project.outOfScope || []).map((oos, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{oos}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Tech Stack Specs Card */}
          <Card className="p-6 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Architecture & Engineering Stack</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Locked for Implementation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Frontend Layer</span>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {project.techStack?.frontend || "React / Next.js / TypeScript"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Backend API</span>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {project.techStack?.backend || "Node.js (NestJS) + Fastify"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Architecture Pattern</span>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {project.techStack?.architecture || "Event-Driven Microservices"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: REQUIREMENT MATRIX ================= */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <RequirementTable
            requirements={requirements}
            onUpdateRequirement={handleUpdateRequirement}
            onAddRequirement={handleAddRequirement}
            onAppendDocument={handleAppendDocumentData}
            projectId={project.id}
            projectName={project.name}
          />
        </div>
      )}

      {/* ================= TAB 3: USER STORIES & EPICS ================= */}
      {activeTab === "stories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Agile User Stories & Acceptance Criteria</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Extracted from the requirement matrix for direct sprint planning and backlog import.
              </p>
            </div>
          </div>

          {userStories.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
              <Layers className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500">No user stories generated for this project yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userStories.map((us) => (
                <Card key={us.id} className="p-5 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
                        {us.code}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {us.storyPoints} Story Points
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{us.title}</h3>

                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                      <p><strong className="text-purple-600 dark:text-purple-400">As a</strong> {us.asA}</p>
                      <p><strong className="text-sky-600 dark:text-sky-400">I want</strong> {us.iWant}</p>
                      <p><strong className="text-emerald-600 dark:text-emerald-400">So that</strong> {us.soThat}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                      Scenarios:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {us.acceptanceCriteria.map((ac, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{ac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: DIAGRAMS (MERMAID.JS) ================= */}
      {activeTab === "diagrams" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Interactive C4 Architecture & Sequence Diagrams
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rendered live with Mermaid.js. Pan, zoom, inspect raw syntax, or export vectors.
              </p>
            </div>
          </div>

          {diagrams.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
              <Code2 className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500">No Mermaid architecture diagrams generated for this specification yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {diagrams.map((diag) => (
                <MermaidRenderer
                  key={diag.id}
                  code={diag.code}
                  title={diag.title}
                  badge={diag.badge}
                  description={diag.description}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: SCOPE GUARD™ ================= */}
      {activeTab === "scopeguard" && (
        <ScopeGuardView
          summary={scopeDiff?.summary || {
            baselineVersion: project.baselineVersion || "v1.0",
            baselineLockedDate: project.baselineLockedAt || new Date().toISOString(),
            currentVersion: project.currentVersion || "v1.0",
            currentRevisionDate: project.updatedAt || new Date().toISOString(),
            addedCount: scopeDiff?.items?.filter(i => i.type === "added").length || 0,
            removedCount: 0,
            modifiedCount: scopeDiff?.items?.filter(i => i.type === "modified").length || 0,
            totalRequirementsCount: project.totalRequirements || requirements.length,
            netHours: project.driftHours || 0,
            hourlyRate: 120,
            netCost: project.driftCost || 0,
            estimatedDaysDelay: Math.ceil((project.driftHours || 0) / 8),
            riskRating: project.driftHours > 20 ? "Severe Drift" : project.driftHours > 0 ? "Moderate Scope Expansion" : "Controlled / On Track"
          }}
          diffItems={scopeDiff?.items || []}
          projectName={project.name}
          clientName={project.clientName}
        />
      )}

      {/* ================= TAB 6: EXPORT ================= */}
      {activeTab === "export" && (
        <ExportPanel
          project={project}
          requirements={requirements}
          diagrams={diagrams}
        />
      )}

      {/* Confirmation Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Specification"
        description="Are you sure you want to permanently delete this project specification?"
        maxWidth="md"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1 text-xs">
            <p className="font-bold text-rose-900 dark:text-rose-200">
              {project?.name}
            </p>
            <p className="text-rose-700 dark:text-rose-300">
              Client: {project?.clientName} • {requirements.length} Requirements
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
              This will remove all associated user stories, diagrams, acceptance criteria, and baseline snapshots.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  await deleteProject(projectId);
                  success("Specification Deleted", `"${project.name}" has been permanently removed.`);
                  router.push("/projects");
                } catch (err) {
                  toastError("Delete Failed", "Could not delete specification.");
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

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-500">Loading project specification...</p>
      </div>
    }>
      <ProjectDetailContent />
    </Suspense>
  );
}
