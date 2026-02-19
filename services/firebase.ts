
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

// Helper para extrair variáveis de ambiente de forma segura
const getEnv = (key: string) => {
  const val = process.env[key] || (window as any).process?.env?.[key];
  if (val === "undefined" || val === "null" || !val) return "";
  return String(val).trim();
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || getEnv("API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID")
};

let db: Firestore | null = null;
let isDbInitialized = false;

try {
  // Se tivermos pelo menos o Project ID, tentamos conectar
  if (firebaseConfig.projectId && firebaseConfig.projectId.length > 3) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isDbInitialized = true;
    console.log("%c✓ Delivery Pira: Banco de dados conectado!", "color: #10b981; font-weight: bold; font-size: 12px;");
  } else {
    console.log("%cℹ Delivery Pira: Rodando em Modo Demo. Conecte o Firebase para sincronizar pedidos entre celulares.", "color: #f59e0b; font-weight: bold;");
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
