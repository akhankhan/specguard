import { createClient } from "@/lib/supabase/client";
import { 
  Project, 
  Requirement, 
  UserStory, 
  MermaidDiagramData, 
  ClarificationQuestion, 
  ScopeDiffItem, 
  ScopeGuardSummary 
} from "@/lib/types";

// Local Storage Keys
const LOCAL_PROJECTS_KEY = "specguard_projects_catalog";
const LOCAL_PROJECT_PREFIX = "specguard_project_";

// In-memory fast cache
let _inMemoryProjectsCache: Project[] | null = null;
let _lastProjectsFetchTime = 0;
const CACHE_TTL_MS = 20000; // 20s in-memory TTL

export function invalidateProjectsCache() {
  _inMemoryProjectsCache = null;
  _lastProjectsFetchTime = 0;
}

/**
 * Fetch all projects for the user with hybrid Supabase + Local Cache fallback
 */
export async function getUserProjects(forceRefresh = false): Promise<Project[]> {
  const now = Date.now();
  if (!forceRefresh && _inMemoryProjectsCache && (now - _lastProjectsFetchTime < CACHE_TTL_MS)) {
    return _inMemoryProjectsCache;
  }

  const localProjects: Project[] = [];
  
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_PROJECTS_KEY);
      if (stored) {
        localProjects.push(...JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Local storage read error:", e);
    }
  }

  // If we already have local projects, set memory cache immediately to prevent UI blocking
  if (localProjects.length > 0 && !_inMemoryProjectsCache) {
    _inMemoryProjectsCache = localProjects;
    _lastProjectsFetchTime = now;
  }

  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      _inMemoryProjectsCache = localProjects;
      _lastProjectsFetchTime = now;
      return localProjects;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error || !data || data.length === 0) {
      _inMemoryProjectsCache = localProjects;
      _lastProjectsFetchTime = now;
      return localProjects;
    }

    const supabaseProjects: Project[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      clientName: row.client_name,
      clientAvatar: row.client_avatar || "📁",
      description: row.description || "",
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      baselineVersion: row.baseline_version || "v1.0",
      currentVersion: row.current_version || "v1.0",
      baselineLockedAt: row.baseline_locked_at,
      totalRequirements: row.total_requirements || 0,
      pendingClarifications: row.pending_clarifications || 0,
      driftHours: Number(row.drift_hours) || 0,
      driftCost: Number(row.drift_cost) || 0,
      tags: row.tags || [],
      platform: row.platform || "Cross-Platform",
      techStack: row.tech_stack || {},
      executiveSummary: row.executive_summary || "",
      scopeObjectives: row.scope_objectives || [],
      outOfScope: row.out_of_scope || [],
    }));

    // Merge Supabase projects with any newly created local projects
    const idSet = new Set(supabaseProjects.map((p) => p.id));
    const merged = [...supabaseProjects, ...localProjects.filter((p) => !idSet.has(p.id))];
    
    _inMemoryProjectsCache = merged;
    _lastProjectsFetchTime = now;
    return merged;
  } catch (err) {
    console.warn("Using local projects catalog due to network/Supabase state:", err);
    _inMemoryProjectsCache = localProjects;
    _lastProjectsFetchTime = now;
    return localProjects;
  }
}

/**
 * Fetch a single project by ID with hybrid Supabase + Local Cache fallback
 */
export async function getProjectById(projectId: string): Promise<{
  project: Project | null;
  requirements: Requirement[];
  userStories: UserStory[];
  diagrams: MermaidDiagramData[];
  clarifications: ClarificationQuestion[];
  scopeDiff: { summary: ScopeGuardSummary; items: ScopeDiffItem[] } | null;
}> {
  // Check local cache first as fallback
  let localData: any = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${LOCAL_PROJECT_PREFIX}${projectId}`);
      if (stored) {
        localData = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Local project cache read error:", e);
    }
  }

  try {
    const supabase = createClient();

    // Query Supabase for the project
    const { data: projectRow, error: pError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (pError || !projectRow) {
      if (localData) {
        return localData;
      }
      return { project: null, requirements: [], userStories: [], diagrams: [], clarifications: [], scopeDiff: null };
    }

    const project: Project = {
      id: projectRow.id,
      name: projectRow.name,
      clientName: projectRow.client_name,
      clientAvatar: projectRow.client_avatar || "📁",
      description: projectRow.description || "",
      status: projectRow.status,
      createdAt: projectRow.created_at,
      updatedAt: projectRow.updated_at,
      baselineVersion: projectRow.baseline_version || "v1.0",
      currentVersion: projectRow.current_version || "v1.0",
      baselineLockedAt: projectRow.baseline_locked_at,
      totalRequirements: projectRow.total_requirements || 0,
      pendingClarifications: projectRow.pending_clarifications || 0,
      driftHours: Number(projectRow.drift_hours) || 0,
      driftCost: Number(projectRow.drift_cost) || 0,
      tags: projectRow.tags || [],
      platform: projectRow.platform || "Web & Mobile",
      techStack: projectRow.tech_stack || {},
      executiveSummary: projectRow.executive_summary || "",
      scopeObjectives: projectRow.scope_objectives || [],
      outOfScope: projectRow.out_of_scope || [],
    };

    // Parallel fetch related tables
    const [reqsRes, storiesRes, diagRes, clarifyRes, diffRes] = await Promise.all([
      supabase.from("requirements").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("user_stories").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("diagrams").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("clarifications").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("scope_diffs").select("*").eq("project_id", projectId).maybeSingle(),
    ]);

    const requirements: Requirement[] = (reqsRes.data || []).map((r: any) => ({
      id: r.id,
      projectId: r.project_id,
      code: r.code,
      title: r.title,
      description: r.description,
      category: r.category,
      type: r.type,
      priority: r.priority,
      status: r.status,
      sourceExcerpt: r.source_excerpt || {},
      acceptanceCriteria: r.acceptance_criteria || [],
      technicalNotes: r.technical_notes,
      estimatedHours: Number(r.estimated_hours) || 8,
      storyPoints: r.story_points || 3,
      assignedEpic: r.assigned_epic,
      version: r.version || "v1.0",
      updatedAt: r.updated_at,
    }));

    const userStories: UserStory[] = (storiesRes.data || []).map((s: any) => ({
      id: s.id,
      projectId: s.project_id,
      code: s.code,
      epicTitle: s.epic_title,
      title: s.title,
      asA: s.as_a,
      iWant: s.i_want,
      soThat: s.so_that,
      acceptanceCriteria: s.acceptance_criteria || [],
      storyPoints: s.story_points || 3,
      priority: s.priority,
      mappedReqCodes: s.mapped_req_codes || [],
    }));

    const diagrams: MermaidDiagramData[] = (diagRes.data || []).map((d: any) => ({
      id: d.id,
      projectId: d.project_id,
      title: d.title,
      type: d.type,
      badge: d.badge || "C4 Model",
      description: d.description || "",
      code: d.code,
    }));

    const clarifications: ClarificationQuestion[] = (clarifyRes.data || []).map((c: any) => ({
      id: c.id,
      projectId: c.project_id,
      reqCode: c.req_code,
      question: c.question,
      contextQuote: c.context_quote || "",
      documentSource: c.document_source || "",
      whyItMatters: c.why_it_matters || "",
      inputType: c.input_type || "single_select",
      options: c.options || [],
      selectedAnswer: c.selected_answer,
      status: c.status || "pending",
      assumptionIfSkipped: c.assumption_if_skipped || "",
      scopeImpactWarning: c.scope_impact_warning,
    }));

    let scopeDiff = null;
    if (diffRes.data) {
      scopeDiff = {
        summary: diffRes.data.summary,
        items: diffRes.data.items || [],
      };
    }

    // Save to local cache as backup
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `${LOCAL_PROJECT_PREFIX}${projectId}`,
          JSON.stringify({ project, requirements, userStories, diagrams, clarifications, scopeDiff })
        );
      } catch (e) {}
    }

    return {
      project,
      requirements,
      userStories,
      diagrams,
      clarifications,
      scopeDiff,
    };
  } catch (err) {
    if (localData) {
      return localData;
    }
    return {
      project: null,
      requirements: [],
      userStories: [],
      diagrams: [],
      clarifications: [],
      scopeDiff: null,
    };
  }
}

/**
 * Lock Baseline for a project (v1.0 approved)
 */
export async function lockProjectBaseline(projectId: string): Promise<boolean> {
  // Update local cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${LOCAL_PROJECT_PREFIX}${projectId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.project) {
          parsed.project.status = "Baseline Locked";
          parsed.project.baselineLockedAt = new Date().toISOString();
          localStorage.setItem(`${LOCAL_PROJECT_PREFIX}${projectId}`, JSON.stringify(parsed));
        }
      }
    } catch (e) {}
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        status: "Baseline Locked",
        baseline_locked_at: new Date().toISOString(),
        baseline_version: "v1.0",
        current_version: "v1.0",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return !error;
  } catch (err) {
    return true; // cached locally
  }
}

/**
 * Answer a clarification question
 */
export async function answerClarificationQuestion(
  questionId: string, 
  answer: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase
      .from("clarifications")
      .update({
        selected_answer: answer,
        status: "answered",
        updated_at: new Date().toISOString(),
      })
      .eq("id", questionId);

    return true;
  } catch (err) {
    return true;
  }
}

/**
 * Save complete AI Blueprint (Project, Requirements, Stories, Diagrams, Clarifications)
 * into both Persistent Local Storage Cache & Supabase PostgreSQL
 */
export async function saveAIProjectToSupabase(
  projectId: string,
  aiData: any,
  meta: {
    projectName: string;
    clientName: string;
    platform: string;
    architecture: string;
    frontendStack: string;
    backendStack: string;
    briefText?: string;
  }
): Promise<boolean> {
  const newProject: Project = {
    id: projectId,
    name: meta.projectName || "Untitled Software Spec",
    clientName: meta.clientName || "Client Partner LLC",
    clientAvatar: "⚡",
    description: aiData?.executiveSummary || (meta.briefText ? meta.briefText.substring(0, 160) + "..." : ""),
    status: "In Review",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    baselineVersion: "v1.0",
    currentVersion: "v1.0",
    totalRequirements: aiData?.requirements?.length || 0,
    pendingClarifications: aiData?.clarifications?.length || 0,
    driftHours: 0,
    driftCost: 0,
    tags: aiData?.tags || ["AI-Extracted", meta.platform, meta.architecture],
    platform: meta.platform,
    techStack: {
      frontend: meta.frontendStack || "React / TypeScript",
      backend: meta.backendStack || "Node.js (NestJS)",
      database: "PostgreSQL 16",
      hosting: "Cloudflare Edge & AWS",
      architecture: meta.architecture || "Microservices",
    },
    executiveSummary: aiData?.executiveSummary || "",
    scopeObjectives: aiData?.scopeObjectives || [],
    outOfScope: aiData?.outOfScope || [],
  };

  const requirements: Requirement[] = (aiData?.requirements || []).map((r: any, idx: number) => ({
    id: `req-${projectId}-${idx}`,
    projectId: projectId,
    code: r.code || `REQ-${String(idx + 1).padStart(2, "0")}`,
    title: r.title,
    description: r.description,
    category: r.category || "Core Functionality",
    type: r.type || "Functional",
    priority: r.priority || "High",
    status: r.status || "Directly extracted",
    sourceExcerpt: r.sourceExcerpt || {},
    acceptanceCriteria: r.acceptanceCriteria || [],
    estimatedHours: r.estimatedHours || 8,
    storyPoints: r.storyPoints || 3,
    version: "v1.0",
  }));

  const userStories: UserStory[] = (aiData?.userStories || []).map((s: any, idx: number) => ({
    id: `story-${projectId}-${idx}`,
    projectId: projectId,
    code: s.code || `US-${String(idx + 1).padStart(2, "0")}`,
    epicTitle: s.epicTitle || "Core Scope",
    title: s.title,
    asA: s.asA || "User",
    iWant: s.iWant,
    soThat: s.soThat,
    acceptanceCriteria: s.acceptanceCriteria || [],
    storyPoints: s.storyPoints || 3,
    priority: s.priority || "High",
    mappedReqCodes: s.mappedReqCodes || [],
  }));

  const clarifications: ClarificationQuestion[] = (aiData?.clarifications || []).map((c: any, idx: number) => ({
    id: `clarify-${projectId}-${idx}`,
    projectId: projectId,
    question: c.question,
    contextQuote: c.contextQuote || "",
    documentSource: c.documentSource || "Client Brief",
    whyItMatters: c.whyItMatters || "Architecture & scope decision",
    inputType: c.inputType || "single_select",
    options: c.options || [],
    status: "pending",
    assumptionIfSkipped: c.assumptionIfSkipped || "Standard implementation assumption",
    scopeImpactWarning: c.scopeImpactWarning || null,
  }));

  const diagrams: MermaidDiagramData[] = (aiData?.diagrams || []).map((d: any, idx: number) => ({
    id: `diag-${projectId}-${idx}`,
    projectId: projectId,
    title: d.title,
    type: d.type || "system_context",
    badge: d.badge || "C4 Model",
    description: d.description || "",
    code: d.code,
  }));

  // 1. SAVE TO LOCAL STORAGE CACHE (INSTANT AVAILABILITY)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `${LOCAL_PROJECT_PREFIX}${projectId}`,
        JSON.stringify({
          project: newProject,
          requirements,
          userStories,
          diagrams,
          clarifications,
          scopeDiff: null,
        })
      );

      const existingCatalog = JSON.parse(localStorage.getItem(LOCAL_PROJECTS_KEY) || "[]");
      const filtered = existingCatalog.filter((p: any) => p.id !== projectId);
      filtered.unshift(newProject);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn("Local storage cache write error:", e);
    }
  }

  // 2. ATTEMPT SUPABASE POSTGRESQL INSERT
  try {
    const supabase = createClient();
    let { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user || null;
    }

    if (user) {
      await supabase.from("projects").upsert({
        id: projectId,
        user_id: user.id,
        name: newProject.name,
        client_name: newProject.clientName,
        client_avatar: newProject.clientAvatar,
        description: newProject.description,
        status: newProject.status,
        baseline_version: newProject.baselineVersion,
        current_version: newProject.currentVersion,
        total_requirements: newProject.totalRequirements,
        pending_clarifications: newProject.pendingClarifications,
        drift_hours: 0,
        drift_cost: 0,
        tags: newProject.tags,
        platform: newProject.platform,
        tech_stack: newProject.techStack,
        executive_summary: newProject.executiveSummary,
        scope_objectives: newProject.scopeObjectives,
        out_of_scope: newProject.outOfScope,
        updated_at: new Date().toISOString(),
      });

      if (requirements.length > 0) {
        const reqRows = requirements.map((r) => ({
          project_id: projectId,
          user_id: user.id,
          code: r.code,
          title: r.title,
          description: r.description,
          category: r.category,
          type: r.type,
          priority: r.priority,
          status: r.status,
          source_excerpt: r.sourceExcerpt,
          acceptance_criteria: r.acceptanceCriteria,
          estimated_hours: r.estimatedHours,
          story_points: r.storyPoints,
          version: r.version,
        }));
        await supabase.from("requirements").insert(reqRows);
      }

      if (userStories.length > 0) {
        const storyRows = userStories.map((s) => ({
          project_id: projectId,
          user_id: user.id,
          code: s.code,
          epic_title: s.epicTitle,
          title: s.title,
          as_a: s.asA,
          i_want: s.iWant,
          so_that: s.soThat,
          acceptance_criteria: s.acceptanceCriteria,
          story_points: s.storyPoints,
          priority: s.priority,
          mapped_req_codes: s.mappedReqCodes,
        }));
        await supabase.from("user_stories").insert(storyRows);
      }

      if (clarifications.length > 0) {
        const clarifyRows = clarifications.map((c) => ({
          project_id: projectId,
          user_id: user.id,
          question: c.question,
          context_quote: c.contextQuote,
          document_source: c.documentSource,
          why_it_matters: c.whyItMatters,
          input_type: c.inputType,
          options: c.options,
          status: "pending",
          assumption_if_skipped: c.assumptionIfSkipped,
          scope_impact_warning: c.scopeImpactWarning,
        }));
        await supabase.from("clarifications").insert(clarifyRows);
      }

      if (diagrams.length > 0) {
        const diagRows = diagrams.map((d) => ({
          project_id: projectId,
          user_id: user.id,
          title: d.title,
          type: d.type,
          badge: d.badge,
          description: d.description,
          code: d.code,
        }));
        await supabase.from("diagrams").insert(diagRows);
      }
    }
  } catch (dbErr) {
    console.warn("Supabase insert skipped (hybrid storage active):", dbErr);
  }

  return true;
}

/**
 * Delete a project and all associated records from both local cache and Supabase
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  // 1. Remove from local storage
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`${LOCAL_PROJECT_PREFIX}${projectId}`);
      const stored = localStorage.getItem(LOCAL_PROJECTS_KEY);
      if (stored) {
        const catalog: Project[] = JSON.parse(stored);
        const updated = catalog.filter((p) => p.id !== projectId);
        localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Local storage deletion error:", e);
    }
  }

  // 2. Invalidate in-memory cache
  invalidateProjectsCache();

  // 3. Remove from Supabase
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await Promise.all([
        supabase.from("requirements").delete().eq("project_id", projectId),
        supabase.from("user_stories").delete().eq("project_id", projectId),
        supabase.from("diagrams").delete().eq("project_id", projectId),
        supabase.from("clarifications").delete().eq("project_id", projectId),
        supabase.from("scope_diffs").delete().eq("project_id", projectId),
        supabase.from("projects").delete().eq("id", projectId).eq("user_id", session.user.id),
      ]);
    }
  } catch (err) {
    console.warn("Supabase deletion warning:", err);
  }

  return true;
}
