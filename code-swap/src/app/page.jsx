"use client";
// Home.js
import React from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './services/interactionsType';

import Controller from '@/Controller/controller';

import Divisor from './components/Divisor/page';



export default function Home() {
  
  const  {logInteraction}  = useInteractionLogger(); // Usando o hook para acessar o contexto

  const controller = Controller();

  

  const handleButtonClick = () => {
    logInteraction(interactionsType.CREATE_MODULE); // Registra a interação quando o botão é clicado
  };

  

  return (
    <>
    <div>
      <p>Hello Word.</p>
      <button onClick={handleButtonClick}>Criar Curso WEB DESIGN</button>
    </div>
    <Divisor />
    </>
  );
}

