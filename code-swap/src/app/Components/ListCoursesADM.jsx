import React, { useState } from 'react';
import styled from 'styled-components';

import Controller from '@/Controller/controller';
import AddModuleModal from './Modals/modalAddModule';
import AddLessonModal from './Modals/modalAddLesson';

import UpdateCourseModal from './Modals/modalUpdateCourse';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

import { storage } from '../../../database/firebase';
import { deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";
import { CategoriesList } from './PainelADM/ListCoursesCamponents/CategoriesList';
import { CoursesCategoryList } from './PainelADM/ListCoursesCamponents/CoursesCategoryList';
import { ConfigCourse } from './PainelADM/ListCoursesCamponents/ConfigCourse';
import { ModulesCourseList } from './PainelADM/ListCoursesCamponents/ModulesCourseList';
import CreateModule from './PainelADM/ManageModule/ManageModule';
import ManageModule from './PainelADM/ManageModule/ManageModule';
import { ContextDataCache } from '../contexts/ContextDataCache';


export const H1 = styled.h1`
  border: 2px solid white;
  padding: 10px;
  color: white;
  text-align: center;
`;

export const ContainerDiv = styled.div`
display: flex;
margin-top: 10px;
border: 2px solid white;
padding: 10px;
color: white;
text-align: center;
background-color: #0f1425d6;
`;

export const CourseConfigDiv = styled.div`
flex: 80%;

padding: 10px;
color: white;
text-align: center;
`;


const ListCourses = () => {
    const controller = Controller();
    const queryClient = useQueryClient();

    const courseSelected = queryClient.getQueryData(['Course-Selected']);


    const [courses, setCourses] = useState([]);
    const [selectedPainel, setSelectedPainel] = useState('courses');
    const [painelUpdateCourse, setPainelUpdateCourse] = useState(false);
    const [category, setCategory] = useState(null);


    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetCategories();
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        //console.log('categoria selecionada', category)
        setCourses(category.courses);
        setCategory(category);
    };

    //Configurações do curso
    const panelSelection = {       
        setPainelUpdateCourse,
        setSelectedPainel
    };

    return (
        <div >
            <H1>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Cursos e Módulos'}</H1>

            <ContainerDiv>
                <CategoriesList categories={categoriesData} handleCategory={handleCategory} setSelectedPainel={setSelectedPainel}  />

                {selectedPainel === 'courses' ? (
                    <CoursesCategoryList category={category} setSelectedPainel={setSelectedPainel} />

                ) : selectedPainel === 'CourseDescription' ? (
                    <CourseConfigDiv>
                        <h3>Configurações do curso {courseSelected?.title}</h3>
                        <div>
                            <div style={{ padding: '5px', margin: '5px' }}>

                                {!painelUpdateCourse ? (
                                    <ConfigCourse {...panelSelection} />
                                ) : (
                                    <UpdateCourseModal
                                        courseCategory={category}
                                        courseId={courseSelected.id}
                                        dataCourse={courseSelected}
                                        setPainelUpdateCourse={setPainelUpdateCourse}
                                        //setCourseSelected={setCourseSelected}
                                        setCourses={setCourses}
                                    />
                                )}

                                {/*<ModulesCourseList modules={modules}
                    handleDeleteModule={handleDeleteModule}
                    courseSelected={courseSelected}
                />*/}

                            </div>
                        </div>
                    </CourseConfigDiv>
                ) : selectedPainel === 'Modules' ? (
                    <ManageModule courseSelected={courseSelected} />
                ) : null}

            </ContainerDiv>
        </div>
    );
};

export default ListCourses;
