"use client"
//import { useRouter } from "next/router"
//import { cookies } from 'next/headers'
import { getCookies, removeCookies } from "../services/cookies"
import { useRouter } from "next/navigation";
import { useAuthContext } from "../contexts/Auth";
import { useEffect, useState } from "react";


import { decryptObjectData } from "../services/encryptedAlgorithm";


export default function Dashboard(){

    const {currentUser, setCurrentUser} = useAuthContext();

    const [userData, setUserData] = useState();

    const router = useRouter();

    async function pegarDadosCookies() {
        // Se o usuário atual não estiver definido, tente pegar os dados do cookie
        if (currentUser == null) {
            const userCript = await getCookies();
    
            // Se não houver dados de cookie, redirecione para a página de login
            if (!userCript) {
                router.push('/login');
                return;
            }
    
            // Descriptografe os dados do usuário e atualize o estado do usuário
            const userDescript = decryptObjectData(userCript.value);
            setUserData(userDescript);
            setCurrentUser(userDescript);
        } else {
            // Se o usuário atual já estiver definido, apenas atualize o estado do usuário
            setUserData(currentUser);
        }
    }

    
    useEffect(()=>{
    
        pegarDadosCookies();
       
    },[userData])

    return(
        <div style={{color:'white'}}> 
            <p>Listagem de Cursos do Aluno</p>
            {userData && <p>Bem-vindo(a) <strong>{userData.userName}</strong></p> }
        </div>
    )
}