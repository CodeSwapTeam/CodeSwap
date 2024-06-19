import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styled from 'styled-components';

const ListItens = styled.div`
    
    width: 95%;
    margin-top: 20px;
    
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

const ModuleItem = styled.div`
    
    
    color: white;  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: max-height 1s ease-in-out;
    max-height: ${props => props.open ? '1000px' : '0'};

    font-size: 1rem;

    margin-left: 0px;
    margin-right: 0px;

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;

const ButtonAcessCourse = styled.button`
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

export function CoursesCategoryList({ courses }) {
    const [openIndex, setOpenIndex] = useState(null);

    const router = useRouter();

    //função para abrir e fechar o modulo
    const toggleOpen = (index) => {
        if (openIndex !== index) {
            setOpenIndex(index);
        } else {
            setOpenIndex(null);
        }
    };

    //função para acessar o curso
    const handleAcessCourse = (course) => {
        console.log(course);
        router.push(`/DistrictMap/${course}`);
    }

    return (
        <ListItens>
            {courses && courses.map((course, index) => (
                <div key={index}>
                    <ModuleTitle onClick={() => toggleOpen(index)} 
                    style={{
                        fontWeight: openIndex === index ? 'bold' : 'normal',
                        backgroundColor: openIndex === index ? '#00000063' : 'transparent',
                        marginBottom: openIndex === index ? '10px' : '0'
                    }}>
                        {course.title}
                    </ModuleTitle>
                    <ModuleItem open={openIndex === index} 
                    style={{ 
                        backgroundColor: openIndex === index ? '#00000058' : 'transparent',
                        padding: openIndex === index ? '10px' : '0'
                        }}>
                            <div style={{display:"flex"}}>
                                <div style={{ width:'60%'}}>
                                    <h3 style={{ textAlign: 'left' }}>Descrição do curso</h3>
                                    {course.description}

                                    <h3 style={{ textAlign: 'left' , marginTop:'40px'}}>Recompensas:</h3>
                                    <p>Codes: {course.codes}</p>
                                    <p>Experiência: {course.experience}</p>

                                    <h3 style={{ textAlign: 'left' , marginTop:'20px'}}>Itens:</h3>

                                </div>

                                <div style={{width:'40%'}}>
                                
                                    {course.imgUrlCover && <Image src={course.imgUrlCover} alt={course.title} style={{  }} width={400} height={400} />}
                                </div>
                            </div>

                            <ButtonAcessCourse onClick={()=> handleAcessCourse(course.id)}>Iniciar Quests</ButtonAcessCourse>
                        

                        {/* <LessonsModule>
                            {course.modules && course.modules.map((module, index) => (
                                <div key={index}>
                                    <h3 style={{ textAlign: 'left' }}>{module.title}</h3>
                                </div>
                            ))}
                        </LessonsModule> */}
                        {/* {
                            currentUser && currentUser.CoursesEnrolled && currentUser.CoursesEnrolled.find(c => c.courseId === course.id) ?
                                ((courseEnrolled) => (
                                    courseEnrolled.modulePermission >= module.permission ?
                                        <ButtonSubscribe>CLIQUE PARA ACESSAR O MÓDULO</ButtonSubscribe>
                                        :
                                        <p>Complete os módulos anteriores para liberar o curso</p>
                                ))(currentUser.CoursesEnrolled.find(c => c.courseId === course.id))
                                :
                                <p>Se inscreva no curso para visualizar o módulo</p>
                        } */}
                    </ModuleItem>
                </div>
            ))}
        </ListItens>
    );
}

export default CoursesCategoryList;