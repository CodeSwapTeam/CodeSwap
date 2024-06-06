import React from "react";
import styled from "styled-components";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';


const Curriculo = styled.div`
display: flex;
flex-direction: column;
justify-content: justify;
width: 80%;
height: 80%;
background-color: white;
font-family: 'Arial', sans-serif;
color: black;
padding: 1rem;
font-size: 12pt;
`

export default function Curriculum(props) {

    const { currentUser } = ContextDataCache();

    return (
        <>
            <Curriculo size="A4">
            <p style={{display:'flex', justifyContent:'center', width:'100%', fontSize:'20pt', textTransform:'capitalize'}}>
                {currentUser?.userName}
            </p>

            <p>Email: {currentUser?.email}</p>
            <p>Telefone: {currentUser?.phone}</p>

            <hr style={{marginTop:'0.5rem', marginBottom:'0.5rem'}} />

            <h2 style={{margin:'0.5rem', fontWeight:'bold', fontSize:'14pt'}}>Projetos</h2>
                {currentUser && currentUser.Projects.map((Projects, index) => (
                    <div key={index} style={{margin:'0.5rem 0.5rem 0.5rem 1rem', width:'100%'}}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <p style={{fontWeight:'bold'}}>{Projects.projectTitle}</p>
                            <br style={{marginTop:'1rem'}}/>
                            <p>{Projects.projectDescription}</p>
                            <p>{Projects.projectLink}</p>
                        </div>
                    </div>
                ))}

            <hr style={{marginTop:'1rem'}}/>

            <h2 style={{margin:'0.5rem', fontWeight:'bold', fontSize:'14pt'}}>
                Formação & Cursos
            </h2>
            <br/>

                {currentUser && currentUser.education &&
                    <div style={{fontWeight:'bold', margin:'0.5rem 0.5rem 0.5rem 1rem'}}>
                        <p>{currentUser.education} - {currentUser.educationSituation}</p>
                        <br/>
                    </div>
                }

                {currentUser && currentUser.CoursesEnrolled.map((CoursesEnrolled, index) => (
                    <div key={index} style={{margin:'0.5rem 0.5rem 0.5rem 1rem', textTransform:'lowercase'}}>
                    <p>
                        <span style={{fontWeight:'bold'}}>
                            <span style={{textTransform:'capitalize'}}>
                                {CoursesEnrolled.difficulty}
                            </span>
                            <span style={{marginLeft:'3pt'}}/>em {CoursesEnrolled.title}
                        </span>
                        <span style={{textTransform:'capitalize'}}>
                        <span style={{marginLeft:'3pt'}}/> - Code Academy
                        <br/>
                        {CoursesEnrolled.progress}% Aproveitamento
                        </span>
                    </p>
                    </div>
                ))}
            <hr style={{marginTop:'1rem'}}/>


            <h2 style={{margin:'0.5rem', fontWeight:'bold', fontSize:'14pt'}}>Histórico Profissional</h2>
                <>
                {currentUser && Array.isArray(currentUser.Curriculum) && currentUser.Curriculum.map((Curriculum, index) => (
                    <div key={index}  style={{fontWeight:'bold', margin:'0.5rem 0.5rem 0.5rem 1rem'}}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', marginBottom:'1rem'}}>
                            <p>{Curriculum.role}</p>
                            <br/>
                            <p>{Curriculum.exp}</p>
                            <p>{Curriculum.description}</p>
                        </div>
                    </div>
                ))}
                <hr style={{marginTop:'1rem'}}/>
                </>

            <h2 style={{margin:'0.5rem', fontWeight:'bold', fontSize:'14pt'}}>Redes Sociais</h2>
            <div style={{fontWeight:'bold', margin:'0.5rem 0.5rem 0.5rem 1rem'}}>
                <h3>Linkedin: {currentUser?.linkedin}</h3>
                <h3>Github: {currentUser?.Github}</h3>
            </div>

            </Curriculo>
        </>
    );
    }
