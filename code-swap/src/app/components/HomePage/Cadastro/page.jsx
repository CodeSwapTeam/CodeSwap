/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, Navigate } from 'next/link';
import logo4k from '.../public/assets/logo4k.png';
import {FaArrowLeft} from 'react-icons/fa';
import NavBar from '../NavBar';


const CadastroContainer = styled.div`
display: flex;
min-height: 100vh;
background-repeat: no-repeat;
`

const TelaCadastro = styled.div`
display: flex;
padding: 1rem;
flex-direction: column;
width: 100%;

@media (min-width: 640px) {
flex-direction: row;
justify-content: space-around;
align-items: center;
}

`

const AbaLateral = styled.div`
display: flex;
justify-content: center;
text-align: center;
flex-direction: column;
`

const LogoContainer = styled.div`
width: 4rem;
height: 4rem;

@media (min-width: 640px) {
margin-top: 1rem;
margin-bottom: 1rem;
width: 8rem;
height: 8rem;
}
`

const CodeSwapName = styled.p`
margin-top: 0.5rem;
font-size: 1.5rem;
line-height: 2rem;
`

const TextoComunidade = styled.p`
padding: 1rem;
font-size: 1.25rem;
line-height: 1.75rem;
font-weight: 700;
color: #ffffff;

@media (min-width: 640px) {
font-size: 2.25rem;
line-height: 2.5rem;
}
`

const LoginBackButtonContainer = styled.div`
display: flex;
align-items: center;
font-weight: 600;
`

const HomeBackButtonContainer = styled.div`
border-radius: 1rem;
font-size: 1.25rem;
line-height: 1.75rem;
font-weight: 700;
text-align: center;
color: #000000;
`

const FormularioContainer = styled.div`
display: flex;
padding: 1rem;
flex-direction: column;
border-radius: 1rem;

@media (min-width: 640px) {
width: 24rem;
}
`

const InputContainer = styled.div`
display: flex;
flex-direction: column;
`

const InputCadastro = styled.input`
padding-left: 1rem;
margin-bottom: 0.5rem;
border-radius: 0.75rem;
height: 3.5rem;
font-size: 0.875rem;
line-height: 1.25rem;
color: #ffffff;

@media (min-width: 640px) {
height: 4rem;
}
`

const BottomForm = styled.div`
display: flex;
margin-top: 1.5rem;
flex-direction: column;
`

const TextoTermosEPoliticas = styled.p`
margin-top: 0.5rem;
font-size: 0.75rem;
line-height: 1rem;
text-align: center;
color: #ffffff;

@media (min-width: 640px) {
font-size: 1rem;
line-height: 1.5rem;
}
`
const CadastrarButton = styled.button`
display: flex;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
justify-content: center;
border-radius: 0.5rem;
width: 83.333333%;
font-size: 1.5rem;
line-height: 2rem;
font-weight: 700;
`

export default function Login() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    function handleCadastro(e) {
        e.preventDefault();
        createUserWithEmailAndPassword(email, password);
    }

    if (loading) {
        console.log(user)
        return <Navigate to="/Dashboard" />
    }

    return (
        <CadastroContainer>
                    <NavBar />
            <TelaCadastro>

                {/* Aba Lateral com Imagem */}
                <AbaLateral>

                        <LogoContainer>

                            <Image src={logo4k} alt='Logo CodeSwap' />
                        </LogoContainer>

                        <CodeSwapName>
                            CODE SWAP
                        </CodeSwapName>

                        <div style={{textAlign:'center'}}>
                            <TextoComunidade>
                                Junte-se  <br /> a Comunidade
                            </TextoComunidade>
                        </div>

                        <Link href={'/Login'}>
                            <LoginBackButtonContainer>
                                <span><FaArrowLeft/></span><span style={{marginLeft: '1rem' }}>Voltar para Login</span>
                            </LoginBackButtonContainer>
                        </Link>

                </AbaLateral>

                {/* Formulário */}
                <FormularioContainer>

                    {/* Inputs */}
                    <InputContainer>
                        <InputCadastro type="text" className='bg-black/70 rounded-xl mb-2 h-14 text-sm text-white sm:h-16 pl-4' placeholder={`Digite Seu nome`} />
                        {/* e-mail */}
                        <InputCadastro onChange={e => setEmail(e.target.value)} type="text" className='bg-black/70 rounded-xl mb-2  h-14 text-sm text-white sm:h-16 pl-4' placeholder=' Digite Seu e-mail' />
                        {/* senha */}
                        <InputCadastro onChange={e => setPassword(e.target.value)} type="password" className='bg-black/70 rounded-xl mb-2 h-14 text-sm text-white sm:h-16 pl-4' placeholder={`Digite sua senha`} />
                        <InputCadastro type="password" className='bg-black/70 rounded-xl  h-14 text-sm text-white sm:h-16 pl-4' placeholder=' Repita sua senha' />
                    </InputContainer>
                    {/* Bottom Form */}
                    <BottomForm>
                        <TextoTermosEPoliticas>Ao se cadastrar você aceita nossos
                                    <span style={{fontWeight: '600'}}> termos de uso </span>e nossa <span style={{fontWeight: '600'}}>politica de privacidade</span>
                        </TextoTermosEPoliticas>
                        {/* Botao Cadastrar */}
                        <CadastrarButton>
                            <Link>
                                <button onClick={handleCadastro}>Cadastrar</button>
                            </Link>
                        </CadastrarButton>

                        <Link href={'/'}>
                            <HomeBackButtonContainer>
                                <span><FaArrowLeft/></span><span style={{marginLeft: '1rem' }}>Voltar para a Home</span>
                            </HomeBackButtonContainer>
                        </Link>
                    </BottomForm>

                </FormularioContainer>
            </TelaCadastro>
        </CadastroContainer>
    )
}