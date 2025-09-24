import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAKifC_9VFsdz9c-9ezIrbbJsSJYc0WFv0",
  authDomain: "waste-sorting-system-b54eb.firebaseapp.com",
  databaseURL: "https://waste-sorting-system-b54eb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "waste-sorting-system-b54eb",
  storageBucket: "waste-sorting-system-b54eb.appspot.com",
  messagingSenderId: "374383568648",
  appId: "1:374383568648:web:785a869d199a923fb6eebd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

export { database };