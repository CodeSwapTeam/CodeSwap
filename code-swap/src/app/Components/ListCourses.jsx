import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';
import { DeleteCourse } from '../../../database/functions/deleteCourse';
import { ChangeStatusCourse } from '../../../database/functions/ChangeStatusCourse';
import { useInteractionLogger } from '../contexts/InteractionContext';
import { useAuthContext } from '../contexts/Auth';

const ListCourses = () => {
    const controller = Controller();

    const {currentUser} = useAuthContext();
    
    const [courses, setCourses] = useState([]);

    // Função para carregar os cursos do banco de dados ao montar o componente
    const fetchCourses = async () => {
        try {
            const coursesData = await controller.getAllModulesAndCourses(); // Supondo que existe uma função para obter todos os cursos do banco de dados
            setCourses(coursesData);
            //console.log(coursesData);
        } catch (error) {
            console.error('Erro ao carregar os cursos:', error);
        }
    };

    useEffect(() => {
      

        fetchCourses();
    }, []);

    function deleteCourse(courseId){
        DeleteCourse(courseId);
        alert(`Curso ${courseId} deletado com sucesso!`);
        fetchCourses();
    }

    function aprovarCurso(idCourse){
        ChangeStatusCourse(idCourse);
        fetchCourses();
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Lista de Cursos</h2>
        {courses.map((course) => (
            <div key={course.id} style={{ marginBottom: '40px', border: '1px solid #007bff', borderRadius: '10px', padding: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{course.title} - Status: {course.status}
                {course.status == 'pending' && <span style={{ padding: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}  onClick={()=>{aprovarCurso(course.title)}}> Aprovar</span> }
                     
                     </h3>
                     <p>Criador: {course.owner}</p>
                <p style={{ marginBottom: '10px' }}><strong>Descrição:</strong> {course.description}</p>
                <div>
                    {course.modules.map((module, index) => (
                        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '10px', padding: '15px' }}>
                            <h4 style={{ marginBottom: '10px', color: '#007bff' }}>{module.nameModule}</h4>
                            <p style={{ marginBottom: '10px' }}><strong>Descrição do Módulo:</strong> {module.description}</p>
                            <ul style={{ paddingLeft: '20px', listStyle: 'none', margin: 0 }}>
                                {module.lessons.map((lesson, index) => (
                                    <li key={index} style={{ marginBottom: '10px' }}>
                                        <strong>{lesson.nameLesson}</strong> - {lesson.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {currentUser && currentUser.permissions > 3 ? (
  <button
    onClick={() => deleteCourse(course.id)}
    style={{ padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
