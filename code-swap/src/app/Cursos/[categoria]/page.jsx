"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';

const BackgroundImage = styled.div`
    background-image: url('/assets/bgCurso.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: fixed;
    top: 0;
    
    width: 100%;
    height: 100%;
    z-index: -1; 
`;

/* const Content = styled.div`
    z-index: 2;
    // other styles...
`; */





const Container = styled.div`
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Content = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LeftContent = styled.div`



    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const RightContent = styled.div`

    width: 40%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ModuleList = styled.div`
    margin-top: 20px;
    height: 300px;
    width: 100%;
    overflow-y: auto;
`;

const ModuleItem = styled.div`
    padding: 10px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Page = () => {

    const controller = Controller();

    const { currentUser, setCurrentUser } = ContextDataCache(); // Contexto de autenticação e dados do usuário
    const router = useRouter(); // Roteador para navegação
    const { categoria } = useParams(); // Parâmetro de courseId da URL
    const [modules, setModules] = useState([]); // Estado para armazenar os módulos do curso
    const [userLogged, setUserLogged] = useState(); // Estado para verificar se o usuário está logado
    const [userPermission, setUserPermission] = useState(); // Estado para armazenar as permissões do usuário
    const [userSubscribed, setUserSubscribed] = useState(false); // Estado para verificar se o usuário está inscrito


    const [course, setCourse] = useState([]); // Estado para armazenar os cursos


    const fetchCourses = async () => {

        const course = await controller.manageCourses.GetCourseById(categoria);

        console.log('course', course);

        setCourse(course);
        setModules(course.modules);
    };

    useEffect(() => {
        fetchCourses();
    }, [categoria, currentUser]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
        router.push(`/Cursos/${categoria}/modulo/${idModule}`);

        // Inscreve o usuário no módulo
        controller.manageUsers.subscribeUserModule(categoria, idModule); // Inscreve o usuário no módulo
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
                await controller.manageUsers.subscribeUserCourse(currentUser.id, course.idCourse, 0, setCurrentUser);
                //setar o usuário como inscrito
                setUserSubscribed(true);

                //buscar os dados do usuário novamente no banco de dados e atualizar os cookies
                const novosDados = await controller.manageUsers.getUserData(currentUser.userId).then((userData) => {
                    return userData;
                });
                //atualizar os dados do usuário no contexto
                setCurrentUser(novosDados);

                // Registra o usuário no curso
                controller.manageUsers.registerUserCourse(course.title, currentUser.userId, 'inscrito');

                //buscar objeto User que tem o userId == user. uid
                const userData = await controller.manageUsers.getUserData(currentUser.userId);
                //criptografar o objeto
                const userDataCript = controller.encryptionAlgorithm.encryptObjectData(userData);
                //setar nos  cookies o token acess criptografado
                controller.services.manageCookies.setCookies(userDataCript);

            } catch (error) {
                console.error('Erro ao inscrever o usuário no curso:', error);
            }
        }


    }


    return (
        <>
            <BackgroundImage />

            <Container>
                {course &&
                    <Content>
                        <LeftContent>
                            <div style={{marginTop:'50px', paddingLeft: '100px', paddingRight: '100px', height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h1 style={{ color: 'green', fontSize: '2rem', marginTop: '20px' }}>{course.title}</h1>
                                <p style={{ color: 'white', fontSize: '0.8rem', margin: '20px' }}>{course.description}</p>
                                <button style={{ color: 'green', border: '1px solid green', padding: '10px' }}>INSCREVA-SE</button>
                            </div>

                            <ModuleList>
                                {modules && modules.map((module, index) => (
                                    <ModuleItem key={index}>
                                        <h2 style={{ color: 'green', fontSize: '1rem', marginTop: '5px' }}>{module.title}</h2>
                                    </ModuleItem>
                                ))}
                            </ModuleList>
                        </LeftContent>

                        <RightContent>
                            {/* Right content */}
                        </RightContent>
                    </Content>
                }
            </Container>



        </>
    );
};

export default Page;