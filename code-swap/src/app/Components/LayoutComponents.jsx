'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from '../Components/NavBarPublic/page';
import NavBarPrivate from '../Components/NarBarPrivate/page';
import { ContextDataCache } from '../contexts/ContextDataCache';

const LayoutComponents = ({ children }) => {

    const { currentUser } = ContextDataCache();

    useEffect(() => {
       // console.log(currentUser);
    }, [currentUser]);

    return (
        <div>
            {currentUser ? <NavBarPrivate userData={currentUser} /> : <NavBarPublic />}
            {children}
        </div>
    );
}

export default LayoutComponents;