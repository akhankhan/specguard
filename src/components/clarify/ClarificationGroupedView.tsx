"use client";

import React, { useState } from "react";
import { ClarificationQuestion } from "@/lib/types";
import { Button, Card, Textarea } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { Check, Sparkles, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClarificationGroupedViewProps {
  questions: ClarificationQuestion[];
  onAnswerQuestion: (questionId: string, answer: string, isAssumption?: boolean) => void;
  onFinish?: () => void;
}

export function ClarificationGroupedView({
  questions,
  onAnswerQuestion,
  onFinish,
}: ClarificationGroupedViewProps) {
  const { success, warning } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    onAnswerQuestion(qId, value, false);
    success("Saved", "Selection recorded for this item.");
  };

  const handleSkip = (q: ClarificationQuestion) => {
    setAnswers((prev) => ({ ...prev, [q.id]: q.assumptionIfSkipped }));
    onAnswerQuestion(q.id, q.assumptionIfSkipped, true);
    warning("Marked as Assumption", `Tagged as [Assumption]: ${q.assumptionIfSkipped}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Grouped Clarifications Review
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Resolve all detected ambiguities across the entire document in one unified view.
          </p>
        </div>
        <Button variant="glow" size="md" onClick={onFinish}>
          Complete & Open Spec Matrix
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const currentAnswer = answers[q.id] || (q.status === "answered" ? q.selectedAnswer : "");
          const isAssumed = q.status === "skipped_assumption";

          return (
            <Card key={q.id} className="p-6 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 font-semibold">
                      {q.reqCode || `Q-${idx + 1}`}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
                      <FileText className="w-3 h-3 text-zinc-400" />
                      {q.documentSource}
                    </span>
                    {isAssumed && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50 font-medium">
                        [Assumption]
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{q.question}</h3>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSkip(q)}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Assume</span>
                </Button>
              </div>

              {/* Excerpt quote */}
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400 italic">
                "{q.contextQuote}"
              </div>

              {/* Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = currentAnswer === opt;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelect(q.id, opt)}
                        className={cn(
                          "p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5",
                          isSelected
                            ? "bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 shadow-xs"
                            : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800/80 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/40"
                        )}
                      >
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                            isSelected
                              ? "border-sky-500 bg-sky-500 text-white"
                              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                          )}
                        >
                          {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
