// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCoursesAdmPainel';
import CreateCourse from '../Components/CreateCourse/CreateCourse';
import { useAuthContext } from '../contexts/Auth';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import UserList from '../Components/ListUsers';

const CourseForm = () => {

    const controller = Controller();

    const { currentUser, setCurrentUser } = useAuthContext();
    const [userDataPermission, setuserDataPermission] = useState();

    const [users, setUsers] = useState();

    async function getUsersList() {

        const users = await controller.manageUsers.getAllUsers();
        setUsers(users);
    }

    async function getUser() {
        const userCookie = await controller.services.manageCookies.getCookies();
        const userDataDescrypt = decryptObjectData(userCookie.value);
        setuserDataPermission(userDataDescrypt.permissions);
        setCurrentUser(userDataDescrypt);
        userDataDescrypt.permissions;   
    }

    useEffect(() => {
        getUser();
        getUsersList();
        
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
                    {userDataPermission > 2 ? <ListCourses /> : <h1>Você não tem permissão para listar cursos</h1>}

                </div>

                <div style={{ border: '1px solid black', padding: '20px' }}>
                    {userDataPermission > 3 ?                    
                           <UserList users={users}  />    : <h1>Você não tem permissão para listar usuários</h1>        
                    }

                </div>
            </div>
        </>

    );
};

export default CourseForm;
