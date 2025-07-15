-- Add Firebase UID column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;

-- Add missing fields for proper user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_category TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS categories TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subcategories TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude DECIMAL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude DECIMAL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wages JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS category_wages JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary_expectation JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vehicle TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary_period TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary_by_subcategory JSONB DEFAULT '{}';

-- Update RLS policies to work with Firebase
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies that work with Firebase UID
CREATE POLICY "Users can insert their own profile by firebase_uid" ON public.profiles 
  FOR INSERT WITH CHECK (
    firebase_uid IS NOT NULL AND 
    LENGTH(firebase_uid) > 0
  );

CREATE POLICY "Users can update their own profile by firebase_uid" ON public.profiles 
  FOR UPDATE USING (
    firebase_uid IS NOT NULL
  );