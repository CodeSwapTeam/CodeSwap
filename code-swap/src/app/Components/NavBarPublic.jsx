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


const loginButtonStyle = {
    position: 'fixed',
    right: '40px',
    top: '0',
    backgroundColor: '#333',
    color: 'white',
    padding: '14px 16px',
    border: 'none',
    cursor: 'pointer',
  };

const NavBarPublic = () => {
  


  return (
    <nav style={navbarStyle}>
        <Link href='/' style={navButtonStyle}>Home</Link>
      <Link href='/Cursos' style={navButtonStyle}>Cursos</Link>
      <Link href='/' style={navButtonStyle}>Comunidade</Link>
      <Link href='/login' style={loginButtonStyle} >
        Fazer Login
      </Link>
      
    </nav>
  );
};

export default NavBarPublic;
