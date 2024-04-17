"use client";
import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../../database/functions/createCategory';
import { getAllModulesAndCourses } from '../../../database/functions/searchModules';
import NavBarPublic from '../Components/NavBarPublic';
import { useRouter } from 'next/navigation';

const Page = () => {

    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCategoriesAndCourses = async () => {
            const categoriesData = await getAllCategories();
            const coursesData = await getAllModulesAndCourses();
            
            setCategories(categoriesData);
            setCourses(coursesData);
        };
        fetchCategoriesAndCourses();
    }, []);


    //função para redirecionar para a página de descrição do curso
    function redirectToCourseDescription(idCourse) {
        router.push(`/Cursos/${idCourse}`);
    }

    return (
        
        
        <div>
    <NavBarPublic/>
    {categories && categories
        .filter((category) => courses.some((course) => course.category === category.name && course.status === 'approved'))
        .map((category, index) => (
            <div key={index} style={{ margin: '20px', border: '1px solid black', padding: '10px' }}>
                <h2 style={{ color: 'blue' }}>{category.name}</h2>
                
                {courses && courses
                    .filter((course) => course.category === category.name && course.status === 'approved')
                    .map((course, index) => (
                        <div key={index} style={{ margin: '10px', border: '1px solid grey', padding: '5px' }}>
                            <h3 style={{ color: 'green' }}>{course.title}</h3>
                            <p>{course.description}</p>
                            
                            <p>{course.modules.length} módulos</p>
                            <p>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} aulas</p>
                            <button onClick={() => redirectToCourseDescription(course.idCourse)}>Ver cursos</button>
                        </div>
                        
                    ))}
                    
            </div>
        ))}
</div>
    );
};

export default Page;