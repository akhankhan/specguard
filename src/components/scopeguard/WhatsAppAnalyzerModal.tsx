"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Bot,
  Zap,
  PhoneCall
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Textarea, Card } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { Project, Requirement } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

interface WhatsAppAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  requirements?: Requirement[];
  onApplyChangeOrder?: (changeItem: any) => void;
}

const SAMPLE_CLIENT_MESSAGES = [
  {
    title: "Flight Radar & WhatsApp Invoicing",
    icon: "✈️",
    message: "Bhai driver jab Dubai International Airport (DXB) par ho to app mein live flight tracking show honi chahiye aur passenger ko automated WhatsApp invoice PDF send ho jaye, bilkul simple sa add-on hai.",
  },
  {
    title: "Apple Pay & Stripe Biometrics",
    icon: "💳",
    message: "Hi team, we want to allow VIP corporate clients to pay directly with Apple Pay and Touch ID inside the mobile app. Can we include this in the upcoming milestone?",
  },
  {
    title: "Salik Toll Auto-Recharge API",
    icon: "🚗",
    message: "We need the app to automatically detect Salik toll gates via GPS and auto-recharge the balance when it drops below AED 50.",
  },
];

export function WhatsAppAnalyzerModal({
  isOpen,
  onClose,
  project,
  requirements = [],
  onApplyChangeOrder,
}: WhatsAppAnalyzerModalProps) {
  const { success, error: toastError } = useToast();
  const [clientMessage, setClientMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [copiedReply, setCopiedReply] = useState(false);

  const handleAnalyze = async () => {
    if (!clientMessage.trim()) {
      toastError("Message Required", "Please paste or select a client message first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/ai/analyze-client-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clientMessage.trim(),
          projectName: project?.name || "Drive Safe Limousine LLC",
          clientName: project?.clientName || "Fleet Client",
          baselineRequirements: requirements,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
        success("Analysis Complete", "Scope variance & diplomatic reply generated.");
      } else {
        toastError("Analysis Error", json.error || "Failed to analyze message");
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      toastError("Analysis Error", "Network error while analyzing scope.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReply = async () => {
    if (!analysisResult?.diplomaticWhatsAppReply) return;
    await navigator.clipboard.writeText(analysisResult.diplomaticWhatsAppReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
    success("Copied to Clipboard", "Ready to paste directly into WhatsApp or Email.");
  };

  const handleApply = () => {
    if (!analysisResult) return;
    onApplyChangeOrder?.(analysisResult);
    success("Change Request Recorded", "Added to project Scope Guard unbilled variance.");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client WhatsApp / Email Scope Creep Analyzer"
      description="Cross-reference incoming client messages against your locked Baseline Specification (v1.0)"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Input Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Paste Client Message / Audio Transcript</span>
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              Target Project: <strong className="text-sky-600 dark:text-sky-400">{project?.name || "Active Project"}</strong>
            </span>
          </div>

          <Textarea
            rows={4}
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            placeholder="Paste client's WhatsApp text, voice note transcript, or email here (e.g. 'Can we also add flight radar tracking and Apple Pay?')..."
            className="text-xs font-sans bg-zinc-50 dark:bg-zinc-950/80 resize-none"
          />

          {/* Quick 1-Click Samples */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Or test with a sample client request:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CLIENT_MESSAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setClientMessage(sample.message)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{sample.icon}</span>
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="glow"
              size="sm"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              className="gap-2 text-xs font-semibold px-4 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Scope Drift with AI</span>
            </Button>
          </div>
        </div>

        {/* AI Analysis Result Section */}
        {analysisResult && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Verdict Header Banner */}
            <div className={cn(
              "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3",
              analysisResult.verdict === "OUT_OF_SCOPE"
                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
                : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold",
                  analysisResult.verdict === "OUT_OF_SCOPE"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-emerald-600 text-white shadow-xs"
                )}>
                  {analysisResult.verdict === "OUT_OF_SCOPE" ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {analysisResult.verdict === "OUT_OF_SCOPE" ? "🔴 Out-of-Scope Drift Detected" : "🟢 Covered in Baseline"}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      ({Math.round(analysisResult.confidenceScore * 100)}% Confidence)
                    </span>
                  </div>
                  <p className="text-xs opacity-90 font-medium">{analysisResult.title}</p>
                </div>
              </div>

              {/* Added Metrics */}
              <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-amber-600 dark:text-amber-400">
                  +{analysisResult.estimatedHours}h Dev Effort
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-emerald-600 dark:text-emerald-400">
                  +${analysisResult.recommendedPriceUSD} / AED {analysisResult.recommendedPriceAED}
                </span>
              </div>
            </div>

            {/* Technical Reasoning */}
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 block uppercase tracking-wider text-[10px]">
                Technical Architecture Reasoning:
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {analysisResult.technicalReasoning}
              </p>
              {Array.isArray(analysisResult.impactedComponents) && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysisResult.impactedComponents.map((comp: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated WhatsApp Chat Bubble Response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💬 Diplomatic Client Response (Copy & Send to Client):</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyReply}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {copiedReply ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReply ? "Copied to Clipboard!" : "Copy WhatsApp Reply"}</span>
                </button>
              </div>

              {/* Chat Message Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed relative font-sans shadow-2xs">
                <p className="whitespace-pre-line">{analysisResult.diplomaticWhatsAppReply}</p>
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                  <span>Delivered via SpecGuard AI Scope Protection</span>
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500">
                Timeline Adjustment: <strong>+{analysisResult.timelineImpactDays} business days</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                  Close
                </Button>
                {onApplyChangeOrder && (
                  <Button variant="glow" size="sm" onClick={handleApply} className="text-xs gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Record in Scope Guard Hub</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
