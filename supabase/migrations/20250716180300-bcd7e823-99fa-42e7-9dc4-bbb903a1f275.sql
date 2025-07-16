-- Clean up existing duplicate policies first
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Employers can create jobs" ON public.jobs;
DROP POLICY IF EXISTS "Employers can manage their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Users can manage their own wages" ON public.wages;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view applications for their jobs or their own applications" ON public.applications;
DROP POLICY IF EXISTS "Job seekers can create applications" ON public.applications;
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can manage their own categories" ON public.user_categories;
DROP POLICY IF EXISTS "Users can view their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can create their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Admins can manage all verification requests" ON public.verification_requests;

-- Enable RLS on all tables that need it
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;

-- Now create proper RLS policies for messages
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