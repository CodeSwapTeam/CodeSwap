"use client";
import React, {  createContext, useContext, useEffect, useState } from 'react';
import { getCookies } from '../services/cookies';

import { getUserId } from '../../../database/functions/getUserId';

// Criando o contexto de autenticação
export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  //const [loading, setLoading] = useState(true);

  const [user, setUser] = useState();

  useEffect(() => {
    
    async function getCookiesUser(){
        const user = await getCookies();
        const  userIdDataBase = await getUserId();

        if(user === userIdDataBase){
            setUser(user);
        }
        
        
    }

    getCookiesUser();
    
    
    
    if(user){
        setCurrentUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      { children}
    </AuthContext.Provider>
  );
};