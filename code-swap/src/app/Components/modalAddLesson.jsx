import React, { useState } from 'react';
import { createLesson } from '../../../database/functions/createCourses';

function AddLessonModal(props) {
    const [show, setShow] = useState(false);
    const [lessonName, setLessonName] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        const lessonData = {
            nameLesson: lessonName,
            description: lessonDescription
        };
        createLesson(props.courseId, props.moduleId, lessonData)
        setLessonName('');
        setLessonDescription('');
        handleClose();
    };

    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Adicionar Lição</button>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adicionar Aula</h5>
                            
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Nome da Lição" value={lessonName} onChange={(e) => setLessonName(e.target.value)} />
                            <input type="text" placeholder="Descrição da Lição" value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Lição</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddLessonModal;