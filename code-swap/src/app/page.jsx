"use client";
// Home.js
import React from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './services/interactionsType';



export default function Home() {
  
  const { logInteraction } = useInteractionLogger(); // Usando o hook para acessar o contexto
  logInteraction(interactionsType.PAGE_LOAD);

  const handleButtonClick = () => {
    logInteraction(interactionsType.LOGIN); // Registra a interação quando o botão é clicado
  };

  return (
    <div>
      <p>Hello Word.</p>
      <button onClick={handleButtonClick}>clique</button>
    </div>
  );
}

