"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCoursesByCategory } from '../../../../database/functions/createCategory';
import { getCookies, setCookies } from '@/app/services/cookies';
import { decryptObjectData, encryptObjectData } from '@/app/services/encryptedAlgorithm';
import { RegisterUserCourse, SubscribeUserCourse, subscribeUserModule } from '../../../../database/functions/subscribeUserCourse';
import { getUserData } from '../../../../database/functions/getUserId';
import { useAuthContext } from '@/app/contexts/Auth';

const Page = () => {

    const {currentUser, setCurrentUser } = useAuthContext();

    const router = useRouter();

    const { categoria } = useParams();
    const [courses, setCourses] = useState([]);
    const [userLogged, setUserLogged] = useState();

    const [userPermission, setUserPermission] = useState();

    const [userSubscribed, setUserSubscribed] = useState(false);

    //Ao carregar a página, verificar se o usuário está logado checando os cookies e se está inscrito no curso
    async function decryptUserData() {
        let cookies;
        if(currentUser == null){
         cookies =  await getCookies();

            if (!cookies) {
                setUserLogged(false);
                return;
            }
        }
        setUserLogged(true);
        const userDecrypted = !currentUser ? decryptObjectData(cookies.value) : currentUser;
        setCurrentUser(userDecrypted);

        if (!userDecrypted) {
            setUserLogged(false);
            return;
        }

        const defaultPermission = [{ courseId: categoria, permissionModule: 0 }];
        //console.log('Permissoes do usuario [{}]',currentUser.CoursesPermissions);
        if (userDecrypted.CoursesPermissions.length === 0) {
            setUserPermission(defaultPermission);
            return;
        }

        //verificar a permission do usuário para o curso
        const hasCoursePermission = userDecrypted.CoursesPermissions.find(
            (permission) => permission.courseId === categoria
        );
       // console.log('hasCoursePermission {}',hasCoursePermission);

        if (!hasCoursePermission) {
            setUserPermission(defaultPermission);
            return;
        }

        setUserPermission(hasCoursePermission);
        //console.log('Permissões do usuário:', userDecrypted.CoursesPermissions);
        setUserSubscribed(true);
    }

    //Se a pagina for recarregada, o context perde as informações então pegar os dados do usuário nos cookies
    async function pegarDadosCookies(){
        if(currentUser == null){
            const userCript = await getCookies();

            if (!userCript) {
                setUserLogged(false);
                return;
            }

            const userDescript = decryptObjectData(userCript.value);
            //console.log('userDescript dos cookies',userDescript);
            
            setCurrentUser(userDescript);
            setUserLogged(true);
            
         }
         return;
    }

    const fetchCourses = async () => {

        const coursesData = await getCoursesByCategory(categoria);

        setCourses(coursesData);
    };

    useEffect(() => {
        
        pegarDadosCookies();
        fetchCourses();

        decryptUserData();
        
        
    }, [categoria,currentUser]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
        router.push(`/Cursos/${categoria}/modulo/${idModule}`);
        
        subscribeUserModule(categoria, idModule);
    }


    //se botao de inscrever-se for clicado, chama a função de inscrever o usuário no curso
    async function subscribeUser(course) {
        //console.log('currentUser', currentUser);
        //verifica se o curso é premium e o usuário não é premium
        if (course.coursePremium === true && currentUser.premium === false) {
            //se for premium, redireciona para a página de pagamento
           router.push(`/SwapPro`);
            return;
        }else{
            try {
                await SubscribeUserCourse(currentUser.id, course.idCourse, 0, setCurrentUser);
                setUserSubscribed(true);
                //buscar os dados do usuário novamente no banco de dados e atualizar os cookies
    
                const novosDados = await getUserData(currentUser.userId).then((userData) => {
                    
                    return userData;
    
                });
                setCurrentUser(novosDados);
                
                RegisterUserCourse(course.title, currentUser.userId, 'inscrito');
    
                //buscar objeto User que tem o userId == user. uid
                const userData = await getUserData(currentUser.userId);
                //criptografar o objeto
    
                const userDataCript = encryptObjectData(userData);
                //setar nos  cookies o o token acess criptografado
                setCookies(userDataCript);
                
    
    
            } catch (error) {
                console.error('Erro ao inscrever o usuário no curso:', error);
            }
        }
        
        
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

                            
                            //pegar o nivel de permissão do modulo
                            //console.log(userPermission);
                            return (
                                <div key={indexC} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                                    <h3 style={{ color: 'green' }}>{module.nameModule}</h3>
                                    <p>{module.description}</p>
                                    {module.lessons.map((lesson, index) => (
                                        <div key={index} style={{ backgroundColor: '#b0b0b0', margin: '5px', padding: '2px' }}>
                                            <h4 style={{ color: 'red' }}>{lesson.nameLesson}</h4>
                                        </div>
                                    ))}
                                    {userLogged && userSubscribed && userPermission.permissionModule >= modulePermission && (
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