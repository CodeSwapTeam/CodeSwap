import { useState } from "react";

import {  createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateUserEmailAndPassword(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

}