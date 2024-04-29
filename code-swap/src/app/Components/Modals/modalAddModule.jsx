import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from '@/app/contexts/ContextDataCache';

function AddModuleModal(props) {

    const controller = Controller();
    //const { modules, setModules } = ContextDataCache();

    const client = useQueryClient();

    const [show, setShow] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    //função mutate para criar um novo modulo

    const createModule = useMutation({
        mutationFn: async (data) => {
            const response = await controller.manageModules.CreateModule(data.courseId, data.newModule);
            return response;
        },
        onSuccess: (data) => {
            //setar os modulos no estado
            //setModules(data.modules);
            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries(["GetModules"]);
        }

    })
 
    //função que ira retornar o nivel de permisão do modulo
    const permissionModule = async () => {
        //pegar a quantidade de modulos do curso no cache local
        const modules = await controller.manageModules.GetModulesLocal();
        
        //pegar o tamanho do array de modulos
        const permission = modules.length + 1;
        console.log('permission', permission);

      
        
     
        return permission;
    }

    const handleSubmit = () => {
        permissionModule();

        const newModule = {
            nameModule: moduleName,
            description: moduleDescription,
            courseId: props.courseSelected.id,
            permission: 1,
            id: '',
            lessons: []
        };

        createModule.mutate({ courseId: props.courseSelected.id, newModule: newModule });

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
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column' }}>
                            <input style={{ margin: '4px', color: 'black' }} type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                            <input style={{ margin: '4px', color: 'black' }} type="text" placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Módulo</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddModuleModal;