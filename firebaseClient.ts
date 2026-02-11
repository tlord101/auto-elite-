import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAocB-xjAk8-xIIcDLjx72k9I8OK4jHVgE",
  authDomain: "tlord-1ab38.firebaseapp.com",
  databaseURL: "https://tlord-1ab38-default-rtdb.firebaseio.com",
  projectId: "tlord-1ab38",
  storageBucket: "tlord-1ab38.firebasestorage.app",
  messagingSenderId: "750743868519",
  appId: "1:750743868519:web:5a937bc8e75e86a96570c2",
  measurementId: "G-5MDEM4EWHJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
