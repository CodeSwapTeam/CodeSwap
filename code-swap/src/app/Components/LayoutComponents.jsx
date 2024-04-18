'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from './NavBarPublic';
import NavBarPrivate from './NavBarPrivate';
import { getCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';

const LayoutComponents = ({ children }) => {

    const [userLogged, setUserLogged] = useState();
    const [userData, setUserData] = useState();
    
    async function getUser() {
        
        
        const userCookie = await getCookies();
        const userDataDescrypt = decryptObjectData(userCookie.value);
        if (userDataDescrypt) {
            setUserLogged(true);
            setUserData(userDataDescrypt);
        }else{
            setUserLogged(false);
        
        }
          
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            {userLogged ? <NavBarPrivate userData={userData} /> : <NavBarPublic />}
            {children}
        </div>
    );
}

export default LayoutComponents;