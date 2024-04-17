import React, { useState } from 'react';
import { updateLesson } from '../../../database/functions/createCourses';
import { useRouter } from 'next/navigation';
import { useRouter as rt } from 'next/router';

function UpdateLessonModal(props) {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        const updatedLesson = {
            nameLesson: lessonTitle,
            description: lessonDescription
        };
        updateLesson(props.courseId, props.moduleId, props.lessonId, updatedLesson);
        handleClose();
        
    };

    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Atualizar</button>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atualizar Aula</h5>
                            <button type="button" className="close" onClick={handleClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Título da Lição" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
                            <input type="text" placeholder="Descrição da Lição" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} />
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

export default UpdateLessonModal;