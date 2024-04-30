import React, { useEffect, useState } from 'react';
import Controller from '../../../../Controller/controller';
import ModalCreateCategory from '../../Modals/modalCreateCategory';
import { storage } from '../../../../../database/firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";

import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from '@/app/contexts/ContextDataCache';


const CreateCourses = () => {

    const controller = Controller();

    //CONTEXT DATA
    const { currentUser } = ContextDataCache();

    const queryClient = useQueryClient();

    const [selectedCategoryID, setSelectedCategoryID] = useState('');

    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
    const [imgUrlCover, setImgUrlCover] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressCover, setProgressCover] = useState(0);

    

    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories'],
        queryFn: async () => {
            //verificar se existe algum erro ao salvar o curso buscando no cache local o erro_save
            const erroData = JSON.parse(sessionStorage.getItem('erro_save'));
            if (erroData) {
                //se existir erro, setar nos campos do formulário os dados salvos
                setCourseName(erroData.title);
                setCourseDescription(erroData.description);
                //excluir o curso no database com o id do erroData
                controller.manageCourses.DeleteCourse(erroData.id);
                //limpar o cache local
                sessionStorage.removeItem('erro_save');
            }

            const categories = await controller.manageCategories.GetCategories();
            return categories;
        },
        staleTime: 1000 * 20, // 20 seconds
    });

    // if(categoriesData) console.log('categoriesData', categoriesData);



    const handleChangeCategory = (categorieID) => {
        setSelectedCategoryID(categorieID.target.value);
    };

    // Função para deletar uma categoria
    const deleteCategory = async (id) => {
        await controller.manageCategories.DeleteCategory(id);
        //pegar as categorias no cache queryClient
        const categoriesCached = queryClient.getQueryData(['All-Categories']);

        //filtrar as categorias para excluir a categoria deletada
        const categoriesUpdated = categoriesCached.filter(category => category.id !== id);
        //atualizar as categorias no cache
        queryClient.setQueryData(['All-Categories'], categoriesUpdated);
        setSelectedCategoryID('');
    }


    //funcção para criar um novo curso
    const createCourse = async (formData) => {
       const courseID = await controller.manageCourses.CreateCourse(formData);

        //atualizar dentro da categoria o curso criado
        const categoriesCached = queryClient.getQueryData(['All-Categories']);
        const coursesCategory = categoriesCached.find(category => category.id === formData.category);
        if(coursesCategory){
            //adicionar o novo curso a categoria
            coursesCategory.courses.push(formData);
            //atualizar a categoria no cache
            queryClient.setQueryData(['All-Categories'], categoriesCached);
        }

    }

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica se uma categoria foi selecionada
        if (!selectedCategoryID || selectedCategoryID.trim() === '') {
            alert('Por favor, escolha uma categoria.');
            return;
        }

        //converter o courseName para caixa alta
        const courseNameUp = courseName.toUpperCase();

        const formData = {
            title: courseNameUp,
            status: 'pending', // pending, approved, reviewed, rejected
            description: courseDescription,
            owner: currentUser.userName,
            experience: 0,
            difficulty: '',
            codes: 0,
            courseObservations: '',
            thumbnail: imgUrlThumbnail ? imgUrlThumbnail : '',
            cover: imgUrlCover ? imgUrlCover : '',
            coursePremium: false,
            id: '',
            category: selectedCategoryID,
            SequentialModule: false,
            modules: []
        }

        //Criar o curso no banco de dados
        await createCourse(formData);

        //limpar os inputs
        setCourseName('');
        setCourseDescription('');
    };


    // Função para lidar com o upload de uma imagem de thumbnail
    const handleUploadThumbnail = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;
        const fileName = `${courseName}-thumbnail`;
        const storageRef = ref(storage, `Courses/Thumbnails/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlThumbnail(downloadURL);
            });
            //limpar o campo de upload
            e.target.file.value = '';
        });
    };
    // Função para lidar com o upload de uma imagem de capa
    const handleUploadCover = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;
        const fileName = `${courseName}-cover`;
        const storageRef = ref(storage, `Courses/Covers/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressCover(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlCover(downloadURL);
                //console.log('File available at', downloadURL);
            });
            //limpar o campo de upload
            e.target.file.value = '';
        });
    };


    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Criar Novo Curso</h2>
            <h3>Categoria</h3>
            <select value={selectedCategoryID} onChange={handleChangeCategory}>
                <option value="">Selecione uma categoria</option>
                {categoriesData?.map((category, index) => (

                    <option onClick={() => handleChangeCategory(category.id)} key={index} value={category.id}>{category.name}</option>
                ))}
            </select>

            <button onClick={() => deleteCategory(selectedCategoryID)} style={{ padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>Excluir Categoria</button>
            <ModalCreateCategory />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="title" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Título do Curso:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }}
                    />
                    <p>Criador: {currentUser && currentUser.userName}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="description" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Criar Curso</button>
            </form>
            <div>
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Upload Thumbnail:</label>
                <form onSubmit={handleUploadThumbnail} >
                    <input type="file" name="file" />
                    <button style={{ padding: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlThumbnail && <progress value={progress} max="100" />}
                {imgUrlThumbnail && <img src={imgUrlThumbnail} alt="Imagem do curso" style={{ width: '100px', height: '100px' }} />}
            </div>

            <div>
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Upload Capa do Curso:</label>
                <form onSubmit={handleUploadCover} >
                    <input type="file" name="file" />
                    <button style={{ padding: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlCover && <progress value={progressCover} max="100" />}
                {imgUrlCover && <img src={imgUrlCover} alt="Imagem do curso" style={{ width: '100px', height: '100px' }} />}
            </div>
        </div>
    )
};

export default CreateCourses;
