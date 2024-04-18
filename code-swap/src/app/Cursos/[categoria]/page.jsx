"use client";
import React, { useEffect, useState } from 'react';

import NavBarPublic from '@/app/Components/NavBarPublic';
import { useParams, useRouter } from 'next/navigation';
import { getCoursesByCategory } from '../../../../database/functions/createCategory';

const Page = () => {

    const router = useRouter();

    const { categoria } = useParams();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesData = await getCoursesByCategory(categoria);
            setCourses(coursesData);
        };
        fetchCourses();
    }, [categoria]);

    //função para redirecionar para a página de descrição do modulo
    function redirectToModuleDescription(idModule) {
        router.push(`/Cursos/${categoria}/modulo/${idModule}`);
    }

    return (
        <div>
    <NavBarPublic />
    <p>Descrição curso publica</p>
    {courses.map((course, index) => (
        <div key={index} style={{ backgroundColor: '#f0f0f0', margin: '20px', padding: '10px' }}>
            <h2 style={{ color: 'blue' }}>{course.title}</h2>
            <p>{course.description}</p>
            {course.modules.map((module, index) => (
                <div key={index} style={{ backgroundColor: '#d0d0d0', margin: '10px', padding: '5px' }}>
                    <h3 style={{ color: 'green' }}>{module.nameModule}</h3>
                    <p>{module.description}</p>
                    {module.lessons.map((lesson, index) => (
                        <div key={index} style={{ backgroundColor: '#b0b0b0', margin: '5px', padding: '2px' }}>
                            <h4 style={{ color: 'red' }}>{lesson.nameLesson}</h4>
                            
                        </div>
                    ))}
                    <button onClick={() => redirectToModuleDescription(module.idModule)}>Ver módulo</button>
                </div>
            ))}
        </div>
    ))}
</div>
    );
};

export default Page;