"use client";
import React, { createContext, useContext } from 'react';
import Controller from '@/Controller/controller';
import { getCodeByInteractionType } from './getCodeByInteractionType';

// Criação do contexto
// Este é um objeto que será compartilhado por todos os componentes que o utilizam
const InteractionContext = createContext();

// Hook personalizado para utilizar o contexto
// Este hook permite que os componentes acessem o valor atual do contexto InteractionContext
export const useInteractionLogger = () => useContext(InteractionContext);

// Componente Provedor para envolver a aplicação
// Este componente irá fornecer o contexto para todos os componentes filhos
export const InteractionProvider = ({ children }) => {
 
  // Inicializa o controlador
  const controller = Controller();
  
  // Define o número máximo de logs que serão armazenados
  const MAX_LOGS = 10;

  // Função para registrar interações do usuário
  // Esta função será chamada sempre que uma interação do usuário precisar ser registrada
  const logInteraction = (interactionType) => {

    // Obtém o código correspondente ao tipo de interação
    const type = interactionType.MESSAGE;
    const code = getCodeByInteractionType(type);
    
    // Verifica se o localStorage está disponível
    // Se estiver, a interação será registrada no localStorage
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
      }else{
        localStorage.setItem('logs', logs);
      }
  
      logs.push({
        interactionType,
        code,
        timestamp: formattedDate,
      });
      
      // Se o número de logs exceder MAX_LOGS, salva os logs e redefine o array de logs
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


