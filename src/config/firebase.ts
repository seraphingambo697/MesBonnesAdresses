import { initializeApp, getApps, getApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'xxx.firebaseapp.com',
  projectId: 'xxx',
  storageBucket: 'xxx.firebasestorage.app',
  messagingSenderId: 'xxx',
  appId: 'xxx',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Exporté par le bundle RN de firebase/auth, absent des types TS
const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence;

function createAuth(): FirebaseAuth.Auth {
  try {
    return FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return FirebaseAuth.getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
