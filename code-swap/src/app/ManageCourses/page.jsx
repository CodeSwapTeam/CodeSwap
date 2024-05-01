// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCoursesADM';
import CreateCourse from '../Components/PainelADM/CreateCourse/CreateCourse';
import { ContextDataCache } from '../contexts/ContextDataCache';
import UserList from '../Components/ListUsers';

const PainelAdm = () => {

    const controller = Controller();

    const {currentUser, setCurrentUser} = ContextDataCache();
    const [userDataPermission, setuserDataPermission] = useState(0);

    const [selectedPainel, setSelectedPainel] = useState('listCourses');


    async function getUser() {
        if(!currentUser){
            const userCached = await controller.services.manageLocalCache.getUserCache();
            setCurrentUser(userCached);
            setuserDataPermission(userCached.permissionAcess);
        };          
    }

    useEffect(() => {
        getUser();           
    }, [])

    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-around', color:'white' }}>
                <button style={{border:'2px solid white', padding: '10px' }} onClick={() => setSelectedPainel('createCourse')}>Criar Curso</button>
                <button style={{border:'2px solid white', padding: '10px' }} onClick={() => setSelectedPainel('listCourses')}>Listar Cursos</button>
                <button style={{border:'2px solid white', padding: '10px' }} onClick={() => setSelectedPainel('listUsers')}>Listar Usuários</button>
            </div>
            
            {selectedPainel === 'createCourse' ? (
                <div style={{  padding: '20px' }}>
                        <CreateCourse /> 
                </div>
            ) : selectedPainel === 'listCourses' ? (
                <div style={{  padding: '20px' }}>
                 {userDataPermission > 2 ? <ListCourses /> : <h1>Você não tem permissão para listar cursos</h1>}
                </div>
            ) : (
                <div style={{  padding: '20px' }}>
                {userDataPermission > 3 ?                    
                    <UserList />: <h1>Você não tem permissão para listar usuários</h1>}
                 </div>
            )}
        </div>

    );
};

export default PainelAdm;
