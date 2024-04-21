"use client";
import React, {  createContext, useContext, useEffect, useState } from 'react';
import { Algorithm, decryptToken } from '../services/encryptedAlgorithm';
import { getCookies, setCookies } from '../services/cookies';

// Criando o contexto de autenticação
export const authContext = createContext();

export const useAuthContext = () => useContext(authContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  

  useEffect(()=>{
    
    
  },[])

  return (
    <authContext.Provider value={{ currentUser, setCurrentUser }}>
      { children}
    </authContext.Provider>
  );
};