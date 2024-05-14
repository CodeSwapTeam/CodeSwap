"use client";
import React, {  createContext, useContext, useEffect, useState } from 'react';
import {  TokenVerify } from '../services/AuthService';



// Criando o contexto de autenticação
export const cacheContext = createContext();

export const ContextDataCache = () => useContext(cacheContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {



  const [currentUser, setCurrentUser] = useState(null); // Estado com dados do usuário autenticado

  useEffect(() => {
    if (!currentUser) {
      console.log('Buscando dados do usuário...');
      // pegar nos cookies o token de acesso nos cookies
      const token = document.cookie.split('user=')[1];

      async function getUserDataToken() {
        // verificando se o token é válido
        const tokenVerify = token && (await TokenVerify(token).catch((error) => {
          console.error('Erro ao verificar o token:', error);
        }));

        if (tokenVerify) {
          // Atualize o estado currentUser aqui
          setCurrentUser(tokenVerify.userData);
        }
      }

      getUserDataToken();
    }
  }, [currentUser]);

   

  

  return (
    <cacheContext.Provider value={
        { 
          currentUser,
          setCurrentUser,


        }}>
      { children}
    </cacheContext.Provider>
  );
};