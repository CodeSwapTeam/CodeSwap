"use client";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../../database/firebase";
import { useAuthContext } from "../../contexts/Auth";
import { useRouter } from "next/navigation";
import { setCookies } from "../../services/cookies";
import Link from 'next/link'
import { CreateUser } from "../../../../database/functions/createUser";
import NavBarPublic from "../NavBarPublic/page";
import styled from 'styled-components';
import Image from 'next/image';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";



const Container = styled.div`
margin: 10vh auto;
display: flex;
padding: 1rem;
flex-direction: column;
width: 100%;
border: 1px solid #7cd393;
border-radius: 8px;
background: linear-gradient(90deg, rgba(2,0,36,0.5) 0%, rgba(9,9,121,0.5) 0%, rgba(0,0,0,0.5) 100%);

@media (min-width: 640px) {
flex-direction: row;
justify-content: space-around;
align-items: center;
}
`

const LeftSide = styled.div`
display: flex;
justify-content: center;
text-align: center;
flex-direction: column;
align-items: center;
`

const LabelText = styled.label`
color: #fff;
display: 'block';
margin-bottom: '5px';
`

const CodeSwapCadastro = styled.h2`
font-family: "Play", sans-serif;
font-weight: 600;
font-style: normal;
font-size: 2rem;
color: #04449c;
`

const CadastroText = styled.h2`
text-align: center;
color: #fff;
font-size: 1.5rem;
font-weight: 600;
font-style: normal;
`

const InputCadastro = styled.input`
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
`

export default function CreateAccount() {

    const { currentUser, setCurrentUser } = useAuthContext();



    const router = useRouter();

    useEffect(() => {
        //console.log('login', currentUser);
        if (currentUser) {
            router.push('/Dashboard');
        }
    }, [currentUser])


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isWhatsApp, setIsWhatsApp] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState(null);

    function criarConta(userId) {
        const userData = {
            userName: displayName,
            userId: userId,
            email: email,
            phone: phoneNumber,
            whatsapp: isWhatsApp
        }
        CreateUser(userData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !displayName) {
            alert('Nickname não pode ser em branco! .');
            return;
        }

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            criarConta(user.uid);
            alert(`Conta criada com sucesso! ${displayName}`);


            setEmail('');
            setPassword('');
            setDisplayName('');
            setError(null);

            setCurrentUser(user);// altera o Context

            setCookies(user.accessToken);
            localStorage.setItem('user', user.accessToken);


        } catch (error) {
            console.log('Error creating new user:', error.message);
            setError(error.message);
        }
    };

    return (
        <>
        <NavBarPublic/>
        <Container>
            <LeftSide>
            <Image src="/assets/logo4k.png" alt="logo" width={200} height={200} />
                <CodeSwapCadastro>CODE SWAP</CodeSwapCadastro>
                <CadastroText>Crie sua conta e inicie sua jornada hoje mesmo!</CadastroText>
            </LeftSide>

            <form style={{marginTop:'2rem', marginBottom:'2rem'}} onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <LabelText htmlFor="displayName" >Como gostaria de ser chamado(a)?:</LabelText>
                    <InputCadastro
                        type="text"
                        id="displayName"
                        value={displayName}
                        required
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Pode ser o seu nome ou um apelido!"
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <LabelText htmlFor="email">Email:</LabelText>
                    <InputCadastro
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="exemplo@exemplo.com"
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <LabelText htmlFor="password">Senha:</LabelText>
                    <InputCadastro
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Insira uma senha forte!"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <LabelText htmlFor="phoneNumber" >Número de Telefone:</LabelText>
                    <InputCadastro
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(Opcional)"
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <LabelText htmlFor="whatsapp">
                        <input
                            type="checkbox"
                            id="whatsapp"
                            checked={isWhatsApp}
                            onChange={(e) => setIsWhatsApp(e.target.checked)}
                            style={{ marginRight: '5px' }}
                        />
                        Aceita receber informativos sobre eventos e promoções via WhatsApp?
                    </LabelText>
                </div>

                <Link style={{ paddingBottom: '5px', color:'white', display:'flex', flexDirection:'row', alignItems:'center' }} href='/createAccount'>Já possui conta? <IoIosArrowForward /> Login<IoIosArrowBack /></Link>

                <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#82d79d', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Criar conta</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>Erro: {error}</p>}

        </Container>
        </>
    );
}
