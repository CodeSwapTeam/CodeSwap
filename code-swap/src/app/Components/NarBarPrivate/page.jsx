import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { removeCookies } from '../../services/cookies';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../contexts/Auth';



const navbarStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  overflow: 'hidden',
  display: 'flex',
};

const navButtonStyle = {
  float: 'left',
  display: 'block',
  color: 'white',
  textAlign: 'center',
  padding: '14px 16px',
  textDecoration: 'none',
  fontSize: '17px',
  border: 'none',
  cursor: 'pointer',
};


const logOutButtonStyle = {
    top: '0',
    color: 'white',
    padding: '14px 16px',
    border: 'none',
    cursor: 'pointer',
  };

const flexContainer = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const navBarLeft = {
  width: '40%',
  display: 'flex',
  justifyContent: 'flex-start',
};

const navBarMiddle = {
  width: '20%',
  display: 'flex',
  justifyContent: 'center',
};

const navBarRight = {
  width: '40%',
  display: 'flex',
  justifyContent: 'flex-end',
};

const adminButton = {
  top: '0',
  color: '#912d2d',
  padding: '14px 16px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '800',
};

const NavBarPrivate = (props) => {

  const router = useRouter();

  const {currentUser, setCurrentUser} = useAuthContext();
  
  const [painelAdmpermissions, setPainelAdmPermissions] = useState(false);

  useEffect(() => {
    //console.log('props.userData', props.userData);
    // Verifica as permissões do usuário
    if (props.userData && props.userData.permissions > 1) {
      setPainelAdmPermissions(true);
    } else {
      setPainelAdmPermissions(false);
    }
  }, [currentUser]);

  //função para deslogar
  async function logout() {
    //remove os cookies
    await removeCookies('user');
    setCurrentUser(null);
    router.push('/Dashboard');
  }


  return (
    <>
    <nav style={navbarStyle}>
      <div style={flexContainer}>
        <div style={navBarLeft}>
          <Link href='/' style={navButtonStyle}>Home</Link>
          <Link href='/Cursos' style={navButtonStyle}>Cursos</Link>
          <Link href='/' style={navButtonStyle}>Comunidade</Link>
        </div>
        <div style={navBarMiddle}>
          <img src="/assets/logo4k.png" alt="Logo" width={50} height={50}/>
        </div>
        <div style={navBarRight}>
            {painelAdmpermissions && (
                <Link href='/ManageCourses' style={adminButton}>
                  Painel ADM
                </Link>
            )}
          <button onClick={()=> logout()} style={logOutButtonStyle}>Sair</button>
        </div>
      </div>
    </nav>
    </>
  );
};

export default NavBarPrivate;
