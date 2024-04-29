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
    const client = useQueryClient();

    const [courses, setCourses] = useState([]);
    const [courseSelected, setCourseSelected] = useState(null);
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
        queryKey: ["ListCourses"],
        queryFn: async () => {

            //Buscar as categorias no cache local
            const categories = controller.manageCategories.GetCategoriesLocal();
            if (categories) {
                return categories;
            }
            const dbCategories = await controller.manageCategories.GetCategories();
            return dbCategories;
        }

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

    //Função para deletar um módulo
    const handleDeleteModule = useMutation({
        mutationFn: async (data) => {
            await controller.manageModules.DeleteModule(courseSelected, data);
        },
        onSuccess: (data, variables) => {
            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries("ListCourses");

            // Remove o curso deletado do estado local
            setModules(modules => modules.filter(module => module.id !== variables));
        }
    });

    const handleConfigCourseData = useMutation({
        mutationFn: async (data) => {
            await controller.manageCourses.UpdateConfigCourseData({ courseId: data.courseId, categoryId: data.categoryId, courseData: data.courseData });
        },
        onSuccess: (data, variables) => {
            // Invalidate a query 'ListCourses' após a atualização do curso
            client.invalidateQueries("ListCourses");
            alert('Curso atualizado com sucesso');
        }
    });

    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        setCourses(category.courses);
        //console.log("setar a categoria", { name: category.name, id: category.id });
        setCategory({ name: category.name, id: category.id });
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



    //Funções para atualizar um curso////////////
    const handleCheckboxChange = (event) => {
        setIsPremium(event.target.checked);
    };

    const handleCheckboxChangeSequential = (event) => {
        setIsSequential(event.target.checked);
    }

    const handleSelectChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleSetStatusCourse = (event) => {
        setStatusCourse(event.target.value);
    };
    /////////////////////////////////////////////



    //Função para atualizar a thumbnail do curso//
    const handleUpdateThumbnail = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;

        let filenameThumbnail;

        // Se existir uma URL, deletar a imagem antiga
        if (courseSelected.imgUrlThumbnail) {
            // Extrair o nome do arquivo da URL
            const url = new URL(decodeURIComponent(courseSelected.imgUrlThumbnail));
            const pathname = url.pathname;
            const parts = pathname.split('/');
            const filename = parts[parts.length - 1];
            filenameThumbnail = decodeURIComponent(filename); // Decodificar o nome do arquivo

            // Deletar a imagem antiga
            const oldImageRef = ref(storage, `Courses/Thumbnails/${filenameThumbnail}`);
            deleteObject(oldImageRef).catch((error) => {
                console.error(error);
            });
        }

        // Fazer o upload da nova imagem
        const storageRef = ref(storage, `Courses/Thumbnails/${filenameThumbnail}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlThumbnail(downloadURL);
                // Atualizar a URL da imagem no banco de dados
                controller.manageCourses.UpdateThumbnailCourse(courseSelected.id, downloadURL);

                //atualizar a imagem no cache local da categoria
                controller.manageCategories.SaveImgUrlThumbnail(category.id, courseSelected.id, downloadURL);

                // Invalidate a query 'ListCourses' após a atualização da imagem
                client.invalidateQueries("ListCourses");

                // Atualizar a imagem no estado local
                setCourseSelected(courseSelected => ({ ...courseSelected, imgUrlThumbnail: downloadURL }));
            });

            // Limpar o campo de upload
            e.target.file.value = '';
        });
    };

    //Função para atualizar a capa do curso
    const handleUpdateCover = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;

        let filenameCover;

        // Se existir uma URL, deletar a imagem antiga
    if (courseSelected.imgUrlCover) {
        // Extrair o nome do arquivo da URL
        const url = new URL(decodeURIComponent(courseSelected.imgUrlCover));
        const pathname = url.pathname;
        const parts = pathname.split('/');
        const filename = parts[parts.length - 1];
        filenameCover = decodeURIComponent(filename); // Decodificar o nome do arquivo

        // Deletar a imagem antiga
        const oldImageRef = ref(storage, `Courses/Covers/${filenameCover}`);
        deleteObject(oldImageRef).catch((error) => {
            // Ignorar o erro  404 se o arquivo não existir
            if (error.code === 'storage/object-not-found') {
                return;
            }
        });
        }

        // Fazer o upload da nova imagem
        const storageRef = ref(storage, `Courses/Covers/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlCover(downloadURL);
                // Atualizar a URL da imagem no banco de dados
                controller.manageCourses.UpdateCoverCourse(courseSelected.id, downloadURL);

                // Invalidate a query 'ListCourses' após a atualização da imagem
                client.invalidateQueries("ListCourses");

                // Atualizar a imagem no estado local
                setCourseSelected(courseSelected => ({ ...courseSelected, imgUrlCover: downloadURL }));
            });

            // Limpar o campo de upload
            e.target.file.value = '';
        });
    };
    /////////////////////////////////////////////





    //Função para atualizar as informações do curso e status
    const handleConfigCourse = async () => {


        const courseData = {
            status: statusCourse,
            coursePremium: isPremium,
            SequentialModule: isSequential,
            difficulty: difficulty,
            experience: experienceCourse,
            codes: codesCourse,
            courseObservations: courseObservations,
            imgUrlThumbnail: imgUrlThumbnail,
            imgUrlCover: imgUrlCover
        };
        handleConfigCourseData.mutate({ courseId: courseSelected.id, categoryId: category.id, courseData: courseData });
    };

    //Configurações do curso
    const configCourseProps = {
        courseSelected,
        setPainelUpdateCourse,
        isPremium,
        handleCheckboxChange,
        isSequential,
        handleCheckboxChangeSequential,
        experienceCourse,
        setExperienceCourse,
        codesCourse,
        setCodesCourse,
        difficulty,
        handleSelectChange,
        courseObservations,
        setCourseObservations,
        handleUpdateThumbnail,
        handleUpdateCover,
        handleConfigCourse,
        handleSetStatusCourse,
        statusCourse
    };

    return (
        <div >
            <H1>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Cursos e Módulos'}</H1>

            <ContainerDiv>
                <CategoriesList
                    categories={categories}
                    handleCategory={handleCategory}
                    setSelectedPainel={setSelectedPainel}
                />

                {selectedPainel === 'courses' ? (
                    <CoursesCategoryList
                        courses={courses}
                        handleDeleteCourse={handleDeleteCourse}
                        setSelectedPainel={setSelectedPainel}
                        setCourseSelected={setCourseSelected}
                        GetModules={GetModules}
                    />
                ) : (
                    <CourseConfigDiv>
                        <h3>Configurações do curso {courseSelected.title}</h3>
                        <div>
                            <div style={{  padding: '5px', margin: '5px' }}>

                                {!painelUpdateCourse ? (
                                    <ConfigCourse {...configCourseProps} />
                                ) : (
                                    <UpdateCourseModal
                                        courseCategory={category}
                                        courseId={courseSelected.id}
                                        dataCourse={courseSelected}
                                        setPainelUpdateCourse={setPainelUpdateCourse}
                                        setCourseSelected={setCourseSelected}
                                        setCourses={setCourses}
                                    />
                                )}

                                <ModulesCourseList modules={modules}
                                    handleDeleteModule={handleDeleteModule}
                                    courseSelected={courseSelected}
                                />

                            </div>
                        </div>
                    </CourseConfigDiv>

                )}

            </ContainerDiv>
        </div>
    );
};

export default ListCourses;
