import React, { useState } from 'react';
import Controller from '../../Controller/controller';

const CreateCourses = () => {
    const controller = Controller();

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        modules: [
            {
                nameModule: '',
                description: '',
                lessons: [
                    {
                        nameLesson: '',
                        description: ''
                    }
                ]
            }
        ]
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
            controller.CreateCourse(formData);
            console.log(formData);
            alert('Curso criado com sucesso!');
            // Limpa o formulário após o envio bem-sucedido
            setFormData({
                title: '',
                description: '',
                modules: [
                    {
                        nameModule: '',
                        description: '',
                        lessons: [
                            {
                                nameLesson: '',
                                description: ''
                            }
                        ]
                    }
                ]
            });
        } catch (error) {
            console.error('Erro ao criar o curso:', error);
            alert('Erro ao criar o curso. Por favor, tente novamente mais tarde.');
        }
    };

    // Função para adicionar um novo módulo a um curso existente
    const handleAddModule = () => {
        const newModule = {
            nameModule: '',
            description: '',
            lessons: [
                {
                    nameLesson: '',
                    description: ''
                }
            ]
        };
        setFormData({ ...formData, modules: [...formData.modules, newModule] });
    };

    // Função para adicionar uma nova aula a um módulo existente
    const handleAddLesson = (moduleIndex) => {
        const newLesson = {
            nameLesson: '',
            description: ''
        };
        const updatedModules = [...formData.modules];
        updatedModules[moduleIndex].lessons.push(newLesson);
        setFormData({ ...formData, modules: updatedModules });
    };

    // Função para remover um módulo de um curso
    const handleRemoveModule = (moduleIndex) => {
        const updatedModules = [...formData.modules];
        updatedModules.splice(moduleIndex, 1);
        setFormData({ ...formData, modules: updatedModules });
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
                    <label style={{ fontWeight: 'bold' }}>Módulos:</label>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                        {formData.modules.map((module, moduleIndex) => (
                            <li key={moduleIndex}>
                                <div>
                                    <input
                                        type="text"
                                        value={module.nameModule}
                                        onChange={(e) => {
                                            const updatedModules = [...formData.modules];
                                            updatedModules[moduleIndex].nameModule = e.target.value;
                                            setFormData({ ...formData, modules: updatedModules });
                                        }}
                                        placeholder="Nome do Módulo"
                                    />
                                    <textarea
                                        value={module.description}
                                        onChange={(e) => {
                                            const updatedModules = [...formData.modules];
                                            updatedModules[moduleIndex].description = e.target.value;
                                            setFormData({ ...formData, modules: updatedModules });
                                        }}
                                        placeholder="Descrição do Módulo"
                                    />
                                    <ul>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <li key={lessonIndex}>
                                                <input
                                                    type="text"
                                                    value={lesson.nameLesson}
                                                    onChange={(e) => {
                                                        const updatedModules = [...formData.modules];
                                                        updatedModules[moduleIndex].lessons[lessonIndex].nameLesson = e.target.value;
                                                        setFormData({ ...formData, modules: updatedModules });
                                                    }}
                                                    placeholder="Nome da Aula"
                                                />
                                                <textarea
                                                    value={lesson.description}
                                                    onChange={(e) => {
                                                        const updatedModules = [...formData.modules];
                                                        updatedModules[moduleIndex].lessons[lessonIndex].description = e.target.value;
                                                        setFormData({ ...formData, modules: updatedModules });
                                                    }}
                                                    placeholder="Descrição da Aula"
                                                />
                                            </li>
                                        ))}
                                        <li>
                                            <button type="button" onClick={() => handleAddLesson(moduleIndex)}>Adicionar Aula</button>
                                        </li>
                                    </ul>
                                    <button type="button" onClick={() => handleRemoveModule(moduleIndex)}>Remover Módulo</button>
                                </div>
                            </li>
                        ))}
                        <li>
                            <button type="button" onClick={handleAddModule}>Adicionar Módulo</button>
                        </li>
                    </ul>
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Criar Curso</button>
            </form>
        </div>
    )
};

export default CreateCourses;
