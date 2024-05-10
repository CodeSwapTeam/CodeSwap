"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';

import { useQuery, useQueryClient } from "@tanstack/react-query";

const BackgroundImage = styled.div`
    background-image: url('/assets/Code-fundo-oficial.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: fixed;
    top: 0;
    
    width: 100%;
    height: 100%;
    z-index: -1; 
`;

const Container = styled.div`
    
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Content = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const LeftContent = styled.div`
    position: absolute;
    left: 0;

    margin-top: 50px;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    @media (max-width: 768px) {
        width: 100%;
    }
`;



const ModuleList = styled.div`
    
padding-left: 60px;
    margin-top: 20px;
`;

const ModuleItem = styled.div`
    


    padding-left: 60px;
    padding-right: 100px;
    color: white;  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: max-height 1s ease-in-out;
    max-height: ${props => props.open ? '1000px' : '0'};

    
    
`;

const ModuleTitle = styled.h2`
    color: #45ff45;
    font-size: 1.5rem;
    

    margin-top: 5px;
    cursor: pointer;
    padding: 10px;

    transition: all 0.3s ease;

    background: linear-gradient(to right, rgba(249, 249, 249, 0) 40%, rgba(249, 249, 249, 0.1) 90%);
    border-radius: 10px;

    
    &:hover {
        background: none;
        background-color: #00000063;
        transform: scale(1.02);
        box-shadow: 10px 0px 15px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }

    
`;

const TitleDescription = styled.div`

    margin-top: 50px;
    padding-left: 100px;
    padding-right: 100px;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const LessonsModule = styled.div`
    margin-top: 20px;
    width: 100%;
    color: white;
    font-size: 1rem;
    justify-content: left;
    align-items: left;
    margin-bottom: 20px;
`;

const ButtonSubscribe = styled.button`
    color: green;
    border: 2px solid green;
    border-radius: 5px;
    padding: 10px;
    font-family: 'Hairline', sans-serif;
    background-color: #00000063;
    font-weight: bold;

    &:hover {
        background: none;
        background-color: #00000063;
        transform: scale(1.02);
        box-shadow: 10px 0px 15px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }
`;


const RightContent = styled.div`
    //conteudo da div absoluto
    position: absolute;
    //alinhamento do conteudo a direita
    right: 0;
    
    margin-left: 30px;  
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    width: 40%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const CourseCard = styled.div`
    border-radius: 10px;

    
    
    margin-top: 20px;
    border: 1px solid white;
    display: flex;
    width: 100%;
    height: 100px;
`;

const Page = () => {

    const controller = Controller();
    const queryClient = useQueryClient();

    const { currentUser, setCurrentUser } = ContextDataCache(); // Contexto de autenticação e dados do usuário
    const router = useRouter(); // Roteador para navegação
    const { courseId } = useParams(); // Parâmetro de courseId da URL
    const [modules, setModules] = useState([]); // Estado para armazenar os módulos do curso
    const [userLogged, setUserLogged] = useState(); // Estado para verificar se o usuário está logado
    const [userPermission, setUserPermission] = useState(); // Estado para armazenar as permissões do usuário
    const [userSubscribed, setUserSubscribed] = useState(false); // Estado para verificar se o usuário está inscrito


    const [course, setCourse] = useState([]); // Estado para armazenar os cursos
    const [coursesCategory, setCoursesCategory] = useState([]); // Estado para armazenar os cursos relacionados a categoria

    // Função para buscar o curso pelo ID
    const fetchCourseById = async (id) => {
        const course = await controller.manageCourses.GetCourseById(id);
        queryClient.setQueryData(['courseSelected'], course);
        return course;
    };

    // Função para buscar os módulos do curso pelo ID do curso
    const fetchModulesByCourseId = async (id) => {
        return await controller.manageModules.GetModulesCourseID(id);
    };

    const fetchCourse = async () => {
        let course = queryClient.getQueryData(['courseSelected']) || null;

        // Se o curso não estiver no cache, buscar pelo ID
        if (!course) {
            course = await fetchCourseById(courseId);
        }

        // Buscar os módulos do curso
        const modules = await fetchModulesByCourseId(course.id);

        // Atualizar o estado do componente
        setCourse(course);
        setModules(modules);
    };

    //Buscar cursos relacionados a categoria
    const fetchCoursesByCategory = async () => {
        const coursesCategory = queryClient.getQueryData(['category-Selected-Mycourses']) || null;

        if (!coursesCategory) return

        setCoursesCategory(coursesCategory.courses);
        
        console.log('coursesCategory', coursesCategory);

    }


    useEffect(() => {
        fetchCoursesByCategory();
        fetchCourse();
    }, [courseId, currentUser]);

    /*  //função para redirecionar para a página de descrição do modulo
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
 
 
     } */

    const [openIndex, setOpenIndex] = useState(null);

    const toggleOpen = (index) => {
        if (openIndex !== index) {
            setOpenIndex(index);
        } else {
            setOpenIndex(null);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <BackgroundImage />

            <Container>
                {course &&
                    <Content>
                        <LeftContent>

                            <TitleDescription>
                                <h1 style={{ color: '#45ff45', fontSize: '2rem', marginTop: '20px' }}>{course.title}</h1>
                                <p style={{ color: 'white', fontSize: '1rem', margin: '20px' }}>{course.description}</p>
                                <ButtonSubscribe>INSCREVA-SE</ButtonSubscribe>
                            </TitleDescription>

                            <ModuleList>
                                {modules && modules.map((module, index) => (
                                    <div key={index}>
                                        <ModuleTitle onClick={() => toggleOpen(index)} 
                                        style={{
                                            fontWeight: openIndex === index ? 'bold' : 'normal',
                                            backgroundColor: openIndex === index ? '#00000063' : 'transparent',
                                            marginBottom: openIndex === index ? '10px' : '0'
                                        }}>
                                            {module.title}
                                        </ModuleTitle>
                                        <ModuleItem open={openIndex === index} 
                                        style={{ 
                                            backgroundColor: openIndex === index ? '#00000058' : 'transparent',
                                            padding: openIndex === index ? '10px' : '0'
                                        }}>
                                            {module.description}
                                            
                                            <LessonsModule>
                                                {module.lessons && module.lessons.map((lesson, index) => (
                                                    <div key={index}>
                                                        <h3 style={{ textAlign: 'left' }}>{lesson.nameLesson}</h3>
                                                    </div>
                                                ))}
                                            </LessonsModule>
                                                <ButtonSubscribe>CLIQUE PARA ACESSAR O MÓDULO</ButtonSubscribe>
                                        </ModuleItem>
                                    </div>
                                ))}
                            </ModuleList>
                        </LeftContent>

                        <RightContent>
                            <div>
                                <img src={course.imgUrlCover} alt="Capa Curso" />
                            </div>

                            <div>
                                {coursesCategory && coursesCategory.map((course, index) => (
                                    <CourseCard key={index}>
                                        <img src={course.imgUrlThumbnail} alt="Capa Curso" style={{borderRadius: '10px'}} />
                                        <p style={{color:'white'}}>{course.title}</p>
                                        
                                    </CourseCard>
                                ))}
                            </div>
                        </RightContent>
                    </Content>
                }
            </Container>



        </div>
    );
};

export default Page;