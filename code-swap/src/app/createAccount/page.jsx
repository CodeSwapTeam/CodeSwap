"use client";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../database/firebase";
import { useAuthContext } from "../contexts/Auth";
import { useRouter } from "next/navigation";
import { setCookies } from "../services/cookies";
import Link from 'next/link'
import { CreateUser } from "../../../database/functions/createUser";
import NavBarPublic from "../Components/NavBarPublic";

export default function CreateAccount() {

    const { currentUser, setCurrentUser } = useAuthContext();



    const router = useRouter();

    useEffect(() => {
        //console.log('login', currentUser);
        if (currentUser) {
            router.push('/Dashboard');
        }
    }, [currentUser])


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isWhatsApp, setIsWhatsApp] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState(null);

    function criarConta() {
        const userData = {
            userName: displayName,
            email: email,
            phone: phoneNumber,
            whatsapp: isWhatsApp
        }
        CreateUser(userData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !displayName) {
            alert('Nickname não pode ser em branco! .');
            return;
        }

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: displayName
            });

            criarConta();
            alert(`Conta criada com sucesso! ${displayName}`);


            setEmail('');
            setPassword('');
            setDisplayName('');
            setError(null);
            setCurrentUser(user);

            setCookies(user.accessToken);
            localStorage.setItem('user', user.accessToken);


        } catch (error) {
            console.log('Error creating new user:', error.message);
            setError(error.message);
        }
    };

    return (
        <>
        <NavBarPublic/>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
           
           <h2 style={{ textAlign: 'center' }}>Criar Conta</h2>
           <form onSubmit={handleSubmit}>
               <div style={{ marginBottom: '20px' }}>
                   <label htmlFor="displayName" style={{ display: 'block', marginBottom: '5px', textAlign: 'center' }}>Como gostaria de ser chamado(a)?:</label>
                   <input
                       type="text"
                       id="displayName"
                       value={displayName}
                       onChange={(e) => setDisplayName(e.target.value)}
                       style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                   />
               </div>
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

               <div style={{ marginBottom: '20px' }}>
                   <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>Número de Telefone:</label>
                   <input
                       type="text"
                       id="phoneNumber"
                       value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)}
                       style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                   />
               </div>
               <div style={{ marginBottom: '20px' }}>
                   <label htmlFor="whatsapp" style={{ display: 'block', marginBottom: '5px' }}>
                       <input
                           type="checkbox"
                           id="whatsapp"
                           checked={isWhatsApp}
                           onChange={(e) => setIsWhatsApp(e.target.checked)}
                           style={{ marginRight: '5px' }}
                       />
                       WhatsApp?
                   </label>
               </div>

               <Link style={{ paddingBottom: '5px' }} href='/createAccount'>Já possui conta?</Link>

               <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Criar Conta</button>
           </form>
           {error && <p style={{ color: 'red', marginTop: '10px' }}>Erro: {error}</p>}

       </div>
        </>
        
        
        
    );
}
