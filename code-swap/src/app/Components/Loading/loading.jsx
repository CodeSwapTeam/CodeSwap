import Image from 'next/image';
import React from 'react';

const Loading = () => {


    return (
        <div style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Adiciona um fundo escuro semi-transparente
        }}>
            <div style={{display:'flex', flexDirection:'column'}}>
                <Image src={"/assets/logo4k.png"} alt="Logo" width={100} height={100} />
                <p style={{color:"white"}}>Carregando...</p>
            </div>
        </div>
    );
};

export default Loading;