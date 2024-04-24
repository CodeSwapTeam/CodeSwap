'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from '../Components/NavBarPublic/page';
import NavBarPrivate from '../Components/NarBarPrivate/page';
import { getCookiesAcessToken } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { ContextDataCache } from '../contexts/ContextDataCache';

const LayoutComponents = ({ children }) => {

    //const {currentUser, setCurrentUser} = ContextDataCache();
    const {currentUser, setCurrentUser} = ContextDataCache();

    const [userLogged, setUserLogged] = useState();
    const [userData, setUserData] = useState();
    
    async function getUser() {
        
        
        const userCookie = await getCookiesAcessToken();
       // console.log(userCookie);
        
       
          
    }

    useEffect(() => {
        
    }, []);

    return (
        <div>
            {currentUser ? <NavBarPrivate userData={userData} /> : <NavBarPublic />}
            {children}
        </div>
    );
}

export default LayoutComponents;