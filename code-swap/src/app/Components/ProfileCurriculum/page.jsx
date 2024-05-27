import React from "react";
import styled from "styled-components";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';

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
            <Curriculo>
            <h1 style={{display:'flex', justifyContent:'center', width:'100%'}}>{currentUser?.userName}</h1>

            <p>Email: {currentUser?.email}</p>
            <p>Telefone: {currentUser?.phone}</p>

            <hr style={{marginTop:'0.5rem', marginBottom:'0.5rem'}} />

            <h2 style={{margin:'1rem'}}>Histórico Profissional</h2>

                <p style={{borderBottomColor:'black', borderBottomStyle:'solid', borderBottomWidth:'1px'}}><input type="text" placeholder="Empresa" /> - <input type="text" placeholder="X Anos"></input></p>
                <input type="text" placeholder='Cargo' />
                <input type="text" placeholder='Descrição' />
                <p style={{borderBottomColor:'black', borderBottomStyle:'solid', borderBottomWidth:'1px'}}><input type="text" placeholder="Empresa" /> - <input type="text" placeholder="X Anos"></input></p>
                <input type="text" placeholder='Cargo' />
                <input type="text" placeholder='Descrição' />
                <p style={{borderBottomColor:'black', borderBottomStyle:'solid', borderBottomWidth:'1px'}}><input type="text" placeholder="Empresa" /> - <input type="text" placeholder="X Anos"></input></p>
                <input type="text" placeholder='Cargo' />
                <input type="text" placeholder='Descrição' />


            <h2 style={{margin:'1rem'}}>Formação & Cursos</h2>

                <p style={{borderBottomColor:'black', borderBottomStyle:'solid', borderBottomWidth:'1px'}}><input type="text" placeholder="Instituição" /> - <input type="text" placeholder="X Anos"></input></p>
                {currentUser && currentUser.CoursesEnrolled.map((CoursesEnrolled, index) => (
                    <p key={index} style={{fontWeight:'bold', margin:'0.5rem'}}>{CoursesEnrolled.difficulty} em {CoursesEnrolled.title} - Code Academy<br/> {CoursesEnrolled.progress}% Aproveitamento</p>
                ))}

            <h2 style={{margin:'1rem'}}>Projetos</h2>

            <h3>Github: {currentUser?.Github}</h3>
            </Curriculo>
            <button>Download</button>
        </>
    );
    }