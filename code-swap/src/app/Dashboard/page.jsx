"use client"
import { useRouter } from "next/navigation";
import { ContextDataCache } from "../contexts/ContextDataCache";
import { useEffect, useState } from "react";
import Controller from "@/Controller/controller";


export default function Dashboard(){

    const controller = Controller();

    const { currentUser, setCurrentUser } = ContextDataCache();

    const [userData, setUserData] = useState();

    const router = useRouter();

    async function SearchData() {
        // Se o usuário atual não estiver definido, tente pegar os dados do cookie
        if (currentUser == null) {

            const queryResponse = await controller.QueryRequests.GetUserData();
            console.log(queryResponse);
            //const userCript = await controller.services.manageCookies.getCookiesAcessToken();
    
            // Se não houver dados de cookie, nem do cache do contexto e
            if (!queryResponse) {
                router.push('/login');
                return;
            }
    

            setUserData(queryResponse);
            setCurrentUser(queryResponse);
            
        } else {
            // Se o usuário atual já estiver definido, apenas atualize o estado do usuário
            setUserData(currentUser);
        }
    }

    
    useEffect(()=>{
    
        SearchData();
       
    },[userData])

    return(
        <div style={{color:'white'}}> 
            <p>Listagem de Cursos do Aluno</p>
            {userData && <p>Bem-vindo(a) <strong>{userData.userName}</strong></p> }
        </div>
    )
}