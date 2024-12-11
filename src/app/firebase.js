import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCEcD9U8nQ6mau99Ray17lZPqzXcO7ufDg",
  authDomain: "ohhpoint.firebaseapp.com",
  projectId: "ohhpoint",
  storageBucket: "ohhpoint.firebasestorage.app",
  messagingSenderId: "1242156174",
  appId: "1:1242156174:web:9f0caac6c220e9d7248ddf",
  measurementId: "G-QS76XW5TGW"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);




