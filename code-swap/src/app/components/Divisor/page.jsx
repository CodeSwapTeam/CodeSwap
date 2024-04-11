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

export default function Divisor() {
    return (
        <DivisorContainer>
                <DivisorButtonContainer>
                    <Link href={"/Comunidade"}>
                        <DivisorButton id="Carreiras">
                            <h2 className="text-lg text-primaryBlue font-semibold p-2">
                                Acesso a Comunidade
                            </h2>
                        </DivisorButton>
                    </Link>
                </DivisorButtonContainer>
            </DivisorContainer>
    )
}