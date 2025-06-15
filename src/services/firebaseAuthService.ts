
import { auth, initializeRecaptcha, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from '@/config/firebase';
import { supabase } from '@/integrations/supabase/client';

export class FirebaseAuthService {
  private recaptchaVerifier: any = null;
  private confirmationResult: any = null;

  async initializeAuth() {
    try {
      // Initialize recaptcha for phone authentication
      this.recaptchaVerifier = initializeRecaptcha('recaptcha-container');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string) {
    try {
      if (!this.recaptchaVerifier) {
        await this.initializeAuth();
      }

      // Format phone number for Firebase (must include country code)
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('Sending OTP to:', formattedPhone);
      
      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      
      return { success: true, verificationId: this.confirmationResult.verificationId };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyOTP(otpCode: string) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request OTP first.');
      }

      // Verify the OTP with Firebase
      const result = await this.confirmationResult.confirm(otpCode);
      const firebaseUser = result.user;
      
      console.log('Firebase user authenticated:', firebaseUser.uid);

      // Create user in Supabase manually instead of using Firebase token
      const phoneNumber = firebaseUser.phoneNumber;
      
      // Check if user already exists in Supabase
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      let userId = existingUser?.id;

      if (!existingUser) {
        // Create new user in Supabase auth.users table using admin functions
        // For now, we'll create a profile directly and let the trigger handle the rest
        console.log('Creating new user profile for:', phoneNumber);
        
        // Sign up the user with a dummy email (we'll use phone as identifier)
        const dummyEmail = `${phoneNumber.replace('+', '')}@fyke.local`;
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: dummyEmail,
          password: firebaseUser.uid, // Use Firebase UID as password
          options: {
            data: {
              phone: phoneNumber,
              firebase_uid: firebaseUser.uid
            }
          }
        });

        if (signUpError) {
          console.error('Error creating Supabase user:', signUpError);
          throw signUpError;
        }

        userId = newUser.user?.id;
      } else {
        // Sign in existing user
        const dummyEmail = `${phoneNumber.replace('+', '')}@fyke.local`;
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: dummyEmail,
          password: firebaseUser.uid
        });

        if (signInError) {
          console.error('Error signing in user:', signInError);
          throw signInError;
        }

        userId = signInData.user?.id;
      }

      return {
        success: true,
        userId: userId,
        phone: phoneNumber
      };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }
  }

  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}

export const firebaseAuthService = new FirebaseAuthService();
