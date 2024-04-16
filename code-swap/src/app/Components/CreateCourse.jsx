import React, { useEffect, useState } from 'react';
import Controller from '../../Controller/controller';
import { getCookies } from '../services/cookies';
import { decryptObjectData } from '../services/encryptedAlgorithm';
import { v4 as uuidv4 } from 'uuid';

const CreateCourses = () => {
    const controller = Controller();
    const [user, setUser] = useState(null);

    
    useEffect(() => {

        // Verifica se o usuário está autenticado
    const checkUser = async () => {
        const user = await getCookies();
        
        
        const  decryptedUser = decryptObjectData(user.value); // Descriptografa os dados do usuário
        setUser(decryptedUser.userName); // Define o usuário no estado
    };
    checkUser();
    }, []);

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        title: '',
        status: 'pending',
        description: '',
        owner: '',
        idCourse: uuidv4(),
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
            controller.CreateCourse(formData, user);
            console.log(formData);
            alert('Curso criado com sucesso!');
            // Limpa o formulário após o envio bem-sucedido
            setFormData({
                title: '',
                description: '',
                owner: '',
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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Criar Novo Curso</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="title" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Título do Curso:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }}
                    />
                    <p>Criador: {user && user}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="description" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', color: '#007bff' }}>Módulos:</label>
                    <ul style={{ listStyle: 'none', padding: '0', marginLeft: '0' }}>
                        {formData.modules.map((module, moduleIndex) => (
                            <li key={moduleIndex} style={{ marginBottom: '20px', border: '2px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#938f8f' }}>
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
                                        style={{ width: '100%', padding: '5px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                    <textarea
                                        value={module.description}
                                        onChange={(e) => {
                                            const updatedModules = [...formData.modules];
                                            updatedModules[moduleIndex].description = e.target.value;
                                            setFormData({ ...formData, modules: updatedModules });
                                        }}
                                        placeholder="Descrição do Módulo"
                                        style={{ width: '100%', padding: '5px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                    <ul style={{ listStyle: 'none', padding: '0', marginLeft: '0' }}>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <li key={lessonIndex} style={{ marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    value={lesson.nameLesson}
                                                    onChange={(e) => {
                                                        const updatedModules = [...formData.modules];
                                                        updatedModules[moduleIndex].lessons[lessonIndex].nameLesson = e.target.value;
                                                        setFormData({ ...formData, modules: updatedModules });
                                                    }}
                                                    placeholder="Nome da Aula"
                                                    style={{ width: '100%', padding: '5px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                />
                                                <textarea
                                                    value={lesson.description}
                                                    onChange={(e) => {
                                                        const updatedModules = [...formData.modules];
                                                        updatedModules[moduleIndex].lessons[lessonIndex].description = e.target.value;
                                                        setFormData({ ...formData, modules: updatedModules });
                                                    }}
                                                    placeholder="Descrição da Aula"
                                                    style={{ width: '100%', padding: '5px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                />
                                            </li>
                                        ))}
                                        <li>
                                            <button type="button" onClick={() => handleAddLesson(moduleIndex)} style={{ padding: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}>Adicionar Aula</button>
                                        </li>
                                    </ul>
                                    <button type="button" onClick={() => handleRemoveModule(moduleIndex)} style={{ padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Remover Módulo</button>
                                </div>
                            </li>
                        ))}
                        <li>
                            <button type="button" onClick={handleAddModule} style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Adicionar Módulo</button>
                        </li>
                    </ul>
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Criar Curso</button>
            </form>
        </div>
    )
};

export default CreateCourses;
