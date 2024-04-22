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


    const { currentUser, setCurrentUser } = useAuthContext(); // Contexto de autenticação e dados do usuário
    const router = useRouter(); // Roteador para navegação
    const { categoria } = useParams(); // Parâmetro de categoria da URL
    const [courses, setCourses] = useState([]); // Estado para armazenar os cursos
    const [userLogged, setUserLogged] = useState(); // Estado para verificar se o usuário está logado
    const [userPermission, setUserPermission] = useState(); // Estado para armazenar as permissões do usuário
    const [userSubscribed, setUserSubscribed] = useState(false); // Estado para verificar se o usuário está inscrito


    //Ao carregar a página, verifica se o usuário está logado checando os cookies e se está inscrito no curso
    async function decryptUserData() {
        let cookies;
        // Obtém os cookies se o usuário atual não estiver definido
        if (currentUser == null) {
            cookies = await getCookies();

            // Define o usuário como não logado se não houver cookies
            if (!cookies) {
                setUserLogged(false);
                return;
            }
        }
        // Define o usuário como logado se houver cookies
        setUserLogged(true);
        // Descriptografa os dados do usuário ou usa o usuário atual
        const userDecrypted = !currentUser ? decryptObjectData(cookies.value) : currentUser;
        // Atualiza o usuário atual com os dados descriptografados
        setCurrentUser(userDecrypted);

        // Define o usuário como não logado se não houver dados descriptografados
        if (!userDecrypted) {
            setUserLogged(false);
            return;
        }

        // Cria uma permissão padrão
        const defaultPermission = [{ courseId: categoria, permissionModule: 0 }];

        // Define a permissão do usuário como a permissão padrão se o usuário não tiver permissões de curso
        if (userDecrypted.CoursesPermissions.length === 0) {
            setUserPermission(defaultPermission);
            return;
        }

        // Procura uma permissão de curso que corresponda à categoria
        const hasCoursePermission = userDecrypted.CoursesPermissions.find(
            (permission) => permission.courseId === categoria
        );

        // Define a permissão do usuário como a permissão padrão se o usuário não tiver permissão para o curso
        if (!hasCoursePermission) {
            setUserPermission(defaultPermission);
            return;
        }

        // Define a permissão do usuário e marca o usuário como inscrito se o usuário tiver permissão para o curso
        setUserPermission(hasCoursePermission);
        setUserSubscribed(true);
    }

    //Se a pagina for recarregada, o context perde as informações então pegar os dados do usuário nos cookies
    async function pegarDadosCookies() {
        // Verifica se o usuário atual não está definido
        if (currentUser == null) {
            // Obtém os cookies do usuário
            const userCript = await getCookies();

            // Se não houver cookies, define o usuário como não logado e retorna
            if (!userCript) {
                setUserLogged(false);
                return;
            }

            // Descriptografa os dados do usuário
            const userDescript = decryptObjectData(userCript.value);

            // Define o usuário atual com os dados descriptografados
            setCurrentUser(userDescript);
            // Define o usuário como logado
            setUserLogged(true);
        }
        // Retorna da função
        return;
    }

    const fetchCourses = async () => {
        // Busca os cursos por categoria
        const coursesData = await getCoursesByCategory(categoria);
        // Atualiza o estado dos cursos com os dados obtidos
        setCourses(coursesData);
    };

    useEffect(() => {
        pegarDadosCookies(); // Obtém os dados do usuário nos cookies
        fetchCourses(); // Busca os cursos
        decryptUserData(); // Descriptografa os dados do usuário e armazena as permissões
    }, [categoria, currentUser]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
        router.push(`/Cursos/${categoria}/modulo/${idModule}`);

        subscribeUserModule(categoria, idModule); // Inscreve o usuário no módulo
    }


    //se botao de inscrever-se for clicado, chama a função de inscrever o usuário no curso
    async function subscribeUser(course) {
        //verifica se o curso é premium e o usuário não é premium
        if (course.coursePremium === true && currentUser.premium === false) {
            //se for premium, redireciona para a página de pagamento
            router.push(`/SwapPro`);
            return;
        } else {
            try {
                //inscrever o usuário no curso
                await SubscribeUserCourse(currentUser.id, course.idCourse, 0, setCurrentUser);
                //setar o usuário como inscrito
                setUserSubscribed(true);

                //buscar os dados do usuário novamente no banco de dados e atualizar os cookies
                const novosDados = await getUserData(currentUser.userId).then((userData) => {
                    return userData;
                });
                //atualizar os dados do usuário no contexto
                setCurrentUser(novosDados);

                // Registra o usuário no curso
                RegisterUserCourse(course.title, currentUser.userId, 'inscrito');

                //buscar objeto User que tem o userId == user. uid
                const userData = await getUserData(currentUser.userId);
                //criptografar o objeto
                const userDataCript = encryptObjectData(userData);
                //setar nos  cookies o token acess criptografado
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

                    {/** --------------------------------------------- */}
                    {userLogged && !userSubscribed && (
                        <button
                            style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                            onClick={() => subscribeUser(course)}
                        >
                            Inscrever-se
                        </button>
                    )}
                    {/** --------------------------------------------- */}

                    <p>{course.description}</p>

                    <div style={{ border: '1px solid black', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                        {course.modules.map((module, indexC) => {

                            {/** --------------------------------------------- */ }

                            //busca os modulos do curso
                            const modulesCourses = course.modules;
                            //busca a permissão do usuário no modulo
                            const modulePermission = modulesCourses[indexC].modulePermission;
                            //busca os registros do usuario no modulo
                            const registrationModules = modulesCourses[indexC].registrationsModule;
                            //procura o usuario na lista de inscritos com o userId == currentUser.userId
                            let userRegistration;
                            if (currentUser) {
                                userRegistration = registrationModules.find(
                                    (registration) => registration.userId === currentUser.userId
                                );
                            }


                            // Verifica se o usuário concluiu o módulo
                            const userHasConcluded = userRegistration && userRegistration.status === 'concluido';

                            {/** --------------------------------------------- */ }


                            return (
                                <div key={indexC} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px', border: userHasConcluded ? '2px solid green' : 'none' }}>
                                    <h3 style={{ color: 'green' }}>{module.nameModule}</h3>
                                    <p>{module.description}</p>

                                    {module.lessons.map((lesson, index) => (
                                        <div key={index} style={{ backgroundColor: '#b0b0b0', margin: '5px', padding: '2px' }}>
                                            <h4 style={{ color: 'red' }}>{lesson.nameLesson}</h4>
                                        </div>
                                    ))}

                                    {/** --------------------------------------------- */}

                                    {userLogged && userSubscribed && userPermission.permissionModule >= modulePermission && (
                                        <button style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }} onClick={() => redirectToModuleDescription(module.idModule)}>Ver modulo</button>
                                    )}

                                    {/** --------------------------------------------- */}
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