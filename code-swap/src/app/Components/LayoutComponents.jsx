'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from '../Components/NavBarPublic/page';
import NavBarPrivate from '../Components/NarBarPrivate/page';
import { getCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { useAuthContext } from "../contexts/Auth";
import styled from 'styled-components';

const PageContainer = styled.section`

`

const ContentContainer = styled.div`
    overflow-x: hidden;
    height: 100vh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`

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
        <PageContainer>
            {userLogged ? <NavBarPrivate userData={userData} /> : <NavBarPublic />}
            <ContentContainer>
                {children}
            </ContentContainer>
        </PageContainer>
    );
}

export default LayoutComponents;