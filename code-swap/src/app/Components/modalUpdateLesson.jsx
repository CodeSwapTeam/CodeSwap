import React, { useState } from 'react';
import { updateLesson } from '../../../database/functions/createCourses';
import { useRouter } from 'next/navigation';

function UpdateLessonModal(props) {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [lessonTitle, setLessonTitle] = useState();
    const [lessonDescription, setLessonDescription] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        const updatedLesson = {
            title: lessonTitle,
            description: lessonDescription
        };
        updateLesson(props.courseId, props.moduleId, props.lessonId, updatedLesson);
        handleClose();
        router.push('/')
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
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Fechar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateLessonModal;