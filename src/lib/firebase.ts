// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;