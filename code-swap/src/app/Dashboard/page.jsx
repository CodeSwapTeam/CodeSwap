"use client"
//import { useRouter } from "next/router"
//import { cookies } from 'next/headers'
import { removeCookies } from "../services/cookies"
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { useAuthContext } from "../contexts/Auth";
import { useEffect } from "react";



export default function Dashboard(){

    const {currentUser, setCurrentUser} = useAuthContext();

    const router = useRouter();

    function submitLogout(){
        removeCookies();
        localStorage.removeItem('user')
        
        setCurrentUser(null);
        router.push('/Dashboard');
    }

    function manage(){
        router.push('/ManageCourses');
    }

    useEffect(()=>{
       
    },[])

    return(
        <div>
            painel de aula.
            <button  onClick={submitLogout}>delogar</button>
            {currentUser && <button  onClick={manage}>manage</button>}
            
        </div>
    )
}