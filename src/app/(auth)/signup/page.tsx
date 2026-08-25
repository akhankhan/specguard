"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  ArrowRight, 
  Lock, 
  Mail, 
  Building2, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  ArrowLeft,
  Eye,
  EyeOff,
  Briefcase,
  Code,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import { Button, Card, Input } from "@/lib/ui-index";
import { useToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function SignupPage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const { signUpWithEmail, signInWithOAuth } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"agency" | "freelancer" | "founder">("agency");
  const [selectedTech, setSelectedTech] = useState<string[]>(["Next.js", "React Native", "PostgreSQL"]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  const techOptions = [
    "Next.js", "React Native", "PostgreSQL", "Flutter", 
    "Fastify / Node", "PostGIS", "Supabase", "Python / AI"
  ];

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  // Real-time password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-zinc-200 dark:bg-zinc-800" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Too Short", color: "bg-rose-500" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      error("Missing Information", "Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      error("Password Too Short", "Password must be at least 8 characters long.");
      return;
    }
    if (!agreeTerms) {
      error("Terms Agreement Required", "Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = await signUpWithEmail(email, password, {
        fullName,
        companyName: agencyName || "Independent Studio",
        role,
        techStack: selectedTech,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes("rate limit")) {
          error("Supabase Email Rate Limit", "Supabase default mailer is rate-limited. Please disable 'Confirm email' in Supabase Settings → Auth → Providers → Email for instant signups.");
          return;
        }
        error("Sign Up Failed", authError.message);
        return;
      }

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}

      // If Supabase requires email confirmation
      if (data?.user && !data.session) {
        setEmailConfirmationRequired(true);
        info("Check Your Email", `Confirmation link sent to ${email}. Please verify to activate.`);
      } else {
        success("Workspace Created!", `Welcome to SpecGuard, ${fullName}! Your trial is active.`);
        router.push("/dashboard");
      }
    } catch (err: any) {
      error("Registration Error", err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const { error: authError } = await signInWithOAuth(provider);
      if (authError) {
        error("OAuth Error", authError.message || `Could not connect to ${provider}.`);
        setIsLoading(false);
      }
      // If successful, signInWithOAuth automatically redirects browser to Google URL
    } catch (err: any) {
      error("OAuth Failed", err?.message || "Social sign-up could not be completed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-800 dark:selection:text-sky-200 transition-colors">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 p-[1px] shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
            SpecGuard<span className="text-sky-600 dark:text-sky-400">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <Link href="/login">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-3.5 bg-white dark:bg-zinc-900">
              <span>Sign In</span>
            </Button>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          
          {/* ================= LEFT COLUMN: REGISTRATION BENEFITS ================= */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4 sticky top-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-xs font-semibold text-sky-700 dark:text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>14-Day Free Pro Studio Trial</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                Build rock-solid software specifications in minutes.
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Join 2,400+ freelancers and boutique agencies using SpecGuard to turn messy client briefs into approved engineering blueprints.
              </p>
            </div>

            {/* Trial Guarantees List */}
            <div className="space-y-3 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Included in Your Free Trial:
              </h3>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span><strong>Unlimited Document Ingestion:</strong> PDFs, DOCX, RFPs, and raw client emails</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span><strong>Automated Gherkin Acceptance Criteria:</strong> Given/When/Then scenarios for every feature</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span><strong>Scope Guard™ Diff Engine:</strong> Instant dollar & hour variance on client additions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span><strong>Zero Credit Card Required:</strong> Instant setup with full export permissions</span>
                </li>
              </ul>
            </div>

            {/* Social Trust Stat */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">AK</div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">TL</div>
              </div>
              <p>Trusted by engineers from top dev studios worldwide</p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: REGISTRATION FORM ================= */}
          <div className="lg:col-span-7 max-w-xl w-full mx-auto">
            <Card className="p-7 sm:p-8 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
                <Link
                  href="/login"
                  className="py-2 text-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors rounded-lg flex items-center justify-center gap-1 font-semibold"
                >
                  <span>Sign In</span>
                </Link>
                <span className="py-2 text-center font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-xs">
                  Create Account
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Create Your Free Workspace
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Set up your agency or developer profile in under 60 seconds.
                </p>
              </div>

              {/* Account Type / Role Pill Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                  I am creating a spec workspace for:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "agency", label: "Agency / Studio", icon: <Building2 className="w-3.5 h-3.5" /> },
                    { id: "freelancer", label: "Solo Freelancer", icon: <User className="w-3.5 h-3.5" /> },
                    { id: "founder", label: "Product Founder", icon: <Globe className="w-3.5 h-3.5" /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRole(t.id as any)}
                      className={cn(
                        "py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all text-center",
                        role === t.id
                          ? "bg-sky-50 dark:bg-sky-950/80 border-sky-400 dark:border-sky-700 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400/40"
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                      )}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social 1-Click Signup */}
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialSignup("google")}
                  className="text-xs h-9 font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-zinc-100"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialSignup("github")}
                  className="text-xs h-9 font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-zinc-100"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Sign up with GitHub</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] uppercase text-zinc-400 dark:text-zinc-500 font-mono absolute">
                  Or register with work email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Your Full Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Business / Studio Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Apex Software Studio"
                      icon={<Building2 className="w-4 h-4" />}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Work Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@apexstudios.dev"
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Create Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      icon={<Lock className="w-4 h-4" />}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Strength:</span>
                        <span className="font-semibold">{strength.label}</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all duration-300 rounded-full", strength.color)}
                          style={{ width: `${(strength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Tech Stack Preference Chips */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Preferred Technologies (Used for non-functional spec calibration):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {techOptions.map((t) => {
                      const isSelected = selectedTech.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTech(t)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all",
                            isSelected
                              ? "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                              : "bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                          )}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms & Privacy */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                      I agree to SpecGuard's{" "}
                      <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="glow"
                  className="w-full text-sm font-semibold h-11 mt-2"
                  isLoading={isLoading}
                >
                  <span>Start Free Pro Trial & Ingest First Brief</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                Already have an account?{" "}
                <Link href="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40">
        <span>© 2026 SpecGuard AI Inc. · Enterprise Spec Security · SOC2 Compliant</span>
      </footer>
    </div>
  );
}
