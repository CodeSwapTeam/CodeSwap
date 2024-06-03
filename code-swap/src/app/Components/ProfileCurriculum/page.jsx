import React from "react";
import styled from "styled-components";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const Title = styled.h1`
font-size: 2rem;
color: white;
`

const Curriculo = styled.div`
display: flex;
flex-direction: column;
justify-content: justify;
width: 80%;
height: 80%;
background-color: white;
font-family: 'Roboto', sans-serif;
color: black;
padding: 1rem;
`

export default function ProfileCurriculum(props) {

    const { currentUser } = ContextDataCache();

    return (
        <>
            <Title>Seu Currículo em PDF</Title>
            <Curriculo size="A4">
            <h1 style={{display:'flex', justifyContent:'center', width:'100%'}}>{currentUser?.userName}</h1>

            <p>Email: {currentUser?.email}</p>
            <p>Telefone: {currentUser?.phone}</p>

            <hr style={{marginTop:'0.5rem', marginBottom:'0.5rem'}} />

            <h2 style={{margin:'1rem'}}>Histórico Profissional</h2>
                <>
                {currentUser && Array.isArray(currentUser.Curriculum) && currentUser.Curriculum.map((Curriculum, index) => (
                    <div key={index} style={{fontWeight:'bold', margin:'0.5rem', border:'solid 1px white', width:'100%'}}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', marginBottom:'1rem'}}>
                            <p>{Curriculum.role}</p>
                            <br/>
                            <p>{Curriculum.exp}</p>
                            <p>{Curriculum.description}</p>
                            <hr/>
                        </div>
                    </div>
                ))}
                </>


            <h2 style={{margin:'1rem'}}>Formação & Cursos</h2>

                    <div style={{fontWeight:'bold', margin:'0.5rem'}}>
                    <p >{currentUser.education} - {currentUser.educationSituation}</p>
                    </div>
                {currentUser && currentUser.CoursesEnrolled.map((CoursesEnrolled, index) => (
                    <div key={index} style={{fontWeight:'bold', margin:'0.5rem'}}>
                    <p >{CoursesEnrolled.difficulty} em {CoursesEnrolled.title} - Code Academy<br/> {CoursesEnrolled.progress}% Aproveitamento</p>
                    </div>
                ))}

            <h2 style={{margin:'1rem'}}>Projetos</h2>
            <hr/>
                {currentUser && currentUser.Projects.map((Projects, index) => (
                    <div key={index} style={{fontWeight:'bold', margin:'0.5rem', border:'solid 1px white', width:'100%'}}>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', marginBottom:'1rem'}}>
                            <p>{Projects.projectTitle}</p>
                            <br/>
                            <p>{Projects.projectDescription}</p>
                            <p>{Projects.projectLink}</p>
                            <hr/>
                        </div>
                    </div>
                ))}

            <h2 style={{margin:'1rem'}}>Redes Sociais</h2>

            <h3>Linkedin: {currentUser?.linkedin}</h3>
            <h3>Github: {currentUser?.Github}</h3>
            </Curriculo>
            <DownloadButton />
        </>
    );
    }

    // Function to download the PDF
const downloadPDF = async () => {
    const blob = await pdf(<Curriculo />).toBlob();
    saveAs(blob, 'my-curriculum.pdf');
};

  // Your component
const DownloadButton = () => (
    <button onClick={downloadPDF}>Download1</button>
);