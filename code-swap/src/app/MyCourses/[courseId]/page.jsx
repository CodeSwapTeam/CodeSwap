"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar,MdOutlineSignalCellularAlt1Bar } from "react-icons/md";




import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from 'next/image';

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
    @media (max-width: 1024px) {
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
    
    
    
    @media (max-width: 1024px) {
        width: 100%;     
        margin-top: 10%;
        align-items: center;
        justify-content: center;
        
    }
    //se a tela for maior que 836px adicione uma margin-left de 50px
    @media (min-width: 836px) {
        
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

    
    @media (max-width: 1170px) {
        padding-left: 50px;
        padding-right: 50px;
    }

    @media (max-width: 1024px) {
        padding-left: 10px;
        padding-right: 10px;
    }


`;

const LessonsModule = styled.div`
    
    margin-top: 20px;
    width: 50%;
    color: white;
    font-size: 1rem;
    //justify-content: left;
    //align-items: left;
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
    @media (max-width: 1024px) {
        width: 100%;
    }
`;

const CourseContainer = styled.div`
    margin-top: 40px;
    text-align: center;
    width: 100%;
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
        font-size: 1rem;
        margin: auto;

        @media (max-width: 470px) {
            font-size: 0.8rem;         
        }     
    } 
    
    @media (max-width: 470px) {
            height: 120px;           
        }
`;

const Title = styled.h1`
  color: #45ff45;
  margin-top: 70px;
  font-size: 2rem;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
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
    const { courseId } = useParams(); // Parâmetro de courseId da URL
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
        let course = coursesCached.find(course => course.id === courseId);

        if (!course) {
            course = await controller.manageCourses.GetCourseById(courseId);
            
            queryClient.setQueryData(['courseSelected'], course);
            //adicionar nos ['courses-Cached']
            queryClient.setQueryData(['courses-Cached'], [...coursesCached, course]);
        } else {
            queryClient.setQueryData(['courseSelected'], course);
        }
    
        setCourse(course);
        console.log('Curso:', course);

        const getAndSortModules = async (courseId) => {
            const modules = await controller.manageModules.GetModulesCourseID(courseId);
            modules.sort((a, b) => a.permission - b.permission);
            return modules;
        }
        
        const modulesCached = queryClient.getQueryData(['modules-CourseID-Cached']) || [];
        
        if (modulesCached.length === 0) {
            const modules = await getAndSortModules(courseId);
            queryClient.setQueryData(['modules-CourseID-Cached'], [{
                courseId: courseId,
                modules: modules
            }]);
            setModules(modules);
        } else {
            const modulesCache = modulesCached.find(m => m.courseId === courseId);
            if(!modulesCache) {
                const modules = await getAndSortModules(courseId);
                queryClient.setQueryData(['modules-CourseID-Cached'], [...modulesCached, {
                    courseId: courseId,
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
            const categorySelected = categories.find(c => c.courses.find(c => c.id === courseId));
    
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
        const coursesCached = queryClient.getQueryData(['courses-Cached']);
    
        let courseSelected;
        //buscar o curso com o id clicado
        if (coursesCached) {
            courseSelected = coursesCached.filter(courseCached => courseCached.id === course.id);
        }
    
        //se não tiver o curso clicado no cache, buscar no banco de dados
        if (!courseSelected || courseSelected.length === 0) {
            const courseFromDB = await controller.manageCourses.GetCourseById(course.id);
            queryClient.setQueryData(['courseSelected'], courseFromDB);
        } else {
            //setar o curso clicado no cache
            queryClient.setQueryData(['courseSelected'], courseSelected[0]);
        }
    
        router.push(`/MyCourses/${course.id}`);
    }

    //função para inscrever o usuário no curso
    const subscribeUser = async (course) => {
        console.log('Curso matriculado:', course);
        //verifica se o curso é premium e o usuário não é premium
        if (course.coursePremium === true && currentUser.premium === false) {
            //se for premium, redireciona para a página de pagamento
            router.push(`/SwapPro`);
            return;
        } else {
            try {
                //inscrever o usuário no curso
                const response = await fetch(`/api/posts?type=EnrollCourse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        courseId: course.id,
                        userId: currentUser.id,
                        status: 'cursando',
                        progress: 0,
                        modulePermission: 1,
                        imgUrlThumbnail: course.imgUrlThumbnail,
                        title: course.title,
                        difficulty: course.difficulty,
                     }),
                });

                if (!response.ok) throw new Error('Erro ao inscrever o usuário no curso');
                
                //buscar os dados do usuário novamente no banco de dados e atualizar os cookies
                const novosDados = await controller.manageUsers.GetUserDataBase(currentUser.userCredential);
                setCurrentUser(novosDados);
                
                
            } catch (error) {
                console.error('Erro ao inscrever o usuário no curso:', error);
            }
        }
    }


    useEffect(() => {
        fetchCourse();
        fetchCoursesByCategory();
    }, [courseId, currentUser]);

    return (
        <div >
            <BackgroundImage />

            <Container>
                {course &&
                    <Content>
                        <LeftContent>

                            <TitleDescription>
                                <Title >{course.title}</Title>
                                <Description >{course.description}</Description>
                                {
                                    // Se currentUser e CoursesEnrolled existirem e o curso com o id do curso estiver em CoursesEnrolled, mostrar o botão CURSANDO, senão mostrar o botão INSCREVA-SE
                                    currentUser && currentUser.CoursesEnrolled && currentUser.CoursesEnrolled.find(c => c.courseId === course.id) ?
                                        ((courseEnrolled) => (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <p style={{ color: 'white', fontSize: '1rem', marginRight: '10px' }}>CURSANDO</p>
                                                <div style={{ marginLeft: '10px', height: '20px', width: '200px', backgroundColor: '#45ff45', borderRadius: '10px' }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%',
                                                        width: `${courseEnrolled.progress}%`,
                                                        backgroundColor: '#0532ff',
                                                        borderRadius: '10px',
                                                        color: '#45ff45',
                                                        fontSize: '1rem'
                                                    }}> {courseEnrolled.progress > 0 ? `${courseEnrolled.progress}%` : null}</div>    
                                                </div>
                                            </div>
                                        ))(currentUser.CoursesEnrolled.find(c => c.courseId === course.id))
                                        :
                                        <ButtonSubscribe onClick={() => subscribeUser(course)}>INSCREVA-SE</ButtonSubscribe>
                                }
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

                                            <div style={{ display:' flex', width:'100%',height:'250px'}}>
                                                <LessonsModule>
                                                    {module.lessons && module.lessons.map((lesson, index) => (
                                                        <div key={index}>
                                                            <h3 style={{ textAlign: 'left' }}>{lesson.nameLesson}</h3>
                                                            <p>
                                                                {lesson.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </LessonsModule>
                                                <div style={{width: '50%',alignContent:"center"}}>
                                                    <img src={module.thumbnail} alt="NPC" />
                                                </div>
                                            </div>
                                            {
                                                currentUser && currentUser.CoursesEnrolled && currentUser.CoursesEnrolled.find(c => c.courseId === course.id) ?
                                                    ((courseEnrolled) => (
                                                        courseEnrolled.modulePermission >= module.permission ?
                                                            <ButtonSubscribe>CLIQUE PARA ACESSAR O MÓDULO</ButtonSubscribe>
                                                            :
                                                            <p>Complete os módulos anteriores para liberar o curso</p>
                                                    ))(currentUser.CoursesEnrolled.find(c => c.courseId === course.id))
                                                    :
                                                    <p>Se inscreva no curso para visualizar o módulo</p>
                                            }

                                        </ModuleItem>
                                    </div>
                                ))}
                            </ModuleList>
                        </LeftContent>

                        <RightContent>
                            {course.imgUrlCover && (
                                <div>
                                    <Image src={course.imgUrlCover} alt="Capa Curso" style={{ marginTop: '50px' }} width={1000} height={800}/>
                                </div>
                            )}

                            <CourseContainer >
                                <CourseTitle >Cursos recomendados</CourseTitle>
                                {coursesCategory && coursesCategory.filter(course => course.id !== courseId).map((course, index) => (
                                    <CourseCard key={index} onClick={()=>handleClickCourseRecommended(course)} >
                                        <Image src={course.imgUrlThumbnail} alt="Capa Curso" style={{ borderRadius: '10px' }} width={200} height={100}/>
                                        <div style={{ display: 'flex', flexDirection: 'column', padding: "5px" }}>
                                            <p >{course.title}</p>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                                                <p style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {course.difficulty === 'iniciante' && <MdOutlineSignalCellularAlt1Bar color="#45ff45" />}
                                                    {course.difficulty === 'intermediário' && <MdOutlineSignalCellularAlt2Bar color="#45ff45" />}
                                                    {course.difficulty === 'avançado' && <MdOutlineSignalCellularAlt color="#45ff45" />}
                                                    <span> {course.difficulty}</span>
                                                </p>
                                                <p style={{ flex: 1 }}>Prof: {course.owner} </p>
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