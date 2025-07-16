-- Fix critical RLS security issues for all public tables
-- Enable RLS on all tables that don't have it yet

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on jobs table  
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Enable RLS on subcategories table
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Enable RLS on wages table
ALTER TABLE public.wages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Enable RLS on conversations table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_categories table
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation 
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their conversations" ON public.messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation 
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own messages" ON public.messages
FOR UPDATE USING (sender_id = auth.uid());

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can create jobs" ON public.jobs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'employer' 
    AND p.id = jobs.employer_id
  )
);

CREATE POLICY "Employers can manage their own jobs" ON public.jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.id = jobs.employer_id
  )
);

-- Create RLS policies for categories (read-only for users)
CREATE POLICY "Anyone can view active categories" ON public.categories
FOR SELECT USING (active = true);

-- Create RLS policies for subcategories (read-only for users)
CREATE POLICY "Anyone can view active subcategories" ON public.subcategories
FOR SELECT USING (active = true);

-- Create RLS policies for wages
CREATE POLICY "Users can manage their own wages" ON public.wages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.id = wages.user_id
  )
);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own profile" ON public.user_profiles
FOR ALL USING (id::uuid = auth.uid());

-- Create RLS policies for applications
CREATE POLICY "Users can view applications for their jobs or their own applications" ON public.applications
FOR SELECT USING (
  applicant_id = auth.uid() OR 
  employer_id = auth.uid()
);

CREATE POLICY "Job seekers can create applications" ON public.applications
FOR INSERT WITH CHECK (
  applicant_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'jobseeker'
  )
);

CREATE POLICY "Employers can update applications for their jobs" ON public.applications
FOR UPDATE USING (employer_id = auth.uid());

-- Create RLS policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations
FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.conversations
FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update their conversations" ON public.conversations
FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can delete their conversations" ON public.conversations
FOR DELETE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Create RLS policies for user_categories
CREATE POLICY "Users can manage their own categories" ON public.user_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.id = user_categories.user_id
  )
);

-- Create RLS policies for verification_requests
CREATE POLICY "Users can view their own verification requests" ON public.verification_requests
FOR SELECT USING (user_id::uuid = auth.uid());

CREATE POLICY "Users can create their own verification requests" ON public.verification_requests
FOR INSERT WITH CHECK (user_id::uuid = auth.uid());

CREATE POLICY "Admins can manage all verification requests" ON public.verification_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Fix function search path security warnings
-- Update all functions to have secure search_path

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.profiles (id, phone, email, role, verified, profile_complete, availability)
    VALUES (
        NEW.id,
        NEW.phone,
        NEW.email,
        'jobseeker',
        FALSE,
        FALSE,
        'available'
    );
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_recommended_jobs(p_user_id uuid)
RETURNS TABLE(id uuid, title text, description text, location text, salary_min numeric, salary_max numeric, salary_period text, urgent boolean, posted_at timestamp with time zone, employer_id uuid, company_name text, status job_status, category_id uuid)
LANGUAGE plpgsql
SET search_path = ''
AS $function$
begin
    return query
    select
        j.id,
        j.title,
        j.description,
        j.location,
        j.salary_min,
        j.salary_max,
        j.salary_period,
        j.urgent,
        j.posted_at,
        j.employer_id,
        p.name as company_name,
        j.status,
        j.category_id
    from
        public.jobs j
    join
        public.profiles p on j.employer_id = p.id
    where
        j.status = 'active'
        and j.category_id in (
            select uc.category_id
            from public.user_categories uc
            where uc.user_id = p_user_id
        )
    order by
        j.urgent desc,
        j.posted_at desc;
end;
$function$;