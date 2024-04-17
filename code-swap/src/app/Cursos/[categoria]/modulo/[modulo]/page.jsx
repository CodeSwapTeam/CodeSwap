"use client";
import React, { useEffect, useState } from 'react';


import NavBarPrivate from '@/app/Components/NavBarPrivate';
import { useParams } from 'next/navigation';
import { getModuleByCourseAndModuleId } from '../../../../../../database/functions/createCategory';

const Page = () => {

    //pegar o parametro da url
    const { categoria, modulo } = useParams();

    const [module, setModule] = useState([]);

    useEffect(() => {
        
        const fetchModule = async () => {
            const moduleData = await getModuleByCourseAndModuleId(categoria,modulo);
            setModule(moduleData);
        };
        fetchModule();
    }, [categoria, modulo]);

    return (
        <div>
    <NavBarPrivate/>
    <p>Descrição modulo privado</p>

    {module.map((module, index) => (
        <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px' }}>
            <h2 style={{ color: 'blue' }}>{module.nameModule}</h2>
            <p>{module.description}</p>
            {module.lessons.map((lesson, index) => (
                <div key={index} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                    <h3 style={{ color: 'green' }}>{lesson.nameLesson}</h3>
                    <p>{lesson.description}</p>
                </div>
            ))}
        </div>
    ))}
    
</div>
    );
};

export default Page;