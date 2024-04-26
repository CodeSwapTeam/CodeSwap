import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';

function UpdateCourseModal(props) {


    const controller = Controller();

    const [show, setShow] = useState(false);
    const [courseTitle, setCourseTitle] = useState(props.dataCourse.title);
    const [courseDescription, setCourseDescription] = useState(props.dataCourse.description);

    const handleClose = () => props.setPainelUpdateCourse(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription
        };
       await controller.manageCourses.UpdateCourse(props.courseId, props.courseCategory.id, courseData);
       props.setCourseSelected(courseData);
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
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Alterações</button>
                        </div>
                    </div>
                </div>
           
        </>
    );
}

export default UpdateCourseModal;