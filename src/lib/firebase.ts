import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAB1S_a71exteCAlts3MvmT-gyV_WEMjY0",
  authDomain: "rosy-dialect-488414-r1.firebaseapp.com",
  projectId: "rosy-dialect-488414-r1",
  storageBucket: "rosy-dialect-488414-r1.firebasestorage.app",
  messagingSenderId: "1088378702415",
  appId: "1:1088378702415:web:c19a52938f2ee58f40f83a"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, 'ai-studio-wattakfaalumni-5ead791e-124a-49e7-ac62-8501af6e0ab6');

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, getDoc };

