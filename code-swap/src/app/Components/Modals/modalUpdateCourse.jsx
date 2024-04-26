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

    const handleSubmit = () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription
        };
       // controller.manageCourses.updateCourse(props.courseId, courseData);
         props.setPainelUpdateCourse(false);
         
       
        handleClose();
      console.log(courseData);
    };

    return (
        <>
            

            
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atualizar Curso</h5>
                            
                        </div>
                        <div className="modal-body" style={{display: 'flex', flexDirection: 'column'}}>
                            <input style={{color: 'black', margin: '5px'}} type="text" placeholder="Título do Curso" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                            <input style={{color: 'black', margin: '5px'}} type="text" placeholder="Descrição do Curso" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
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