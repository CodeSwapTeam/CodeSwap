import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Controller from '@/Controller/controller';

function AddModuleModal(props) {

    const controller = Controller();

    const [show, setShow] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        
        const newModule = {
            nameModule: moduleName,
            description: moduleDescription,
            courseId : props.courseId,
            id: '',
            lessons: [ ]
        };

        //prev => prev.concat(newModule)

        //props.setModules(prev => [...prev, newModule]);
        


        controller.manageModules.CreateModule(props.courseId, newModule);

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
                            
                        </div>
                        <div className="modal-body" style={{display:'flex', flexDirection: 'column'}}>
                            <input style={{margin:'4px', color: 'black'}} type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                            <input style={{margin:'4px', color: 'black'}}  type="text" placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
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