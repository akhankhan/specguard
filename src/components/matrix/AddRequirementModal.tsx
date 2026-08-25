"use client";

import React, { useState } from "react";
import { Plus, Sparkles, FileText, Check, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Textarea } from "@/lib/ui-index";
import { Requirement, RequirementPriority, RequirementType, RequirementStatus } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";

interface AddRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  existingCount: number;
  onAdd: (newReq: Requirement) => void;
}

export function AddRequirementModal({
  isOpen,
  onClose,
  projectId,
  existingCount,
  onAdd,
}: AddRequirementModalProps) {
  const { success, error: toastError } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dashboard & Operations");
  const [type, setType] = useState<RequirementType>("Functional");
  const [priority, setPriority] = useState<RequirementPriority>("High");
  const [status, setStatus] = useState<RequirementStatus>("Directly extracted");
  const [hours, setHours] = useState(12);
  const [storyPoints, setStoryPoints] = useState(3);
  const [sourceExcerpt, setSourceExcerpt] = useState("Added via project requirement manager");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    "Scenario: Driver verifies data\nGiven the driver is logged in\nWhen they view this section\nThen the real-time values are displayed correctly."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError("Title Required", "Please enter a requirement title.");
      return;
    }

    const nextCodeNum = String(existingCount + 1).padStart(2, "0");
    const code = `REQ-ADD-${nextCodeNum}`;

    const newReq: Requirement = {
      id: `req_custom_${Date.now()}`,
      projectId,
      code,
      title: title.trim(),
      description: description.trim() || title.trim(),
      category,
      type,
      priority,
      status,
      sourceExcerpt: {
        text: sourceExcerpt,
        documentName: "Manual Entry / Client Addendum",
        pageNumber: 1,
        paragraphNumber: 1,
        confidenceScore: 1.0,
      },
      acceptanceCriteria: [
        {
          id: `ac_${Date.now()}`,
          given: "the user accesses the feature",
          when: "actions are performed according to specification",
          then: "the expected system output is confirmed",
        },
      ],
      estimatedHours: Number(hours) || 8,
      storyPoints: Number(storyPoints) || 2,
      version: "v1.0",
      updatedAt: new Date().toISOString(),
    };

    onAdd(newReq);
    success("Requirement Added", `Added ${code}: ${title}`);
    onClose();

    // Reset form
    setTitle("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Requirement"
      description="Add an additional functional or non-functional requirement to this project specification."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Requirement Title <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Apple Pay & Touch ID Biometric Checkout"
            className="mt-1 text-xs"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Detailed Description / Specification
          </label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what the system must do, validation rules, user roles, and constraints..."
            className="mt-1 text-xs resize-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Billing, Driver"
              className="mt-1 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
            >
              <option value="Functional">Functional</option>
              <option value="Non-Functional">Non-Functional</option>
              <option value="Security">Security</option>
              <option value="Integration">Integration</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Status Tag
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
            >
              <option value="Directly extracted">Directly extracted</option>
              <option value="Confirmed by client">Confirmed by client</option>
              <option value="AI-inferred">AI-inferred</option>
              <option value="Needs clarification">Needs clarification</option>
              <option value="Assumption">Assumption</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Dev Hours
            </label>
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Story Points
            </label>
            <Input
              type="number"
              value={storyPoints}
              onChange={(e) => setStoryPoints(Number(e.target.value))}
              className="mt-1 text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Source Citation / Client Reference
          </label>
          <Input
            value={sourceExcerpt}
            onChange={(e) => setSourceExcerpt(e.target.value)}
            placeholder="e.g., Client Email (24 Aug) or PDF Page 3 Sec 2"
            className="mt-1 text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button variant="glow" size="sm" type="submit" className="text-xs gap-1.5 font-semibold">
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Requirement Matrix</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
