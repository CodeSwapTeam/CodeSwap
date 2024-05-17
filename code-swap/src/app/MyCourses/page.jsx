'use client';
import Controller from "@/Controller/controller";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Carousel from "@/app/MyCourses/UI/Caroucel";
import { useEffect } from "react";
import { ContextDataCache } from "../Providers/ContextDataCache";
import CarouselCoursesEnrolled from "./UI/CaroucelCoursesEnrolled";




const MyCoursesPage = () => {

    const queryClient = useQueryClient();

    const Router = useRouter();

    const { currentUser, setCurrentUser } = ContextDataCache();

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
        Router.push(`/MyCourses/${course.id}`);
    }

    useEffect(() => {
        console.log('currentUser', currentUser);
    }, [currentUser]);

    return (
        <>

        <div style={{  marginTop: '60px' }}>

            {currentUser && currentUser.CoursesEnrolled && currentUser.CoursesEnrolled.length > 0 && (
                <>            
                 <CarouselCoursesEnrolled/>
                </>
           )}

            <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                {categoriesData && categoriesData.map((category, index) => (
                    <div key={index} style={{  }}>
                        <h2 style={{color: '#45ff45', fontSize: '2rem', marginLeft: '40px' }}>{category.name}</h2>
                       
                        {category.courses && <Carousel courses={category.courses} handleCourseClick={handleCourseClick} />}
                        
                    </div>
                ))}
            </div>
        </div>
        
        </>
        
    )
}

export default MyCoursesPage;