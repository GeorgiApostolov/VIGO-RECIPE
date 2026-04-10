import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBCZnskJAmA_hx8g0LG_XuPjd7-qaMlz-g',
  authDomain: 'vigo-recipe.firebaseapp.com',
  projectId: 'vigo-recipe',
  storageBucket: 'vigo-recipe.firebasestorage.app',
  messagingSenderId: '1094064654934',
  appId: '1:1094064654934:web:0401c3377c96e5f495c9f7',
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
