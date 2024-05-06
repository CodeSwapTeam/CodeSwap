import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";


function UpdateCourseModal(props) {

    const queryClient = useQueryClient();

    let categoryId = props.courseSelected.category;
    let courseId = props.courseSelected.id;

    const controller = Controller();

    const [show, setShow] = useState(false);
    const [courseTitle, setCourseTitle] = useState(props.courseSelected.title);
    const [courseDescription, setCourseDescription] = useState(props.courseSelected.description);

    const handleClose = () => props.setPainelUpdateCourse(false);
    const handleShow = () => setShow(true);

    const handleSubmitUpdateInfoCourse = async () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription
        };

        const courseSelected = queryClient.getQueryData(['Course-Selected']);
        //atualizar o titulo e descrição do curso selecionado
        courseSelected.title = courseTitle;
        courseSelected.description = courseDescription;
        //salvar o curso selecionado no cache
        queryClient.setQueryData(['Course-Selected'], courseSelected);
        //queryClient.invalidateQueries(['Course-Selected']);



        //Atualizar o titulo e descrição do curso no cache ['All-Categories']
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

        //Atualizar ["Category-Selected"] no cache
        const categorySelected = queryClient.getQueryData(['Category-Selected']);
        //verificar se a categoria selecionada é a mesma do curso selecionado
        if (categorySelected.id === categoryId) {
            //atualizar o titulo e descrição do curso selecionado
            categorySelected.courses.find(course => course.id === courseId).title = courseTitle;
            categorySelected.courses.find(course => course.id === courseId).description = courseDescription;
            //salvar a categoria selecionada no cache
            queryClient.setQueryData(['Category-Selected'], categorySelected);
        }

        //atualizar o cache ['Courses-Cached']
        let coursesCached = queryClient.getQueryData(['Courses-Cached']) || [];
        //atualizar o curso no cache
        let courseCached = coursesCached.find(course => course.id === courseId);
        courseCached.title = courseTitle;
        courseCached.description = courseDescription;
        //salvar o curso no cache
        queryClient.setQueryData(['Courses-Cached'], coursesCached);


        //atualizar Titulo e descrição do curso no banco de dados
       await controller.manageCourses.UpdateInfoCourse(courseId, categoryId, courseData);

       props.setPainelUpdateCourse(false);
            
        handleClose();

    };

    return (
        <>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '5px', width: '90%', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ borderBottom: '1px solid #f2f2f2', padding: '10px 15px' }}>
                            <h5  style={{ margin: 0, fontWeight: '500', fontSize: '1.25rem', color: '#333' }}>Atualizar informações</h5>
                            
                        </div>
                        <div className="modal-body" style={{display: 'flex', flexDirection: 'column'}}>
                            <textarea style={{color: 'black', margin: '5px', padding:'10px', borderRadius:'5px', border:'1px solid black'}} type="text" placeholder="Título do Curso" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                            <textarea style={{color: 'black', margin: '5px' , height:'15rem', padding:'10px', borderRadius:'5px', border:'1px solid black'}} type="text" placeholder="Descrição do Curso" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
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