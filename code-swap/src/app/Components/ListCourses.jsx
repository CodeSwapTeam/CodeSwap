import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';

const ListCourses = () => {
    const controller = Controller();

    const [courses, setCourses] = useState([]);

    useEffect(() => {
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

        fetchCourses();
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista de Cursos</h2>
            {courses.map((course) => (
                <div key={course.id} style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '10px' }}>{course.title}</h3>
                    <p style={{ marginBottom: '10px' }}><strong>Descrição:</strong> {course.description}</p>
                    <div>
                        {course.modules.map((module, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <h4 style={{ marginBottom: '10px' }}>{module.nameModule}</h4>
                                <p style={{ marginBottom: '10px' }}><strong>Descrição do Módulo:</strong> {module.description}</p>
                                <ul style={{ paddingLeft: '20px' }}>
                                    {module.lessons.map((lesson, index) => (
                                        <li key={index}>
                                            <strong>{lesson.nameLesson}</strong> - {lesson.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListCourses;
