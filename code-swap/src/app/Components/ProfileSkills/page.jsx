'use client'
import React from "react";
import styled from "styled-components";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';


const HabilidadesContainer = styled.div`
display: flex;
box-sizing: border-box;
flex-direction: column;
align-items: stretch;
justify-content: flex-start;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.75);
color: white;
padding: 1rem;
flex-wrap: nowrap;
`

const ProgressBar = styled.div`
    background-color: #001d46;
    border-radius: 13px;
    height: 15px;
    width: 80%;
    position: relative;
    margin: auto;
    color: black;


&::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width || '0%'};
    height: 100%;
    background-color: #4caf50;
    border-radius: 13px;
    animation: progressBarEffect 2.5s alternate infinite;
}

@keyframes progressBarEffect {
    100%{
box-shadow: 0 0 1px #fff,
    0 0 2px #fff,
    0 0 4px #fff,
    0 0 6px #0fa,
    0 0 8px #0fa,
    0 0 10px #0fa;
} 0% {
    box-shadow: 0 0 1px #fff,
    0 0 1px #fff,
    0 0 2px #fff,
    0 0 4px #0fa,
    0 0 6px #0fa,
    0 0 8px #0fa;
}
}
`;

const NeonLine = styled.hr`
    border: none;
    border-radius: 5px;
    padding: 0.01rem;
    animation: resumeEffect 2.5s alternate infinite;
    margin: 3rem 0 0 0;
`

export default function ProfileSkills(props) {
    const { currentUser } = ContextDataCache();
    return (
        <>
        {currentUser && currentUser.CoursesEnrolled?.map((CoursesEnrolled, index) => (
            <HabilidadesContainer key={index} style={{fontWeight:'bold', margin:'0.5rem'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:'1rem'}}>
                    <p>{CoursesEnrolled.title}</p>
                    <p>{CoursesEnrolled.progress}%</p>
                </div>
                <div>
                    <ProgressBar width={`${CoursesEnrolled.progress}%`}/>
                </div>
                <NeonLine/>
            </HabilidadesContainer>
                ))}
        </>
    );
}