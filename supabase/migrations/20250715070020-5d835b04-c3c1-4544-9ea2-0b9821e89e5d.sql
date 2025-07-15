-- Create profiles table with proper structure for Firebase users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT,
  email TEXT,
  bio TEXT,
  role TEXT DEFAULT 'jobseeker',
  verified BOOLEAN DEFAULT false,
  profile_complete BOOLEAN DEFAULT false,
  profile_photo TEXT,
  location TEXT,
  availability TEXT DEFAULT 'available',
  primary_category TEXT,
  skills TEXT[],
  categories TEXT[],
  subcategories TEXT[],
  latitude DECIMAL,
  longitude DECIMAL,
  wages JSONB DEFAULT '{}',
  category_wages JSONB DEFAULT '{}',
  salary_expectation JSONB,
  vehicle TEXT,
  salary_period TEXT,
  salary_by_subcategory JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'sub' = firebase_uid);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE 
  USING (auth.jwt() ->> 'sub' = firebase_uid);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();