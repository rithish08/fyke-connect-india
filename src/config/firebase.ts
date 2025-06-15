
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize RecaptchaVerifier
export const initializeRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    'size': 'invisible',
    'callback': () => {
      console.log('reCAPTCHA solved');
    }
  });
};

export { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
