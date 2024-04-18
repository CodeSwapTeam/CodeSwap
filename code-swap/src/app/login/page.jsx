'use client';
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/Auth";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../database/firebase";
import { setCookies } from "../services/cookies";
import Link from 'next/link'
import NavBarPublic from "../components/NavBarPublic/page";
import styled from 'styled-components';
import { Algorithm, encryptObjectData } from "../services/encryptedAlgorithm";
import { getUserData } from "../../../database/functions/getUserId";
import Image from 'next/image';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CreatePhrase, GetPhrases } from "../../../database/functions/phrases";

const Container = styled.div`
margin: 10vh auto;
display: flex;
padding: 1rem;
flex-direction: column;
justify-content: space-evenly;
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
width: 50%;
height: 100%;
padding: 5rem 0 5rem 0;
`

const RightSide = styled.div`
width: 50%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100%;

`

const CodeSwap = styled.h2`
//animation: animateCodeSwap 2.5s alternate infinite;
font-family: "Play", sans-serif;
font-weight: 600;
font-style: normal;
font-size: 2rem;
color: #04449c;
text-shadow: 0 0 1.5px #fff,
    0 0 2.5px #fff,
    0 0 5px #fff,
    0 0 10px #0fa,
    0 0 20px #0fa,
    0 0 23px #0fa;

/*@keyframes animateCodeSwap {
    100%{
text-shadow: 0 0 3.5px #fff,
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #0fa,
    0 0 40px #0fa,
    0 0 45px #0fa;
} 0% {
text-shadow: 0 0 1.5px #fff,
    0 0 2.5px #fff,
    0 0 5px #fff,
    0 0 10px #0fa,
    0 0 20px #0fa,
    0 0 23px #0fa;
}
}*/
`

const FraseMotivacional = styled.h2`
text-align: center;
color: #fff;
font-size: 1rem;
font-weight: 600;
font-style: normal;
`
const AutorMotivacional = styled.h2`
text-align: center;
color: #fff;
font-size: 1rem;
font-weight: 400;
font-style: normal;
`
const ReferenciaMotivacional = styled.h2`
text-align: center;
color: #fff;
font-size: 0.5rem;
font-weight: 400;
font-style: italic;
`
const Form = styled.form`
display: flex;
flex-direction: column;
width: 100%;
align-items: center;
`

const InputContainer = styled.div`
display: flex;
width: 90%;
flex-direction: column;
justify-content: center;
align-items: center;
`

const BoxContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 50%;
background: rgba(0,0,0,0.5);
padding: 20px;
border-radius: 20px;
box-shadow: 0 0 1.5px #fff,
    0 0 2.5px #fff,
    0 0 5px #fff,
    0 0 10px #0fa,
    0 0 20px #0fa,
    0 0 23px #0fa;
`

const LogoEffect = styled.div`

animation: animateLogoCodeSwap 2.5s alternate infinite;
border-radius: 100px;
width: 150px;
height: 150px;
position: absolute;
z-index: -1;
margin-bottom: 75px;

@keyframes animateLogoCodeSwap {
    100%{
box-shadow: 0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #0fa,
    0 0 82px #0fa,
    0 0 92px #0fa;
} 0% {
    box-shadow: 0 0 3.5px #fff,
    0 0 5px #fff,
    0 0 10.5px #fff,
    0 0 21px #0fa,
    0 0 41px #0fa,
    0 0 46px #0fa;
}
}
`

const LabelText = styled.label`
color: #fff;
display: 'block';
margin-bottom: '5px';
`

const LinkText = styled.p`
display: flex;
flex-direction: row;
color: #fff;
`

const LoginAlternatives = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
margin: 10px;
width: 100%;
`

const InputDiv = styled.div`
margin-bottom: 20px;
width: 100%;
`


export default function Login() {

    const [fraseAleatoria, setFraseAleatoria] = useState(null);
    
    async function getFraseAleatoria() {
        const frases = await GetPhrases();
        const index = Math.floor(Math.random() * frases.length);
        setFraseAleatoria(frases[index]);
    }

    

    const { currentUser, setCurrentUser } = useAuthContext();
    const r = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getFraseAleatoria();
        
        //console.log('login', currentUser);
        if (currentUser) {
            r.push('/Dashboard');
        }


    }, [currentUser])


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //jbuscar objeto User que tem o userId == user. uid
            const userData = await getUserData(user.uid);
            //console.log(userData);
            //criptografar o objeto
            const userDataCript = encryptObjectData(userData);
            //setar nos  cookies o o token acess criptografado
            setCookies(userDataCript);
            //console.log('dados criptografados pelo algoritmo', userDataCript);
            
            //localStorage.setItem('userId', user.uid);
            setCookies(userDataCript)

            setEmail('');
            setPassword('');
            setError('');
            //console.log(userData);

            setCurrentUser(userData); // atualiza context

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
        <NavBarPublic/>
        <Container>
            <LeftSide>
                <Image src="/assets/logo4k.png" alt="logo" width={200} height={200}  />
                <LogoEffect></LogoEffect>
                    <CodeSwap>CODE SWAP</CodeSwap>
                    {fraseAleatoria && <FraseMotivacional>{fraseAleatoria.frase}</FraseMotivacional> }
                    {fraseAleatoria && <AutorMotivacional>{fraseAleatoria.autor}</AutorMotivacional> }
                    {fraseAleatoria && <ReferenciaMotivacional>{fraseAleatoria.referencia}</ReferenciaMotivacional> }
            </LeftSide>
            <RightSide>
            <BoxContainer>
                <Form onSubmit={handleSubmit}>
                    <InputContainer>
                    <InputDiv>
                        <LabelText htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>E-mail:</LabelText>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </InputDiv>
                    <InputDiv>
                        <LabelText htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</LabelText>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </InputDiv>
                    <LinkText>Não possui conta?<Link style={{ paddingBottom: '5px', color:'#7cd393', display:'flex', flexDirection:'row', alignItems:'center' }} href='/createAccount/'><IoIosArrowForward /> Cadastrar-se<IoIosArrowBack /></Link></LinkText>
                    <button type="submit" style={{margin: '20px 0 20px 0', width: '60%', padding: '10px', backgroundColor: '#7cd393', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Entrar</button>
                    </InputContainer>
                    <FraseMotivacional>Ou entre com:</FraseMotivacional>
                        <LoginAlternatives>
                            <Image src="/assets/GoogleLogo.png" alt="google" width={50} height={50} style={{margin:'0 5px 0 5px'}}/>
                            <Image src="/assets/githubLogo.png" alt="github" width={50} height={50} style={{margin:'0 5px 0 5px'}}/>
                        </LoginAlternatives>
                </Form>
            </BoxContainer>
            </RightSide>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </Container>
        </>
    )

}