"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "agency" | "client" | "admin" | "freelancer" | "founder";
  companyName: string;
  techStack: string[];
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
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper to extract clean profile from user
  const extractProfile = (currentUser: User | null): UserProfile => {
    if (!currentUser) {
      if (typeof window !== "undefined") {
        const savedCustomProfile = localStorage.getItem("specguard_custom_profile");
        if (savedCustomProfile) {
          try {
            return JSON.parse(savedCustomProfile);
          } catch {}
        }
      }
      return {
        id: "guest-user",
        email: "agency@specguard.ai",
        fullName: "Agency Partner",
        role: "agency",
        companyName: "Apex Digital Studio",
        techStack: ["Next.js", "Tailwind", "Supabase", "Llama 3.3"],
      };
    }

    const meta = currentUser.user_metadata || {};
    const identities = currentUser.identities || [];
    const identityData = identities[0]?.identity_data || {};

    const email = 
      currentUser.email || 
      meta.email || 
      identityData.email || 
      "";

    const fullName = 
      meta.full_name || 
      meta.name || 
      identityData.full_name || 
      identityData.name || 
      (email ? email.split("@")[0].replace(/[._-]/g, " ") : "Agency Partner");

    const avatarUrl = 
      meta.avatar_url || 
      meta.picture || 
      identityData.avatar_url || 
      identityData.picture || 
      undefined;

    const companyName = 
      meta.company_name || 
      meta.companyName || 
      (fullName ? `${fullName}'s Studio` : "Apex Digital Studio");

    return {
      id: currentUser.id,
      email,
      fullName,
      role: (meta.role as any) || "agency",
      companyName,
      techStack: meta.tech_stack || ["Next.js", "Tailwind", "Supabase"],
      avatarUrl,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        const [{ data: sessionData }, { data: userData }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        if (isMounted) {
          const currentSession = sessionData?.session ?? null;
          const currentUser = userData?.user ?? currentSession?.user ?? null;

          setSession(currentSession);
          setUser(currentUser);
          setProfile(extractProfile(currentUser));
        }
      } catch (err) {
        console.warn("Supabase initialization error:", err);
        if (isMounted) {
          setProfile(extractProfile(null));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setProfile(extractProfile(newSession?.user ?? null));
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
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
      const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
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
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
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
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates } as UserProfile;
    setProfile(newProfile);

    if (typeof window !== "undefined") {
      localStorage.setItem("specguard_custom_profile", JSON.stringify(newProfile));
    }

    if (user) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updates.fullName,
            company_name: updates.companyName,
          },
        });
      } catch (err) {
        console.warn("Supabase profile update warning:", err);
      }
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      try {
        await fetch("/api/auth/signout", { method: "POST" });
      } catch (e) {
        console.warn("Signout fetch error:", e);
      }

      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(extractProfile(null));

      if (typeof window !== "undefined") {
        sessionStorage.clear();
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
        updateProfile,
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
