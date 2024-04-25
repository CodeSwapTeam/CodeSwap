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
    const [category, setCategory] = useState(null);

    const [selectedPainel, setSelectedPainel] = useState('courses');

    const client = useQueryClient();

    const { data : categories} = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            //Buscar as categorias no cache local
            const categories = controller.manageCategories.GetCategoriesLocal();
            if(categories){
                return categories;
            }
            const dbCategories = await controller.manageCategories.GetCategories();
            return dbCategories;
        }

    })

    //if(categories) console.log(categories);
    


    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        console.log(category);
        setCourses(category.courses);
        setCategory({name: category.name, id: category.id});
    }



    return (
        <div>
            <h1 style={{ border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Modulos'}</h1>
            <div style={{ display: 'flex', marginTop: '10px', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                <div style={{ flex: '20%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                    <h3>Categorias</h3>
                    <div>
                        {categories && categories.map(category => (
                            <div key={category.id} style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={() => {handleCategory(category), setSelectedPainel('courses')}}>
                                <h4>{category.name}</h4>                             
                            </div>
                        ))} 
                    </div>
                </div>
                {selectedPainel === 'courses' ? (<div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                        {courses && courses.map(course => (
                            <div key={course.id} style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>
                                <h4>{course.title}</h4>
                                <p>{course.description}</p>
                                <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={()=> setSelectedPainel('Modules')}>Gerenciar</button>
                            </div>
                        ))}
                </div>) : (
                    
                    <div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                        <h3>Modulos</h3>
                        <div>
                            <div style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>
                                <h4>Modulo 1</h4>
                                <p>Descrição do modulo</p>
                                <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }}>Gerenciar</button>
                            </div>
                        </div>
                    </div>
                
                )}
                
            </div>
        </div>
    );
};

export default ListCourses;
