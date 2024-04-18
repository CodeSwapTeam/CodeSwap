import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const CardContainer = styled.div`
border: 1px solid #34D399;
margin: 2rem;
padding: 1rem;
width: 15rem;
border-radius: 1rem;
background-color: #EF4444;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const CardButton = styled.button`
display: flex;
margin-left: auto;
margin-right: auto;
margin-bottom: 1rem;
margin-top: 2rem;
font-weight: 600;
justify-content: center;
align-items: center;
width: 9rem;
height: 2rem;
border-radius: 1.5rem;
border-color: #000000;

:hover {
border-width: 1px;
}

`;

const ContentDiv = styled.div`
border-radius: 1rem;
height: 100%;
box-shadow: drop-shadow(0 20px 13px rgba(0, 0, 0, 0.03)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.08));
`

const CursoNome = styled.p`
padding-top: 1rem;
padding-bottom: 1rem;
font-size: 1.875rem;
line-height: 2.25rem;
font-weight: 600;
text-align: center;
`

const CursoFormacaoDiv = styled.div`
display: flex;
padding-left: 0.5rem;
padding-right: 0.5rem;
flex-direction: column;
`

const CursoLinkTree = styled.div`
margin-top: 1rem;
font-size: 1.25rem;
line-height: 1.75rem;
font-weight: 600;

`

export default function Card() {
    return (
        <CardContainer>

            <ContentDiv>
                <div>
                    <CursoNome>props.curso.nome</CursoNome>
                </div>
                <CursoFormacaoDiv>
                    <p>- props.curso.formacao1 </p>
                    <p>- props.curso.formacao2 </p>
                    <p>- props.curso.formacao3</p>
                    <CursoLinkTree>
                        <p>props.curso.aulas Aulas</p>
                        <p>props.curso.projetos Projetos</p>
                    </CursoLinkTree>

                        <CardButton>
                            <Link href={`/`}>props.nomeButton</Link>
                        </CardButton>

                </CursoFormacaoDiv>
            </ContentDiv>
        </CardContainer>
    )
}