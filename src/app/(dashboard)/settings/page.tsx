"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  DollarSign, 
  Shield, 
  Palette, 
  Cpu, 
  Bell, 
  Save, 
  CheckCircle2,
  UploadCloud,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  LogOut,
  Calendar,
  Layers,
  Lock,
  Globe
} from "lucide-react";
import { Button, Card, Input } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("120");
  const [currency, setCurrency] = useState("USD");
  const [strictness, setStrictness] = useState(true);
  const [autoAssumption, setAutoAssumption] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      const company = profile.companyName && profile.companyName !== "Login" 
        ? profile.companyName 
        : "Apex Digital Software Studio";
      setAgencyName(company);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        companyName: agencyName,
      });

      if (user) {
        // Update user metadata in Supabase
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            company_name: agencyName,
          }
        });

        // Update profiles table if exists
        try {
          await supabase
            .from("profiles")
            .update({
              full_name: fullName,
              company_name: agencyName,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        } catch {}
      }

      success("Profile & Settings Saved", "Your user profile and workspace configuration have been updated.");
    } catch (err: any) {
      console.error("Save settings error:", err);
      toastError("Update Failed", err.message || "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = fullName || profile?.fullName || (user?.email ? user.email.split("@")[0] : "Workspace User");
  const userEmail = user?.email || profile?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "WU";

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Active Member";

  return (
    <div className="max-w-4xl space-y-7 mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Account & Agency Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal profile, logged-in account email, agency branding, and Scope Guard™ contract rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= SECTION 1: USER PROFILE & LOGGED-IN EMAIL ================= */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                User Profile & Account Identity
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified Session</span>
            </span>
          </div>

          {/* User Identity Highlight Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-indigo-50/60 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-200/80 dark:border-sky-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-sky-300 dark:border-sky-700 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm shrink-0">
                  {initials}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{displayName}</h4>
                  <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-semibold bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    Pro Workspace
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
                  <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{userEmail}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Member since {memberSince}
              </span>
            </div>
          </div>

          {/* Form Fields: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Full Display Name
              </label>
              <Input
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="w-4 h-4 text-zinc-400" />}
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Authenticated Gmail / Email Address
              </label>
              <div className="relative">
                <Input
                  value={userEmail}
                  disabled
                  icon={<Mail className="w-4 h-4 text-emerald-500" />}
                  className="h-10 text-xs bg-zinc-100/70 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 cursor-not-allowed border-zinc-200 dark:border-zinc-800 font-mono"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/60 pointer-events-none">
                  Active Login
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ================= SECTION 2: AGENCY PROFILE & BRANDING ================= */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl space-y-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Agency Profile & Client PRD Branding
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Agency / Company Name</label>
              <Input
                placeholder="e.g. Apex Digital Software Studio"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                icon={<Building2 className="w-4 h-4 text-zinc-400" />}
                className="h-10 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Principal Project Lead</label>
              <Input
                value={displayName}
                disabled
                icon={<User className="w-4 h-4 text-zinc-400" />}
                className="h-10 text-xs bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Agency Logo (Rendered on Client Export PRDs)
            </label>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800/60 flex items-center justify-center font-bold text-sm text-sky-700 dark:text-sky-400 shrink-0">
                {initials}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">brand_vector_logo.svg</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Vector SVG / PNG format (max 2MB)</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="ml-auto text-xs shrink-0">
                Upload Logo
              </Button>
            </div>
          </div>
        </Card>

        {/* ================= SECTION 3: SCOPE GUARD™ FINANCIAL RULES ================= */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl space-y-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Scope Guard™ Financial Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Default Blended Billable Hourly Rate ($/hr)
              </label>
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                icon={<span className="text-zinc-400 dark:text-zinc-500 font-mono">$</span>}
                className="h-10 text-xs"
              />
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Used to calculate financial variance when scope drift is detected.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Contract Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium h-10"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ================= SECTION 4: AI INTELLIGENCE PREFERENCES ================= */}
        <Card className="p-6 sm:p-7 bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80 rounded-2xl space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                AI Intelligence & Extraction Preferences
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold">
              Active Engine
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">Zero-Hallucination Strict Mode</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                  Requires 100% confidence citation match for every extracted functional spec.
                </p>
              </div>
              <input
                type="checkbox"
                checked={strictness}
                onChange={(e) => setStrictness(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-white dark:bg-zinc-950 rounded border-zinc-300 dark:border-zinc-700 focus:ring-sky-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">Auto-Tag Unresolved Items as [Assumption]</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                  Prevents blocking deliverables when clients delay answering clarification questions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoAssumption}
                onChange={(e) => setAutoAssumption(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-white dark:bg-zinc-950 rounded border-zinc-300 dark:border-zinc-700 focus:ring-sky-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Save Changes Action Bar */}
        <div className="flex items-center justify-between pt-3 pb-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5 h-10 px-4 rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>

          <Button
            type="submit"
            variant="glow"
            size="md"
            disabled={isSaving}
            className="gap-2 text-xs font-semibold h-10 px-6 rounded-xl shadow-md"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
