// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCoursesADM';
import CreateCourse from '../Components/CreateCourse/CreateCourse';
import { ContextDataCache } from '../contexts/ContextDataCache';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import UserList from '../Components/ListUsers';

const PainelAdm = () => {

    const controller = Controller();

    const {currentUser, setCurrentUser} = ContextDataCache();
    const [userDataPermission, setuserDataPermission] = useState(0);


    async function getUser() {
        const userCached = await controller.services.manageLocalCache.getUserCache();
        console.log(userCached);
        setCurrentUser(userCached);
        setuserDataPermission(userCached.permissionAcess);
           
    }

    useEffect(() => {
        getUser();
       
        
    }, [])

    return (
        <>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <div style={{ border: '1px solid black', padding: '20px' }}>
                        {userDataPermission > 1 ? <CreateCourse /> : <h1>Você não tem permissão para criar cursos</h1>}

                    </div>
                </div>

                <div style={{ border: '1px solid black', padding: '20px' }}>
                    {/*userDataPermission > 2 ? <ListCourses /> : <h1>Você não tem permissão para listar cursos</h1>*/}

                </div>

                <div style={{ border: '1px solid black', padding: '20px' }}>
                    {/*userDataPermission > 3 ?                    
                           <UserList users={users}  />    : <h1>Você não tem permissão para listar usuários</h1>        */}

                </div>
            </div>
        </>

    );
};

export default PainelAdm;
