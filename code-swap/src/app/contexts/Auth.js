"use client";
import React, {  createContext, useContext, useState } from 'react';


// Criando o contexto de autenticação
export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      { children}
    </AuthContext.Provider>
  );
};