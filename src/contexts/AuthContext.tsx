"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: "agency" | "client" | "admin";
  companyName?: string;
  techStack?: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: { fullName?: string; role?: string; companyName?: string; techStack?: string[] }
  ) => Promise<{ data: any; error: any }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setProfile({
        id: user.id,
        email: user.email || "",
        fullName: meta.full_name || meta.name || user.email?.split("@")[0],
        role: (meta.role as any) || "agency",
        companyName: meta.company_name || meta.companyName || "Apex Digital Studio",
        techStack: meta.tech_stack || ["Next.js", "Tailwind", "Supabase"],
        avatarUrl: meta.avatar_url || meta.picture || undefined,
      });
    } else {
      setProfile(null);
    }
  }, [user]);

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
      const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
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
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (data?.url) {
      window.location.href = data.url;
    }
    return { error };
  };

  const resetPassword = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/settings`,
    });
    return { error };
  };

  const resendConfirmationEmail = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
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
      // 1. Call server-side signout endpoint to expire cookies
      try {
        await fetch("/api/auth/signout", { method: "POST" });
      } catch (e) {
        console.warn("Signout fetch error:", e);
      }

      // 2. Client-side Supabase signOut
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);

      // 3. Clear browser sessions
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        // 4. Hard redirect to /login
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Sign out error:", err);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
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
