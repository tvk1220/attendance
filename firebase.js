import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-ZFIHAGipf9EZ801tB1fxxsm6arteW8k",
  authDomain: "smart-attendence-c1242.firebaseapp.com",
  projectId: "smart-attendence-c1242",
  storageBucket: "smart-attendence-c1242.firebasestorage.app",
  messagingSenderId: "998943461655",
  appId: "1:998943461655:web:2cfd92e6ce54dcca25a752"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);