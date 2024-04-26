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
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

import { storage } from '../../../database/firebase';
import { deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";


const ListCourses = () => {
    const controller = Controller();

    const [courses, setCourses] = useState([]);
    const [courseSelected, setCourseSelected] = useState(null);
    const [modules, setModules] = useState([{}]);
    const [category, setCategory] = useState(null);

    const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
    const [progress, setProgress] = useState(0);

    const [imgUrlCover, setImgUrlCover] = useState('');
    const [progressCover, setProgressCover] = useState(0);

    const [selectedPainel, setSelectedPainel] = useState('courses');

    const [painelUpdateCourse, setPainelUpdateCourse] = useState(false);
    const client = useQueryClient();

    const { data: categories } = useQuery({
        queryKey: ["ListCourses"],
        queryFn: async () => {
            
            //Buscar as categorias no cache local
            const categories = controller.manageCategories.GetCategoriesLocal();
            //console.log(categories);
            if (categories) {
                console.log('Buscando categorias Locais', categories);
                //setCourses(category.courses);
                return categories;
            }
            //setCourses(category.courses);
            const dbCategories = await controller.manageCategories.GetCategories();
            //setCourses(dbCategories.courses);
            return dbCategories;
        }

    })

    // if(categories) console.log(categories);

    //função para deletar um curso
    const handleDeleteCourse = useMutation({
        mutationFn: async (courseId) => {
            await controller.manageCourses.DeleteCourse(courseId);
        },
        onSuccess: (data, variables) => {
            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries("ListCourses");

            // Remove o curso deletado do estado local
            setCourses(courses => courses.filter(course => course.id !== variables));
        }
    })

    //função para pegar os cursos dentro de uma categoria selecionada pelo usuário
    const handleCategory = (category) => {
        setCourses(category.courses);
        console.log("setar os cursos", category.courses);
        //console.log("setar a categoria", { name: category.name, id: category.id });
        setCategory({ name: category.name, id: category.id });
    }

    //função para buscar os modulos de um curso
    const GetModules = async (course) => {

        handleGetModules.mutate(course);

        console.log(course.id)
        const courseSelected = await controller.manageCourses.GetCourseById(course.id);
        setCourseSelected(courseSelected);
        console.log(courseSelected);
    }

    const handleGetModules = useMutation({
        mutationFn: async (course) => {
            //Buscar os módulos do curso no cache local
            const modulesLocal = await controller.manageModules.GetModulesLocal(course.id);
            if (modulesLocal && modulesLocal.length > 0) {
                return modulesLocal;
            }

            const modules = await controller.manageModules.GetModules(course.id);

            return modules;
        },
        onSuccess: (data) => {
            client.invalidateQueries("ListCourses");
            setModules(data);

        }
    })

    //MUTATION PARA DELETAR UM MODULO
    const handleDeleteModule = useMutation({
        mutationFn: async (data) => {
            await controller.manageModules.DeleteModule(courseSelected, data);
        },
        onSuccess: (data, variables) => {
            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries("ListCourses");

            // Remove o curso deletado do estado local
            setModules(modules => modules.filter(module => module.id !== variables));
        }
    })

    const [isPremium, setIsPremium] = useState(false);
    const [isSequential, setIsSequential] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsPremium(event.target.checked);
    };

    const handleCheckboxChangeSequential = (event) => {
        setIsSequential(event.target.checked);
    }


    const [difficulty, setDifficulty] = useState('iniciante');

    const handleSelectChange = (event) => {
        setDifficulty(event.target.value);
    };




    const handleUpdateThumbnail = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;

        // Extrair o nome do arquivo da URL
        const url = new URL(decodeURIComponent(courseSelected.thumbnail));
        const pathname = url.pathname;
        const parts = pathname.split('/');
        const filename = parts[parts.length - 1];
        console.log(filename);

        // Deletar a imagem antiga
        const oldImageRef = ref(storage, `Courses/Thumbnails/${filename}`);
        deleteObject(oldImageRef).catch((error) => {
            console.error(error);
        });

        // Fazer o upload da nova imagem
        const storageRef = ref(storage, `Courses/Thumbnails/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlThumbnail(downloadURL);
                console.log('File available at', downloadURL);
                // Atualizar a URL da imagem no banco de dados
                controller.manageCourses.UpdateThumbnailCourse(courseSelected.id, downloadURL);

                // Invalidate a query 'ListCourses' após a atualização da imagem
                client.invalidateQueries("ListCourses");

                // Atualizar a imagem no estado local
                setCourseSelected(courseSelected => ({ ...courseSelected, thumbnail: downloadURL }));
            });

            // Limpar o campo de upload
            e.target.file.value = '';
        });
    };

    const handleUpdateCover = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        if (!file) return;

        // Extrair o nome do arquivo da URL
        const url = new URL(decodeURIComponent(courseSelected.cover));
        const pathname = url.pathname;
        const parts = pathname.split('/');
        const filename = parts[parts.length - 1];
        console.log(filename);

        // Deletar a imagem antiga
        const oldImageRef = ref(storage, `Courses/Covers/${filename}`);
        deleteObject(oldImageRef).catch((error) => {
            // Ignorar o erro  404 se o arquivo não existir
            if (error.code === 'storage/object-not-found') {
                return;
            }
        });

        // Fazer o upload da nova imagem
        const storageRef = ref(storage, `Courses/Covers/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlThumbnail(downloadURL);
                console.log('File available at', downloadURL);
                // Atualizar a URL da imagem no banco de dados
                controller.manageCourses.UpdateCoverCourse(courseSelected.id, downloadURL);

                // Invalidate a query 'ListCourses' após a atualização da imagem
                client.invalidateQueries("ListCourses");

                // Atualizar a imagem no estado local
                setCourseSelected(courseSelected => ({ ...courseSelected, cover: downloadURL }));
            });

            // Limpar o campo de upload
            e.target.file.value = '';
        });
    };

    return (
        <div>
            <h1 style={{ border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>{selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` : 'Modulos'}</h1>
            <div style={{ display: 'flex', marginTop: '10px', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>
                <div style={{ flex: '20%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>

                    <h3>Categorias</h3>

                    <div>
                        {categories && categories.map(category => (
                            <div key={category.id} style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={() => { handleCategory(category), setSelectedPainel('courses') }}>
                                <h4>{category.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedPainel === 'courses' ? (<div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>

                    {courses && courses.map(course => (
                        <div key={course.id} style={{ border: '1px solid white', padding: '5px', margin: '5px', position: 'relative' }}>
                            <button style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => handleDeleteCourse.mutate(course.id)}>Deletar Curso</button>
                            <h4>{course.title}</h4>
                            <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }} onClick={() => { setSelectedPainel('Modules'), setCourseSelected(course), GetModules(course) }}>Gerenciar</button>
                        </div>
                    ))}
                </div>) : (

                    <div style={{ flex: '80%', border: '2px solid white', padding: '10px', color: 'white', textAlign: 'center' }}>

                        <h3>Modulos do curso {courseSelected.title}</h3>
                        <div>
                            <div style={{ border: '2px solid white', padding: '5px', margin: '5px' }}>


                                {!painelUpdateCourse ? (
                                    <>
                                        <h4>{courseSelected.title}</h4>
                                        <p>{courseSelected.description}</p>
                                        <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setPainelUpdateCourse(true)}>Atualizar informações</button>

                                        <div >
                                            <p style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>Configurações do Curso</p>

                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between' }}>

                                                <div style={{ width: '30%', marginLeft: '10px' }}>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Criador:
                                                        <span type="text" >{courseSelected.owner}</span>
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Status:
                                                        <span type="text" >{courseSelected.status}</span>
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Curso premium?
                                                        <input type="checkbox" checked={isPremium} onChange={handleCheckboxChange} />
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Módulos sequenciais?
                                                        <input type="checkbox" checked={isSequential} onChange={handleCheckboxChangeSequential} />
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        XP do curso:
                                                        <span type="text" > 100 </span>
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Codes do curso:
                                                        <span type="text" > 150 </span>
                                                    </label>
                                                    <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start' }}>
                                                        Nível de dificuldade do curso:
                                                        <select style={{ color: 'black' }} value={difficulty} onChange={handleSelectChange}>
                                                            <option value="iniciante">Iniciante</option>
                                                            <option value="intermediário">Intermediário</option>
                                                            <option value="avançado">Avançado</option>
                                                        </select>
                                                    </label>




                                                    <label style={{ width: '60%', border: '1px solid white', display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '10px' }}>
                                                        Thumbnail
                                                        <img src={courseSelected.thumbnail} alt="imagem" />
                                                    </label>

                                                    <div>
                                                        <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar Thumbnail:</label>
                                                        <form onSubmit={handleUpdateThumbnail} >
                                                            <input type="file" name="file" />
                                                            <button style={{ padding: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Enviar</button>
                                                        </form>
                                                        <br />

                                                    </div>
                                                </div>

                                                <label style={{ width: '60%', border: '1px solid white', display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '10px' }}>
                                                    Capa do Curso
                                                    <img src={courseSelected.cover
                                                    } alt="imagem" />

                                                    <div>
                                                        <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar capa do curso:</label>
                                                        <form onSubmit={handleUpdateCover} >
                                                            <input type="file" name="file" />
                                                            <button style={{ padding: '5px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit">Enviar</button>
                                                        </form>
                                                        <br />

                                                    </div>
                                                </label>



                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <UpdateCourseModal courseCategory={category} courseId={courseSelected.id} dataCourse={courseSelected} setPainelUpdateCourse={setPainelUpdateCourse} setCourseSelected={setCourseSelected} setCourses={setCourses}/>
                                )}

                                <div style={{ border: '1px solid white', padding: '5px', margin: '5px' }}>

                                    {modules && modules.map((module, index) => (
                                        <div key={index} style={{ position: 'relative', border: '1px solid white', padding: '5px', margin: '5px' }}>
                                            <button style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => handleDeleteModule.mutate(module.id)}>Deletar Módulo</button>
                                            <h4>{module.title}</h4>

                                            <button style={{ border: '1px solid white', padding: '5px', margin: '5px', cursor: 'pointer' }}>Gerenciar</button>
                                        </div>
                                    ))}

                                    <p>Criar Módulos</p>

                                    <AddModuleModal courseId={courseSelected.id} />
                                </div>


                            </div>
                        </div>
                    </div>

                )}

            </div>
        </div>
    );
};

export default ListCourses;
