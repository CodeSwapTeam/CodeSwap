"use client";
import React, { useEffect, useState } from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './contexts/interactionsType';

import { useRouter } from 'next/navigation';

import Link from 'next/link'
import { getCookies } from './services/cookies';
import { useAuthContext } from './contexts/Auth';
import NavBarPublic from './Components/NavBarPublic';


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
          <NavBarPublic/>
          <h1>Code Swap</h1>
          <p>Apresentação</p>
        </div>
      );
    
    
  
  
  
}