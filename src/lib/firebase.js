import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from "firebase/storage";


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAEHQSoGKKwkaPBfeb_SCK42YJzkN3ypnA",
    authDomain: "lavish-61052.firebaseapp.com",
    projectId: "lavish-61052",
    storageBucket: "lavish-61052.firebasestorage.app",
    messagingSenderId: "14696390458",
    appId: "1:14696390458:web:a09431fc265a8986a07a03",
    measurementId: "G-KCGMGQSD6S"
  };
  

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  } else {
    getApp(); // If already initialized, use the existing app
  }
  
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

  
  export { db, auth, storage };
  