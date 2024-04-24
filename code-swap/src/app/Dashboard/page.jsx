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
        // Se o usuário atual não estiver definido, tente pegar os dados no cache local
        if (currentUser == null) {

            const queryResponse = await controller.manageUsers.GetUserLocalData();

            // Se não houver dados de cookie disponíveis, redirecione para a página de login
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
            
            {userData && <p>Bem-vindo(a) <strong>{userData.userName}</strong></p> }
            <p>PÁGINA DASHBOARD PRINCIPAL DO ALUNO</p>
        </div>
    )
}