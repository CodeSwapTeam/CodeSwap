"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';

const Page = () => {

    const controller = Controller();

    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);

    // Função assíncrona para buscar categorias e cursos
    const fetchCategoriesAndCourses = async () => {
        // Busca todas as categorias
        const categoriesData = await controller.manageCategories.getAllCategories();
        // Busca todos os módulos e cursos
        const coursesData = await controller.manageCourses.getAllModulesAndCourses();

        // Atualiza o estado das categorias com os dados obtidos
        setCategories(categoriesData);
        // Atualiza o estado dos cursos com os dados obtidos
        setCourses(coursesData);
    };

    useEffect(() => {
        fetchCategoriesAndCourses();
    }, []);


    //função para redirecionar para a página de descrição do curso
    function redirectToCourseDescription(idCourse) {
        router.push(`/Cursos/${idCourse}`);
    }

    return (


        <div>
            {categories && categories
                .filter((category) => courses.some((course) => course.category === category.name && course.status === 'approved'))
                .map((category, index) => (
                    <div key={index} style={{ margin: '20px', border: '1px solid black', padding: '10px' }}>
                        <h1 style={{ color: 'blue' }}>{category.name}</h1>

                        <div style={{ margin: '20px', border: '1px solid black', padding: '10px', display: 'flex', flexDirection: 'row' }} >
                            {courses && courses
                                .filter((course) => course.category === category.name && course.status === 'approved')
                                .map((course, index) => (

                                    <div key={index} style={{ margin: '10px', border: '2px solid grey', padding: '5px', width: '30vw', height: '20%', display: 'flex', flexDirection: 'row' }}>

                                        <div style={{ margin: '1px', border: '1px solid grey', padding: '5px', width: '60%' }}>
                                            <img src={course.thumbnail} alt="thumbnail do curso" style={{ width: '100%', height: '100%' }} />
                                        </div>

                                        <div style={{ margin: '1px', border: '1px solid grey', padding: '5px', width: '40%' }}>
                                            <h3 style={{ color: 'green' }}>{course.title}</h3>
                                            <p style={{ color: 'blue' }}>{course.modules.length} módulos</p>
                                            <p style={{ color: 'blue' }}>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} aulas</p>
                                            <button style={{ padding: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }} onClick={() => redirectToCourseDescription(course.idCourse)}>Ver cursos</button>
                                        </div>
                                    </div>

                                ))}
                        </div>

                    </div>
                ))}
        </div>
    );
};

export default Page;