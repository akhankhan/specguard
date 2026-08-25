import React from "react";
import { cn, getStatusBadgeClasses, getPriorityBadgeClasses, getTypeBadgeClasses } from "@/lib/utils";
import { RequirementStatus, RequirementPriority, RequirementType } from "@/lib/types";

interface StatusBadgeProps {
  status: RequirementStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const styles = getStatusBadgeClasses(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors whitespace-nowrap shadow-2xs",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", styles.dot)} />}
      <span className="truncate">{status}</span>
    </span>
  );
}

interface PriorityBadgeProps {
  priority: RequirementPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const styles = getPriorityBadgeClasses(priority);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {priority}
    </span>
  );
}

interface TypeBadgeProps {
  type: RequirementType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const styles = getTypeBadgeClasses(type);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase",
        styles.bg,
        styles.text,
        className
      )}
    >
      {type}
    </span>
  );
}
