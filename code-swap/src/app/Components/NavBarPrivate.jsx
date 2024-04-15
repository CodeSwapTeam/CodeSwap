import React, { useState } from 'react';
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

const NavBarPrivate = (props) => {
  
    


  return (
    <nav style={navbarStyle}>
        <Link href='/' style={navButtonStyle}>Home</Link>
      <Link href='/Cursos' style={navButtonStyle}>Meus Cursos</Link>
      <Link href='/' style={navButtonStyle}>Comunidade</Link>
      <Link href='/ManageCourses' style={painelAdmButtonStyle}>Painel ADM</Link>
      <button onClick={props.submitLogout} style={logoutButtonStyle} >
        Sair
      </button>
      
    </nav>
  );
};

export default NavBarPrivate;
