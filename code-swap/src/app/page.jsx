"use client";
// Home.js
import React from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './services/interactionsType';

import Controller from '@/Controller/controller';



export default function Home() {
  
  const  {logInteraction}  = useInteractionLogger(); // Usando o hook para acessar o contexto

  const controller = Controller();

  

  const handleButtonClick = () => {
    logInteraction(interactionsType.BUTTON_CLICK); // Registra a interação quando o botão é clicado
  };

  const handleButtonClick2 = () => {
    logInteraction(interactionsType.AUDIO_PLAY); // Registra a interação quando o botão é clicado
  };

  return (
    <div>
      <p>Hello Word.</p>
      <button onClick={handleButtonClick}>clique</button>
      <button onClick={handleButtonClick2}>clique2</button>
    </div>
  );
}

