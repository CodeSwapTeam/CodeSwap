"use client"
//import { useRouter } from "next/router"
//import { cookies } from 'next/headers'
import { removeCookies } from "../services/cookies"
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { useAuthContext } from "../contexts/Auth";
import { useEffect } from "react";
import NavBarPrivate from "../Components/NavBarPrivate";



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
            <NavBarPrivate submitLogout={submitLogout}/>
            <p>Listagem de Cursos do Aluno</p>
            
        </div>
    )
}