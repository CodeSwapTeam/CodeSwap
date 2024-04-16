import React, { useState } from 'react';
import { createModule } from '../../../database/functions/createCourses';

function AddModuleModal(props) {
    const [show, setShow] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        console.log(props.courseId);
        const newModule = {
            nameModule: moduleName,
            description: moduleDescription,
            lessons: [
                {
                    nameLesson: '',
                    description: ''
                }
            ]
        };
        createModule(props.courseId, newModule);
        
        setModuleName('');
        setModuleDescription('');
        handleClose();
    };

    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Adicionar Modulo</button>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adicionar Módulo</h5>
                            
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                            <input type="text" placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}  onClick={handleSubmit}>Salvar Módulo</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddModuleModal;