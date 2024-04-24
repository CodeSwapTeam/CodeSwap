"use client";
import React, {  createContext, useContext, useState } from 'react';

// Criando o contexto de autenticação
export const cacheContext = createContext();

export const ContextDataCache = () => useContext(cacheContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null); // Estado com dados do usuário autenticado
  


  return (
    <cacheContext.Provider value={{ currentUser, setCurrentUser }}>
      { children}
    </cacheContext.Provider>
  );
};