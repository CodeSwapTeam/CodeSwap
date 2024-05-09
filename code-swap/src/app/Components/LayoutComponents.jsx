'use client';
import React, { useEffect, useState } from 'react';
import NavBarPublic from '../Components/NavBarPublic/page';
import NavBarPrivate from '../Components/NarBarPrivate/page';
import { ContextDataCache } from '../Providers/ContextDataCache';

const LayoutComponents = ({ children }) => {

    const { currentUser } = ContextDataCache();

    useEffect(() => {
    }, [currentUser]);

    return (
        <>
            {currentUser ? <NavBarPrivate userData={currentUser} /> : <NavBarPublic />}
            {children}
        </>
    );
}

export default LayoutComponents;