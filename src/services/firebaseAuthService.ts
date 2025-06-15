
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

      // Create or get user in Supabase using Firebase custom token
      const firebaseToken = await firebaseUser.getIdToken();
      
      // Sign in to Supabase with Firebase token
      const { data: supabaseUser, error } = await supabase.auth.signInWithIdToken({
        provider: 'firebase',
        token: firebaseToken,
      });

      if (error) {
        console.error('Supabase authentication error:', error);
        throw error;
      }

      return {
        success: true,
        user: supabaseUser.user,
        session: supabaseUser.session,
        phone: firebaseUser.phoneNumber
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
