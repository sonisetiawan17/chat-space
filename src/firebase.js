import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB0AR-lU_Fxa4LieRBlPywVOg0mrXG-ZMk',
  authDomain: 'chat-7e810.firebaseapp.com',
  projectId: 'chat-7e810',
  storageBucket: 'chat-7e810.appspot.com',
  messagingSenderId: '1059164666382',
  appId: '1:1059164666382:web:ab538731f6ce4312269a5f',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
