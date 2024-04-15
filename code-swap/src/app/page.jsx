"use client";
import React, { useEffect, useState } from 'react';
import { useInteractionLogger} from '../app/contexts/InteractionContext';
import interactionsType from './contexts/interactionsType';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Typewriter from 'typewriter-effect';
import { getCookies } from './services/cookies';
import { useAuthContext } from './contexts/Auth';
import NavBarPublic from './components/NavBarPublic/page';

const PageContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 100vh;
`

const CardsContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;

@media (min-width: 640px) {
  margin-left: 2.5rem;
flex-direction: row;
justify-content: space-around;
}
`

const TextoEsquerda = styled.div`
margin-top: 2rem;
border-radius: 1rem;
width: 16rem;
height: 14rem;

@media (min-width: 640px) {
width: 33.333333%;
height: 24rem;
}
`

const TextoDireitaContainer = styled.div`
display: flex;
margin-top: 1.5rem;
align-items: center;
border-radius: 1rem;
width: 16rem;
height: 13rem;
background-color: #000000;

@media (min-width: 640px) {
  margin-left: 2rem;
width: 33.333333%;
height: 16rem;
}
`

const TextContainer = styled.div`
display: flex;
font-size: 3rem;
line-height: 1;
text-align: center;

@media (min-width: 640px) {
  margin-top: 2.5rem;
margin-bottom: 2.5rem;
font-size: 3.75rem;
line-height: 1;
}
`

const TextoEstatico = styled.p`
margin-top: 0.5rem;
font-weight: 600;
color: white;

@media (min-width: 640px) {
  margin-top: 2rem;
}
`

const TextoDinamico = styled.span`
font-family: 'Inter';
font-style: normal;
font-weight: 600;
font-size: 96px;
line-height: 116px;

color: #73DF4A;
text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`


export default function Home() {

  const r = useRouter();

  const {currentUser, setCurrentUser} = useAuthContext();

  useEffect(() => {
    //console.log('home', currentUser);
    if(currentUser){

      r.push('/Dashboard');
    }

  }, []);

  const isClient = typeof window !== 'undefined';


      return (
        <>
        <div>
          <NavBarPublic />
        </div>
        <PageContainer>
                    {/* Cards Middle */}
                    <CardsContainer>
                        {/* primeiro Texto */}
                        <TextoEsquerda>
                            <TextContainer>
                                <TextoEstatico>Sua carreira Começa
                                    <br />
                                    <TextoDinamico>
                                                    {isClient ? (
                                                      <Typewriter
                                                        options={{
                                                          strings: ['Aqui!', 'Agora!', 'Hoje!'],
                                                          autoStart: true,
                                                          loop: true,
                                                        }}
                                                      />
                                                    ) : (
                                                      <p>Loading</p>
                                                    )}
                                                  </TextoDinamico>
                                              </TextoEstatico>
                                          </TextContainer>
                                      </TextoEsquerda>
                                      {/* Segundo Texto */}
                        <TextoDireitaContainer>
                                <div style={{display:'flex'}}>
                                    <TextoEstatico>
                                            Domine as tecnologias utilizadas pelas empresas mais inovadoras do mundo e encare seu novo desafio profissional, evoluindo em comunidade com os melhores experts.
                                    </TextoEstatico>

                                </div>

                        </TextoDireitaContainer>
                    </CardsContainer>

                    {/* Divisor Carreiras */}
                    <div className="h-24  w-full mt-16 fixed bottom-0
                        backdrop-opacity-10 backdrop-invert bg-black/70
                        flex justify-center items-center">

                        <Link href={"/Carreiras"}>
                            <button className="border rounded-xl border-secondaryGreen" id="Carreiras">
                                <h2 className="text-lg text-primaryBlue font-semibold p-2">
                                    Explore nossas Carreiras
                                </h2>
                            </button>
                        </Link>
                    </div>
                </PageContainer>
        </>
      );
}