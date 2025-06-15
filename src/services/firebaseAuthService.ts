
import { auth, initializeRecaptcha, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from '@/config/firebase';
import { supabase } from '@/integrations/supabase/client';

export class FirebaseAuthService {
  private recaptchaVerifier: any = null;
  private confirmationResult: any = null;

  async initializeAuth() {
    try {
      // Clear any existing recaptcha first
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }
      
      // Initialize recaptcha for phone authentication
      this.recaptchaVerifier = initializeRecaptcha('recaptcha-container');
      console.log('Recaptcha initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  async sendOTP(phoneNumber: string) {
    try {
      console.log('Starting OTP send process for:', phoneNumber);
      
      if (!this.recaptchaVerifier) {
        console.log('Initializing recaptcha...');
        await this.initializeAuth();
      }

      // Format phone number for Firebase (must include country code)
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('Sending OTP to formatted number:', formattedPhone);
      
      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      
      console.log('OTP sent successfully, verification ID:', this.confirmationResult.verificationId);
      
      return { success: true, verificationId: this.confirmationResult.verificationId };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyOTP(otpCode: string) {
    try {
      console.log('Starting OTP verification with code:', otpCode);
      
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request OTP first.');
      }

      // Verify the OTP with Firebase
      console.log('Confirming OTP with Firebase...');
      const result = await this.confirmationResult.confirm(otpCode);
      const firebaseUser = result.user;
      
      console.log('Firebase user authenticated:', firebaseUser.uid);
      console.log('Phone number:', firebaseUser.phoneNumber);

      const phoneNumber = firebaseUser.phoneNumber;
      
      if (!phoneNumber) {
        throw new Error('No phone number found in Firebase user');
      }

      // Create a simple email from phone number for Supabase
      const email = `${phoneNumber.replace('+', '')}@temp.local`;
      const password = firebaseUser.uid; // Use Firebase UID as password
      
      console.log('Attempting Supabase authentication with email:', email);

      // Try to sign in first (existing user)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // User doesn't exist, create new user
        console.log('User not found, creating new user...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
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

        console.log('New user created successfully:', signUpData.user?.id);
        return {
          success: true,
          userId: signUpData.user?.id,
          phone: phoneNumber
        };
      } else if (signInError) {
        console.error('Unexpected sign in error:', signInError);
        throw signInError;
      } else {
        console.log('Existing user signed in successfully:', signInData.user?.id);
        return {
          success: true,
          userId: signInData.user?.id,
          phone: phoneNumber
        };
      }
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
