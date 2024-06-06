import React from "react";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import styled from "styled-components";

const ProfileProjectsTitle = styled.h1`
    font-size: 1.5rem;
    color: #f5f5f5;
    text-align: center;
`

const ProjectsContainer = styled.div`
    margin: 0.5rem;
    width: 100%;
`

const ProjectContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1rem;
`

const ProjectTitle = styled.h2`
    font-size: 1.5rem;
    color: #f5f5f5;
`

const ProjectDescription = styled.p`
    font-size: 1rem;
    color: #f5f5f5;
    margin: 0.5rem;
`

const ProjectLink = styled.p`
    font-size: 1rem;
    color: #f5f5f5;
    margin: 0.5rem;
`

const NeonLine = styled.hr`
    border: none;
    border-radius: 5px;
    padding: 0.01rem;
    animation: resumeEffect 2.5s alternate infinite;
    margin: 1rem 0 1rem 0;
`

export default function ProfileProjects(props) {

    const { currentUser } = ContextDataCache();

    return (
        <div style={{width:'100%'}}>
        <ProfileProjectsTitle>Profile Projects</ProfileProjectsTitle>
        <NeonLine/>
        <>
        {currentUser && currentUser.Projects.map((Projects, index) => (
            <ProjectsContainer key={index}>
                <ProjectContent>
                    <ProjectTitle>{Projects.projectTitle}</ProjectTitle>
                    <ProjectDescription>{Projects.projectDescription}</ProjectDescription>
                    <ProjectLink>{Projects.projectLink}</ProjectLink>
                </ProjectContent>
                <NeonLine/>
            </ProjectsContainer>
                ))}
        </>
        </div>

    );
    }