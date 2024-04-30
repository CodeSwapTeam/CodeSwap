import { ContextDataCache } from '@/app/contexts/ContextDataCache';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

const Container = styled.div`
    flex: 80%;
    border: 2px solid white;
    padding: 10px;
    color: white;
    text-align: center;
    background-color: #0034f35c;
`;

const CourseContainer = styled.div`
    position: relative;
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
    position: relative;
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



export const CoursesCategoryList = ({  category, handleDeleteCourse, setSelectedPainel, GetModules }) => {
    const {setCourseSelected } = ContextDataCache();

    const queryClient = useQueryClient();

    const handleSetCourseSelected = (course) => {
       //console.log(course)
       //adicionar o id da categoria ao curso selecionado
        let courseSelected = course
        courseSelected.categoryId = category.id



        //let category = category.id
        //setar o curso selecionado no cache do queryClient juntamente com o id da categoria

        queryClient.setQueryData(['course-selected'], courseSelected);
       
    }



    return (
        <Container>
            {category?.courses && category.courses.map(course => (
                <CourseContainer key={course.id}>
                    <StyledImg src={course.imgUrlThumbnail} alt="Imagem Thumbnail" />
                    <StatusCourse status={course.status}>Status: {course.status}</StatusCourse>
                    <DeleteButton onClick={() => handleDeleteCourse.mutate(course.id)}>Deletar Curso</DeleteButton>
                    <h4>{course.title}</h4>
                    <ManageButton onClick={() => { setSelectedPainel('CourseDescription'), handleSetCourseSelected(course)}}>Gerenciar</ManageButton>
                </CourseContainer>
            ))}
        </Container>
    );
};