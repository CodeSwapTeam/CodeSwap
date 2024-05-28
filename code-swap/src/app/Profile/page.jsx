"use client"
import React, { useContext, useEffect, useState } from 'react';
import { ContextDataCache } from '../Providers/ContextDataCache';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import ProfileConfig from '../Components/ProfileConfig/page';
import ProfileProjects from '../Components/ProfileProjects/page';
import ProfileCurriculum from '../Components/ProfileCurriculum/page';
import ProfileSkills from '../Components/ProfileSkills/page';

//Estilização da página

const PageContainer = styled.div`
display: flex;
flex-direction: row;
width: 100%;
height: 100%;
margin-top: 8vh;
color: #f5f5f5;
`

//Estilização da parte esquerda
const ProfileResume = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 30%;
height: 100%;
margin: 1rem;
//background-color: #f5f5f5;
`

const ProfileImage = styled.img`
width: 150px;
height: 150px;
border-radius: 50%;
border: 1px solid #000;
padding: 2%;
`

const ProfileName = styled.h1`
font-size: 2rem;
color: #f5f5f5;
`

const ProfileImageEffect = styled.div`

animation: animateLogoCodeSwap 2.5s alternate infinite;
border-radius: 100px;
width: 150px;
height: 150px;
margin-bottom: 10%;

@keyframes animateLogoCodeSwap {
    100%{
box-shadow: 0 0 2px #fff,
    0 0 4px #fff,
    0 0 8px #fff,
    0 0 15px #0fa,
    0 0 22px #0fa,
    0 0 25px #0fa;
} 0% {
    box-shadow: 0 0 1px #fff,
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 8px #0fa,
    0 0 12px #0fa,
    0 0 15px #0fa;
}
}
`

const ResumeSection = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
margin: 1rem;
background-color: rgba(0, 0, 0, 0.75);
border-radius: 10%;
padding: 1rem;
`
const ProgressBar = styled.div`
    background-color: #f3f3f3;
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
}
`;

//Estilização da parte direita

const ProfileDetails = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
margin: 1rem;
`

const DetailsHeader = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-evenly;
width: 100%;
height: 100%;
margin-top: 1rem;
color: white;
`

const DetailHeaderButton = styled.button`
color: #f5f5f5;
border: none;
border-radius: 5px;
padding: 0.5rem;
border-radius: 10px 10px 0 0;
background-color: rgba(0, 0, 0, 0.75);
font-size: 1.5rem;
`

const DetailContent = styled.div`
display: flex;
box-sizing: border-box;
flex-direction: column;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.75);
color: white;
padding: 1rem;
`


function ProfilePage(props) {
    //Função para redirecionar o usuário para a página de login caso não esteja logado
    const { currentUser } = ContextDataCache();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !currentUser) {
                router.push('/login');
            } else {
                return (
                    <div>
                        <h1>Carregando...</h1>
                    </div>
                )
            }
        }, [isMounted, currentUser]);

        //tabs
        const [selectedTab, setSelectedTab] = useState('Habilidades');

        return (
            <>
            <PageContainer>
                <ProfileResume>
                    <ResumeSection>
                        <ProfileImageEffect>
                            <ProfileImage src={currentUser?.imgUrlProfile} />
                        </ProfileImageEffect>
                        <ProfileName>{currentUser?.userName}</ProfileName>
                    </ResumeSection>
                    <ResumeSection>
                            <ProfileName>Nível do Perfil</ProfileName>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <ProfileName style={{marginLeft: '1rem'}}>Level: {currentUser?.lvl}</ProfileName>
                                <ProfileName style={{marginLeft: '1rem'}}>XP:{currentUser?.xp}</ProfileName>
                            </div>
                        <ProgressBar width={`${currentUser?.xp}%`}/>
                    </ResumeSection>
                    <ResumeSection>
                        <ProfileName>Insígnias</ProfileName>
                        <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        <Image src={currentUser?.imgUrlProfile} width={50} height={50}/>
                        </div>
                    </ResumeSection>
                </ProfileResume>

                <ProfileDetails>
                    <DetailsHeader>
                        <div style={{backgroundColor:'black', borderRadius:'50% 50% 0 0'}}>
                            <DetailHeaderButton onClick={() => setSelectedTab('Habilidades')}>Habilidades</DetailHeaderButton>
                            <DetailHeaderButton onClick={() => setSelectedTab('Curriculo')}>Currículo</DetailHeaderButton>
                            <DetailHeaderButton onClick={() => setSelectedTab('Projetos')}>Projetos</DetailHeaderButton>
                            <DetailHeaderButton onClick={() => setSelectedTab('Configuracoes')}>Configurações</DetailHeaderButton>
                        </div>
                    </DetailsHeader>
                    {selectedTab === 'Habilidades' && <DetailContent>
                        <ProfileSkills />
                    </DetailContent>}
                    {selectedTab === 'Curriculo' && <DetailContent>
                        <ProfileCurriculum />
                    </DetailContent>}
                    {selectedTab === 'Projetos' && <DetailContent>
                        <ProfileProjects />
                    </DetailContent>}
                    {selectedTab === 'Configuracoes' && <DetailContent>
                    <ProfileConfig />
                    </DetailContent>}
                </ProfileDetails>
            </PageContainer>
            </>
        )
    }

export default ProfilePage;