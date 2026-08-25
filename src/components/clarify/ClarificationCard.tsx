"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { ClarificationQuestion } from "@/lib/types";
import { Button, Card, Textarea } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ClarificationCardProps {
  questions: ClarificationQuestion[];
  onAnswerQuestion: (questionId: string, answer: string, isAssumption?: boolean) => void;
  onFinish?: () => void;
}

export function ClarificationCard({
  questions,
  onAnswerQuestion,
  onFinish,
}: ClarificationCardProps) {
  const { success, warning } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.status === "answered").length;
  const assumedCount = questions.filter((q) => q.status === "skipped_assumption").length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt);
    setCustomText("");
  };

  const handleSubmitAnswer = () => {
    const answer = selectedOption || customText;
    if (!answer.trim()) return;

    onAnswerQuestion(currentQ.id, answer, false);
    success("Clarification Saved", `Requirement resolved with your specification.`);

    setSelectedOption(null);
    setCustomText("");

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish?.();
    }
  };

  const handleSkipAndAssume = () => {
    onAnswerQuestion(currentQ.id, currentQ.assumptionIfSkipped, true);
    warning("Marked as Assumption", `System will tag this spec as [Assumption]: "${currentQ.assumptionIfSkipped}"`);

    setSelectedOption(null);
    setCustomText("");

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish?.();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Step Meter */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
            Clarification {currentIndex + 1} of {totalQuestions}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Resolve Ambiguities Before Scope Lock
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 font-medium">
              {answeredCount + assumedCount} / {totalQuestions} Resolved
            </span>
            <div className="w-32 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-sky-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${((answeredCount + assumedCount) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Requirement Tag & Source Quote */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {currentQ.reqCode && (
              <span className="px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 font-mono text-xs font-bold">
                {currentQ.reqCode}
              </span>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              {currentQ.documentSource}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Context Snippet from original document */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
            <div className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">
              Source Document Excerpt
            </div>
            <p className="italic text-zinc-700 dark:text-zinc-300">
              "{currentQ.contextQuote}"
            </p>
          </div>
        </div>

        {/* Why this matters / Cost impact subtext */}
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Why SpecGuard is Asking</span>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {currentQ.whyItMatters}
          </p>
          {currentQ.scopeImpactWarning && (
            <p className="text-amber-800 dark:text-amber-300/90 font-medium text-[11px] pt-1">
              ⚠️ {currentQ.scopeImpactWarning}
            </p>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Choose Specification or Type Custom Answer:
          </label>

          {currentQ.options && (
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={cn(
                      "p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs sm:text-sm",
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 shadow-xs"
                        : "bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                        isSelected
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                      )}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom Text Area */}
          <div className="pt-2">
            <Textarea
              placeholder="Or write custom requirement instruction..."
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                if (e.target.value) setSelectedOption(null);
              }}
              className="text-xs h-20 bg-zinc-50 dark:bg-zinc-950/70"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>

            {/* Skip & Let AI Assume Action */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSkipAndAssume}
              className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20"
              title="Tag as Assumption"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skip — Let AI Assume</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              disabled={!selectedOption && !customText.trim()}
              onClick={handleSubmitAnswer}
              className="gap-2 px-5"
            >
              <span>{isLastQuestion ? "Save & View Matrix" : "Confirm & Next"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
