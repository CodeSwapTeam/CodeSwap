import { ContextDataCache } from '@/app/contexts/ContextDataCache';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Container = styled.div`
    width: 100vw;
    display: flex;
    border: 2px solid white;
    padding: 10px;
    color: white;
    text-align: center;
    background-color: #0034f35c;
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
    position: absolute;
    top: 5px;
    right: 5px;

    &:hover {
        color: red;
    }
`;

const StatusCourse = styled.p`
    position: absolute;
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
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;

    &:hover {
        background-color: #00ff375c;
    }
`;

const StyledImg = styled.img`
  height: auto; // Ajuste conforme necessário
  width: 150px; // Ajuste conforme necessário
  object-fit: cover; // Mantém as proporções da imagem
  position: absolute;
  //centralizar imagem na vertical 
    top: 50%;
    transform: translateY(-50%);
    left: 5px;
    border: 1px solid white;
    border-radius: 5px;
`;

const CategoryContainer = styled.div`
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
    cursor: pointer;

    &:hover {
        background-color: #00ff375c;
    }
`;





export const CoursesCategoryList = ({  setSelectedPainel, setCourseSelected }) => {
    const queryClient = useQueryClient();
    const controller = Controller();

    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);



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

    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetCategories();
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    // Função para buscar o curso selecionado pelo id 
const handleGetCourseData = async (courseId) => {
    // Obter o array de cursos cacheados
    let coursesCached = queryClient.getQueryData(['Courses-Cached']) || [];

    // Tentar encontrar o curso no cache
    let course = coursesCached.find(course => course.id === courseId);

    // Se o curso não estiver no cache, buscar o curso na API
    if (!course) {
        course = await controller.manageCourses.GetCourseById(courseId);

        // Adicionar o novo curso ao array de cursos cacheados
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
    //console.log('categoria selecionada', category)
    setCourses(category.courses);
    //console.log('cursos da categoria', category.courses)
    setCategory(category);
};



    return (
        <Container>

            <div style={{ width: '30%' }}>
                <h3>CATEGORIAS</h3>
                <div >
                    {categoriesData?.map((category, index) => (
                        <CategoryContainer key={index} onClick={() => { handleCategory(category), setSelectedPainel("courses") }}>
                            <h4>{category.name}</h4>
                        </CategoryContainer>
                    ))}
                </div>
            </div>

            <div style={{  display: 'flex', flexDirection: 'column' , width:'100%'}}>
            {courses?.map(course => (
                    <div style={{border: '1px solid black', position:"relative", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '150px'}} key={course.id}>
                    <img src={course.imgUrlThumbnail} alt="Imagem Thumbnail" style={{height: '150px', objectFit: 'cover'}} />
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                        <h4 style={{textAlign: 'center'}}>{course.title}</h4>
                        <ManageButton onClick={() => { handleGetCourseData(course.id) }}>Gerenciar</ManageButton>
                    </div>
                    <div style={{position: 'absolute', top: 0, right: 0}}>
                        <DeleteButton onClick={() => handleDeleteCourse.mutate(course.id)}>Deletar Curso</DeleteButton>
                    </div>
                    <div style={{position: 'absolute', bottom: 0, right: 0}}>
                        <StatusCourse status={course.status}>Status: {course.status}</StatusCourse>
                    </div>
                </div>
            ))}
            </div>
        </Container>
    );
};