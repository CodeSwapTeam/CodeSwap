import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import { DeleteCourse } from '../../../database/functions/Courses/manageCourses';

import { ContextDataCache } from '../contexts/ContextDataCache';
import AddModuleModal from './Modals/modalAddModule';
import AddLessonModal from './Modals/modalAddLesson';

import UpdateCourseModal from './Modals/modalUpdateCourse';
import UpdateModuleModal from './Modals/modalUpdateModule';
import UpdateLessonModal from './Modals/modalUpdateLesson';
import EditCourseCategoryModal from './Modals/modalEditCategoryCourse';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";


const ListCourses = () => {
    const controller = Controller();

    const [courses, setCourses] = useState([]);
    const [courseSelected, setCourseSelected] = useState(null);
    const [modules, setModules] = useState([{}]);
    const [category, setCategory] = useState(null);

    const [selectedPainel, setSelectedPainel] = useState('courses');

    const [painelUpdateCourse, setPainelUpdateCourse] = useState(false);
    const client = useQueryClient();

    const { data: categories } = useQuery({
        queryKey: ["ListCourses"],
        queryFn: async () => {
            //Buscar as categorias no cache local
            const categories = controller.manageCategories.GetCategoriesLocal();
            //console.log(categories);
            if (categories) {
                return categories;
            }
            //setCourses(category.courses);
            const dbCategories = await controller.manageCategories.GetCategories();
            return dbCategories;
        }

    })




    // if(categories) console.log(categories);


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
        }
    })

    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        setCourses(category.courses);
        setCategory({ name: category.name, id: category.id });
    }


    

    const handleGetModules = useMutation({
        mutationFn: async (course) => {
            //Buscar os módulos do curso no cache local
            const modulesLocal = await controller.manageModules.GetModulesLocal(course.id);
            if (modulesLocal && modulesLocal.length > 0) {
                console.log('modulesLocal,', modulesLocal);
                return modulesLocal;
            }

            const modules = await controller.manageModules.GetModules(course.id);
            return modules;
        },
        onSuccess: (data) => {
            client.invalidateQueries("ListCourses");
            setModules(data);

        }
    })

    //MUTATION PARA DELETAR UM MODULO
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
    })





    return (
        <div>
            <h1 style={{ border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Modulos'}</h1>
            <div style={{ display: 'flex', marginTop: '10px', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                <div style={{ flex: '20%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>

                    <h3>Categorias</h3>

                    <div>
                        {categories && categories.map(category => (
                            <div key={category.id} style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={() => { handleCategory(category), setSelectedPainel('courses') }}>
                                <h4>{category.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedPainel === 'courses' ? (<div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>

                    {courses && courses.map(course => (
                        <div key={course.id} style={{ border: '1px solid white', padding: '5px', margin: '5px', position: 'relative' }}>
                            <button style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => handleDeleteCourse.mutate(course.id)}>Deletar Curso</button>
                            <h4>{course.title}</h4>
                            <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={() => { setSelectedPainel('Modules'), setCourseSelected(course), handleGetModules.mutate(course) }}>Gerenciar</button>
                        </div>
                    ))}
                </div>) : (

                    <div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                        <h3>Modulos</h3>
                        <div>
                            <div style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>


                                {!painelUpdateCourse ? (
                                    <>
                                        <h4>{courseSelected.title}</h4>
                                        <p>{courseSelected.description}</p>
                                        <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setPainelUpdateCourse(true)}>Atualizar Curso</button>
                                    </>
                                ) : (
                                    <UpdateCourseModal courseId={courseSelected.id} dataCourse={courseSelected} setPainelUpdateCourse={setPainelUpdateCourse} />
                                )}

                                <div style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>
                                    <div style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>
                                        {modules && modules.map((module, index) => (
                                            <div key={index} style={{ position: 'relative', border: '1px solid white', padding: '5px', margin: '5px' }}>
                                                <button style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => handleDeleteModule.mutate(module.id)}>Deletar Módulo</button>
                                                <h4>{module.title}</h4>
                                                
                                                <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }}>Gerenciar</button>
                                            </div>
                                        ))}
                                    </div>
                                    <p>Criar Módulos</p>

                                    <AddModuleModal courseId={courseSelected.id} />
                                </div>


                            </div>
                        </div>
                    </div>

                )}

            </div>
        </div>
    );
};

export default ListCourses;
