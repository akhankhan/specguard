export type RequirementType = 
  | "Functional" 
  | "Non-Functional" 
  | "Security" 
  | "Integration" 
  | "Compliance";

export type RequirementPriority = 
  | "Critical" 
  | "High" 
  | "Medium" 
  | "Low";

export type RequirementStatus = 
  | "Confirmed by client" 
  | "Directly extracted" 
  | "AI-inferred" 
  | "Assumption" 
  | "Needs clarification" 
  | "Conflict detected";

export type ProjectStatus = 
  | "In Review" 
  | "Baseline Locked" 
  | "Scope Drift Detected" 
  | "Draft" 
  | "Approved";

export interface SourceExcerpt {
  text: string;
  documentName: string;
  pageNumber: number;
  paragraphNumber: number;
  confidenceScore: number;
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  code: string; // e.g. "REQ-AUTH-01"
  title: string;
  description: string;
  category: string; // "Authentication", "Payments", "KYC & Compliance", "Push Notifications", etc.
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
  sourceExcerpt: SourceExcerpt;
  acceptanceCriteria: AcceptanceCriterion[];
  technicalNotes?: string;
  estimatedHours: number;
  storyPoints: number;
  assignedEpic?: string;
  version: string;
  updatedAt: string;
}

export interface ClarificationQuestion {
  id: string;
  projectId: string;
  reqCode?: string;
  question: string;
  contextQuote: string;
  documentSource: string;
  whyItMatters: string;
  inputType: "single_select" | "multi_select" | "text" | "boolean";
  options?: string[];
  selectedAnswer?: string | string[];
  status: "pending" | "answered" | "skipped_assumption";
  assumptionIfSkipped: string;
  scopeImpactWarning?: string;
}

export interface UserStory {
  id: string;
  projectId?: string;
  code: string; // e.g. "US-04"
  epicTitle: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: RequirementPriority;
  mappedReqCodes: string[];
}

export interface MermaidDiagramData {
  id: string;
  projectId: string;
  title: string;
  type: "system_context" | "user_flow" | "architecture" | "erd";
  badge: string;
  description: string;
  code: string;
}

export interface ScopeDiffItem {
  id: string;
  type: "added" | "removed" | "modified";
  reqCode: string;
  title: string;
  category: string;
  oldDescription?: string;
  newDescription?: string;
  diffSummary: string;
  impactLevel: "Critical" | "High" | "Medium" | "Low";
  hoursImpact: number; // positive or negative
  costImpact: number;
  reasonForChange: string;
  affectedComponents: string[];
}

export interface ScopeGuardSummary {
  baselineVersion: string;
  baselineLockedDate: string;
  currentVersion: string;
  currentRevisionDate: string;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  totalRequirementsCount: number;
  netHours: number;
  hourlyRate: number;
  netCost: number;
  estimatedDaysDelay: number;
  riskRating: "Severe Drift" | "Moderate Scope Expansion" | "Controlled / On Track";
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientAvatar?: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  baselineVersion: string;
  currentVersion: string;
  baselineLockedAt?: string;
  totalRequirements: number;
  pendingClarifications: number;
  driftHours: number;
  driftCost: number;
  tags: string[];
  platform: string;
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    architecture: string;
  };
  executiveSummary: string;
  scopeObjectives: string[];
  outOfScope: string[];
}
