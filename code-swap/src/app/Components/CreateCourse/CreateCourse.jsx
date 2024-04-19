import React, { useEffect, useState } from 'react';
import Controller from '../../../Controller/controller';
import { getCookies } from '../../services/cookies';
import { decryptObjectData } from '../../services/encryptedAlgorithm';
import { v4 as uuidv4 } from 'uuid';
//importar router do next/navigation
import { useRouter } from 'next/navigation';
import ModalCreateCategory from '../modalCreateCategory';
import { getAllCategories } from '../../../../database/functions/createCategory';
import { addCourseToCategory } from '../../../../database/functions/createCategory';
import { storage } from '../../../../database/firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import { convertBlobToBase64 } from "image-conversion";


import { ref } from "firebase/storage";

const CreateCourses = () => {

    const controller = Controller();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const [imgUrl, setImgUrl] = useState('');
    const [progress, setProgress] = useState(0);

    const [SequentialModule, setSequentialModule] = useState(false);
    const [modulePermission, setModulePermission] = useState(0); 

    const handleChangeCategory = (event) => {
        setSelectedCategory(event.target.value);
    };


    useEffect(() => {

        // Verifica se o usuário está autenticado
        const checkUser = async () => {
            const user = await getCookies();


            const decryptedUser = decryptObjectData(user.value); // Descriptografa os dados do usuário
            setUser(decryptedUser.userName); // Define o usuário no estado

            async function fetchCategories() {
                const categories = await getAllCategories();
                setCategories(categories);
                //console.log(categories);
            }
            fetchCategories();


        };
        checkUser();
    }, []);

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        title: '',
        status: 'pending',
        registrations: [], // Lista de alunos inscritos no curso com ID e status (concluído, desistente, cursando)

        description: '',
        owner: '',
        thumbnail: imgUrl ? imgUrl : '',
        idCourse: uuidv4(),
        category: selectedCategory ? selectedCategory : 'categoria não selecionada',
        modules: [
            {
                nameModule: '',
                description: '',
                registrationsModule: [], // Lista de alunos inscritos no módulo com ID e status (concluído, desistente, cursando)

                modulePermission: modulePermission,
                idModule: uuidv4(),
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

        // Verifica se uma categoria foi selecionada
        if (!selectedCategory || selectedCategory.trim() === '') {
            alert('Por favor, escolha uma categoria.');
            return;
        }

        try {
            // Adiciona a categoria selecionada ao formData antes de criar o curso
            const courseData = {
                ...formData,
                category: selectedCategory,
                thumbnail: imgUrl,
                SequentialModule: SequentialModule
            };




            controller.CreateCourse(courseData, user);


            // Adiciona o curso à categoria selecionada
            await addCourseToCategory(formData.title, selectedCategory);
            alert(`Curso ${formData.title} criado com sucesso!`);
            //console.log('categoria selecionada:', selectedCategory);
            // Limpa o formulário após o envio bem-sucedido
            setFormData({
                title: '',
                status: 'pending',
                registrations: [],

                description: '',
                owner: '',
                thumbnail: '',
                idCourse: uuidv4(),
                category: selectedCategory,
                modules: [
                    {
                        nameModule: '',
                        description: '',
                        registrationsModule: [],

                        modulePermission: modulePermission,
                        idModule: uuidv4(),
                        lessons: [
                            {
                                nameLesson: '',
                                description: ''
                            }
                        ]
                    }
                ]
            });

            window.location.reload();
        } catch (error) {
            console.error('Erro ao criar o curso:', error);
            alert('Erro ao criar o curso. Por favor, tente novamente mais tarde.');
        }
    };

    

    // Função para adicionar um novo módulo a um curso existente
    const handleAddModule = () => {

        setModulePermission(modulePermission + 1);
        

        const newModule = {
            nameModule: '',
            description: '',
            //module com permissão sequencial sempre adiciona o nivel de permissão +1
            modulePermission: SequentialModule ? modulePermission + 1 : modulePermission,
            idModule: '',
            lessons: [
                {
                    nameLesson: '',
                    description: ''
                }
            ]
        };

        //adicionar id unico para cada modulo criado dentro do curso
        newModule.idModule = uuidv4();

        console.log('Nível de persimissao do modulo', newModule.modulePermission);

        //se sequencialMoule for false, o modulo é criado com permissão 0
        if (!SequentialModule) {
            newModule.modulePermission = 0;
        }


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



    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error(error);
        }
            , () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL);
                    console.log('File available at', downloadURL);
                });
                //limpar o campo de upload
                e.target.file.value = '';
            });
    };

    
    //função para lidar com alteração no checkbox
    const handleChangeCheckbox = (e) => {
        setSequentialModule(e.target.checked);
        
    };



    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Criar Novo Curso</h2>
            <h3>Categoria</h3>
            <select value={selectedCategory} onChange={handleChangeCategory}>
                <option value="">Selecione uma categoria</option>
                {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <ModalCreateCategory />
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


                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="private" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Módulos sequenciais?</label>
                        <input type="checkbox" id="private" name="private" value="private" style={{ padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }} onChange={handleChangeCheckbox} />
                    </div>


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
            <div>
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Upload Arquivos:</label>
                <form onSubmit={handleUpload} >
                    <input type="file" name="file" />
                    <button style={{ padding: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrl && <progress value={progress} max="100" />}
                {imgUrl && <img src={imgUrl} alt="Imagem do curso" style={{ width: '100px', height: '100px' }} />}
            </div>
        </div>
    )
};

export default CreateCourses;
