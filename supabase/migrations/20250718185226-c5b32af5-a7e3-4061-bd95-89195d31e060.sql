-- 🚦 PRODUCTION-READY DATABASE AUDIT & SECURITY FIXES

-- 1. Fix security definer functions (critical security issue)
ALTER FUNCTION public.handle_new_user() 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.handle_updated_at() 
SECURITY DEFINER SET search_path = public;

ALTER FUNCTION public.get_recommended_jobs(p_user_id uuid) 
SECURITY DEFINER SET search_path = public;

-- 2. Create comprehensive notification system trigger
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Job Application Notifications
  IF TG_TABLE_NAME = 'applications' THEN
    -- Notify employer when someone applies
    INSERT INTO notifications (user_id, type, title, message, data)
    SELECT 
      j.employer_id,
      'application_received',
      'New Job Application',
      'Someone applied for your job: ' || j.title,
      jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id)
    FROM jobs j 
    WHERE j.id = NEW.job_id;
    
    -- Notify applicant when status changes (for updates)
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      INSERT INTO notifications (user_id, type, title, message, data)
      SELECT 
        NEW.applicant_id,
        'application_' || NEW.status,
        'Application ' || INITCAP(NEW.status),
        'Your application for "' || j.title || '" has been ' || NEW.status,
        jsonb_build_object('job_id', NEW.job_id, 'application_id', NEW.id)
      FROM jobs j 
      WHERE j.id = NEW.job_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Create notification triggers
DROP TRIGGER IF EXISTS applications_notification_trigger ON applications;
CREATE TRIGGER applications_notification_trigger
  AFTER INSERT OR UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION create_notification();

-- 4. Create test notifications for existing users
INSERT INTO notifications (user_id, type, title, message, data, read)
SELECT 
  id as user_id,
  'profile_verified' as type,
  'Welcome to Fyke!' as title,
  'Your profile has been set up successfully. Start exploring jobs and opportunities!' as message,
  jsonb_build_object('action', 'explore_jobs') as data,
  false as read
FROM profiles 
WHERE role IS NOT NULL
ON CONFLICT DO NOTHING;

-- 5. Create job match notifications for job seekers
INSERT INTO notifications (user_id, type, title, message, data, read)
SELECT DISTINCT
  uc.user_id,
  'job_match' as type,
  'New Job Opportunities!' as title,
  'New jobs matching your skills are available in ' || c.name as message,
  jsonb_build_object('category_id', j.category_id, 'job_count', 
    (SELECT COUNT(*) FROM jobs j2 WHERE j2.category_id = j.category_id AND j2.status = 'active')
  ) as data,
  false as read
FROM user_categories uc
JOIN categories c ON c.id = uc.category_id
JOIN jobs j ON j.category_id = uc.category_id
JOIN profiles p ON p.id = uc.user_id
WHERE p.role = 'jobseeker' 
  AND j.status = 'active'
  AND j.created_at > NOW() - INTERVAL '7 days'
LIMIT 50
ON CONFLICT DO NOTHING;

-- 6. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category_status ON jobs(category_id, status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 7. Update RLS policies for better security
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications" ON notifications
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;
CREATE POLICY "Users can mark their notifications as read" ON notifications
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Create admin notification function
CREATE OR REPLACE FUNCTION public.create_system_notification(
  target_user_id uuid,
  notification_type text,
  notification_title text,
  notification_message text,
  notification_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data, read)
  VALUES (target_user_id, notification_type, notification_title, notification_message, notification_data, false)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;