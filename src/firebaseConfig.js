// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCmW-QJU3gzZk8Pade34umBWTBo-nd6tms",
    authDomain: "rekindle-book-lending.firebaseapp.com",
    projectId: "rekindle-book-lending",
    storageBucket: "rekindle-book-lending.firebasestorage.app",
    messagingSenderId: "948622833342",
    appId: "1:948622833342:web:a98898b189625910f590ef",
    measurementId: "G-JZE888ZQQ7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };
export { db }; // ✅ Only export `db`, not `addDoc`
