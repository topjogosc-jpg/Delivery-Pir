
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  limit,
  deleteDoc,
  getDoc,
  Firestore
} from "firebase/firestore";

// Função para limpar strings "undefined" literais que o Vite pode injetar
const cleanVar = (val: any) => {
  if (val === undefined || val === null || val === "undefined" || val === "") return "";
  return String(val).trim();
};

const firebaseConfig = {
  apiKey: cleanVar(process.env.VITE_FIREBASE_API_KEY) || cleanVar(process.env.API_KEY), 
  authDomain: cleanVar(process.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanVar(process.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanVar(process.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanVar(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanVar(process.env.VITE_FIREBASE_APP_ID)
};

let db: Firestore | null = null;
let isDbInitialized = false;

try {
  if (firebaseConfig.projectId && firebaseConfig.projectId !== "undefined") {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isDbInitialized = true;
    console.log("%c✓ Delivery Pira: Banco de dados conectado!", "color: green; font-weight: bold;");
  } else {
    console.warn("%c! Delivery Pira: Rodando em modo DEMO (Offline). Configure o VITE_FIREBASE_PROJECT_ID para ativar o banco real.", "color: orange;");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

export { 
  db,
  isDbInitialized,
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  limit,
  deleteDoc,
  getDoc
};
