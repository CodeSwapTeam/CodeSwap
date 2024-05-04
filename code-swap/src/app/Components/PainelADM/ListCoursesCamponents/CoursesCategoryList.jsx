import { ContextDataCache } from '@/app/contexts/ContextDataCache';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Container = styled.div`
    width: 100vw;
    display: flex;
    padding: 10px;
    color: white;
    text-align: center;
    background-color: #0f142500;
    
`;

const CourseContainer = styled.div`
    width: 100%;
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
    
    height: 150px;
    background-color: #020a29;
`;

const DeleteButton = styled.button`
    //position: absolute;
    top: 5px;
    right: 5px;

    &:hover {
        color: red;
    }
`;

const StatusCourse = styled.p`
   // position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 12px;

    //se o status for 'approved', a cor do texto é verde, se for 'pending' é amarelo, se for 'revision' é azul claro, e se for 'rejected' é vermelho
    color: ${props => {
        switch(props.status) {
            case 'approved':
                return '#09ed12';
            case 'pending':
                return '#f2ff4c';
            case 'revision':
                return '#00f3c8'; // azul claro
            case 'rejected':
                return '#e90101';
            default:
                return '#000'; // preto por padrão
        }
    }};
`;

const ManageButton = styled.button`
    border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
        color: #04ff02;
        font-weight: bold;
        transform: scale(1.05);
        box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;



const CategoryContainer = styled.div`
    border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
        
        color: #04ff02;
        font-weight: bold;
        transform: scale(1.05);
        box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const StyledH4 = styled.h4`
    text-align: center;
    font-size: 1.4vw; // Ajusta o tamanho da fonte com base na largura da viewport

    @media (max-width: 600px) {
        font-size: 3vw; // Ajusta o tamanho da fonte para ser um pouco maior em telas menores
    }
`;

const StyledImg = styled.img`
    border-radius: 5px;
    height: 150px;
    object-fit: cover;
    box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2);

    @media (max-width: 600px) {
        width: 100%;
        height: auto;
    }
`;

const StyledCourseDiv = styled.div`
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 150px;
    margin: 10px 20px 10px 10px;
    transition: all 0.3s ease;
    background-color: #00000063;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        flex-direction: column;
        height: auto;
    }
`;



const CourseInfoDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 10px;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const BottomDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;



export const CoursesCategoryList = ({  setSelectedPainel, categoriesData }) => {
    const queryClient = useQueryClient();
    const controller = Controller();

    //se ouver categoria selecionada ['Category-Selected'], setar os cursos da categoria no estado local, se não, setar um array vazio
    const [courses, setCourses] = useState(queryClient.getQueryData(['Category-Selected'])?.courses || []);

    //função para deletar um curso
    const handleDeleteCourse = useMutation({
        mutationFn: async (courseId) => {
            //atualizar o estado courses com os cursos que não foram deletados
            setCourses(courses.filter(course => course.id !== courseId));

            //remover de ['All-Categories'] o curso deletado
            const categories = queryClient.getQueryData(['All-Categories']);
            categories.forEach(category => {
                category.courses = category.courses.filter(course => course.id !== courseId);
            });

            //atualizar o cache com as categorias atualizadas
            queryClient.setQueryData(['All-Categories'], categories);

            await controller.manageCourses.DeleteCourse(courseId);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries(['All-Categories']);
            alert('Curso deletado com sucesso');
        }
    });


    // Função para buscar o curso selecionado pelo id 
    const handleGetCourseData = async (courseId) => {
        // Obter o array de cursos cacheados
        let coursesCached = queryClient.getQueryData(['Courses-Cached']) || [];

        // Tentar encontrar o curso no cache
        let course = coursesCached.find(course => course.id === courseId);

        // Se o curso não estiver no cache, buscar o curso na API
        if (!course) {
            // Buscar o curso na API
            course = await controller.manageCourses.GetCourseById(courseId);

            // Adicionar o novo curso ao array de cursos em cache
            coursesCached = [...coursesCached, course];

            // Atualizar o cache com o novo array de cursos
            queryClient.setQueryData(['Courses-Cached'], coursesCached);
        }

        // Setar o curso selecionado no estado local
        queryClient.setQueryData(['Course-Selected'], course);

        // Atualizar o painel selecionado
        setSelectedPainel('CourseDescription');
    };



    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        setCourses(category.courses);
        queryClient.setQueryData(['Category-Selected'], category);
    };



    return (
        <Container>

            <div style={{ width: '30%' , marginRight:'10px'}}>
                <h3>CATEGORIAS</h3>
                <div >
                    {categoriesData?.map((category, index) => (
                        <CategoryContainer key={index} onClick={() => { handleCategory(category), setSelectedPainel("courses") }}>
                            <h4>{category.name}</h4>
                        </CategoryContainer>
                    ))}
                </div>
            </div>

            <StyledDiv>
                {courses?.map(course => (
                    <StyledCourseDiv key={course.id}>
                        <StyledImg src={course.imgUrlThumbnail} alt="Imagem Thumbnail" />
                        <CourseInfoDiv>
                            <StyledH4>{course.title}</StyledH4>
                            <ManageButton onClick={() => { handleGetCourseData(course.id) }}>Gerenciar</ManageButton>
                            <BottomDiv>
                                <StatusCourse status={course.status}>Status: {course.status}</StatusCourse>
                                <DeleteButton onClick={() => handleDeleteCourse.mutate(course.id)}>Deletar Curso</DeleteButton>
                            </BottomDiv>
                        </CourseInfoDiv>
                    </StyledCourseDiv>
                ))}
            </StyledDiv>
        </Container>
    );
};