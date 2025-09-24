// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔁 Replace this with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAKifC_9VFsdz9c-9ezIrbbJsSJYc0WFv0",
  authDomain: "waste-sorting-system-b54eb.firebaseapp.com",
  projectId: "waste-sorting-system-b54eb",
  storageBucket: "waste-sorting-system-b54eb.firebasestorage.app",
  messagingSenderId: "374383568648",
  appId: "1:374383568648:web:785a869d199a923fb6eebd",
  measurementId: "G-R2VMES277X"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
