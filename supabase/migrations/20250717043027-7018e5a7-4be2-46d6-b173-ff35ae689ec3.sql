-- Fix security issues with database functions
-- Add proper search_path to all functions for security

-- Fix function security by setting proper search_path
ALTER FUNCTION public.handle_new_user() 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.handle_updated_at() 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_recommended_jobs(p_user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_conversations_with_details() 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_conversations_with_details(p_user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_conversations_with_details_v2(p_user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_conversations_with_details_v4(user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_conversations_with_details_v5(user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_user_role(user_id uuid) 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.is_admin(user_id uuid) 
SECURITY DEFINER SET search_path = public;

-- Enable RLS on missing tables
ALTER TABLE public.otpauth ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for otpauth table (should only be accessible by admin/system)
CREATE POLICY "otpauth_access_policy" ON public.otpauth
FOR ALL 
USING (false)  -- No user access to OTP auth table
WITH CHECK (false);