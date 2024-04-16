import React, { useState } from 'react';
import { updateModule } from '../../../database/functions/createCourses';

function UpdateModuleModal(props) {
    const [show, setShow] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = () => {
        const updatedModule = {
            nameModule: moduleName,
            description: moduleDescription,
            lessons: []
        };
        updateModule(props.courseId, props.moduleId, updatedModule);
        
        setModuleName('');
        setModuleDescription('');
        handleClose();
    };
    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Atualizar Módulo</button>
            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Atualizar Módulo</h5>
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                            <input type="text" placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleSubmit}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateModuleModal;