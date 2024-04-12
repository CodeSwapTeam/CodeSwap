
import React, { useEffect, useState } from 'react';
import Controller from '../../Controller/controller';

const CreateCourses = () => {
    
    const controller = Controller();

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courses: []
    });

    // Função para lidar com a alteração nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            controller.CreateCourse(formData)
            //console.log(formData);
            alert('Curso criado com sucesso!');
            // Limpa o formulário após o envio bem-sucedido
            setFormData({
                title: '',
                description: '',
                courses: []
            });
        } catch (error) {
            console.error('Erro ao criar o curso:', error);
            alert('Erro ao criar o curso. Por favor, tente novamente mais tarde.');
        }
    };

    // Função para adicionar um novo curso à lista de cursos
    const handleAddCourse = () => {
        const newCourse = prompt('Digite o nome do curso:');
        if (newCourse) {
            setFormData({ ...formData, courses: [...formData.courses, newCourse] });
        }
    };

    // Função para remover um curso da lista de cursos
    const handleRemoveCourse = (index) => {
        const updatedCourses = [...formData.courses];
        updatedCourses.splice(index, 1);
        setFormData({ ...formData, courses: updatedCourses });
    };

    

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="title" style={{ fontWeight: 'bold', marginBottom: '5px' }}>Título do Curso:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="description" style={{ fontWeight: 'bold', marginBottom: '5px' }}>Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Cursos:</label>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                        {formData.courses.map((course, index) => (
                            <li key={index}>
                                {course}
                                <button type="button" onClick={() => handleRemoveCourse(index)}>Remover</button>
                            </li>
                        ))}
                    </ul>
                    <button type="button" onClick={handleAddCourse} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Adicionar Curso</button>
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Criar Curso</button>
            </form>
        </div>
    )
};

export default CreateCourses;
