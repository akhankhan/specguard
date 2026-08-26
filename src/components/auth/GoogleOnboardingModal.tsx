"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  User, 
  Sparkles, 
  Check, 
  Briefcase, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Code
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input } from "@/lib/ui-index";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import confetti from "canvas-confetti";

interface GoogleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleOnboardingModal({ isOpen, onClose }: GoogleOnboardingModalProps) {
  const { user, profile, updateProfile } = useAuth();
  const { success } = useToast();

  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [role, setRole] = useState<"agency" | "freelancer" | "founder">("agency");
  const [selectedTech, setSelectedTech] = useState<string[]>([
    "Next.js", "Flutter", "Supabase", "Python / AI"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const techOptions = [
    "Next.js", "Flutter", "React Native", "PostgreSQL", 
    "Fastify / Node", "Supabase", "Python / AI", "Docker / AWS"
  ];

  useEffect(() => {
    if (user || profile) {
      const email = user?.email || profile?.email || "";
      const defaultName = profile?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || (email ? email.split("@")[0].replace(/[._-]/g, " ") : "Agency Partner");
      setFullName(defaultName);

      const defaultCompany = profile?.companyName && profile.companyName !== "Apex Digital Studio"
        ? profile.companyName
        : `${defaultName.split(" ")[0]}'s Digital Studio`;
      setAgencyName(defaultCompany);
    }
  }, [user, profile]);

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        fullName: fullName.trim() || "Agency Partner",
        companyName: agencyName.trim() || "Apex Digital Studio",
        role,
        techStack: selectedTech,
      });

      if (typeof window !== "undefined") {
        if (user?.id) {
          localStorage.setItem(`specguard_onboarding_${user.id}`, "true");
        }
        localStorage.removeItem("specguard_onboarding_completed");
        // Also remove onboarding query param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("onboarding");
        window.history.replaceState({}, "", url.toString());
      }

      // Celebrate onboarding complete!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      success("Workspace Initialized", `Welcome to SpecGuard AI, ${fullName}!`);
      onClose();
    } catch (err) {
      console.error("Onboarding error:", err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      if (user?.id) {
        localStorage.setItem(`specguard_onboarding_${user.id}`, "true");
      }
      localStorage.setItem("specguard_onboarding_completed", "true");
      const url = new URL(window.location.href);
      url.searchParams.delete("onboarding");
      window.history.replaceState({}, "", url.toString());
    }
    onClose();
  };

  const userEmail = user?.email || profile?.email || "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      title="Complete Your Agency Workspace Setup"
      description="Tailor your AI requirement engine, client contract headers, and Scope Guard™ rules."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Verified Google Account Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-sky-300 dark:border-sky-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm font-mono">
                {fullName.slice(0, 2).toUpperCase() || "AP"}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Google Account Authenticated</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">{userEmail}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Verified
          </span>
        </div>

        {/* Form Fields: Full Name & Agency Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Full Name</span>
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Agency / Studio Name</span>
            </label>
            <Input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g. Apex Digital Software Studio"
              required
              className="text-xs"
            />
          </div>
        </div>

        {/* Primary Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Your Primary Workflow Role</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "agency", label: "Agency Founder / Lead" },
              { id: "founder", label: "Product / Tech Architect" },
              { id: "freelancer", label: "Solo Dev / Consultant" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as any)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                  role === item.id
                    ? "bg-sky-50 dark:bg-sky-950/80 border-sky-500 text-sky-700 dark:text-sky-300 font-semibold shadow-xs"
                    : "bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Core Tech Stack Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Core Development Tech Stack</span>
            </label>
            <span className="text-[10px] text-zinc-400 font-mono">Used for AI C4 Diagrams</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {techOptions.map((tech) => {
              const selected = selectedTech.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    selected
                      ? "bg-sky-600 text-white font-semibold shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                  <span>{tech}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
          <Button
            type="submit"
            variant="glow"
            size="md"
            isLoading={isSubmitting}
            className="w-full sm:w-auto text-xs font-semibold gap-2 shadow-xs"
          >
            <span>Launch Agency Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
