'use client';
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/Auth";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, } from "../../../database/firebase";
import { setCookies } from "../services/cookies";
import Link from 'next/link'
import NavBarPublic from "../components/NavBarPublic/page";
import styled from 'styled-components';
import { Algorithm, encryptObjectData } from "../services/encryptedAlgorithm";
import { getUserData } from "../../../database/functions/getUserId";
import Image from 'next/image';

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
`

const CodeSwap = styled.h2`
font-family: "Play", sans-serif;
font-weight: 600;
font-style: normal;
font-size: 2rem;
color: #04449c;
text-shadow: 0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #0fa,
    0 0 82px #0fa,
    0 0 92px #0fa
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
width: 50%;
align-items: center;
`

const InputContainer = styled.div`
width: 50%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`


export default function Login() {

    const frases = [
        /*2*/
        { frase: '"O homem precisa de dificuldades para mostrar o que ele é."', autor: " - Leonardo Da Vinci", referencia: "Caderno de anotações de Leonardo da Vinci (c. 1508)" },
        /*3*/
        { frase: '"O sucesso não é definitivo, o fracasso não é fatal: o que importa é a coragem de continuar."', autor: " - Winston Churchill", referencia: "Discurso na Câmara dos Comuns (1940)." },
        /*5*/
        { frase: '"Não existem segredos para o sucesso. O sucesso é resultado de dedicação, trabalho árduo e aprendizagem com os erros."', autor: " - Henry Ford", referencia: "Entrevista para o Chicago Tribune (1923)." },
        /*7*/
        { frase: '"A mente que se abre a uma nova ideia jamais retorna ao seu tamanho original."', autor: " - Albert Einstein", referencia: "Entrevista para o New York Times (1929)." },
        /*8*/
        { frase: '"O que nos torna fortes não é a ausência de desafios, mas a capacidade de superá-los."', autor: " - Nelson Mandela", referencia: "Discurso na abertura do primeiro parlamento democrático da África do Sul (1994)." },
        /*9*/
        { frase: '"O conhecimento é poder. É a chave para abrir as portas do futuro."', autor: " - Francis Bacon", referencia: 'Ensaio "Of Studies" (1597).' },
        /*10*/
        { frase: '"O sucesso não é a chave para a felicidade. A felicidade é a chave para o sucesso. Se você fizer o que você ama, você será bem sucedido."', autor: " - Albert Schweitzer", referencia: "Discurso de aceitação do Prêmio Nobel da Paz (1954)." },
        /*11*/
        { frase: ' "A vida é uma aventura ousada ou nada."', autor: " - Helen Keller", referencia: "Discurso na Convenção Nacional da Associação Americana para Cegos (1920)." },
        /*12*/
        { frase: '"O que não me mata me torna mais forte."', autor: " - Friedrich Nietzsche", referencia: "Assim Falou Zaratustra (1883)." },
        /*13*/
        { frase: '"A maior glória na vida não está em não cair, mas em levantar-se sempre que se cai."', autor: " - Nelson Mandela", referencia: "Discurso na abertura do primeiro parlamento democrático da África do Sul (1994)." },
        /*14*/
        { frase: '"O fracasso é apenas a oportunidade de começar de novo, desta vez de forma mais inteligente."', autor: " - Henry Ford", referencia: "Entrevista para o Saturday Evening Post (1922)." },
        /*15*/
        { frase: '"O único limite para o nosso aprendizado é a nossa vontade de aprender."', autor: " - William Arthur Ward", referencia: 'Livro "A Thousand Days" (1957).' },
        /*16*/
        { frase: '"O sucesso é a soma de pequenos esforços repetidos dia após dia."', autor: " - Robert Collier", referencia: 'Livro "Secret of the Ages" (1926).' },
        /*17*/
        { frase: '"A persistência é a chave para o sucesso. Se você continuar tentando, você vai conseguir."', autor: " - Winston Churchill", referencia: "Discurso na Câmara dos Comuns (1940)." },
        /*28*/
        { frase: '"O que você faz hoje é mais importante do que o que você fez ontem."', autor: " - Abraham Lincoln", referencia: "Discurso em Gettysburg (1863)." },
        /*29*/
        { frase: '"O sucesso não é final, o fracasso não é fatal: o que importa é a coragem de continuar."', autor: " - Winston Churchill", referencia: "Discurso na Câmara dos Comuns (1940)." },
        /*31*/
        { frase: '"A mente que se abre a uma nova ideia jamais retorna ao seu tamanho original."', autor: " - Albert Einstein", referencia: "Entrevista para o New York Times (1929)." },
        /*34*/
        { frase: '"O sucesso não é a chave para a felicidade. A felicidade é a chave para o sucesso. Se você fizer o que você ama, você será bem sucedido."', autor: " - Albert Schweitzer", referencia: "Discurso de aceitação do Prêmio Nobel da Paz (1954)." },
        /*38*/
        { frase: '"Nossa maior glória não está em nunca cair, mas em emergir sempre que caímos."', autor: " - Confúcio", referencia: "Analectos de Confúcio (Livro 17, Capítulo 23)." },
        /*42*/
        { frase: '"A vida é 10% o que acontece com você e 90% como você reage a isso."', autor: " - Charles R. Swindoll", referencia: 'Livro "The Tough Stuff" (1987).' },

    ];
    
    function getFraseAleatoria() {
        const index = Math.floor(Math.random() * frases.length);
        return frases[index];
    }

    const fraseAleatoria = getFraseAleatoria();

    const { currentUser, setCurrentUser } = useAuthContext();
    const r = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
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
                <Image src="/assets/logo4k.png" alt="logo" width={200} height={200} />
                    <CodeSwap>CODE SWAP</CodeSwap>
                    <FraseMotivacional>{fraseAleatoria.frase}</FraseMotivacional>
                    <AutorMotivacional>{fraseAleatoria.autor}</AutorMotivacional>
                    <ReferenciaMotivacional>{fraseAleatoria.referencia}</ReferenciaMotivacional>
                </LeftSide>
            <Form onSubmit={handleSubmit}>
                <InputContainer>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
                <Link style={{ paddingBottom: '5px'}} href='/createAccount'>Não possui conta?</Link>
                <button type="submit" style={{marginTop: '20px', width: '50%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Authenticate</button>
                </InputContainer>
            </Form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </Container>
        </>
    )

}