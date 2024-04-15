"use client";
import React, {  createContext, useContext, useEffect, useState } from 'react';
import { Algorithm, decryptToken } from '../services/encryptedAlgorithm';
import { getCookies, setCookies } from '../services/cookies';

// Criando o contexto de autenticação
export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  

  useEffect(()=>{
    
    
  },[])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      { children}
    </AuthContext.Provider>
  );
};