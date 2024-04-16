import React, { useState } from 'react';
import { updateCourse } from '../../../database/functions/createCourses';

function UpdateCourseModal(props) {
    const [show, setShow] = useState(false);
    const [courseTitle, setCourseTitle] = useState();
    const [courseDescription, setCourseDescription] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription
        };
        updateCourse(props.courseId, courseData);
        handleClose();
    };

    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Atualizar Curso</button>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atualizar Curso</h5>
                            
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Título do Curso" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                            <input type="text" placeholder="Descrição do Curso" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateCourseModal;