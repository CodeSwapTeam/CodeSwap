'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from './NavBarPublic';
import NavBarPrivate from './NavBarPrivate';
import { getCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { useAuthContext } from "../contexts/Auth";

const LayoutComponents = ({ children }) => {

    const {currentUser, setCurrentUser} = useAuthContext();

    const [userLogged, setUserLogged] = useState();
    const [userData, setUserData] = useState();
    
    async function getUser() {
        
        
        const userCookie = await getCookies();
        //console.log(currentUser);
        
        if (currentUser) {
            
            setUserLogged(true);
            setUserData(currentUser);
        }else{
            if(userCookie){
                const userDescript = decryptObjectData(userCookie.value);
                setUserData(userDescript);
                setCurrentUser(userDescript);
                setUserLogged(true);
            }
            setUserLogged(false);
        
        }
          
    }

    useEffect(() => {
        getUser();
    }, [currentUser]);

    return (
        <div>
            {userLogged ? <NavBarPrivate userData={userData} /> : <NavBarPublic />}
            {children}
        </div>
    );
}

export default LayoutComponents;