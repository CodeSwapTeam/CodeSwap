"use client";
import React, { useEffect, useState } from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './contexts/interactionsType';

import { useRouter } from 'next/navigation';

import Link from 'next/link'
import { getCookies } from './services/cookies';
import { useAuthContext } from './contexts/Auth';


export default function Home() {
  
  const r = useRouter();
   
  
  

  const {currentUser, setCurrentUser} = useAuthContext();

  useEffect(() => {
    //console.log('home', currentUser);
    if(currentUser){
     
      r.push('/Dashboard');
    }
    
  }, []);

 
    
      return (
        <div>
          <h1>Code Swap</h1>
          <p>Conheça nossos cursos</p>
          <button style={{ border: '1px solid black', padding: '2px' }}>
            <Link href='/Cursos'>Clique aqui</Link>
          </button>
          <Link href='/login'>Logar</Link>
        </div>
      );
    
    
  
  
  
}