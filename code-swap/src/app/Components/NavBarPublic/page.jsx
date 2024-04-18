import React, { useState } from 'react';
import Link from 'next/link'


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


const loginButtonStyle = {
    top: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

const NavBarPublic = () => {


  return (
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
          <Link href='/login' style={loginButtonStyle} >
            Fazer Login
          </Link>
          <Link href='./createAccount' style={loginButtonStyle} >
            Cadastre-se
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBarPublic;
