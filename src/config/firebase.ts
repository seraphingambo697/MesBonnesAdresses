import { initializeApp, getApps, getApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCmVOq28Ou19YH_uuyFrnnp7Pcac4AfPcA',
  authDomain: 'mes-bonnes-adresses-36e1d.firebaseapp.com',
  projectId: 'mes-bonnes-adresses-36e1d',
  storageBucket: 'mes-bonnes-adresses-36e1d.firebasestorage.app',
  messagingSenderId: '231127163414',
  appId: '1:231127163414:web:f91a450a9bbebc6918cb37',
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