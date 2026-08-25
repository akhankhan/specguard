"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, ArrowRight, Layers, FileCode } from "lucide-react";
import { Button } from "@/lib/ui-index";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 p-[1px] shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              SpecGuard<span className="text-sky-600 dark:text-sky-400">.ai</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 font-semibold tracking-wider">
              Requirement Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Features
          </a>
          <a href="#scope-guard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1">
            <span>Scope Guard™</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          </a>
          <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Pricing
          </a>
          <Link
            href="/projects/demo-fintech"
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold transition-colors"
          >
            Live Demo Matrix
          </Link>
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-medium">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="sm" className="text-xs font-semibold hidden sm:inline-flex bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              Sign Up
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button variant="glow" size="sm" className="text-xs gap-1.5 font-semibold shadow-xs">
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
