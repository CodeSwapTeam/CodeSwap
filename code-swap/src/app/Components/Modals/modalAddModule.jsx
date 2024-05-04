"use client";
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import styled from 'styled-components';

const AddModuleButton = styled.button`
    border: 1px solid white;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
        color: #04ff02;
        font-weight: bold;
        transform: scale(1.05);
        box-shadow: 0px 0px 2px #04ff02;
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;

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
      
          // Criar uma cópia do array de módulos
          const modulesCourse = [...courseSelected.modules];
          // Adicionar o novo módulo no array de módulos
          modulesCourse.push(newModule);
      
          // Atualizar os módulos dentro do curso selecionado
          const updatedCourse = { ...courseSelected, modules: modulesCourse };
          queryClient.setQueryData(["Course-Selected"], updatedCourse);  
      
          // Adicionar o módulo novo em ["Modules-Course"] ...mais os módulos existentes
          queryClient.setQueryData(["Modules-Course"], modulesCourse);
        },
        onSuccess: (data) => {
          //queryClient.invalidateQueries(["Modules-Course"]);
        }
      });

    
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
            <AddModuleButton  onClick={handleShow}>Adicionar Modulo</AddModuleButton>

            {show && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '5px', maxWidth: '500px', width: '90%', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
                    <div className="modal-header">

                    </div>
                    <div className="modal-header" style={{ borderBottom: '1px solid #f2f2f2', padding: '10px 15px' }}>
                <h5 className="modal-title" style={{ margin: 0, fontWeight: '500', fontSize: '1.25rem', color: '#333' }}>Adicionar Módulo</h5>
              </div>
                    <div  style={{ display: 'flex', flexDirection: 'column' }}>
                        <input style={{ margin: '10px', color: 'black' }} type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                        <textarea style={{ margin: '10px', color: 'black', height:'100px' }} placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />                    </div>
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