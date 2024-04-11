"use client";
import React, { createContext, useContext } from 'react';
import Controller from '@/Controller/controller';
import { getCodeByInteractionType } from './getCodeByInteractionType';

// Criação do contexto
const InteractionContext = createContext();

// Hook personalizado para utilizar o contexto
export const useInteractionLogger = () => useContext(InteractionContext);

// Componente Provedor para envolver a aplicação
export const InteractionProvider = ({ children }) => {
 
  const controller = Controller();
  

  const MAX_LOGS = 10;

   // Função para registrar interações do usuário
  const logInteraction = (interactionType) => {

    const type = interactionType.MESSAGE;
    const code = getCodeByInteractionType(type);
    
    if (typeof window !== 'undefined' && window.localStorage) {

      const formattedDate = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
      console.log('Interação registrada:', interactionType, 'em:', formattedDate);
      
      let logs = [];
      // Obter os logs existentes do localStorage
      const existingLogsJSON = localStorage.getItem("logs");
  
      // Adicionar o novo log aos logs existentes
      if (existingLogsJSON) {
        try {
          logs = JSON.parse(existingLogsJSON); 
        } catch (error) {
          console.error("Error parsing existing logs:", error);
          logs = [];
        }
      }
  
      logs.push({
        interactionType,
        code,
        timestamp: formattedDate,
      });
  
      if (logs.length > MAX_LOGS) {
        controller.saveInteraction(logs);
        logs = [];
      }
  
      localStorage.setItem('logs', JSON.stringify(logs));
    } 
  };
  
  // Contexto e a função de registro de interações para os componentes filhos
  return (
    <InteractionContext.Provider value={{ logInteraction}}>
      {children}
    </InteractionContext.Provider>
  );
};


