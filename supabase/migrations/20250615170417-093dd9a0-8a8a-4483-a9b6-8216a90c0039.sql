
-- Add firebase_uid column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='firebase_uid') THEN
    ALTER TABLE public.profiles ADD COLUMN firebase_uid TEXT;
  END IF;
END $$;

-- Add unique constraint on firebase_uid if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_firebase_uid_key' AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_firebase_uid_key UNIQUE (firebase_uid);
  END IF;
END $$;

-- Update the handle_new_user function to correctly save user metadata, including firebase_uid.
-- This function is called by a trigger when a new user is created in auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Insert a new row into public.profiles, populating it with data from the new auth.users record.
  INSERT INTO public.profiles (id, email, phone, name, role, firebase_uid, profile_complete, verified, availability)
  VALUES (
    NEW.id,
    NEW.email,
    -- Use phone from metadata, fallback to user's phone field
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    -- Use name from metadata
    NEW.raw_user_meta_data->>'name',
    -- Default role to jobseeker if not provided
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'jobseeker'),
    -- Use firebase_uid from metadata
    NEW.raw_user_meta_data->>'firebase_uid',
    -- Set initial profile state
    false,
    false,
    'available'
  );
  RETURN NEW;
END;
$function$;

-- Create the trigger that calls handle_new_user() after a new user is inserted into auth.users.
-- This is the missing piece that links authentication with profile creation.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
