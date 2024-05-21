import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { FiAlignJustify } from "react-icons/fi";
import { FiXSquare } from "react-icons/fi";

import { useEffect, useState } from 'react';

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
`;

const NavButton = styled(Link)`
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  border: none;
  cursor: pointer;
`;

const LoginButton = styled(Link)`
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 14px 16px;
  border: none;
  cursor: pointer;

  @media (max-width: 640px) {
    font-size: 0.8rem;
  }

  @media (max-width: 525px) {
    display: none;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NavBarLeft = styled.div`
  width: 40%;

  @media (max-width: 800px) {
    display: none;
  }
`;

const NavBarMiddle = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;

  @media (max-width: 800px) {
    width: 10%;
  }
`;

const NavBarRight = styled.div`
  width: 40%;
  display: flex;
  justify-content: flex-end;
`;


const HamburgerButton = styled.button`
  display: block;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 10px;

  @media (min-width: 525px) {
    display: none;
  }
  
`;

const NavBarPublic = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsOpen(!isOpen);
  };


  return (
    <>
    <NavBar>
      <FlexContainer>
        <NavBarLeft>
          <NavButton href="/">Home</NavButton>
          <NavButton href="/Cursos">Cursos</NavButton>
          <NavButton href="/">Comunidade</NavButton>
        </NavBarLeft>

        <NavBarMiddle>
          <Image src="/assets/logo4k.png" alt="Logo" width={50} height={50} />
        </NavBarMiddle>

        <NavBarRight>
          <LoginButton href="/login">Fazer Login</LoginButton>
          <LoginButton href="./createAccount">Cadastre-se</LoginButton>
        </NavBarRight>

        <HamburgerButton onClick={handleHamburgerClick}>
          <div style={{display: !isOpen ? 'block' : 'none'}}>
            <FiAlignJustify size={40}  style={{cursor:'pointer' , color:"#45ff45"}}/>
          </div>
          </HamburgerButton>
        </FlexContainer>
      </NavBar>

      <div style={{
        display: isOpen ? 'block' : 'none',
        position: 'fixed',
        width: '40%',
        height: '40%',
        zIndex: 9999,
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // preto transparente
        color: 'white',
        borderRadius: '10px',

      }}>
        <div style={{ zIndex: '9999', padding:'10px', height:'100%' }}>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <FiXSquare size={40}  onClick={handleHamburgerClick} style={{cursor:'pointer' , color:"#45ff45"}}/>
          </div>

          <div style={{ display: "flex", flexDirection: 'column', height: '80%', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>
              <Link href="/Cursos" style={{
                border: '1px solid green',
                padding: '5px',
                borderRadius: '5px',
                textAlign: 'center',
                display: 'block',
                lineHeight: '20px',
                boxShadow: '0px 0px 5px 1px #00ff00',
                fontSize: '0.8rem'
              }}>Cursos</Link>
              <Link href="/" style={{
                border: '1px solid green',
                padding: '5px',
                borderRadius: '5px',
                textAlign: 'center',
                display: 'block',
                lineHeight: '20px',
                boxShadow: '0px 0px 5px 1px #00ff00',
                fontSize: '0.8rem'
              }}>Comunidade</Link>
            </div>
            <div style={{ display: "flex", flexDirection: 'column', gap: '15px' }}>
              <Link href="/login" style={{
                border: '1px solid green',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                display: 'block',
                lineHeight: '20px',
                boxShadow: '0px 0px 5px 1px #00ff00',
                fontSize: '0.8rem'
              }}>Fazer Login</Link>
              <Link href="./createAccount" style={{
                border: '1px solid green',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                display: 'block',
                lineHeight: '20px',
                boxShadow: '0px 0px 5px 1px #00ff00',
                fontSize: '0.8rem'

              }}>Cadastre-se</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default NavBarPublic;