"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, Sparkles, Check, AlertCircle, ArrowRight, Layers } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Textarea } from "@/lib/ui-index";
import { Requirement, UserStory, MermaidDiagramData } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";

interface AppendDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  existingCount: number;
  onAppendData: (
    newRequirements: Requirement[],
    newUserStories: UserStory[],
    newDiagrams: MermaidDiagramData[]
  ) => void;
}

export function AppendDocumentModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  existingCount,
  onAppendData,
}: AppendDocumentModalProps) {
  const { success, error: toastError } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file && !pastedText.trim()) {
      toastError("Document Required", "Please select a file or paste text from the addendum.");
      return;
    }

    try {
      setIsProcessing(true);
      let extractedText = pastedText.trim();

      if (file) {
        setProgressStep("Extracting text from " + file.name + "...");
        const formData = new FormData();
        formData.append("file", file);

        const extractRes = await fetch("/api/extract-document", {
          method: "POST",
          body: formData,
        });

        const extractJson = await extractRes.json();
        if (extractJson.success && extractJson.text) {
          extractedText = extractJson.text;
        } else {
          throw new Error(extractJson.error || "Failed to extract text from document");
        }
      }

      setProgressStep("SpecGuard AI analyzing requirements & architecture...");
      const parseRes = await fetch("/api/ai/parse-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: extractedText,
          fileName: file?.name || "Client Addendum Notes",
        }),
      });

      const parseJson = await parseRes.json();
      if (!parseJson.success || !parseJson.data) {
        throw new Error(parseJson.error || "AI parsing failed");
      }

      const rawReqs = parseJson.data.requirements || [];
      const rawStories = parseJson.data.userStories || [];
      const rawDiags = parseJson.data.diagrams || [];

      // Re-index new requirement codes sequentially starting from existingCount + 1
      const offset = existingCount;
      const formattedReqs: Requirement[] = rawReqs.map((r: any, idx: number) => {
        const num = String(offset + idx + 1).padStart(2, "0");
        return {
          id: `req_${Date.now()}_${idx}`,
          projectId,
          code: `REQ-ADD-${num}`,
          title: r.title,
          description: r.description,
          category: r.category || "Client Addendum",
          type: r.type || "Functional",
          priority: r.priority || "High",
          status: "Directly extracted",
          sourceExcerpt: r.sourceExcerpt || {
            text: r.description,
            documentName: file?.name || "Addendum Document",
            pageNumber: 1,
            paragraphNumber: idx + 1,
            confidenceScore: 0.95,
          },
          acceptanceCriteria: r.acceptanceCriteria || [],
          estimatedHours: Number(r.estimatedHours) || 12,
          storyPoints: Number(r.storyPoints) || 3,
          version: "v1.1",
          updatedAt: new Date().toISOString(),
        };
      });

      const formattedStories: UserStory[] = rawStories.map((s: any, idx: number) => ({
        id: `story_${Date.now()}_${idx}`,
        projectId,
        code: `US-ADD-${String(offset + idx + 1).padStart(2, "0")}`,
        epicTitle: s.epicTitle || "Addendum Features",
        title: s.title,
        asA: s.asA || "user",
        iWant: s.iWant || s.title,
        soThat: s.soThat || "the requirement is satisfied",
        acceptanceCriteria: s.acceptanceCriteria || [],
        storyPoints: Number(s.storyPoints) || 3,
        priority: s.priority || "High",
        mappedReqCodes: formattedReqs.map(r => r.code),
      }));

      onAppendData(formattedReqs, formattedStories, rawDiags);
      success("Addendum Ingested", `Added ${formattedReqs.length} new requirements to ${projectName}.`);
      onClose();

      setFile(null);
      setPastedText("");
    } catch (err: any) {
      console.error("Append document error:", err);
      toastError("Processing Failed", err.message || "Could not parse document.");
    } finally {
      setIsProcessing(false);
      setProgressStep("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Append Additional Document / Client Addendum"
      description={`Extract & append new requirements to "${projectName}" using SpecGuard AI.`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-sky-500 rounded-2xl p-6 text-center transition-colors bg-zinc-50/50 dark:bg-zinc-950/50">
          <input
            type="file"
            id="append-file-input"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="append-file-input" className="cursor-pointer block space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div>
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400">{file.name}</p>
                <p className="text-[11px] text-zinc-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Click to browse or drop additional PDF, DOCX, or text brief
                </p>
                <p className="text-[11px] text-zinc-500">Supports client change requests, RFPs, or addendum memos</p>
              </div>
            )}
          </label>
        </div>

        {/* Or Paste Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Or Paste Addendum Text / Meeting Transcript:
          </label>
          <Textarea
            rows={4}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste text notes, client emails, or additional feature lists here..."
            className="text-xs resize-none"
          />
        </div>

        {/* Progress Display */}
        {isProcessing && (
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center gap-3 text-xs text-sky-900 dark:text-sky-300 font-medium animate-pulse">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{progressStep || "SpecGuard AI is processing..."}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] text-zinc-500">
            Existing: <strong>{existingCount} Requirements</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isProcessing} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleProcess}
              isLoading={isProcessing}
              className="text-xs gap-1.5 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract & Append to Project</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
