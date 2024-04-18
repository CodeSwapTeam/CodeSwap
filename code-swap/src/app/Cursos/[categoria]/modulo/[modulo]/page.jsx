"use client";
import React, { useEffect, useState } from 'react';


import NavBarPrivate from '@/app/Components/NavBarPrivate';
import { useParams } from 'next/navigation';
import { getModuleByCourseAndModuleId } from '../../../../../../database/functions/createCategory';

const Page = () => {

    //pegar o parametro da url
    const { categoria, modulo } = useParams();

    const [module, setModule] = useState([]);
    const [lessonSelected, setLessonSelected] = useState(null);

    useEffect(() => {
        
        const fetchModule = async () => {
            const moduleData = await getModuleByCourseAndModuleId(categoria,modulo);
            setModule(moduleData);
        };
        fetchModule();
    }, [categoria, modulo]);

    

    function handleLessonClick(index) {
        //pegar  a lesson selecionada dentro do modulo pelo index
        const lesson = module[0].lessons[index];
        setLessonSelected(lesson);
        

      }


    return (
        <div>
    
    <p></p>

    {module.map((module, index) => (
        <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px',flexDirection: 'column',border: '1px solid black' }}>
            <h2 style={{ color: 'blue' }}>{module.nameModule}</h2>
            
            <div style={{border: '1px solid black', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <div style={{border: '1px solid black', height: '40vw', width: '70vw'}}>

                </div>

                <div style={{border: '1px solid black', height: '40vw', width: '30vw',flexDirection: 'column'}}> 
                    <div style={{ border: '1px solid black'}} >
                        {module.lessons.map((lesson, index) => (
                        <div key={index} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                            <h3 onClick={() => handleLessonClick(index)}  style={{ color: 'green' }}>{lesson.nameLesson}</h3>
                        
                        </div>
                            ))}
                    </div>
                    <button style={{ backgroundColor: '#d0d0d0' }}>Finalizar Atividade</button>
                </div>
                
            </div>
            <p>{lessonSelected ? lessonSelected.description : module.description}</p>
        </div>
    ))}
    
</div>
    );
};

export default Page;