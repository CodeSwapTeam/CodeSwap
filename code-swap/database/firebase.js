// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxysc_L4OQEUlMr85WwfrZXG8ro3Xz1pE",
  authDomain: "code-swap-cc05a.firebaseapp.com",
  projectId: "code-swap-cc05a",
  storageBucket: "code-swap-cc05a.appspot.com",
  messagingSenderId: "818846687707",
  appId: "1:818846687707:web:a07699071f6d376a7507fe",
  measurementId: "G-QMTVBNZERC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);

import { getFirestore } from "firebase/firestore";

export const db = getFirestore(app);