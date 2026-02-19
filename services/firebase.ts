
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, query, where, orderBy, getDocs, addDoc } from "firebase/firestore";

// As chaves devem ser configuradas no Vercel Environment Variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSy...", 
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helpers para facilitar o uso no App.tsx
export { collection, doc, setDoc, updateDoc, onSnapshot, query, where, orderBy, getDocs, addDoc };
