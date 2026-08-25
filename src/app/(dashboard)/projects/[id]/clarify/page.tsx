"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  LayoutList, 
  CreditCard as CardIcon, 
  Sparkles,
  ShieldAlert,
  FolderKanban
} from "lucide-react";
import { ClarificationCard } from "@/components/clarify/ClarificationCard";
import { ClarificationGroupedView } from "@/components/clarify/ClarificationGroupedView";
import { Button } from "@/lib/ui-index";
import { cn } from "@/lib/utils";
import { getProjectById, answerClarificationQuestion } from "@/lib/services/projectService";
import { Project, ClarificationQuestion } from "@/lib/types";

export default function ClarifyPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params.id as string) || "";

  const [project, setProject] = useState<Project | null>(null);
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "grouped">("card");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!projectId) return;
      try {
        setIsLoading(true);
        const data = await getProjectById(projectId);
        if (data.project) {
          setProject(data.project);
        }
        setQuestions(data.clarifications || []);
      } catch (err) {
        console.error("Failed to load clarifications:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [projectId]);

  const handleAnswer = async (qId: string, answer: string, isAssumption = false) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              selectedAnswer: answer,
              status: isAssumption ? "skipped_assumption" : "answered",
            }
          : q
      )
    );

    await answerClarificationQuestion(qId, answer);
  };

  const handleFinish = () => {
    router.push(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-500">Loading clarification items...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
          <FolderKanban className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Project Not Found</h2>
        <Link href="/projects">
          <Button variant="secondary" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${projectId}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{project.name}</span>
              <span className="text-zinc-400 dark:text-zinc-600">/</span>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">Clarification Engine</span>
            </div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              AI Ambiguity & Scope Clarifications
            </h1>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5",
              viewMode === "card"
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <span>Step-by-Step Card</span>
          </button>
          <button
            onClick={() => setViewMode("grouped")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5",
              viewMode === "grouped"
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <span>Grouped List View</span>
          </button>
        </div>
      </div>

      {/* Main Clarification View */}
      {questions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Zero Ambiguities in Specification</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">All requirements in this specification are fully defined with zero missing assumptions.</p>
          <Link href={`/projects/${projectId}`}>
            <Button variant="secondary" size="sm" className="text-xs mt-2">
              Back to Specification Matrix
            </Button>
          </Link>
        </div>
      ) : viewMode === "card" ? (
        <ClarificationCard
          questions={questions}
          onAnswerQuestion={handleAnswer}
          onFinish={handleFinish}
        />
      ) : (
        <ClarificationGroupedView
          questions={questions}
          onAnswerQuestion={handleAnswer}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}
