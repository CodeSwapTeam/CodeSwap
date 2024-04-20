"use client";
import React, { useEffect, useState } from 'react';


import { useParams, useRouter } from 'next/navigation';
import { getCoursesByCategory } from '../../../../database/functions/createCategory';
import { getCookies } from '@/app/services/cookies';
import { decryptObjectData } from '@/app/services/encryptedAlgorithm';
import { SubscribeUserCourse } from '../../../../database/functions/subscribeUserCourse';

const Page = () => {

    const router = useRouter();

    const { categoria } = useParams();
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState({});
    const[userLogged, setUserLogged] = useState();

    //função para descriptografar os dados do usuário
    const[userPermission, setUserPermission] = useState();

   async function decryptUserData() {
        const cookies = await getCookies();
        
        if(cookies) {
            
            setUserLogged(true);
            const userDecrypted = decryptObjectData(cookies.value);

            if(userDecrypted) {
                //console.log(userDecrypted);
                setUser(userDecrypted);
                setUserPermission(userDecrypted.CoursesPermissions);
            }else {
                setUserLogged(false);
            }
        
        }else {
            setUserLogged(false);
        }
        
        
        
    
    }

    useEffect(() => {
       
        
        decryptUserData();
        
        const fetchCourses = async () => {
            const coursesData = await getCoursesByCategory(categoria);
            setCourses(coursesData);
            //console.log(coursesData);
            
        };
        fetchCourses();
    }, [categoria]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
        router.push(`/Cursos/${categoria}/modulo/${idModule}`);
    }


    //se botao de inscrever-se for clicado, chama a função de inscrever o usuário no curso
    async function subscribeUser(course) {
        console.log(course);
        try {
            await SubscribeUserCourse(user.id, course.idCourse, 0);
            
        } catch (error) {
            console.error('Erro ao inscrever o usuário no curso:', error);
        }
    }

    


    return (
        <div>
    <p></p>
    {courses.map((course, index) => (
        <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px' }}>
            <h2 style={{ color: 'blue' }}>{course.title}</h2> 
            <button style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }} onClick={() => subscribeUser(course)}>Inscrever-se</button>
            <p>{course.description}</p>

            <div style={{border: '1px solid black', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
                {course.modules.map((module, indexC) => {
                    const coursePermission = course.modules;
                    //nivel de permissão para ver o  modulo
                    console.log('coursePermission', coursePermission);
                    const modulePermission = coursePermission[indexC].modulePermission;

                    //console.log('categoria', categoria);

                    //nivelde permisão do usuário
                    //console.log('userPermission', userPermission);
                    //procure o objeto dentro de userPermission que tenha o mesmo courseId da categoria
                    const userPermissionCourse = userPermission ? userPermission.find((permission) => permission.courseId === course.idCourse) : 0;
                    //pegar o nivel de permissão do modulo
                    console.log('userPermissionCourse', userPermissionCourse.permissionModule);
                   
                   
                        console.log('modulePermission', modulePermission);
                    return (
                        <div key={indexC} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                            <h3 style={{ color: 'green' }}>{module.nameModule}</h3>
                            <p>{module.description}</p>
                            {module.lessons.map((lesson, index) => (
                                <div key={index} style={{ backgroundColor: '#b0b0b0', margin: '5px', padding: '2px' }}>
                                    <h4 style={{ color: 'red' }}>{lesson.nameLesson}</h4>
                                </div>
                            ))}
                                {/**se o userPermission é maior que o module permission renderizar botao */}
                                {userLogged  && userPermissionCourse.permissionModule >= modulePermission && (
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