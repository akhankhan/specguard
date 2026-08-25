"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { ScopeGuardSummary, ScopeDiffItem } from "@/lib/types";
import { Button, Card } from "@/lib/ui-index";
import { ChangeRequestModal } from "./ChangeRequestModal";
import { WhatsAppAnalyzerModal } from "./WhatsAppAnalyzerModal";
import { cn, formatCurrency } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ScopeGuardViewProps {
  summary: ScopeGuardSummary;
  diffItems: ScopeDiffItem[];
  projectName: string;
  clientName: string;
}

export function ScopeGuardView({
  summary,
  diffItems,
  projectName,
  clientName,
}: ScopeGuardViewProps) {
  const [filterType, setFilterType] = useState<"ALL" | "added" | "modified" | "removed">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = diffItems.filter(
    (item) => filterType === "ALL" || item.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Version Comparison & Lock Baseline */}
      <div className="bg-gradient-to-r from-zinc-50 via-white to-sky-50/40 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Scope Drift Active</span>
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Comparing against approved baseline
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-2">
              <span>{summary.baselineVersion}</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <span className="text-sky-600 dark:text-sky-400">{summary.currentVersion}</span>
            </h2>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
              SpecGuard detected unapproved scope expansion from incoming client emails and revisions. 
              Review the variance below before developers start unpaid work.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsWhatsAppOpen(true)}
              className="gap-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Analyze Client WhatsApp</span>
            </Button>

            <Button
              variant="glow"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 shadow-sky-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Change-Request Notice</span>
            </Button>
          </div>
        </div>

        {/* 4 KPI Impact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          {/* Net Hours */}
          <div className="bg-white dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Net Engineering Impact
            </span>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              +{summary.netHours} hrs
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              +{summary.addedCount + summary.modifiedCount} tasks added / revised
            </p>
          </div>

          {/* Commercial Variance */}
          <div className="bg-white dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Unbilled Financial Variance
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(summary.netCost)}
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              @ {formatCurrency(summary.hourlyRate)}/hr blended rate
            </p>
          </div>

          {/* Delivery Delay */}
          <div className="bg-white dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Milestone Shift
            </span>
            <div className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
              +{summary.estimatedDaysDelay} days
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Target delivery pushed by 1 sprint
            </p>
          </div>

          {/* Risk Level */}
          <div className="bg-white dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 space-y-1 shadow-xs">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Drift Risk Rating
            </span>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {summary.riskRating}
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Requires formal sign-off
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setFilterType("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-md font-medium transition-colors",
              filterType === "ALL"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            All Changes ({diffItems.length})
          </button>
          <button
            onClick={() => setFilterType("added")}
            className={cn(
              "px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5",
              filterType === "added"
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            )}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Additions ({diffItems.filter((i) => i.type === "added").length})</span>
          </button>
          <button
            onClick={() => setFilterType("modified")}
            className={cn(
              "px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5",
              filterType === "modified"
                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-400"
            )}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Modifications ({diffItems.filter((i) => i.type === "modified").length})</span>
          </button>
          <button
            onClick={() => setFilterType("removed")}
            className={cn(
              "px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5",
              filterType === "removed"
                ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-rose-700 dark:hover:text-rose-400"
            )}
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Deprecated ({diffItems.filter((i) => i.type === "removed").length})</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono">
          Showing {filteredItems.length} diff items
        </span>
      </div>

      {/* Diff List */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;

          const typeStyles = {
            added: {
              border: "border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400",
              badgeBg: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60",
              label: "+ ADDED IN REVISION",
              icon: <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
            },
            modified: {
              border: "border-amber-300 dark:border-amber-500/30 hover:border-amber-400",
              badgeBg: "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800/60",
              label: "~ SCOPE MODIFICATION",
              icon: <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
            },
            removed: {
              border: "border-rose-300 dark:border-rose-500/30 hover:border-rose-400",
              badgeBg: "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-800/60",
              label: "- REMOVED / DEPRECATED",
              icon: <MinusCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
            },
          }[item.type];

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border bg-white dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden transition-all shadow-xs",
                typeStyles.border
              )}
            >
              {/* Diff Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {typeStyles.icon}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-semibold border uppercase tracking-wider",
                          typeStyles.badgeBg
                        )}
                      >
                        {typeStyles.label}
                      </span>
                      <span className="font-mono text-xs font-semibold text-sky-700 dark:text-sky-400">
                        {item.reqCode}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">•</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{item.diffSummary}</p>
                  </div>
                </div>

                {/* Right side cost & impact */}
                <div className="flex items-center gap-3 self-end md:self-center pl-7 md:pl-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-200">
                      {item.hoursImpact > 0 ? `+${item.hoursImpact} hrs` : `${item.hoursImpact} hrs`}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {item.costImpact > 0 ? `+${formatCurrency(item.costImpact)}` : formatCurrency(item.costImpact)}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-zinc-400 transition-transform duration-200",
                      isExpanded && "rotate-90 text-zinc-700 dark:text-zinc-200"
                    )}
                  />
                </div>
              </div>

              {/* Expanded Diff Detail */}
              {isExpanded && (
                <div className="p-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60 space-y-4 text-xs">
                  {/* Before vs After comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {item.oldDescription && (
                      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          Baseline Spec ({summary.baselineVersion})
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-300 line-through decoration-zinc-400">
                          {item.oldDescription}
                        </p>
                      </div>
                    )}

                    {item.newDescription && (
                      <div className="bg-sky-50/80 dark:bg-zinc-900/90 border border-sky-200 dark:border-sky-900/40 p-3 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                          New Revision Spec ({summary.currentVersion})
                        </span>
                        <p className="text-sky-950 dark:text-sky-100 font-medium">{item.newDescription}</p>
                      </div>
                    )}
                  </div>

                  {/* Rationale & Affected components */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-200/80 dark:border-zinc-900">
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <strong className="text-zinc-800 dark:text-zinc-300">Trigger Rationale: </strong>
                      {item.reasonForChange}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-zinc-500">Affected:</span>
                      {item.affectedComponents.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-mono"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Change Request Notice Generator Modal */}
      <ChangeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={summary}
        diffItems={diffItems}
        projectName={projectName}
        clientName={clientName}
      />

      {/* WhatsApp Message Scope Creep Analyzer Modal */}
      <WhatsAppAnalyzerModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        project={{
          id: "temp",
          name: projectName,
          clientName: clientName,
          clientAvatar: "📁",
          description: "Active client contract baseline scope",
          status: "Scope Drift Detected",
          baselineVersion: summary.baselineVersion,
          currentVersion: summary.currentVersion,
          driftHours: summary.netHours,
          driftCost: summary.netCost,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalRequirements: 11,
          pendingClarifications: 0,
          tags: ["Fleet", "Mobile"],
          platform: "Flutter",
          techStack: {
            frontend: "Flutter",
            backend: "Node.js",
            database: "PostgreSQL",
            hosting: "AWS",
            architecture: "Microservices"
          },
          executiveSummary: "Active contract specification",
          scopeObjectives: [],
          outOfScope: []
        }}
      />
    </div>
  );
}
