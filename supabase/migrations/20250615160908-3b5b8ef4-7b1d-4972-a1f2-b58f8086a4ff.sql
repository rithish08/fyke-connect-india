
-- 1. Drop policy on jobs that references profiles.role
DROP POLICY IF EXISTS "Employers can create jobs" ON public.jobs;

-- 2. Repeat all previous necessary drops (safe to repeat)
DROP POLICY IF EXISTS "Only admins can access reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all verification requests" ON public.verification_requests;

-- 3. Create enum type if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('jobseeker', 'employer', 'admin');
  END IF;
END
$$;

-- 4. Alter profiles.role to enum type
ALTER TABLE public.profiles
  ALTER COLUMN role TYPE user_role
  USING role::text::user_role;

-- 5. Recreate profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- 6. Recreate the reports policy that restricts to admins
CREATE POLICY "Only admins can access reports" ON public.reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Recreate the verification_requests policy for admins
CREATE POLICY "Admins can view all verification requests" ON public.verification_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Recreate jobs policy for employers (reference role as ENUM now!)
CREATE POLICY "Employers can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (
    auth.uid() = employer_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'employer'
    )
  );
