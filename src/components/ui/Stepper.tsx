import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 -z-0" />
        
        {/* Active progress track line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-sky-500 transition-all duration-300 -z-0"
          style={{
            width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = onStepClick && step.id <= currentStep;

          return (
            <div
              key={step.id}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={cn(
                "relative z-10 flex flex-col items-center group",
                isClickable && "cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 border-2",
                  isCompleted && "bg-sky-600 border-sky-600 text-white",
                  isCurrent &&
                    "bg-white dark:bg-zinc-900 border-sky-500 text-sky-600 dark:text-sky-400 ring-4 ring-sky-500/20 shadow-sm",
                  !isCompleted && !isCurrent && "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 whitespace-nowrap text-xs font-medium transition-colors",
                  isCurrent ? "text-sky-600 dark:text-sky-400 font-semibold" : isCompleted ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-500"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
