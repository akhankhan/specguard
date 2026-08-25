import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RequirementStatus, RequirementPriority, RequirementType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getStatusBadgeClasses(status: RequirementStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case "Confirmed by client":
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/50",
        dot: "bg-emerald-500 dark:bg-emerald-400",
      };
    case "Directly extracted":
      return {
        bg: "bg-sky-50 dark:bg-sky-950/40",
        text: "text-sky-700 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800/50",
        dot: "bg-sky-500 dark:bg-sky-400",
      };
    case "AI-inferred":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/40",
        text: "text-purple-700 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800/50",
        dot: "bg-purple-500 dark:bg-purple-400",
      };
    case "Assumption":
      return {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-800 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/50",
        dot: "bg-amber-500 dark:bg-amber-400",
      };
    case "Needs clarification":
      return {
        bg: "bg-orange-50 dark:bg-orange-950/40",
        text: "text-orange-800 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800/50",
        dot: "bg-orange-500 dark:bg-orange-400 animate-pulse",
      };
    case "Conflict detected":
      return {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        text: "text-rose-800 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-800/50",
        dot: "bg-rose-500 dark:bg-rose-400 animate-ping",
      };
    default:
      return {
        bg: "bg-zinc-100 dark:bg-zinc-800/50",
        text: "text-zinc-700 dark:text-zinc-400",
        border: "border-zinc-200 dark:border-zinc-700/50",
        dot: "bg-zinc-500 dark:bg-zinc-400",
      };
  }
}

export function getPriorityBadgeClasses(priority: RequirementPriority): {
  bg: string;
  text: string;
  border: string;
} {
  switch (priority) {
    case "Critical":
      return {
        bg: "bg-red-50 dark:bg-red-500/10",
        text: "text-red-700 dark:text-red-400 font-semibold",
        border: "border-red-200 dark:border-red-500/30",
      };
    case "High":
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-800 dark:text-amber-400 font-medium",
        border: "border-amber-200 dark:border-amber-500/30",
      };
    case "Medium":
      return {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-500/30",
      };
    case "Low":
      return {
        bg: "bg-zinc-100 dark:bg-zinc-800",
        text: "text-zinc-600 dark:text-zinc-400",
        border: "border-zinc-200 dark:border-zinc-700",
      };
  }
}

export function getTypeBadgeClasses(type: RequirementType): {
  bg: string;
  text: string;
} {
  switch (type) {
    case "Functional":
      return { 
        bg: "bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-transparent", 
        text: "text-zinc-700 dark:text-zinc-300" 
      };
    case "Non-Functional":
      return { 
        bg: "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-transparent", 
        text: "text-indigo-700 dark:text-indigo-300" 
      };
    case "Security":
      return { 
        bg: "bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-transparent", 
        text: "text-cyan-700 dark:text-cyan-300" 
      };
    case "Integration":
      return { 
        bg: "bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-transparent", 
        text: "text-violet-700 dark:text-violet-300" 
      };
    case "Compliance":
      return { 
        bg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-transparent", 
        text: "text-emerald-700 dark:text-emerald-300" 
      };
  }
}
