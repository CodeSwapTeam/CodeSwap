"use client";
import { useState } from "react";
import { auth } from "../../../database/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function FormUserEmailAndPassword(){

  const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const[user, setUser] = useState('');

    useState(()=>{
      if(user){
        console.log(user)
        router.push('/Dashboard');
      }
    },[user])
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created:', user);
        // Limpar os campos de e-mail e senha após a criação do usuário
        setEmail('');
        setPassword('');
        setError('');
        setUser(user.displayName);
      } catch (error) {
        setError(error.message);
      }
    };

    return (
       <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ textAlign: 'center' }}>Create User with Email and Password</h2>
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
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Criar Conta</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </div>
    )
}
