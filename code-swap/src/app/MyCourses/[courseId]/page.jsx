"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar,MdOutlineSignalCellularAlt1Bar } from "react-icons/md";




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
        align-items: center;
        justify-content: center;
    }
`;

const LeftContent = styled.div`

    left: 0;

    margin-top: 50px;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    
    @media (max-width: 768px) {
        width: 100%;
        margin-left: 50px;
        
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
    box-sizing: border-box;
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

    

    right: 0;
    padding: 20px;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    //alinhar verticalmente

    align-items: center;
    height: 100%;

    width: 40%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const CourseContainer = styled.div`

    margin-top: 40px;
    //centraliza o texto
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
        router.push(`/MyCourses/${course.id}`);
    }

    //função para inscrever o usuário no curso
    const subscribeUser = async (course) => {
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
                        userId: currentUser.id,
                        courseId: course.id,
                        status: 'cursando',
                        progress: 0,
                        modulePermission: 1
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

    

    return (
        <div >
            <BackgroundImage />

            <Container>
                {course &&
                    <Content>
                        <LeftContent>

                            <TitleDescription>
                                <h1 style={{ color: '#45ff45', fontSize: '2rem', marginTop: '20px' }}>{course.title}</h1>
                                <p style={{ color: 'white', fontSize: '1rem', margin: '20px' }}>{course.description}</p>
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

                                            <LessonsModule>
                                                {module.lessons && module.lessons.map((lesson, index) => (
                                                    <div key={index}>
                                                        <h3 style={{ textAlign: 'left' }}>{lesson.nameLesson}</h3>
                                                    </div>
                                                ))}
                                            </LessonsModule>
                                            {
                                                // Se currentUser e CoursesEnrolled existirem e o curso com o id do curso estiver em CoursesEnrolled, verificar modulePermission e renderizar o botão ou a mensagem apropriada
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
                            <div>
                                <img src={course.imgUrlCover} alt="Capa Curso" style={{ marginTop: '50px' }} />
                            </div>

                            <CourseContainer >
                                <h1 style={{ margin: 'auto', color: '#45ff45', fontSize: '2vw' }}>Cursos recomendados</h1>
                                {coursesCategory && coursesCategory.filter(course => course.id !== courseId).map((course, index) => (
                                    <CourseCard key={index} onClick={()=>handleClickCourseRecommended(course)} >
                                        <img src={course.imgUrlThumbnail} alt="Capa Curso" style={{ borderRadius: '10px' }} />
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