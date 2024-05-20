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



const Title = styled.h1`
    width: 100%;
    color: white;
    font-size: 2rem;
    margin: auto;
    text-align: center; // Centraliza o texto

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const CategoryTitle = styled.h2`
    color: #45ff45;
    font-size: 2rem;
    margin-left: 40px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;



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

    const handleCourseRolledClick = async (course) => {
        const coursesCached = queryClient.getQueryData(['courses-Cached']) || [];
        let courseSelected = coursesCached.find(c => c.id === course.courseId);

        if (!courseSelected) {
            courseSelected = await controller.manageCourses.GetCourseById(course.courseId);
            queryClient.setQueryData(['courses-Cached'], [...coursesCached, courseSelected]);
        }

        //adicionar no cache a categoria selecionada buscando dentro de ['All-Categories-MyCourses'] a categoria que contém o curso selecionado
        const categoriesCached = queryClient.getQueryData(['All-Categories-MyCourses']) || [];
        const categorySelected = categoriesCached.find(c => c.courses.find(c => c.id === course.courseId));
        queryClient.setQueryData(['category-Selected-Mycourses'], categorySelected);

        queryClient.setQueryData(['courseSelected'], courseSelected);
        Router.push(`/MyCourses/${course.courseId}`);
    }

    useEffect(() => {
        console.log('currentUser', currentUser);
    }, [currentUser]);



    return (
        <>

            <div style={{ marginTop: '60px' }}>

                {currentUser && currentUser.CoursesEnrolled && currentUser.CoursesEnrolled.length > 0 && (
                    <>
                        <CarouselCoursesEnrolled handleCourseRolledClick={handleCourseRolledClick} />
                    </>
                )}
                        <Title>Explore mais</Title>
                <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                    {categoriesData && categoriesData.map((category, index) => {
                        // Filtrar os cursos da categoria para remover os cursos em que o usuário já está matriculado
                        const filteredCourses = category.courses.filter(course => {
                            // Verificar se o usuário está matriculado no curso
                            const isEnrolled = currentUser?.CoursesEnrolled.some(enrolledCourse => enrolledCourse.courseId === course.id);
                            // Retornar true se o usuário não estiver matriculado no curso, false caso contrário
                            return !isEnrolled;
                        });

                        return (
                            <div key={index} style={{}}>
                                <CategoryTitle>{category.name}</CategoryTitle>
                                {filteredCourses.length > 0 && <Carousel courses={filteredCourses} handleCourseClick={handleCourseClick} />}
                            </div>
                        );
                    })}
                </div>
            </div>

        </>

    )
}

export default MyCoursesPage;