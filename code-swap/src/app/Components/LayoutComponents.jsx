'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from '../Components/NavBarPublic/page';
import NavBarPrivate from '../Components/NarBarPrivate/page';
import { ContextDataCache } from '../Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import { TokenVerify } from '../services/AuthService';

const LayoutComponents = ({ children }) => {

    const controller = Controller();

    const { currentUser, setCurrentUser } = ContextDataCache();

    async function getUser() {
        if(!currentUser){
            //pegar o token nos cookies e buscar o usuário no banco de dados 
            const token = await controller.services.manageCookies.getCookiesAcessToken(); 
            if(!token) return 
            const userDecrypted = await TokenVerify(token.value);
         
            const userCached = await controller.manageUsers.GetUserDataBase(userDecrypted.userId);
            setCurrentUser(userCached);
        } 
    }

    useEffect(() => {
        getUser();
    }, [currentUser]);

    return (
        <>
            {currentUser ? <NavBarPrivate userData={currentUser} /> : <NavBarPublic />}
            {children}
        </>
    );
}

export default LayoutComponents;