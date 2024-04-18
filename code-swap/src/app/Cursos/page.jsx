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
                <h1 style={{ color: 'blue' }}>{category.name}</h1>
                
                <div style={{ margin: '20px', border: '1px solid black', padding: '10px',display: 'flex',  flexDirection: 'row' }} >
                    {courses && courses
                        .filter((course) => course.category === category.name && course.status === 'approved')
                        .map((course, index) => (
                            
                            <div key={index} style={{ margin: '10px', border: '2px solid grey', padding: '5px', width: '30vw',height: '20%', display: 'flex',  flexDirection: 'row'  }}>
                                
                                <div style={{ margin: '1px', border: '1px solid grey', padding: '5px' , width: '60%' }}>
                                    <img src={course.image} alt="thumbnail do curso" style={{ width: '100%', height: '100%' }} />
                                </div>
                                
                                <div style={{ margin: '1px', border: '1px solid grey', padding: '5px' , width: '40%' }}>
                                    <h3 style={{ color: 'green' }}>{course.title}</h3>
                                    <p>{course.modules.length} módulos</p>
                                    <p>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} aulas</p>
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