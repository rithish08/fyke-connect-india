
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCYDcdq0Jz0g7yJimQk-Q7ffOED06eaTZ0",
  authDomain: "fyke-connect.firebaseapp.com",
  projectId: "fyke-connect",
  storageBucket: "fyke-connect.firebasestorage.app",
  messagingSenderId: "599132732722",
  appId: "1:599132732722:web:942bc8886eff41f54eab2b",
  measurementId: "G-YRMRR08CNH"
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
