"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role?: "agency" | "freelancer" | "founder";
  companyName?: string;
  techStack?: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string, 
    password: string, 
    metadata?: { fullName?: string; role?: string; companyName?: string; techStack?: string[] }
  ) => Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derive profile from user metadata
  const profile = useMemo<UserProfile | null>(() => {
    if (!user) return null;
    const meta = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || "",
      fullName: meta.full_name || meta.fullName || user.email?.split("@")[0] || "User",
      role: meta.role || "agency",
      companyName: meta.company_name || meta.companyName || "Apex Digital Studio",
      techStack: meta.tech_stack || meta.techStack || ["Next.js", "React Native", "PostgreSQL"],
      avatarUrl: meta.avatar_url || meta.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || "SpecGuard"}`,
    };
  }, [user]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Supabase getSession warning:", error.message);
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.warn("Supabase initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: { fullName?: string; role?: string; companyName?: string; techStack?: string[] }
  ) => {
    setIsLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            full_name: metadata?.fullName,
            role: metadata?.role || "agency",
            company_name: metadata?.companyName,
            tech_stack: metadata?.techStack,
          },
        },
      });
      return { data, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/settings`,
    });
    return { error };
  };

  const resendConfirmationEmail = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        resetPassword,
        resendConfirmationEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
