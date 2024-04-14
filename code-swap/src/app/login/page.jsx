'use client';
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/Auth";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth , } from "../../../database/firebase";
import {setCookies} from "../services/cookies";



export default function Login(){

    const {currentUser, setCurrentUser} = useAuthContext();
    const r = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

  useEffect(()=> {
    //console.log('login', currentUser);
    if(currentUser ){
        r.push('/Dashboard');
    }
   
    
  },[currentUser])

    
   

  
    const handleSubmit = async (e) => {
      
      e.preventDefault();

      
      
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        //localStorage.setItem('userId', user.uid);
        setCookies(user.accessToken);
        localStorage.setItem('user',user.accessToken);
        // Limpar os campos de e-mail e senha após a autenticação do usuário
        setEmail('');
        setPassword('');
        setError('');
        //console.log(user);
        setCurrentUser(user);
        
       // router.push('/Dashboard');
        
      } catch (error) {
        setError(error.message);
      }
    };
    
      return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
           <h2 style={{ textAlign: 'center' }}>Authentication with Email and Password</h2>
           <form onSubmit={handleSubmit}>
             <div style={{ marginBottom: '20px' }}>
               <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
               <input 
                 type="email" 
                 id="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
                 required 
                 style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
               />
             </div>
             <div style={{ marginBottom: '20px' }}>
               <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
               <input 
                 type="password" 
                 id="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 required 
                 style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
               />
             </div>
             <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Authenticate</button>
           </form>
           {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
         </div>
     )

}