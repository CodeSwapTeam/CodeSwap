// CourseForm.jsx
"use client";
import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCourses';
import CreateCourse from '../Components/CreateCourse';
import { useAuthContext } from '../contexts/Auth';
import NavBarPrivate from '../Components/NavBarPrivate';
import { getCookies, removeCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { useRouter } from 'next/navigation';

import { GetAllUsers } from '../../../database/functions/GetAllUsers';
import UserList from '../Components/ListUsers';

const CourseForm = () => {

    const router = useRouter();

    function submitLogout() {
        removeCookies();
        localStorage.removeItem('user')

        setCurrentUser(null);
        router.push('/login');
    }

    const [users, setUsers] = useState();

    async function getUsers() {
        const users = await GetAllUsers();
        //console.log(users);
        setUsers(users);
    }

    const { currentUser, setCurrentUser } = useAuthContext();
    const [userDataPermission, setuserDataPermission] = useState(1);
    //console.log(currentUser);
    useEffect(() => {

        getUsers();

        async function getUserData() {
            if (currentUser == null) {
                const userDataCrypt = await getCookies();
                //console.log(userDataCrypt);
                const userDataDescrypt = decryptObjectData(userDataCrypt.value);
                //console.log(userDataDescrypt);
                setuserDataPermission(userDataDescrypt.permissions);

                //console.log(userDataDescrypt.permissions);

            } else {
                setuserDataPermission(currentUser.permissions);
            }
        }
        getUserData();

    }, [])

    return (
        <>
            <NavBarPrivate submitLogout={submitLogout} />
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <div style={{ border: '1px solid black', padding: '20px' }}>
                        {userDataPermission > 1 && <CreateCourse />}

                    </div>
                </div>

                <div style={{ border: '1px solid black', padding: '20px' }}>
                    {userDataPermission > 2 && <ListCourses />}

                </div>

                <div style={{ border: '1px solid black', padding: '20px' }}>
                    {userDataPermission > 3 &&                     
                           <UserList users={users} />            
                    }

                </div>
            </div>
        </>

    );
};

export default CourseForm;
