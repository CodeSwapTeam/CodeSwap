// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCoursesAdmPainel';
import CreateCourse from '../Components/CreateCourse/CreateCourse';
import { useAuthContext } from '../contexts/Auth';

import { getCookies, removeCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { useRouter } from 'next/navigation';

import { GetAllUsers } from '../../../database/functions/GetAllUsers';
import UserList from '../Components/ListUsers';

const CourseForm = () => {

    const { currentUser, setCurrentUser } = useAuthContext();
    const [userDataPermission, setuserDataPermission] = useState();

    const router = useRouter();

    function submitLogout() {
        removeCookies();
        localStorage.removeItem('user')

        setCurrentUser(null);
        router.push('/login');
    }

    const [users, setUsers] = useState();

    async function getUsersList() {
        const users = await GetAllUsers();
        setUsers(users);
    }

    async function getUser() {
        //const users = await GetAllUsers();
        //console.log(users);
        //setUsers(users);

        const userCookie = await getCookies();
        const userDataDescrypt = decryptObjectData(userCookie.value);
        //console.log(userDataDescrypt);
        setuserDataPermission(userDataDescrypt.permissions);
        setCurrentUser(userDataDescrypt);
        //console.log(userDataDescrypt.permissions);
        userDataDescrypt.permissions;   
    }

    
    //console.log(currentUser);
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
