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

const ListCourses = () => {
    const controller = Controller();

    const {currentUser, setCurrentUser} = ContextDataCache();
    
    const [courses, setCourses] = useState([]);



    useEffect(() => {
        //fetchCourses();
    }, []);

    function deleteCourse(courseId){
        
       
    }

    function aprovarCurso(idCourse){
        
       
    }

    function deleteSpecificModule(courseId, indexModule) { 
       
       
    }


    function deleteSpecificLesson(courseId, moduleId, lessonId) {
        
       
    }


    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Lista de Cursos</h2>
        {courses.map((course) => (
            <div key={course.id} style={{backgroundColor: '#83dfc5', marginBottom: '40px', border: '1px solid #007bff', borderRadius: '10px', padding: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{course.title} - Status: {course.status}
                
                {course.status == 'pending' && <span style={{ padding: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}  onClick={()=>{aprovarCurso(course.title)}}> Aprovar</span> }
                     <UpdateCourseModal courseId={course.id} />
                     </h3>
                     
                     <p>Criador: {course.owner}</p>
                     <p>Categoria: {course.category}</p>
                      <span>
                        <EditCourseCategoryModal courseId={course.id}  />
                        </span>
                <p style={{ marginBottom: '10px' }}><strong>Descrição:</strong> {course.description}</p>
                <div>
                    {course.modules.map((module, indexM) => (
                        <div key={indexM} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '10px', padding: '15px', backgroundColor: '#a7a7a7' }}>
                            <h4 style={{ marginBottom: '10px', color: '#007bff' }}>{module.nameModule}</h4><UpdateModuleModal courseId={course.id} moduleId={indexM} />
                            <p style={{ marginBottom: '10px' }}><strong>Descrição do Módulo:</strong> {module.description}</p>
                            <ul style={{ paddingLeft: '20px', listStyle: 'none', margin: 0 }}>
                                {module.lessons.map((lesson, index) => (
                                    <li key={index} style={{ marginBottom: '10px' }}>
                                        <strong>{lesson.nameLesson}</strong> - {lesson.description} <button style={{ padding: '5px', backgroundColor: '#916913', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={()=>deleteSpecificLesson(course.id, indexM, index )}>Remover</button>
                                        <UpdateLessonModal courseId={course.id} moduleId={indexM} lessonId={index} />
                                    </li>
                                ))}
                            </ul>
                            <button style={{ padding: '5px', backgroundColor: '#a54d67', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={()=> deleteSpecificModule(course.id, indexM)}>Remover Módulo</button>
                            <AddLessonModal courseId={course.id} moduleId={indexM} />
                            
                    
                        </div>
                        
                    ))}
                    <AddModuleModal courseId={course.id} />
                </div>
                {currentUser && currentUser.permissions > 3 ? (
  <button
    onClick={() => deleteCourse(course.id)}
    style={{ marginTop: '5px', padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
  >
    Remover Curso
  </button>
) : null}
            </div>
        ))}
    </div>
    );
};

export default ListCourses;
