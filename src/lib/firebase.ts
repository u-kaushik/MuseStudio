
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "muse-studio-l39yy",
  appId: "1:1015212000225:web:bc390274a8680a90bec8a0",
  storageBucket: "muse-studio-l39yy.firebasestorage.app",
  apiKey: "AIzaSyCwc8B8w5Np5mfGqB8dVB7nZ5VT7rq5sF0",
  authDomain: "muse-studio-l39yy.firebaseapp.com",
  messagingSenderId: "1015212000225",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
