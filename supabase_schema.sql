-- =========================================================================
-- SPECGUARD AI — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Execute this SQL in your Supabase Project: Dashboard -> SQL Editor -> New Query
-- =========================================================================

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT DEFAULT 'Apex Digital Studio',
  role TEXT DEFAULT 'Principal Solutions Architect',
  tech_stack TEXT DEFAULT 'React / Next.js / Node.js / PostgreSQL',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_avatar TEXT DEFAULT '📁',
  description TEXT,
  status TEXT DEFAULT 'In Review', -- 'In Review' | 'Baseline Locked' | 'Scope Drift Detected' | 'Draft' | 'Approved'
  baseline_version TEXT DEFAULT 'v1.0',
  current_version TEXT DEFAULT 'v1.0',
  baseline_locked_at TIMESTAMPTZ,
  total_requirements INT DEFAULT 0,
  pending_clarifications INT DEFAULT 0,
  drift_hours NUMERIC DEFAULT 0,
  drift_cost NUMERIC DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  platform TEXT DEFAULT 'Web & Mobile',
  tech_stack JSONB DEFAULT '{}'::JSONB,
  executive_summary TEXT,
  scope_objectives JSONB DEFAULT '[]'::JSONB,
  out_of_scope JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" 
  ON public.projects FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- e.g. "REQ-AUTH-01"
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT DEFAULT 'Functional', -- 'Functional' | 'Non-Functional' | 'Security' | 'Integration' | 'Compliance'
  priority TEXT DEFAULT 'High', -- 'Critical' | 'High' | 'Medium' | 'Low'
  status TEXT DEFAULT 'Directly extracted', -- 'Confirmed by client' | 'Directly extracted' | 'AI-inferred' | 'Assumption' | 'Needs clarification' | 'Conflict detected'
  source_excerpt JSONB DEFAULT '{}'::JSONB,
  acceptance_criteria JSONB DEFAULT '[]'::JSONB,
  technical_notes TEXT,
  estimated_hours NUMERIC DEFAULT 8,
  story_points INT DEFAULT 3,
  assigned_epic TEXT,
  version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on requirements
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their requirements" 
  ON public.requirements FOR ALL 
  USING (auth.uid() = user_id);

-- 4. CLARIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.clarifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  req_code TEXT,
  question TEXT NOT NULL,
  context_quote TEXT,
  document_source TEXT,
  why_it_matters TEXT,
  input_type TEXT DEFAULT 'single_select', -- 'single_select' | 'multi_select' | 'text' | 'boolean'
  options JSONB DEFAULT '[]'::JSONB,
  selected_answer TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'answered' | 'skipped_assumption'
  assumption_if_skipped TEXT,
  scope_impact_warning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on clarifications
ALTER TABLE public.clarifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their clarifications" 
  ON public.clarifications FOR ALL 
  USING (auth.uid() = user_id);

-- 5. USER STORIES TABLE
CREATE TABLE IF NOT EXISTS public.user_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- e.g. "US-01"
  epic_title TEXT NOT NULL,
  title TEXT NOT NULL,
  as_a TEXT NOT NULL,
  i_want TEXT NOT NULL,
  so_that TEXT NOT NULL,
  acceptance_criteria JSONB DEFAULT '[]'::JSONB,
  story_points INT DEFAULT 3,
  priority TEXT DEFAULT 'High',
  mapped_req_codes TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_stories
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their user stories" 
  ON public.user_stories FOR ALL 
  USING (auth.uid() = user_id);

-- 6. MERMAID DIAGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'system_context' | 'user_flow' | 'architecture' | 'erd'
  badge TEXT DEFAULT 'C4 Model',
  description TEXT,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on diagrams
ALTER TABLE public.diagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their diagrams" 
  ON public.diagrams FOR ALL 
  USING (auth.uid() = user_id);

-- 7. SCOPE DIFFS TABLE (For Change Orders & Drift Detection)
CREATE TABLE IF NOT EXISTS public.scope_diffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  summary JSONB DEFAULT '{}'::JSONB,
  items JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on scope_diffs
ALTER TABLE public.scope_diffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their scope diffs" 
  ON public.scope_diffs FOR ALL 
  USING (auth.uid() = user_id);

-- Automatic Profile Creation Trigger on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'company_name', 'Apex Digital Studio')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
