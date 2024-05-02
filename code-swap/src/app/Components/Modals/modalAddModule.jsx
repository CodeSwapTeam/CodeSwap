import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from '@/app/contexts/ContextDataCache';

function AddModuleModal() {

    const controller = Controller();

    const queryClient = useQueryClient();

    const courseSelected = queryClient.getQueryData(["Course-Selected"]);

    const [show, setShow] = useState(false);
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    //função mutate para criar um novo modulo

    const createModuleMutate = useMutation({
        mutationFn: async (data) => {

            const newModule = {
                title: moduleName,
                description: moduleDescription,
                id: data.moduleId,            
            };

            //pegar os modulos do cache local do clientQuery
            const modulesCourse = courseSelected.modules;
            //adicionar o novo modulo no array de modulos
            modulesCourse.push(newModule);
            //atualizar os modulos dentro do curso selecionado
            queryClient.setQueryData(["Course-Selected"], courseSelected);  
            
            //adicionar o nodulo novo em ["Modules-Course"] junto com os modulos antigos
            queryClient.invalidateQueries(["Modules-Course"]);
            
            
        },
        onSuccess: (data) => {
            

        }

    })

    
    //função que ira retornar o nivel de permisão do modulo
    const permissionModule = async () => {
        let permission = 0;
        if(courseSelected.SequentialModule){
        //pegar a quantidade de modulos do curso no cache local
        const modules = courseSelected.modules;
        
        //pegar o tamanho do array de modulos
         permission = modules.length + 1;
        
        }else{
            permission = 1;
        }
        return permission;
    }

    const handleSubmit = async () => {
        
    
        const newModule = {
            title: moduleName,
            description: moduleDescription,
            courseId: courseSelected.id,
            id: '',
            permission: await permissionModule(),
            lessons: []
        };
    
        const moduleID = await controller.manageModules.CreateModule(courseSelected.id, newModule);

        createModuleMutate.mutate({courseID: courseSelected.id, moduleId: moduleID, module: newModule});

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