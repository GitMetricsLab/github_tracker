import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT2h_X2bSMxjsiHilQQx9ryPwC3654lt0",
  authDomain: "github-tracker-f39ac.firebaseapp.com",
  projectId: "github-tracker-f39ac",
  storageBucket: "github-tracker-f39ac.firebasestorage.app",
  messagingSenderId: "562897055831",
  appId: "1:562897055831:web:8f63882abd2f9e13b8f312"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export { auth, signInWithGoogle };