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

    const {data : courseSelected} = useQuery({
        queryKey: ["course-selected"],
        queryFn: async () => {
            //Buscar o curso selecionado no cache do queryClient
            const courseSelected = queryClient.getQueryData(['course-selected']);
            if (courseSelected) {
                return courseSelected;
            }
            return null;
        }

    });

    const {  setCourseSelected } = ContextDataCache();

    const [courses, setCourses] = useState([]);
    //const [courseSelected, setCourseSelected] = useState(null);
    const [modules, setModules] = useState([{}]);

    const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
    const [imgUrlCover, setImgUrlCover] = useState('');
    const [selectedPainel, setSelectedPainel] = useState('courses');
    const [difficulty, setDifficulty] = useState('iniciante');
    const [courseObservations, setCourseObservations] = useState('');
    const [statusCourse, setStatusCourse] = useState('pending');

    const [experienceCourse, setExperienceCourse] = useState(100);
    const [codesCourse, setCodesCourse] = useState(150);

    const [isPremium, setIsPremium] = useState(false);
    const [isSequential, setIsSequential] = useState(false);
    const [painelUpdateCourse, setPainelUpdateCourse] = useState(false);

    const [category, setCategory] = useState(null);




    /////////////////////////////////////////////
    //Buscar as categorias ao iniciar a página
    const { data: categories } = useQuery({
        queryKey: ["All-Categories"],
        queryFn: async () => {
            //Buscar as categorias no banco de dados
            const categories = await controller.manageCategories.GetCategories();
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos

    });

    

    //função para deletar um curso
    const handleDeleteCourse = useMutation({
        mutationFn: async (courseId) => {
            await controller.manageCourses.DeleteCourse(courseId);
        },
        onSuccess: (data, variables) => {
            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries("ListCourses");

            // Remove o curso deletado do estado local
            setCourses(courses => courses.filter(course => course.id !== variables));
            alert('Curso deletado com sucesso');
        }
    });



    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        //console.log('categoria selecionada', category)
        setCourses(category.courses);
        setCategory(category);
    };
    /////////////////////////////////////////////



    //funções para buscar os modulos de um curso
    const GetModules = async (course) => {
        handleGetModules.mutate(course);
        const courseSelected = await controller.manageCourses.GetCourseById(course.id);
        setCourseSelected(courseSelected);

        //setar os dados do curso nos campos de configuração
        setIsPremium(courseSelected.coursePremium);
        setIsSequential(courseSelected.SequentialModule);
        setDifficulty(courseSelected.difficulty);
        setExperienceCourse(courseSelected.experience);
        setCodesCourse(courseSelected.codes);
        setCourseObservations(courseSelected.courseObservations);
        setImgUrlThumbnail(courseSelected.imgUrlThumbnail);
        setImgUrlCover(courseSelected.imgUrlCover);
        setStatusCourse(courseSelected.status);


    };
    const handleGetModules = useMutation({
        mutationFn: async (course) => {
            //Buscar os módulos do curso no cache local
            const modulesLocal = await controller.manageModules.GetModulesLocal(course.id);
            if (modulesLocal && modulesLocal.length > 0) {
                return modulesLocal;
            }

            const modules = await controller.manageModules.GetModules(course.id);

            return modules;
        },
        onSuccess: (data) => {
            client.invalidateQueries("ListCourses");
            setModules(data);
        }
    });
    /////////////////////////////////////////////



    

    //Configurações do curso
    const configCourseProps = {
        
        setPainelUpdateCourse,
        setSelectedPainel
    };

    return (
        <div >
            <H1>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Cursos e Módulos'}</H1>

            <ContainerDiv>
                <CategoriesList categories={categories} handleCategory={handleCategory} setSelectedPainel={setSelectedPainel} />

                {selectedPainel === 'courses' ? (
                    <CoursesCategoryList
                        category={category}
                        courses={courses}
                        handleDeleteCourse={handleDeleteCourse}
                        setSelectedPainel={setSelectedPainel}
                    />
                ) : selectedPainel === 'CourseDescription' ? (
                    <CourseConfigDiv>
                        <h3>Configurações do curso {courseSelected.title}</h3>
                        <div>
                            <div style={{ padding: '5px', margin: '5px' }}>

                                {!painelUpdateCourse ? (
                                    <ConfigCourse {...configCourseProps} />
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
