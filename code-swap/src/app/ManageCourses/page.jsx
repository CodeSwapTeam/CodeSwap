// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCoursesADM';
import CreateCourse from '../Components/PainelADM/CreateCourse/CreateCourse';
import { ContextDataCache } from '../contexts/ContextDataCache';
import UserList from '../Components/ListUsers';
import styled from 'styled-components';


const StyledButtonNavBar = styled.button`
  border: 1px solid white;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  background-color: #020a29;
  color: #04ff02;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-size: 1rem;
  margin-top: 10px;

  &:hover {
    color: #04ff02;
    transform: scale(1.05);
    box-shadow: 0px 0px 10px #04ff02;
  }
`;

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
                <StyledButtonNavBar onClick={() => setSelectedPainel('createCourse')}>Criar Curso</StyledButtonNavBar>
                <StyledButtonNavBar  onClick={() => setSelectedPainel('listCourses')}>Listar Cursos</StyledButtonNavBar>
                <StyledButtonNavBar  onClick={() => setSelectedPainel('listUsers')}>Listar Usuários</StyledButtonNavBar>
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
