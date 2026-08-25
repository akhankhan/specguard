"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowUpDown, 
  FileText, 
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  UploadCloud
} from "lucide-react";
import { Requirement, RequirementStatus, RequirementPriority, RequirementType, UserStory, MermaidDiagramData } from "@/lib/types";
import { StatusBadge, PriorityBadge, TypeBadge, Input, Button } from "@/lib/ui-index";
import { RequirementDrawer } from "./RequirementDrawer";
import { AddRequirementModal } from "./AddRequirementModal";
import { AppendDocumentModal } from "./AppendDocumentModal";
import { cn } from "@/lib/utils";

interface RequirementTableProps {
  requirements: Requirement[];
  onUpdateRequirement?: (updated: Requirement) => void;
  onAddRequirement?: (newReq: Requirement) => void;
  onAppendDocument?: (newReqs: Requirement[], newStories: UserStory[], newDiagrams: MermaidDiagramData[]) => void;
  projectId?: string;
  projectName?: string;
}

export function RequirementTable({
  requirements,
  onUpdateRequirement,
  onAddRequirement,
  onAppendDocument,
  projectId = "",
  projectName = "Project Specification",
}: RequirementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"code" | "priority" | "status" | "hours">("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeReq, setActiveReq] = useState<Requirement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAppendModalOpen, setIsAppendModalOpen] = useState(false);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set(requirements.map((r) => r.category));
    return Array.from(set);
  }, [requirements]);

  // Filter and sort logic
  const filteredRequirements = useMemo(() => {
    return requirements.filter((r) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "ALL" || r.status === selectedStatus;
      const matchesPriority = selectedPriority === "ALL" || r.priority === selectedPriority;
      const matchesType = selectedType === "ALL" || r.type === selectedType;
      const matchesCategory = selectedCategory === "ALL" || r.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesCategory;
    }).sort((a, b) => {
      const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      if (sortField === "priority") {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortDirection === "asc" ? diff : -diff;
      }
      if (sortField === "code") {
        return sortDirection === "asc"
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      }
      if (sortField === "hours") {
        return sortDirection === "asc"
          ? a.estimatedHours - b.estimatedHours
          : b.estimatedHours - a.estimatedHours;
      }
      if (sortField === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, [
    requirements,
    searchQuery,
    selectedStatus,
    selectedPriority,
    selectedType,
    selectedCategory,
    sortField,
    sortDirection,
  ]);

  const toggleSort = (field: "code" | "priority" | "status" | "hours") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs transition-colors">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by ID, requirement, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="bg-zinc-50 dark:bg-zinc-950/80"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Statuses ({requirements.length})</option>
            <option value="Confirmed by client">Confirmed by client</option>
            <option value="Directly extracted">Directly extracted</option>
            <option value="AI-inferred">AI-inferred</option>
            <option value="Assumption">Assumption</option>
            <option value="Needs clarification">Needs clarification</option>
            <option value="Conflict detected">Conflict detected</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Types</option>
            <option value="Functional">Functional</option>
            <option value="Non-Functional">Non-Functional</option>
            <option value="Security">Security</option>
            <option value="Integration">Integration</option>
            <option value="Compliance">Compliance</option>
          </select>

          {/* Reset button if filtered */}
          {(selectedStatus !== "ALL" ||
            selectedPriority !== "ALL" ||
            selectedType !== "ALL" ||
            selectedCategory !== "ALL" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("ALL");
                setSelectedPriority("ALL");
                setSelectedType("ALL");
                setSelectedCategory("ALL");
              }}
              className="text-sky-600 dark:text-sky-400 hover:underline px-2 py-1 font-medium"
            >
              Reset
            </button>
          )}

          {/* New Add Actions Group */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAppendModalOpen(true)}
              className="text-xs gap-1.5 h-8 px-2.5 font-semibold text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100"
              title="Upload another PDF / DOCX or paste text to add more requirements"
            >
              <UploadCloud className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Append Doc / Addendum</span>
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs gap-1.5 h-8 px-3 font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
        <span>
          Showing <strong className="text-zinc-900 dark:text-zinc-200">{filteredRequirements.length}</strong> of{" "}
          <strong className="text-zinc-900 dark:text-zinc-200">{requirements.length}</strong> requirements
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {requirements.filter((r) => r.status === "Needs clarification").length} Pending Clarifications
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {requirements.filter((r) => r.status === "Conflict detected").length} Conflicts
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-800 dark:text-zinc-200">
            <thead className="bg-zinc-50 dark:bg-zinc-950/80 text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th
                  onClick={() => toggleSort("code")}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-[140px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 min-w-[320px]">Requirement</th>
                <th className="py-3.5 px-4 w-[130px]">Type</th>
                <th
                  onClick={() => toggleSort("priority")}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-[110px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 w-[175px]">Source Citation</th>
                <th
                  onClick={() => toggleSort("status")}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-[155px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("hours")}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-[90px]"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Est.</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/60 font-normal">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <p className="text-sm font-medium">No matching requirements found.</p>
                    <p className="text-xs text-zinc-400 mt-1">Try relaxing your search terms or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRequirements.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setActiveReq(req)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:text-sky-500 dark:group-hover:text-sky-300">
                      {req.code}
                    </td>

                    {/* Requirement statement & category */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-white transition-colors">
                            {req.title}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          {req.description}
                        </p>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <TypeBadge type={req.type} />
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <PriorityBadge priority={req.priority} />
                    </td>

                    {/* Source Citation */}
                    <td className="py-3 px-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReq(req);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-300 hover:border-sky-400 dark:hover:border-sky-700 transition-colors shadow-2xs"
                        title={req.sourceExcerpt?.text || "Source Document Citation"}
                      >
                        <FileText className="w-3 h-3 text-sky-500 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          Page {req.sourceExcerpt?.pageNumber || 1} • Sec {req.sourceExcerpt?.paragraphNumber || 1}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-4 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {req.estimatedHours}h
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <RequirementDrawer
        requirement={activeReq}
        isOpen={Boolean(activeReq)}
        onClose={() => setActiveReq(null)}
        onSave={(updated) => {
          onUpdateRequirement?.(updated);
          setActiveReq(updated);
        }}
      />

      {/* Manual Add Requirement Modal */}
      <AddRequirementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={projectId}
        existingCount={requirements.length}
        onAdd={(newReq) => {
          onAddRequirement?.(newReq);
        }}
      />

      {/* Append Document / Addendum Modal */}
      <AppendDocumentModal
        isOpen={isAppendModalOpen}
        onClose={() => setIsAppendModalOpen(false)}
        projectId={projectId}
        projectName={projectName}
        existingCount={requirements.length}
        onAppendData={(newReqs, newStories, newDiags) => {
          onAppendDocument?.(newReqs, newStories, newDiags);
        }}
      />
    </div>
  );
}
