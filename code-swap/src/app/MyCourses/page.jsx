'use client';
import Controller from "@/Controller/controller";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styled from "styled-components";
//página que exibe os cursos do aluno


const StyledImg = styled.img`
    border-radius: 5px;
    width: 100%;
    height: auto;
    object-fit: cover;
    box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2);
`;

const StyledCourses = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;

    
`;

const StyledCourse = styled.div`
    border: 1px solid white;
    margin: 10px;
    width: calc(100% / 5 - 20px);
    box-sizing: border-box;
    cursor: pointer;

    transition: all 0.3s ease;
    background-color: #00000063;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }
`;

const MyCoursesPage = () => {

    const queryClient = useQueryClient();

    const Router = useRouter();

    const controller = Controller();

    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories-MyCourses'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetAllCategories();
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

    return (
        <div style={{ width: '100%' }}>

            <div style={{ width: '80%' }}>

                <div style={{ color: 'white' }}>
                    <h1 style={{ color: 'white' }}>Meus Cursos</h1>
                    <div style={{ border: '1px solid white' }}> <br /></div>
                    <br />
                    <br />
                    
                </div>

                <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
                    {categoriesData && categoriesData.map((category, index) => (
                        <div key={index} style={{ border: '1px solid white' }}>
                            <h2>{category.name}</h2>
                            <StyledCourses>
                                {category.courses.map((course, index) => (
                                    <StyledCourse key={index} onClick={() =>{ handleCourseClick(course)}}>
                                        <StyledImg src={course.imgUrlThumbnail} />
                                        <h3 style={{ fontSize: '1.2vw' }}>{course.title}</h3>                                    
                                    </StyledCourse>
                                ))}
                            </StyledCourses>
                        </div>
                    ))}
                </div>

            </div>

            <div style={{ width: '20%' }}>

            </div>




        </div>
    )
}

export default MyCoursesPage;