import { ScopeGuardSummary, ScopeDiffItem } from "./types";
import { formatCurrency } from "./utils";

export function generateChangeOrderText(options: {
  changeOrderNumber: string;
  projectName: string;
  clientName: string;
  agencyName: string;
  date: string;
  summary: ScopeGuardSummary;
  diffItems: ScopeDiffItem[];
  customNote?: string;
}): string {
  const {
    changeOrderNumber,
    projectName,
    clientName,
    agencyName,
    date,
    summary,
    diffItems,
    customNote,
  } = options;

  const addedItems = diffItems.filter((i) => i.type === "added");
  const modifiedItems = diffItems.filter((i) => i.type === "modified");
  const removedItems = diffItems.filter((i) => i.type === "removed");

  return `================================================================================
                    FORMAL CHANGE ORDER / SCOPE REVISION NOTICE
================================================================================
Change Order ID:    ${changeOrderNumber}
Project Name:       ${projectName}
Client Organization: ${clientName}
Prepared By:        ${agencyName}
Date of Notice:     ${date}
Baseline Reference: ${summary.baselineVersion}
Revision Trigger:   ${summary.currentVersion}
================================================================================

EXECUTIVE SUMMARY
-----------------
During ongoing reviews and recent stakeholder communications, additional scope items
and architecture modifications were requested outside the mutually agreed baseline
specification (${summary.baselineVersion}). 

This Change Order outlines the engineering impact, timeline adjustments, and commercial
variance required to execute these changes without compromising system reliability.

COMMERCIAL & TIMELINE VARIANCE
-------------------------------
• Baseline Requirements:     ${summary.totalRequirementsCount} items
• Scope Additions:          +${summary.addedCount} requirements (+${addedItems.reduce((acc, i) => acc + i.hoursImpact, 0)} hours)
• Scope Modifications:      ~${summary.modifiedCount} requirements (${modifiedItems.reduce((acc, i) => acc + i.hoursImpact, 0) > 0 ? "+" : ""}${modifiedItems.reduce((acc, i) => acc + i.hoursImpact, 0)} hours)
• Scope Deprecations:       -${summary.removedCount} requirements (${removedItems.reduce((acc, i) => acc + i.hoursImpact, 0)} hours)
--------------------------------------------------------------------------------
• NET ENGINEERING EFFORT:   ${summary.netHours > 0 ? "+" : ""}${summary.netHours} billable hours
• BLENDED HOURLY RATE:      ${formatCurrency(summary.hourlyRate)}/hr
• TOTAL FINANCIAL VARIANCE: ${summary.netCost > 0 ? "+" : ""}${formatCurrency(summary.netCost)} USD
• REVISED DELIVERY IMPACT:  +${summary.estimatedDaysDelay} business days to Target Milestone Date
--------------------------------------------------------------------------------

DETAILED BREAKDOWN OF SCOPE CHANGES

1. NEW ADDITIONS (${addedItems.length} items):
${addedItems
  .map(
    (item, idx) => `   ${idx + 1}. [${item.reqCode}] ${item.title}
      • Impact: +${item.hoursImpact} hours (${formatCurrency(item.costImpact)})
      • Technical Rationale: ${item.reasonForChange}
      • Affected Architecture: ${item.affectedComponents.join(", ")}`
  )
  .join("\n\n")}

2. MODIFICATIONS & EXPANSIONS (${modifiedItems.length} items):
${modifiedItems
  .map(
    (item, idx) => `   ${idx + 1}. [${item.reqCode}] ${item.title}
      • Impact: ${item.hoursImpact > 0 ? "+" : ""}${item.hoursImpact} hours (${formatCurrency(item.costImpact)})
      • Variance Summary: ${item.diffSummary}
      • Affected Architecture: ${item.affectedComponents.join(", ")}`
  )
  .join("\n\n")}

3. REMOVED / DEPRECATED (${removedItems.length} items):
${removedItems
  .map(
    (item, idx) => `   ${idx + 1}. [${item.reqCode}] ${item.title}
      • Adjustment: ${item.hoursImpact} hours (${formatCurrency(item.costImpact)})
      • Rationale: ${item.reasonForChange}`
  )
  .join("\n\n")}

${
  customNote
    ? `ADDITIONAL NOTES
----------------
${customNote}
`
    : ""
}
AUTHORIZATION & NEXT STEPS
--------------------------
To authorize this change order and incorporate the listed deliverables into the active
sprint milestone, please countersign below or reply to this notice with formal written
confirmation.

Client Authorized Signature: ______________________    Date: ______________

Agency Project Lead:         ______________________    Date: ______________
================================================================================`;
}
