"use client";
import React from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './contexts/interactionsType';

import { useRouter } from 'next/navigation';

import Link from 'next/link'



export default function Home() {

  const router = useRouter();
  
  
  const  {logInteraction}  = useInteractionLogger(); // Usando o hook para acessar o contexto
  //Registrar log de carregamento de página Home
  logInteraction(interactionsType.PAGE_LOAD_HOME);


  function submitLogin(){
    //localStorage.setItem('user', 'logado');
    router.push('/Dashboard');
    //cookies().set('user', 'logado');
  }
  

  
  

  return (
    <div>
      <h1>Code Swap</h1>
        <p>Conheça nossos cursos</p>
        <button style={{border : '1px solid black', padding: '2px'}}><Link href='/Cursos'>Clique aqui</Link></button>

        <button onClick={submitLogin}> Logar </button>
        
    </div>
  );
}

