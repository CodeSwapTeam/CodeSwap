// ListCourses.jsx

import React, { useEffect, useState } from 'react';
import Controller from '@/Controller/controller';

const ListCourses = () => {
    const controller = Controller();

    const [modules, setModules] = useState([]);

    useEffect(() => {
        // Função para carregar os módulos do banco de dados ao montar o componente
        const fetchModules = async () => {
            try {
                const modulesData = await controller.courses; // Supondo que existe uma função para obter todos os módulos do banco de dados
                setModules(modulesData);
                //console.log(modulesData);
            } catch (error) {
                console.error('Erro ao carregar os módulos:', error);
            }
        };

        fetchModules();
        
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista de Módulos</h2>
            {modules.map((module) => (
                <div key={module.id} style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px' }}><strong>{module.title}</strong></h3>
                    <p style={{ marginBottom: '10px' }}><strong>Descrição:</strong> {module.description}</p>
                    <ul style={{ paddingLeft: '20px' }}>
                        {module.courses.map((course, index) => (
                            <li key={index}>{course}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ListCourses;
