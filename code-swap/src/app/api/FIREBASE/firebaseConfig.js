// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3vcsQV7NL4s4cNBWkdgY9ORa6yuK2VKM",
  authDomain: "codeswap-test.firebaseapp.com",
  projectId: "codeswap-test",
  storageBucket: "codeswap-test.appspot.com",
  messagingSenderId: "368234998748",
  appId: "1:368234998748:web:c2c65c6ec41ab409c07d19",
  measurementId: "G-ZH51KL4533"
};


export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);

import { getFirestore } from "firebase/firestore";

export const dbAPI = getFirestore(app);

export const storage = getStorage(app);







