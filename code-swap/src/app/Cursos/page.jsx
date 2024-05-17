"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';
import Carousel from '../MyCourses/UI/Caroucel';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Page = () => {

    const queryClient = useQueryClient();

    const Router = useRouter();

    const controller = Controller();

    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories-MyCourses'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetAllCategories();
            console.log(categories);
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    const handleCourseClick = async (course) => {
        const coursesCached = queryClient.getQueryData(['courses-Cached']) || [];
        let courseSelected = coursesCached.find(c => c.id === course.id);

        if (!courseSelected) {
            courseSelected = await controller.manageCourses.GetCourseById(course.id);
            queryClient.setQueryData(['courses-Cached'], [...coursesCached, courseSelected]);
        }

        //adicionar no cache a categoria selecionada buscando dentro de ['All-Categories-MyCourses'] a categoria que contém o curso selecionado
        const categoriesCached = queryClient.getQueryData(['All-Categories-MyCourses']) || [];
        const categorySelected = categoriesCached.find(c => c.courses.find(c => c.id === course.id));
        queryClient.setQueryData(['category-Selected-Mycourses'], categorySelected);

        queryClient.setQueryData(['courseSelected'], courseSelected);
        Router.push(`/Cursos/${course.id}`);
    }

    return (
        <>

            <div style={{ marginTop: '60px' }}>


                <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                    {categoriesData && categoriesData.map((category, index) => (
                        <div key={index} style={{}}>
                            <h2 style={{ color: '#45ff45', fontSize: '2rem', marginLeft: '40px'  }}>{category.name}</h2>

                            {category.courses && <Carousel courses={category.courses} handleCourseClick={handleCourseClick} />}

                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Page;