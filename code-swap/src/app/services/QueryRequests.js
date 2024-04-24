import { useContext } from 'react';
import { ContextDataCache } from "../contexts/ContextDataCache";

export function useQueryRequests(){
    
    //função para buscar os dados do usuário
    async function GetUserData(){
        //Primeiro Buscar no cache do localstorage, senão buscar no banco de dados
        
        //buscar no cache do localstorage
        const userData = JSON.parse(localStorage.getItem('currentUserData'));
        if(userData){
            return userData;
        }       
    }

    //função para buscar um usuario pelo id
    async function GetUserById(userId){
        //buscar no banco de dados
        return null;
    }

    return {
        GetUserData,
        GetUserById
    }
}