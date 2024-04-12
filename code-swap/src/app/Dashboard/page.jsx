"use client"
//import { useRouter } from "next/router"
//import { cookies } from 'next/headers'

export default function Dashboard(){

    //const router = useRouter();

    function submitLogout(){
        
    }

    return(
        <div>
            painel de aula.
            <button onClick={submitLogout}>Deslogar</button>
        </div>
    )
}