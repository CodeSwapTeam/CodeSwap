"use client";
import React, {  createContext, useContext, useState } from 'react';

// Criando o contexto de autenticação
export const authContext = createContext();

export const useAuthContext = () => useContext(authContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);


  return (
    <authContext.Provider value={{ currentUser, setCurrentUser }}>
      { children}
    </authContext.Provider>
  );
};