"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  FolderKanban, 
  ShieldAlert, 
  Settings, 
  CreditCard, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers
} from "lucide-react";
import { Button, Input } from "@/lib/ui-index";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import { getUserProjects } from "@/lib/services/projectService";
import { Project } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to load nav projects:", err);
      }
    }
    load();
  }, []);

  const activeSpecsCount = projects.length;
  const activeDriftCount = projects.filter((p) => p.status === "Scope Drift Detected").length;

  const mainNavItems = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { 
      label: "Projects & Specs", 
      href: "/projects", 
      icon: <FolderKanban className="w-4 h-4" />,
      badge: activeSpecsCount > 0 ? `${activeSpecsCount} Specs` : undefined
    },
    { 
      label: "Scope Guard™ Hub", 
      href: "/scope-guard", 
      icon: <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
      badge: activeDriftCount > 0 ? `${activeDriftCount} Drift` : undefined,
      badgeVariant: "amber"
    },
  ];

  const configNavItems = [
    { 
      label: "Settings & Agency", 
      href: "/settings", 
      icon: <Settings className="w-4 h-4" /> 
    },
    { 
      label: "Billing & Plans", 
      href: "/billing", 
      icon: <CreditCard className="w-4 h-4" />,
      badge: "Pro"
    },
  ];

  const isItemActive = (href: string, label: string) => {
    if (label === "Scope Guard™ Hub") {
      return pathname === "/scope-guard" || pathname.startsWith("/scope-guard");
    }
    if (label === "Projects & Specs") {
      return pathname === "/projects" || (pathname.startsWith("/projects") && pathname !== "/projects/new");
    }
    if (label === "Dashboard") {
      return pathname === "/dashboard";
    }
    if (label === "Settings & Agency") {
      return pathname.startsWith("/settings");
    }
    if (label === "Billing & Plans") {
      return pathname.startsWith("/billing");
    }
    return pathname === href;
  };

  const displayName = profile?.fullName || user?.email?.split("@")[0] || "Agency Partner";
  const displayCompany = profile?.companyName && profile.companyName !== "Login" 
    ? profile.companyName 
    : "Apex Digital Studio";
    
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row transition-colors font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col justify-between shrink-0 z-30 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        
        {/* Top Section */}
        <div className="p-4 space-y-5">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 p-[1px] shadow-sm shadow-sky-500/20">
                <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  SpecGuard<span className="text-sky-600 dark:text-sky-400">.ai</span>
                </span>
              </div>
            </Link>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
              v1.4
            </span>
          </div>

          {/* Active Workspace Switcher */}
          <div className="p-3 rounded-2xl bg-gradient-to-b from-zinc-50 to-zinc-100/70 dark:from-zinc-900/90 dark:to-zinc-900/40 border border-zinc-200/90 dark:border-zinc-800/90 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {initials}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{displayCompany}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Pro Workspace</p>
                </div>
              </div>
            </div>
            <Link href="/settings" title="Workspace Settings">
              <div className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Quick Create CTA in Sidebar */}
          <Link href="/projects/new" className="block">
            <Button 
              variant="glow" 
              size="sm" 
              className="w-full justify-center text-xs h-9 font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Client Brief</span>
            </Button>
          </Link>

          {/* Main Navigation Group */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 block">
              Workspace
            </span>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const active = isItemActive(item.href, item.label);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-100 relative group",
                      active
                        ? "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/80 dark:border-sky-800/60 shadow-2xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        "transition-colors",
                        active ? "text-sky-600 dark:text-sky-400" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "px-1.5 py-0.2 rounded-md text-[10px] font-mono font-semibold border",
                        item.badgeVariant === "amber"
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 animate-pulse"
                          : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Configuration Navigation Group */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 block">
              Preferences
            </span>
            <nav className="space-y-1">
              {configNavItems.map((item) => {
                const active = isItemActive(item.href, item.label);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-100 relative group",
                      active
                        ? "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/80 dark:border-sky-800/60 shadow-2xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        "transition-colors",
                        active ? "text-sky-600 dark:text-sky-400" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Storage & Pro Status + User Profile */}
        <div className="p-4 space-y-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60">
          {/* Scope Protection Health Card */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Scope Health</span>
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">98.4%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-emerald-500 h-1.5 rounded-full w-[84%]" />
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-between">
              <span>{activeSpecsCount} / 10 Specs Active</span>
              <Link href="/billing" className="text-sky-600 dark:text-sky-400 hover:underline">Upgrade</Link>
            </p>
          </div>

          {/* User Footer Account & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-200 shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{displayName}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email || "alex@apexstudios.dev"}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle />
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  signOut();
                }} 
                title="Sign Out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-0.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-20 transition-colors">
          {/* Quick Search with ⌘K Badge */}
          <div className="max-w-md w-full relative">
            <Input
              placeholder="Search specifications, requirements, diffs (⌘K)..."
              icon={<Search className="w-4 h-4 text-zinc-400" />}
              className="bg-zinc-50/80 dark:bg-zinc-900/70 text-xs h-9 rounded-xl pr-12"
            />
            <kbd className="absolute right-3 top-2.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-300/60 dark:border-zinc-700 pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Right Topbar actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Notifications</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">1 Action Required</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 space-y-1">
                      <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Scope Drift Detected</span>
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                        PayPulse Financial requested Stripe & Plaid payment gateway mid-sprint (+36h / +$4,320 unbilled).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ingest Client Brief CTA */}
            <Link href="/projects/new">
              <Button variant="glow" size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>New Spec</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-7xl w-full mx-auto space-y-7 pb-36">
          {children}
        </main>
      </div>
    </div>
  );
}
