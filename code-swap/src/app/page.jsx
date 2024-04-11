"use client";
// Home.js
import React from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './contexts/interactionsType';

import Controller from '@/Controller/controller';

import ListCourses from './Components/ListCourses';



export default function Home() {
  
  const  {logInteraction}  = useInteractionLogger(); // Usando o hook para acessar o contexto
  //Registrar log de carregamento de página Home
  logInteraction(interactionsType.PAGE_LOAD_HOME);

  const controller = Controller();

  

  
  

  return (
    <div>
      <ListCourses/>
      
    </div>
  );
}

