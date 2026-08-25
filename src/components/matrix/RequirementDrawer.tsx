"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Code2, 
  Copy, 
  Check, 
  AlertCircle,
  Hash,
  Layers
} from "lucide-react";
import { Requirement, RequirementStatus, RequirementPriority } from "@/lib/types";
import { Drawer, StatusBadge, PriorityBadge, TypeBadge, Button } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";

interface RequirementDrawerProps {
  requirement: Requirement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: Requirement) => void;
}

export function RequirementDrawer({
  requirement,
  isOpen,
  onClose,
  onSave,
}: RequirementDrawerProps) {
  const { success } = useToast();
  const [currentReq, setCurrentReq] = useState<Requirement | null>(requirement);
  const [copiedCriteria, setCopiedCriteria] = useState<boolean>(false);

  useEffect(() => {
    setCurrentReq(requirement);
  }, [requirement]);

  if (!currentReq) return null;

  const handleStatusChange = (newStatus: RequirementStatus) => {
    const updated: Requirement = {
      ...currentReq,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    setCurrentReq(updated);
    onSave?.(updated);
    success("Status Updated", `${updated.code} is now marked as "${newStatus}"`);
  };

  const handleCopyAcceptanceCriteria = async () => {
    const text = currentReq.acceptanceCriteria
      .map((ac, idx) => `Scenario ${idx + 1}:\nGiven ${ac.given}\nWhen ${ac.when}\nThen ${ac.then}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedCriteria(true);
    setTimeout(() => setCopiedCriteria(false), 2000);
    success("Copied to Clipboard", "Acceptance criteria copied in Gherkin format.");
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="xl"
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 font-bold">
            {currentReq.code}
          </span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {currentReq.title}
          </span>
        </div>
      }
      subtitle={
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <StatusBadge status={currentReq.status} />
          <PriorityBadge priority={currentReq.priority} />
          <TypeBadge type={currentReq.type} />
          <span className="text-zinc-400 dark:text-zinc-500">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-xs">{currentReq.category}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Full Requirement Statement */}
        <div className="space-y-2 bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Requirement Specification
          </label>
          <p className="text-sm text-zinc-800 dark:text-zinc-100 leading-relaxed font-normal">
            {currentReq.description}
          </p>
        </div>

        {/* Source Document Traceability Section */}
        <div className="space-y-3 bg-sky-50/80 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Source Document Citation & Offset</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50 font-medium">
              Confidence: {Math.round(currentReq.sourceExcerpt.confidenceScore * 100)}%
            </span>
          </div>

          <div className="text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950/80 p-3 rounded-lg border border-sky-200 dark:border-sky-900/40 relative shadow-xs">
            <div className="absolute top-2 right-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              Page {currentReq.sourceExcerpt.pageNumber}, Para {currentReq.sourceExcerpt.paragraphNumber}
            </div>
            <p className="italic text-sky-900 dark:text-sky-200/90 leading-relaxed pr-16">
              "{currentReq.sourceExcerpt.text}"
            </p>
            <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1 font-mono">
                📄 {currentReq.sourceExcerpt.documentName}
              </span>
              <span className="text-sky-600 dark:text-sky-400 text-[10px] font-medium">Direct Citation Match</span>
            </div>
          </div>
        </div>

        {/* Gherkin Acceptance Criteria */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Acceptance Criteria (Gherkin Format)</span>
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyAcceptanceCriteria}
              className="h-7 text-xs px-2.5"
            >
              {copiedCriteria ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied Gherkin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Gherkin</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {currentReq.acceptanceCriteria.map((ac, idx) => (
              <div
                key={ac.id || idx}
                className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-lg space-y-1.5 text-xs font-mono"
              >
                <div className="text-zinc-400 dark:text-zinc-500 font-semibold text-[11px] pb-1 border-b border-zinc-200 dark:border-zinc-900">
                  Scenario {idx + 1}
                </div>
                <p className="text-zinc-800 dark:text-zinc-300">
                  <strong className="text-purple-600 dark:text-purple-400">GIVEN </strong>
                  {ac.given}
                </p>
                <p className="text-zinc-800 dark:text-zinc-300">
                  <strong className="text-sky-600 dark:text-sky-400">WHEN </strong>
                  {ac.when}
                </p>
                <p className="text-zinc-800 dark:text-zinc-300">
                  <strong className="text-emerald-600 dark:text-emerald-400">THEN </strong>
                  {ac.then}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture Notes */}
        {currentReq.technicalNotes && (
          <div className="space-y-2 bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Technical & Engineering Notes</span>
            </label>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-900/80 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 leading-relaxed">
              {currentReq.technicalNotes}
            </p>
          </div>
        )}

        {/* Metadata & Estimates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              Estimated Effort
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {currentReq.estimatedHours} hours
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-zinc-400" />
              Story Points
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {currentReq.storyPoints} pts
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-zinc-400" />
              Assigned Epic
            </span>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
              {currentReq.assignedEpic || "Core"}
            </p>
          </div>
        </div>

        {/* Status Transition Selector */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Reviewer Status Action
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button
              variant={currentReq.status === "Confirmed by client" ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleStatusChange("Confirmed by client")}
            >
              Mark Client Confirmed
            </Button>
            <Button
              variant={currentReq.status === "Assumption" ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleStatusChange("Assumption")}
            >
              Tag as Assumption
            </Button>
            <Button
              variant={currentReq.status === "Needs clarification" ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleStatusChange("Needs clarification")}
            >
              Flag Clarification
            </Button>
            <Button
              variant={currentReq.status === "Conflict detected" ? "destructive" : "secondary"}
              size="sm"
              onClick={() => handleStatusChange("Conflict detected")}
            >
              Flag Conflict
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
