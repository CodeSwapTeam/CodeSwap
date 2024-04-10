"use client";
// InteractionContext.js
import React, { createContext, useContext } from 'react';
import logRegister from '../services/logRegister';



// Criação do contexto
const InteractionContext = createContext();

// Hook personalizado para utilizar o contexto
export const useInteractionLogger = () => useContext(InteractionContext);

// Componente Provedor para envolver a aplicação
export const InteractionProvider = ({ children }) => {
  // Função para registrar interações

  const MAX_LOGS = 10;

  const logInteraction = (interactionType) => {
    const currentDate = new Date(); // Obter a data e hora atuais
    const formattedDate = currentDate.toISOString(); // Formatar a data e hora como uma string
    const code = logRegister(interactionType);
    //console.log('Interação registrada: ', interactionType, 'código: ', code, 'em: ', formattedDate);
  
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
       logs = [];
      }

    localStorage.setItem('logs', JSON.stringify(logs))

  };

  // Fornecer o contexto e a função de registro de interações para os componentes filhos
  return (
    <InteractionContext.Provider value={{ logInteraction }}>
      {children}
    </InteractionContext.Provider>
  );
};


