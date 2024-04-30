import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from '@/app/contexts/ContextDataCache';

function AddModuleModal(props) {

    const controller = Controller();
    const { moduleSelected , setModuleSelected, courseSelected, setCourseSelected} = ContextDataCache();

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

            //adicionar no curso selecionado o modulo criado
            setCourseSelected({...courseSelected, modules: [...courseSelected.modules, { id: response.id, title: response.nameModule, description: response.description }]});

            return response;
        },
        onSuccess: (data) => {
            

            // Invalidate a query 'ListCourses' após a deleção do curso
            client.invalidateQueries(["GetModules"]);
        }

    })
    //console.log('courseSelected: ', props.courseSelected);
    
    //função que ira retornar o nivel de permisão do modulo
    const permissionModule = async () => {
        let permission = 0;
        if(props.courseSelected.SequentialModule){
        //pegar a quantidade de modulos do curso no cache local
        const modules = await controller.manageModules.GetModulesLocal();

        
        //pegar o tamanho do array de modulos
         permission = modules.length + 1;
         console.log('permission: ', permission);
        
        }else{
            permission = 1;
        }
      
        
     
        return permission;
    }

    const handleSubmit = async () => {
        

        const newModule = {
            nameModule: moduleName,
            description: moduleDescription,
            courseId: props.courseSelected.id,
            permission: await permissionModule(),
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