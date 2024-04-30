import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";


function UpdateCourseModal(props) {

    const queryClient = useQueryClient();

    let categoryId = props.courseCategory.id;
    let courseId = props.courseId;

    const controller = Controller();

    const [show, setShow] = useState(false);
    const [courseTitle, setCourseTitle] = useState(props.dataCourse.title);
    const [courseDescription, setCourseDescription] = useState(props.dataCourse.description);

    const handleClose = () => props.setPainelUpdateCourse(false);
    const handleShow = () => setShow(true);

    const handleSubmitUpdateInfoCourse = async () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription
        };


        //atualizar Titulo e descrição dentro curso selecionado no cache do queryClient
        //pegar o curso selecionado no cache
        const courseSelected = queryClient.getQueryData(['course-selected']);
        //atualizar o titulo e descrição do curso selecionado
        courseSelected.title = courseTitle;
        courseSelected.description = courseDescription;
        //salvar o curso selecionado no cache
        queryClient.setQueryData(['course-selected'], courseSelected);


        //atualizar o curso dentro da categoria no cache do queryClient
        //pegar as categorias no cache
        const categoriesCached = queryClient.getQueryData(['All-Categories']);
        //pegar a categoria do curso selecionado
        const category = categoriesCached.find(category => category.id === categoryId);
        //pegar o curso dentro da categoria
        const course = category.courses.find(course => course.id === courseId);
        //atualizar o titulo e descrição do curso
        course.title = courseTitle;
        course.description = courseDescription;
        //salvar a categoria no cache
        queryClient.setQueryData(['All-Categories'], categoriesCached);


        //atualizar Titulo e descrição do curso no banco de dados
       await controller.manageCourses.UpdateInfoCourse(courseId, categoryId, courseData);

       props.setPainelUpdateCourse(false);
            
        handleClose();

    };

    return (
        <>
            

            
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atualizar informações</h5>
                            
                        </div>
                        <div className="modal-body" style={{display: 'flex', flexDirection: 'column'}}>
                            <textarea style={{color: 'black', margin: '5px'}} type="text" placeholder="Título do Curso" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                            <textarea style={{color: 'black', margin: '5px' , height:'15rem'}} type="text" placeholder="Descrição do Curso" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={()=> props.setPainelUpdateCourse(false)}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmitUpdateInfoCourse}>Salvar Alterações</button>
                        </div>
                    </div>
                </div>
           
        </>
    );
}

export default UpdateCourseModal;