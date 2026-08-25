"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Send, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { Modal, Button, Textarea } from "@/lib/ui-index";
import { ScopeGuardSummary, ScopeDiffItem } from "@/lib/types";
import { generateChangeOrderText } from "@/lib/change-request-template";
import { useToast } from "@/components/ui/Toast";

interface ChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ScopeGuardSummary;
  diffItems: ScopeDiffItem[];
  projectName: string;
  clientName: string;
}

export function ChangeRequestModal({
  isOpen,
  onClose,
  summary,
  diffItems,
  projectName,
  clientName,
}: ChangeRequestModalProps) {
  const { success } = useToast();
  const [copied, setCopied] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>(
    "Please note that the listed timeline adjustments (+5 business days) will shift the Stage 2 Staging deployment from September 10 to September 17, 2026."
  );

  const memoText = generateChangeOrderText({
    changeOrderNumber: "CR-2026-08-04",
    projectName,
    clientName,
    agencyName: "Apex Digital Product Studio",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    summary,
    diffItems,
    customNote: customNotes,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    success("Change Order Copied", "Client-ready scope change notice copied to clipboard.");
  };

  const handleDownloadPdf = () => {
    const element = document.createElement("a");
    const file = new Blob([memoText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Change-Order-CR-2026-08-04-${projectName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    success("Downloaded Notice", "Change request specification exported successfully.");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Generate Change-Request Notice #CR-2026-08-04
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Formal, airtight scope change memorandum ready to email or attach for {clientName}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Quick Highlights Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-950/80 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Net Billable Hours</span>
            <p className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
              +{summary.netHours} hrs
            </p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Total Adjustment</span>
            <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              +${summary.netCost.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Timeline Variance</span>
            <p className="text-base font-bold font-mono text-sky-600 dark:text-sky-400">
              +{summary.estimatedDaysDelay} business days
            </p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Scope Items Changed</span>
            <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-200">
              {diffItems.length} items
            </p>
          </div>
        </div>

        {/* Custom Agency Notes Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Additional Agency Notes & Context (Optional)
          </label>
          <Textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="text-xs h-16 font-sans bg-zinc-50 dark:bg-zinc-950"
            placeholder="Add special notes or milestone adjustments..."
          />
        </div>

        {/* Live Memo Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Formal Memorandum Preview
            </label>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">Plaintext / PDF formatted</span>
          </div>
          <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-xl p-4 max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
            {memoText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
              <Download className="w-3.5 h-3.5" />
              <span>Download Text/PDF</span>
            </Button>
            <Button variant="glow" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                  <span>Copied Notice</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Change Order</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
