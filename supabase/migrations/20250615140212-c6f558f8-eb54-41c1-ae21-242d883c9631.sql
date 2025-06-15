
-- Create user roles enum
CREATE TYPE user_role AS ENUM ('jobseeker', 'employer', 'admin');

-- Create availability status enum
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');

-- Create job status enum
CREATE TYPE job_status AS ENUM ('active', 'filled', 'expired', 'draft');

-- Create application status enum
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  name TEXT,
  email TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'jobseeker',
  verified BOOLEAN DEFAULT false,
  profile_complete BOOLEAN DEFAULT false,
  profile_photo TEXT,
  location TEXT,
  availability availability_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hindi TEXT,
  description TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_hindi TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_categories table (many-to-many)
CREATE TABLE public.user_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, subcategory_id)
);

-- Create wages table
CREATE TABLE public.wages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('hourly', 'daily', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  location TEXT,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  salary_period TEXT CHECK (salary_period IN ('hourly', 'daily', 'weekly', 'monthly')),
  urgent BOOLEAN DEFAULT false,
  status job_status DEFAULT 'active',
  requirements TEXT[],
  benefits TEXT[],
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  filled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Create conversation_messages table
CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_requests table
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT,
  status verification_status DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for subcategories (public read)
CREATE POLICY "Anyone can view subcategories" ON public.subcategories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subcategories" ON public.subcategories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for user_categories
CREATE POLICY "Users can view their own categories" ON public.user_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own categories" ON public.user_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user categories" ON public.user_categories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for wages
CREATE POLICY "Users can view their own wages" ON public.wages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wages" ON public.wages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wages" ON public.wages
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage their own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = employer_id);

CREATE POLICY "Admins can manage all jobs" ON public.jobs
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for applications
CREATE POLICY "Users can view applications for their jobs or applications they made" ON public.applications
  FOR SELECT USING (
    auth.uid() = applicant_id OR 
    auth.uid() = (SELECT employer_id FROM public.jobs WHERE id = job_id)
  );

CREATE POLICY "Jobseekers can create applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update applications they're involved in" ON public.applications
  FOR UPDATE USING (
    auth.uid() = applicant_id OR 
    auth.uid() = (SELECT employer_id FROM public.jobs WHERE id = job_id)
  );

CREATE POLICY "Admins can manage all applications" ON public.applications
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent or received" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Admins can view all conversations" ON public.conversations
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for conversation_messages
CREATE POLICY "Users can view messages in their conversations" ON public.conversation_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user1_id FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT user2_id FROM public.conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON public.conversation_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT user1_id FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT user2_id FROM public.conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can update messages in their conversations" ON public.conversation_messages
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user1_id FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT user2_id FROM public.conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Admins can view all conversation messages" ON public.conversation_messages
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for verification_requests
CREATE POLICY "Users can view their own verification requests" ON public.verification_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests" ON public.verification_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all verification requests" ON public.verification_requests
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for reports
CREATE POLICY "Users can view reports they made" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports" ON public.reports
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'jobseeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, name_hindi, description, icon) VALUES
('Delivery', 'डिलीवरी', 'Food delivery, package delivery, courier services', '🚚'),
('Construction', 'निर्माण', 'Building, renovation, electrical, plumbing work', '🏗️'),
('Cleaning', 'सफाई', 'House cleaning, office cleaning, deep cleaning', '🧹'),
('Transportation', 'परिवहन', 'Driving, moving services, logistics', '🚗'),
('Beauty & Wellness', 'सौंदर्य और स्वास्थ्य', 'Salon services, massage, spa treatments', '💆‍♀️'),
('Tutoring', 'ट्यूशन', 'Academic tutoring, skill teaching, language classes', '📚'),
('Event Services', 'इवेंट सेवाएं', 'Catering, decoration, photography, entertainment', '🎉'),
('Tech Support', 'तकनीकी सहायता', 'Computer repair, software installation, tech help', '💻'),
('Pet Care', 'पालतू जानवरों की देखभाल', 'Pet sitting, dog walking, grooming', '🐕'),
('Gardening', 'बागवानी', 'Garden maintenance, landscaping, plant care', '🌱');

-- Insert sample subcategories
INSERT INTO public.subcategories (category_id, name, name_hindi, description) VALUES
((SELECT id FROM public.categories WHERE name = 'Delivery'), 'Food Delivery', 'खाना डिलीवरी', 'Restaurant and food delivery services'),
((SELECT id FROM public.categories WHERE name = 'Delivery'), 'Package Delivery', 'पैकेज डिलीवरी', 'Document and package courier services'),
((SELECT id FROM public.categories WHERE name = 'Delivery'), 'Grocery Delivery', 'किराना डिलीवरी', 'Grocery and essential items delivery'),

((SELECT id FROM public.categories WHERE name = 'Construction'), 'Electrical Work', 'बिजली का काम', 'Electrical installation and repair'),
((SELECT id FROM public.categories WHERE name = 'Construction'), 'Plumbing', 'प्लंबिंग', 'Plumbing installation and repair'),
((SELECT id FROM public.categories WHERE name = 'Construction'), 'Painting', 'पेंटिंग', 'Wall painting and decoration'),

((SELECT id FROM public.categories WHERE name = 'Cleaning'), 'House Cleaning', 'घर की सफाई', 'Residential cleaning services'),
((SELECT id FROM public.categories WHERE name = 'Cleaning'), 'Office Cleaning', 'ऑफिस की सफाई', 'Commercial cleaning services'),
((SELECT id FROM public.categories WHERE name = 'Cleaning'), 'Deep Cleaning', 'गहरी सफाई', 'Thorough cleaning services'),

((SELECT id FROM public.categories WHERE name = 'Transportation'), 'Personal Driver', 'व्यक्तिगत ड्राइवर', 'Personal driving services'),
((SELECT id FROM public.categories WHERE name = 'Transportation'), 'Moving Services', 'शिफ्टिंग सेवाएं', 'Household and office moving'),
((SELECT id FROM public.categories WHERE name = 'Transportation'), 'Logistics', 'लॉजिस्टिक्स', 'Goods transportation and logistics');

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
