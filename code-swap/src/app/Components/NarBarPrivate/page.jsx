'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { FiXSquare } from "react-icons/fi";

import { ContextDataCache } from '../../Providers/ContextDataCache';
import Controller from '@/Controller/controller';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation'

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  z-index: 1000;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NavBarSection = styled.div`
  width: ${props => props.width};
  display: flex;
  justify-content: center;

 

  `;

const NavButton = styled.div`
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

const LogOutButton = styled.button`
  
  padding: 5px;
  border-radius: 10px;
  font-weight: 600;
  color: #912d2d;

  border: none;
  cursor: pointer;
  border: 1px solid #912d2d;

  //efeito hover pequeno aumento de tamanho e box shadow
  transition: all 0.2s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 5px #912d2d;
    color: white;
  }
  
`;



const StyledLinkPerfil = styled.div`
  border: 1px solid #45ff45;
  padding: 5px;
  border-radius: 10px;
  margin: 5px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 5px #45ff45;
    color: white;
  }
`;

const NavBarLeftPRIVATE = styled.div`
  width: 40%;
  justify-content: flex-start;

  @media (max-width: 800px) {
    display: none;
  }
`;

const NavBarRightPRIVATE = styled.div`
color: white;

  width: 40%;
  justify-content: flex-end;

`;

const UserProfileImg = styled.div`
  border-radius: 50px;
  width: 45px;
  height: 45px;
  margin-right: 10px;
  box-shadow: 0 0 5px blue;
  cursor: pointer;


`;

const UserProfileImgMobile = styled.div`
  border-radius: 50px;
  width: 45px;
  height: 45px;
  margin-right: 10px;
  box-shadow:  0 0 5px green;
  cursor: pointer;



`;

const UserProfileMenu = styled.div`

 
  width: 100%;

  //centraliza o texto
  display: flex;
  flex-direction: column;
  
  align-items: center;
  text-align: center;


`;



const ProgressBar = styled.div`
  background-color: #f3f3f3;
  border-radius: 13px;
  height: 10px;
  width: 80%;
  position: relative;
  margin: auto;


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width || '0%'};
    height: 100%;
    background-color: #4caf50;
    border-radius: 13px;
  }
`;

const ProgressBarNavBar = styled.div`
  background-color: #f3f3f3;
  border-radius: 13px;
  height: 10px;
  width: 30%;
  position: relative;


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width || '0%'};
    height: 100%;
    background-color: #4caf50;
    border-radius: 13px;
  }
`;


const NavBarPrivate = (props) => {
  const controller = Controller();
  const router = useRouter();
  const { currentUser, setCurrentUser } = ContextDataCache();
  const [painelAdmpermissions, setPainelAdmPermissions] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const [painelInfoMobile, setPainelInfoMobile] = useState(false);


  const [isOpen, setIsOpen] = useState(false);
  const handleMenuMobileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    handlePainelInfoClick();
    router.push('/Profile');
  };

  const [painelInfo, setPainelInfo] = useState(false);
  const handlePainelInfoClick = () => {
    setPainelInfo(!painelInfo);
  }

  const handlePainelInfoMobileClick = () => {
    setPainelInfoMobile(!painelInfoMobile);
  }

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.permissionAcess > 1) {
      setPainelAdmPermissions(true);
    } else {
      setPainelAdmPermissions(false);
    }
  }, [currentUser]);

  async function logout() {
    await controller.services.manageCookies.removeCookiesAcessToken();
    setCurrentUser(null);
    router.push('/');
  }


  const [isMobile, setIsMobile] = useState();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  useEffect(() => {
    if (pathname === '/Profile') {
      if (isOpen) {
        handleMenuMobileClick();
      }
      if (painelInfo || painelInfoMobile) {
        handlePainelInfoClick();
        handlePainelInfoMobileClick();
      }
    }
  }, [pathname]);




  return (

    <>
      {isMounted &&
        (
          <NavBar>
            <FlexContainer>

              <NavBarLeftPRIVATE >
                <Link href='/MyCourses'><NavButton>Meus Cursos</NavButton></Link>
                <Link href='/FeedCommunity'><NavButton>Comunidade</NavButton></Link>
              </NavBarLeftPRIVATE>

              <NavBarSection width='20%' >
                <Link href="/">
                  <Image src="/assets/logo4k.png" alt="Logo" width={50} height={50} />
                </Link>
              </NavBarSection>

              <NavBarRightPRIVATE >
                {!isMobile && !painelInfo && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', marginRight: '30px' }}>Level: {currentUser?.lvl}</div>

                    EXP: <ProgressBarNavBar width={`${currentUser?.xp}%`} />

                    <div style={{ display: 'flex', gap: '5px', marginLeft: '30px' }}>CODES: {currentUser?.codes} </div>

                  </div>
                )}
              </NavBarRightPRIVATE>

              {isMobile ? (

                <UserProfileImgMobile onClick={() => handleMenuMobileClick()} >
                  <img src={currentUser?.imgUrlProfile} alt="Logo" width={45} height={45} style={{ borderRadius: '50px' }} />
                </UserProfileImgMobile>

              ) : (
                <UserProfileImg onClick={() => handlePainelInfoClick()} >
                  <img src={currentUser?.imgUrlProfile} alt="Logo" width={45} height={45} style={{ borderRadius: '50px' }} />
                </UserProfileImg>
              )}
            </FlexContainer>

            {/** MENU MOBILE */}
            <div
              onClick={handleMenuMobileClick}
              style={{
                display: isOpen ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  border: '1px solid blue',
                  padding: '10px',
                  height: '400px',
                  zIndex: 9999,
                  width: '50%',
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  color: 'white',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                }}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ display: 'flex', fontSize: '0.8rem' }}>Minhas Informações</p>
                  <FiXSquare size={40} onClick={handleMenuMobileClick} style={{ cursor: 'pointer', color: "#45ff45" }} />
                </div>


                <UserProfileMenu>
                  <p style={{ fontSize: '1.2rem', color: '#45ff45' }}> {currentUser?.userName} </p>

                  {!painelInfoMobile ? (
                    <>
                      <Link href='/' style={{ border: '1px solid #45ff45', padding: '5px', borderRadius: '10px', margin: '5px' }} > Meu Perfil </Link>
                      <button onClick={handlePainelInfoMobileClick} style={{ border: '1px solid #45ff45', padding: '5px', borderRadius: '10px', margin: '5px' }}>Check List Diário</button>

                      <div style={{ width: '100%' }}>
                        <p style={{ marginTop: '15px' }}>Level: {currentUser?.lvl} </p>
                        <ProgressBar width={`${currentUser?.xp}%`} />
                      </div>

                      <div style={{ marginTop: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                        <p>Codes: {currentUser?.codes} </p>
                        <span style={{ marginLeft: '5px' }}>
                          <Image src="/assets/logo4k.png" alt="Logo" width={15} height={15} />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                      <button onClick={handlePainelInfoMobileClick} style={{ border: '1px solid #45ff45', padding: '5px', borderRadius: '10px', margin: '5px' }}>Status</button>

                      <div style={{ marginTop: '20px', marginBottom: '20px', display: "flex", flexDirection: 'column', textAlign: 'left', fontSize: '0.8rem' }}>
                        <ul >
                          <li><input type="checkbox" /> Login do dia <span></span></li>
                          <li><input type="checkbox" /> Conclusão de curso</li>
                          <li><input type="checkbox" /> Conclusão de Módulo</li>
                          <li><input type="checkbox" /> Conclusão de Atividade</li>
                          <li><input type="checkbox" /> Comentário no Feed</li>
                          <li><input type="checkbox" /> Bônus XP: </li>
                        </ul>
                      </div>
                    </div>)}

                  {painelAdmpermissions && (
                    <Link href='/ManageCourses' style={{ color: '#912d2d', cursor: 'pointer', fontWeight: '800' }}>Painel ADM</Link>
                  )}
                  <LogOutButton onClick={logout} style={{ border: '1px solid red', padding: '5px', borderRadius: '10px', margin: '5px' }}>Desconectar</LogOutButton>
                </UserProfileMenu>

              </div>
            </div>
            {/** MENU DESKTOP */}
            <div
              onClick={handlePainelInfoClick} // fecha o menu quando clica fora
              style={{
                display: painelInfo ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()} // impede que o menu feche quando clica dentro
                style={{
                  border: '1px solid blue',
                  position: 'fixed',
                  width: '30%',
                  height: '450px',
                  zIndex: 9999,
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', // preto transparente
                  color: 'white',
                  borderRadius: '10px',
                }}
              >
                <div style={{ padding: '10px', height: '100%' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ display: 'flex', marginLeft: '30px' }}>Minhas Informações</p>
                    <FiXSquare size={40} onClick={handlePainelInfoClick} style={{ cursor: 'pointer', color: "#45ff45" }} />
                  </div>

                  <div style={{ display: 'flex', width: '100%', borderRadius: '20px', border: '1px solid #45ff45', boxShadow: '0 0 5px #45ff45', justifyContent: 'space-around', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#45ff45' }}> {currentUser?.userName} </p>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p>Codes: {currentUser?.codes} </p>
                      <span style={{ marginLeft: '5px' }}>
                        <Image src="/assets/logo4k.png" alt="Logo" width={15} height={15} />
                      </span>
                    </div>
                  </div>

                  <div>
                    <p style={{ marginTop: '15px', width: '100%', textAlign: 'center' }}>Level: {currentUser?.lvl} </p>
                    <ProgressBar width={`${currentUser?.xp}%`} />
                  </div>

                  <div style={{ padding: '10px', width: '100%', height: '50%', marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
                    <p style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>Check List Diário</p>

                    <ul>
                      <li><input type="checkbox" /> Login do dia <span></span></li>
                      <li><input type="checkbox" /> Conclusão de curso</li>
                      <li><input type="checkbox" /> Conclusão de Módulo</li>
                      <li><input type="checkbox" /> Conclusão de Atividade</li>
                      <li><input type="checkbox" /> Comentário no Feed</li>
                      <li><input type="checkbox" /> Bônus XP: </li>
                    </ul>
                  </div>

                  <div style={{ height: '20%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    {painelAdmpermissions && (
                      <Link href='/ManageCourses' style={{ color: '#912d2d', cursor: 'pointer', fontWeight: '800' }}>Painel ADM</Link>
                    )}
                    <StyledLinkPerfil>
                      <Link href={'/Profile'}>
                        Meu Perfil
                      </Link>


                    </StyledLinkPerfil>

                    <LogOutButton onClick={logout} >Desconectar</LogOutButton>
                  </div>
                </div>
              </div>
            </div>

          </NavBar>
        )
      }
    </>

  );
};

export default NavBarPrivate;