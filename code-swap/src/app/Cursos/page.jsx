"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';

const Page = () => {

    const controller = Controller();

    const router = useRouter();

    

    useEffect(() => {
       
    }, []);


    //função para redirecionar para a página de descrição do curso
    function redirectToCourseDescription(idCourse) {
        router.push(`/Cursos/${idCourse}`);
    }

    return (


        <div>
            <h1 style={{color:'white'}}> Cursos PUBLICOS</h1>
        </div>
    );
};

export default Page;