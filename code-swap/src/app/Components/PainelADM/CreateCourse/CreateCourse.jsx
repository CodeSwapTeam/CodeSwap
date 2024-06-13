import React, { useEffect, useState } from 'react';
import Controller from '../../../../Controller/controller';
import ModalCreateCategory from '../../Modals/modalCreateCategory';
import { storage } from '../../../../../database/firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";

import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import ModalUpdateCategory from '../../Modals/modalUpdateCategory';


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

    //verificar se existe algum erro ao salvar o curso buscando no cache local o erro_save
    useEffect(() => {
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
    }, []);

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

            const categories = await controller.manageCategories.GetAllCategories();
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    // if(categoriesData) console.log('categoriesData', categoriesData);



    const handleChangeCategory = (categorieID) => {
        setSelectedCategoryID(categorieID.target.value);
    };

    // Função para deletar uma categoria
    const deleteCategory = async (id) => {
        await controller.manageCategories.DeleteCategory(id);
        queryClient.refetchQueries(['All-Categories']);

        setSelectedCategoryID('');
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
        await controller.manageCourses.CreateCourse(formData);
        queryClient.refetchQueries(['All-Categories']);

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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#002449db' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '5px', color: '#04ff02', fontWeight: 'bold', fontSize: '1.5rem'}}>Criar Novo Curso</h1>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px' }}>Categoria</h3>
            <select value={selectedCategoryID} onChange={handleChangeCategory} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                <option value="">Selecione uma categoria</option>
                {categoriesData?.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>
                ))}
            </select>
            <ModalCreateCategory />
            <button onClick={() => deleteCategory(selectedCategoryID)} style={{ padding: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }}>Excluir Categoria</button>
            {categoriesData && <ModalUpdateCategory categoriesData={categoriesData}/>
            }
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' , marginTop:'20px'}}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="title" style={{  marginBottom: '5px', color: '#ffffff' }}>Título do Curso:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #007bff', borderRadius: '5px' }}
                    />
                    <p style={{color: '#ffffff' }} >Criador: {currentUser && currentUser.userName}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="description" style={{  marginBottom: '5px', color: '#ffffff' }}>Descrição:</label>
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
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', color: '#007bff', display: 'block', marginBottom: '10px' }}>Upload Thumbnail:</label>
                <form onSubmit={handleUploadThumbnail} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="file" name="file" style={{ marginRight: '10px', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />
                    <button style={{ padding: '10px 20px', backgroundColor: '#034C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlThumbnail && <progress value={progress} max="100" style={{ width: '100%', height: '10px', borderRadius: '5px' }} />}
                {imgUrlThumbnail && <img src={imgUrlThumbnail} alt="Imagem do curso" style={{ width: '100px', height: '100px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', color: '#007bff', display: 'block', marginBottom: '10px' }}>Upload Capa do Curso:</label>
                <form onSubmit={handleUploadCover} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="file" name="file" style={{ marginRight: '10px', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />
                    <button style={{ padding: '10px 20px', backgroundColor: '#034C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlCover && <progress value={progressCover} max="100" style={{ width: '100%', height: '10px', borderRadius: '5px' }} />}
                {imgUrlCover && <img src={imgUrlCover} alt="Imagem do curso" style={{ width: '100px', height: '100px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />}
            </div>
        </div>
    )
};

export default CreateCourses;
