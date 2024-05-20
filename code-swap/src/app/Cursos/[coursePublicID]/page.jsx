"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar, MdOutlineSignalCellularAlt1Bar } from "react-icons/md";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from 'next/image';


const Container = styled.div`   
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Content = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const LeftContent = styled.div`
    left: 0;
    margin-top: 5%;
    width: 60%;
    display: flex;
    flex-direction: column;
    
    
    @media (max-width: 768px) {
        width: 100%;
        margin-left: 50px;
        margin-top: 15%;
        margin-right: 20px;
        
    }
    //se a tela for maior que 836px adicione uma margin-left de 50px
    @media (min-width: 836px) {
        margin-left: 50px;
    }
`;



const ModuleList = styled.div` 
    width: 95%;
    margin-top: 20px;
`;

const ModuleItem = styled.div`
    
    box-sizing: border-box;
    color: white;  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: max-height 1s ease-in-out;
    max-height: ${props => props.open ? '1000px' : '0'};

    font-size: 1rem;

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
    
`;

const ModuleTitle = styled.h2`
    color: #45ff45;
    font-size: 1.5rem;
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

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }

    
`;

const TitleDescription = styled.div`
    box-sizing: border-box;
    padding-left: 100px;
    padding-right: 100px;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        padding-left: 50px;
        padding-right: 50px;
    }
`;

const LessonsModule = styled.div`
    margin-top: 20px;
    width: 100%;
    color: white;
    font-size: 1rem;
    justify-content: left;
    align-items: left;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
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

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;


const RightContent = styled.div`
    right: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    align-items: center;
    height: 100%;

    width: 40%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const CourseContainer = styled.div`
    margin-top: 40px;
    text-align: center;  
`;

const CourseCard = styled.div`
    border-radius: 10px;
    margin: auto;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
    display: flex;
    
    height: 100px;
    transition: all 0.3s ease;
    background-color: #00000063;
    

    &:hover {
        background: none;
        background-color: #00000063;
        transform: scale(1.02);
        box-shadow: 10px 0px 15px rgba(4, 255, 2, 0.2);
    }

    p {
        color: white;
        font-size: 1vw;
        margin: auto;

        @media (max-width: 768px) {
            font-size: 2vw;
        }
    }  
`;


const Title = styled.h1`
  color: #45ff45;
  margin-top: 20px;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Description = styled.p`
  color: white;
  margin: 20px;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const CourseTitle = styled.h1`
    margin: auto;
    color: #45ff45;
    font-size: 1.5rem;
    word-wrap: break-word; // Quebra de linha para palavras longas
    overflow-wrap: break-word; // Quebra de linha para palavras longas
    hyphens: auto; // Adiciona hífens automaticamente quando a palavra quebra

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;


const Page = () => {


    const controller = Controller();
    const queryClient = useQueryClient();

    const { currentUser, setCurrentUser } = ContextDataCache(); // Contexto de autenticação e dados do usuário
    const router = useRouter(); // Roteador para navegação
    const { coursePublicID } = useParams(); // Parâmetro de courseId da URL
    const [modules, setModules] = useState([]); // Estado para armazenar os módulos do curso

    const [course, setCourse] = useState([]); // Estado para armazenar os cursos
    const [coursesCategory, setCoursesCategory] = useState([]); // Estado para armazenar os cursos relacionados a categoria

    const [openIndex, setOpenIndex] = useState(null);


    //função para abrir e fechar o modulo
    const toggleOpen = (index) => {
        if (openIndex !== index) {
            setOpenIndex(index);
        } else {
            setOpenIndex(null);
        }
    };

    //função para buscar o curso pelo id
    const fetchCourse = async () => {
        const coursesCached = queryClient.getQueryData(['courses-Cached']) || [];
        let course = coursesCached.find(course => course.id === coursePublicID);

        if (!course) {
            course = await controller.manageCourses.GetCourseById(coursePublicID);

            queryClient.setQueryData(['courseSelected'], course);
            //adicionar nos ['courses-Cached']
            queryClient.setQueryData(['courses-Cached'], [...coursesCached, course]);
        } else {
            queryClient.setQueryData(['courseSelected'], course);
        }

        setCourse(course);

        const getAndSortModules = async (coursePublicID) => {
            const modules = await controller.manageModules.GetModulesCourseID(coursePublicID);
            modules.sort((a, b) => a.permission - b.permission);
            return modules;
        }

        const modulesCached = queryClient.getQueryData(['modules-CourseID-Cached']) || [];

        if (modulesCached.length === 0) {
            const modules = await getAndSortModules(coursePublicID);
            queryClient.setQueryData(['modules-CourseID-Cached'], [{
                courseId: coursePublicID,
                modules: modules
            }]);
            setModules(modules);
        } else {
            const modulesCache = modulesCached.find(m => m.courseId === coursePublicID);
            if (!modulesCache) {
                const modules = await getAndSortModules(coursePublicID);
                queryClient.setQueryData(['modules-CourseID-Cached'], [...modulesCached, {
                    courseId: coursePublicID,
                    modules: modules
                }]);
                setModules(modules);
            } else {
                setModules(modulesCache.modules);
            }
        }
    };

    //função para buscar os cursos pela categoria para recomendar
    const fetchCoursesByCategory = async () => {
        let coursesCategory = queryClient.getQueryData(['category-Selected-Mycourses']);

        if (!coursesCategory) {
            const categories = await controller.manageCategories.GetAllCategories();
            const categorySelected = categories.find(c => c.courses.find(c => c.id === coursePublicID));

            if (categorySelected && categorySelected.courses) {
                setCoursesCategory(categorySelected.courses);
                queryClient.setQueryData(['category-Selected-Mycourses'], categorySelected);
            } else {
                console.log('Nenhum curso encontrado para a categoria selecionada');
            }
        } else {
            if (coursesCategory.courses) {
                setCoursesCategory(coursesCategory.courses);
            } else {
                console.log('Nenhum curso encontrado no cache para a categoria selecionada');
            }
        }
    };

    //função para redirecionar para a página do curso clicado
    const handleClickCourseRecommended = async (course) => {

        //verificar se nos ["courses-Cached"] tem o curso clicado
        const coursesCached = queryClient.getQueryData(['courses-Cached']) || null;
        //buscar o curso com o id clicado
        const courseSelected = coursesCached.filter(courseCached => courseCached.id === course.id);

        //se não tiver o curso clicado no cache, buscar no banco de dados
        if (!courseSelected) {
            const course = await controller.manageCourses.GetCourseById(id);
            queryClient.setQueryData(['courseSelected'], course);
        }

        //setar o curso clicado no cache
        queryClient.setQueryData(['courseSelected'], courseSelected[0]);

        //queryClient.setQueryData(['courseSelected'], course);
        router.push(`/Cursos/${course.id}`);
    }

    //função para redirecionar usuario para página de login
    const handleLogin = () => {
        router.push('/login');
    }

    useEffect(() => {
        fetchCourse();
        fetchCoursesByCategory();
    }, [coursePublicID]);


    return (
        <div >

            <Container>
                {course &&
                    <Content>
                        <LeftContent>

                            <TitleDescription>
                                <Title >{course.title}</Title>
                                <Description >{course.description}</Description>
                                
                                <ButtonSubscribe onClick={()=>handleLogin()}>FAÇA LOGIN ACESSAR O MÓDULO</ButtonSubscribe>
                                
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
                                            
                                               
                                            <ButtonSubscribe onClick={()=>handleLogin()}>FAÇA LOGIN ACESSAR O MÓDULO</ButtonSubscribe>
                                   
                                            

                                        </ModuleItem>
                                    </div>
                                ))}
                            </ModuleList>

                        </LeftContent>

                        <RightContent>
                            <div>
                                <Image src={course.imgUrlCover} alt="Capa Curso" style={{ marginTop: '50px' }} width={1000} height={800}/>
                            </div>

                            <CourseContainer >
                                <CourseTitle>Cursos recomendados</CourseTitle>
                                {coursesCategory && coursesCategory.filter(course => course.id !== coursePublicID).map((course, index) => (
                                    <CourseCard key={index} onClick={() => handleClickCourseRecommended(course)} >
                                        <Image src={course.imgUrlThumbnail} alt="Capa Curso" style={{ borderRadius: '10px' }} width={200} height={100}/>
                                        <div style={{ display: 'flex', flexDirection: 'column', padding: "5px" }}>
                                            <p >{course.title}</p>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                                                <p style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' , fontSize:'1rem'}}>
                                                    {course.difficulty === 'iniciante' && <MdOutlineSignalCellularAlt1Bar color="#45ff45" />}
                                                    {course.difficulty === 'intermediário' && <MdOutlineSignalCellularAlt2Bar color="#45ff45" />}
                                                    {course.difficulty === 'avançado' && <MdOutlineSignalCellularAlt color="#45ff45" />}
                                                    <span> {course.difficulty}</span>
                                                </p>
                                                <p style={{ flex: 1 , fontSize:'1rem' }}>Prof: {course.owner} </p>
                                            </div>
                                        </div>
                                    </CourseCard>
                                ))}
                            </CourseContainer>
                        </RightContent>
                    </Content>
                }
            </Container>

        </div>
    );
};

export default Page;