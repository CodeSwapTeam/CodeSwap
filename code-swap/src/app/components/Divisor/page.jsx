import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const DivisorContainer = styled.div`
width: 100%;
`

const DivisorButtonContainer = styled.div`
display: flex;
position: fixed;
bottom: 0;
justify-content: center;
align-items: center;
width: 100%;
height: 6rem;
`

const DivisorButton = styled.button`
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
border-radius: 0.75rem;
border-color: #000000;
border-width: 1px;
`

const DivisorText = styled.h2`
padding: 0.5rem;
font-size: 1.125rem;
line-height: 1.75rem;
font-weight: 600;
`

export default function Divisor() {
    return (
        <DivisorContainer>
                <DivisorButtonContainer>
                    <Link href={"/Comunidade"}>
                        <DivisorButton id="Carreiras">
                            <DivisorText >
                                Acesso a Comunidade
                            </DivisorText>
                        </DivisorButton>
                    </Link>
                </DivisorButtonContainer>
            </DivisorContainer>
    )
}