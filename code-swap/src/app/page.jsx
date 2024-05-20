"use client";
import React, { useEffect, useState } from 'react';
import { useInteractionLogger } from './services/InteractionContext';
import interactionsType from './services/interactionsType';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Typewriter from 'typewriter-effect';
import { ContextDataCache } from './Providers/ContextDataCache';


const PageContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 100%;
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
background: rgba(81, 80, 78, 0.47);
border-radius: 24px;


@media (min-width: 640px) {
width: 33.333333%;
height: 24rem;
}
`
const TextoDireitaContainer = styled.div`
display: flex;
margin-top: 1.5rem;
align-items: center;
border-radius: 2rem;
width: 16rem;
height: 13rem;
box-sizing: border-box;
background: rgba(15, 14, 10, 0.76);
border: 1px solid #09381C;

@media (min-width: 640px) {
  margin-left: 2rem;
width: 33.333333%;
height: 95%;
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
const TextoEstatico = styled.div`
margin-top: 0.5rem;
font-weight: 600;
font-family: 'Inter';
font-style: normal;
text-align: center;
color: whitesmoke;

@media (min-width: 640px) {
  margin-top: 2rem;
  font-weight: 400;
  margin-left: 2rem;
}
`
const TextoEstaticoDireita = styled.p`
font-size:16px;
line-height:48px;
font-weight:600;
font-family:'Inter';
font-style:normal;
text-align:center;
color:whitesmoke;

@media (min-width: 640px) {
  margin-top: 2rem;
  font-size: 32px;
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

@media (min-width: 640px) {
  font-weight: 600;
  font-size: 78px;
}
`
const DivisorCarreiras = styled.div`
display: flex;
position: fixed;
bottom: 0;
margin-top: 4rem;
justify-content: center;
align-items: center;
width: 100%;
height: 6rem;
background: linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 1) 40%);
`
const ButtonCarreiras = styled.button`
border-radius: 0.75rem;
border-width: 1px;
border-color: #73DF4A;
`
const CarreirasText = styled.h2`
padding: 0.5rem;
font-size: 1.125rem;
line-height: 1.75rem;
font-weight: 600;
color: #0099ff;
`


export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const { currentUser } = ContextDataCache();

  useEffect(() => {
    if (currentUser) {
      router.push('/MyCourses');
    }

    setIsMounted(true);
  }, []);


  return (
    <>
      <div>

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
                  {isMounted && (
                    <Typewriter
                      options={{
                        strings: ['Aqui!', 'Agora!', 'Hoje!'],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  )}
                </TextoDinamico>
              </TextoEstatico>
            </TextContainer>
          </TextoEsquerda>
          {/* Segundo Texto */}
          <TextoDireitaContainer>
            <div style={{ display: 'flex', padding: '1rem' }}>
              <TextoEstaticoDireita>
                Domine as tecnologias utilizadas pelas empresas mais inovadoras do mundo e encare seu novo desafio profissional, evoluindo em comunidade com os melhores experts.
              </TextoEstaticoDireita>
            </div>

          </TextoDireitaContainer>
        </CardsContainer>

        {/* Divisor Carreiras */}

      </PageContainer>
    </>
  );
}