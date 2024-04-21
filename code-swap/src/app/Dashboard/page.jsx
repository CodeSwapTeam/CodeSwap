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

    

    
    useEffect(()=>{
        

        async function pegarDadosCookies(){
            if(currentUser == null){
                const userCript = await getCookies();
                
                const userDescript = decryptObjectData(userCript.value);
                //console.log(userDescript);
                setUserData(userDescript);
                
                setCurrentUser(userDescript);
                
             }else{
                setUserData(currentUser)
             }
        }
        pegarDadosCookies();
       
    },[userData])

    return(
        <div>
            
            <p>Listagem de Cursos do Aluno</p>
            {userData && <p>Bem-vindo(a) {userData.userName}</p> }
        </div>
    )
}