import React, { useEffect, useState } from 'react';
import Link from 'next/link'

const navbarStyle = {
  backgroundColor: '#333',
  overflow: 'hidden',
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


const logoutButtonStyle = {
    position: 'fixed',
    right: '40px',
    top: '0',
    backgroundColor: '#333',
    color: 'white',
    padding: '14px 16px',
    border: 'none',
    cursor: 'pointer',
  };

  const painelAdmButtonStyle = {
    position: 'fixed',
    right: '120px',
    top: '0',
    backgroundColor: '#333',
    color: 'white',
    padding: '14px 16px',
    border: 'none',
    cursor: 'pointer',
  };



  const dropdownContentStyle = {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    zIndex: 1,
  };

  const linkStyle = {
    color: 'black',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '16px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  };

  const dropdownStyle = {
    position: 'relative',
    display: 'inline-block',
  };

const NavBarPrivate = (props) => {
  
  const [painelAdmpermissions, setPainelAdmPermissions] = useState(false);

  useEffect(() => {
    // Verifica as permissões do usuário
    if (props.userData && props.userData.permissions > 1) {
      setPainelAdmPermissions(true);
    } else {
      setPainelAdmPermissions(false);
    }
  }, [props.userData]);


  return (
    <nav style={{ backgroundColor: '#333', overflow: 'hidden' }}>
      <Link href='/' style={navButtonStyle}>Home</Link>
      <Link href='/Cursos' style={navButtonStyle}>Meus Cursos</Link>
      <Link href='/' style={navButtonStyle}>Comunidade</Link>
      {painelAdmpermissions && (
        
          <Link href='/ManageCourses' style={navButtonStyle}>
            Painel ADM
          </Link>
          
        
      )}
      <button onClick={props.submitLogout} style={{ position: 'fixed', right: '40px', top: '0', backgroundColor: '#333', color: 'white', padding: '14px 16px', border: 'none', cursor: 'pointer' }}>Sair</button>
    </nav>
  );
};

export default NavBarPrivate;
