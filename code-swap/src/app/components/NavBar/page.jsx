import Logo from '../assets/img/Logo.png';
import {FaBars, FaWindowClose} from 'react-icons/fa';
import {Link, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const NavBarContainer = styled.div`
display: flex;
position: fixed;
top: 0;
z-index: 50;
justify-content: space-between;
align-items: center;
width: 100%;
height: 6rem;
`
const ListContainer = styled.div`
display: flex;
width: 100%;
`

const List = styled.ul`
display: none;
justify-content: space-around;
width: 100%;
font-size: 1.25rem;
line-height: 1.75rem;
color: #ffffff;

@media (min-width: 640px) {
display: flex;
}
`

const ListLoginButton = styled.button`
border-radius: 1.5rem;
width: 8rem;
height: 2.5rem;
font-weight: 600;
`

const ListCadastroButton = styled.button`
margin-top: 0.5rem;
border-radius: 1.5rem;
width: 8rem;
height: 2.5rem;
font-weight: 600;
`

const MenuMobileContainer = styled.div`
display: flex;
position: fixed;
top: 0;
right: 0;
z-index: 50;
justify-content: center;
border-top-left-radius: 1.5rem;
border-bottom-left-radius: 1.5rem;
border-width: 1px;
width: 66.666667%;
height: 66.666667%;

@media (min-width: 640px) {
display: none;
}
`

const MenuMobileButton = styled.button`
display: flex;
position: fixed;
right: 0;
top: 1.25rem;
margin-right: 1rem;
justify-content: center;
align-items: center;
border-radius: 0.75rem;
width: 3.5rem;
height: 3.5rem;
font-size: 2.25rem;
line-height: 2.5rem;
backdrop-invert: invert(1);
backdrop-opacity: opacity(0.1);

@media (min-width: 640px) {
display: none;
}
`

export default function NavBar() {

    const [showMenu, setShowMenu] = useState(false);

    function toggleMenu() {
        setShowMenu(!showMenu);
    }

    const location = useLocation();
    const [loc, setLoc] = useState(location.pathname);

        useEffect(() => {
            setLoc(location.pathname);
        }, [location.pathname]);

    return (
        <>
        <NavBarContainer className= {`
            ${loc ==="/Login"  && 'hidden'}
            ${loc ==="/HomePage/Cadastro"  && 'hidden'}
            `}>
            <Link href={'/'}><img src={logo4k}alt="Logo" className='' width={90}/></Link>
            {/* Menu Desktop */}
            <ListContainer>
                <List>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/Carreiras">Cursos</Link></li>
                    <li><Link href="/Metodologia">Ensino</Link></li>
                    <li><Link href="/Dashboard">Comunidade</Link></li>
                    <li className='flex '>
                        <Link href={'/Login'}>
                            <button className='font-semibold bg-primaryBlue hover:bg-secondaryGreen hover:text-primaryBlue rounded-3xl w-24 h-8 text-secondaryGreen '>
                                    Login
                            </button>
                        </Link>
                    </li>
                    <li className='flex '>
                        <Link href={'/Cadastro'}>
                            <button className='font-semibold bg-primaryBlue
                            hover:bg-secondaryGreen hover:text-primaryBlue
                            rounded-3xl w-32 h-8 text-secondaryGreen ml-8'>
                                    Cadastrar
                            </button>
                        </Link>
                    </li>
                </List>
            </ListContainer>

            {/* Botao Hamburguer */}
            <div>
                <button className=' rounded-xl h-14 w-14 mr-4 text-secondaryGreen
                    flex justify-center
                    items-center text-4xl
                    bg-secondaryGreen
                    backdrop-opacity-10 backdrop-invert bg-primaryBlue/5
                    sm:hidden'
                    onClick={toggleMenu}>
                    <FaBars/>
                </button>
            </div>

        </NavBarContainer>
        {/* Menu Mobile */}
        <MenuMobileContainer className= {`${showMenu ? '':'hidden'}`}>
            <MenuMobileButton onClick={toggleMenu}>
                <FaWindowClose/>
            </MenuMobileButton>
            {/* lista Menu */}
            <div className=' w-full '>
                <ul className='text-white mt-20  text-3xl text-center '>
                    <li className='mb-4  hover:text-primaryBlue'><Link href="/" onClick={toggleMenu}>Home</Link></li>
                    <li className='mb-4 hover:text-primaryBlue'> <Link href="/Carreiras" onClick={toggleMenu}>Cursos</Link></li>
                    <li className='mb-4 hover:text-primaryBlue'> <Link href="/Metodologia" onClick={toggleMenu}>Ensino</Link></li>
                    <li className='mb-4 hover:text-primaryBlue'> <Link href="/Dashboard"onClick={toggleMenu}>Comunidade</Link></li>
                    <li className='mb-4 hover:text-primaryBlue text-xl mt-6'>
                        <Link href={'/Login'} >
                            <ListLoginButton>
                                Login
                            </ListLoginButton>
                        </Link>
                    </li>
                    <li className=' mb-2 hover:text-primaryBlue text-xl  mt-6'>

                        <Link href={'/Cadastro'}>
                                <ListCadastroButton>
                                    Cadastrar
                                </ListCadastroButton>
                        </Link>

                    </li>
                </ul>
            </div>
        </MenuMobileContainer>
        </>
    );
}