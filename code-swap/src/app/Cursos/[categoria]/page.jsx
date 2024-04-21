"use client";
import React, { useEffect, useState } from 'react';


import { useParams, useRouter } from 'next/navigation';
import { getCoursesByCategory } from '../../../../database/functions/createCategory';
import { getCookies, setCookies } from '@/app/services/cookies';
import { decryptObjectData, encryptObjectData } from '@/app/services/encryptedAlgorithm';
import { RegisterUserCourse, SubscribeUserCourse, subscribeUserModule } from '../../../../database/functions/subscribeUserCourse';
import { getUserData } from '../../../../database/functions/getUserId';

const Page = () => {

    const router = useRouter();

    const { categoria } = useParams();
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState({});
    const [userLogged, setUserLogged] = useState();

    //função para descriptografar os dados do usuário
    const [userPermission, setUserPermission] = useState();
    //usuario inscrito no curso
    const [userSubscribed, setUserSubscribed] = useState(false);

    async function decryptUserData() {
        const cookies = await getCookies();

        if (!cookies) {
            setUserLogged(false);
            return;
        }

        setUserLogged(true);
        const userDecrypted = decryptObjectData(cookies.value);

        if (!userDecrypted) {
            setUserLogged(false);
            return;
        }

        setUser(userDecrypted);

        const defaultPermission = [{ courseId: categoria, permissionModule: 0 }];

        if (userDecrypted.CoursesPermissions.length === 0) {
            setUserPermission(defaultPermission);
            return;
        }

        const hasCoursePermission = userDecrypted.CoursesPermissions.find(
            (permission) => permission.courseId === categoria
        );

        if (!hasCoursePermission) {
            setUserPermission(defaultPermission);
            return;
        }

        setUserPermission(userDecrypted.CoursesPermissions);
        setUserSubscribed(true);
    }

    useEffect(() => {

        const fetchCourses = async () => {
            const coursesData = await getCoursesByCategory(categoria);
            setCourses(coursesData);
            //console.log(coursesData);
        };

        fetchCourses();
        decryptUserData();
    }, [categoria]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
         router.push(`/Cursos/${categoria}/modulo/${idModule}`);
      // console.log(`/Cursos/${categoria}/modulo/${idModule}`)
       subscribeModule(categoria, idModule);
    }


    //se botao de inscrever-se for clicado, chama a função de inscrever o usuário no curso
    async function subscribeUser(course) {

        try {
            await SubscribeUserCourse(user.id, course.idCourse, 0);
            setUserSubscribed(true);
            //buscar os dados do usuário novamente no banco de dados e atualizar os cookies

            const novosDados = await getUserData(user.userId).then((userData) => {

                return userData;

            });
            setUser(novosDados);
            RegisterUserCourse(course.title, user.userId, 'inscrito');

            //buscar objeto User que tem o userId == user. uid
            const userData = await getUserData(user.userId);
            //criptografar o objeto

            const userDataCript = encryptObjectData(userData);
            //setar nos  cookies o o token acess criptografado
            setCookies(userDataCript);


        } catch (error) {
            console.error('Erro ao inscrever o usuário no curso:', error);
        }
    }

    //função para se inscrever no módulo
    async function subscribeModule(categoria, idModule) {
        subscribeUserModule(categoria, idModule);
    }



    return (
        <div>

            {courses.map((course, index) => (
                <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px' }}>
                    <h2 style={{ color: 'blue' }}>{course.title}</h2>
                    {userLogged && !userSubscribed && (
    <button 
        style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }} 
        onClick={() => subscribeUser(course)}
    >
        Inscrever-se
    </button>
)}
                    <p>{course.description}</p>

                    <div style={{ border: '1px solid black', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                        {course.modules.map((module, indexC) => {
                            const modulesCourses = course.modules;
                            //nivel de permissão para ver o  modulo

                            const modulePermission = modulesCourses[indexC].modulePermission;

                            //nivel de permisão do usuário
                            //procure o objeto dentro de userPermission que tenha o mesmo courseId da categoria

                            let userPermissionCourse = userPermission ? userPermission.find((permission) => permission.courseId === course.idCourse) : 0;
                            //pegar o nivel de permissão do modulo
                            //console.log(module);
                            return (
                                <div key={indexC} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                                    <h3 style={{ color: 'green' }}>{module.nameModule}</h3>
                                    <p>{module.description}</p>
                                    {module.lessons.map((lesson, index) => (
                                        <div key={index} style={{ backgroundColor: '#b0b0b0', margin: '5px', padding: '2px' }}>
                                            <h4 style={{ color: 'red' }}>{lesson.nameLesson}</h4>
                                        </div>
                                    ))}
                                    {userLogged && userSubscribed && userPermissionCourse.permissionModule >= modulePermission && (
                                        <button style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }} onClick={() => redirectToModuleDescription(module.idModule)}>Ver modulo</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Page;