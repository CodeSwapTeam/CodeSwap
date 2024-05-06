import React, { useState } from 'react';
import { updateModule } from '../../../../database/functions/Modules/manageModules';
import { useRouter } from 'next/navigation';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

function UpdateModuleModal({moduleSelected, setPanelUpdateModule}) {
    //console.log(moduleSelected);

    const controller = Controller();

    const queryClient = useQueryClient();

    const [moduleName, setModuleName] = useState(moduleSelected.title);
    const [moduleDescription, setModuleDescription] = useState(moduleSelected.description);

    const handleSubmit = async () => {
        const updatedModule = {
            title: moduleName,
            description: moduleDescription
        };
        await controller.manageModules.updateInfoModule(moduleSelected.courseId, moduleSelected.id, updatedModule);


        //ATUALIZAR ["Modules-Course"]
        const modulesCourseSelected = await queryClient.getQueryData(["Modules-Course"]);
        const moduleIndexCourse = modulesCourseSelected.findIndex(module => module.id === moduleSelected.id);
        const updatedModulesCourseSelected = [...modulesCourseSelected];
        updatedModulesCourseSelected[moduleIndexCourse] = { ...moduleSelected, title: moduleName, description: moduleDescription };
        queryClient.setQueryData(["Modules-Course"], updatedModulesCourseSelected);

        //atualizar a query ["Module-Selected"] com o novo modulo atualizado
        const moduleUpdated = await queryClient.getQueryData(['Module-Selected']);
        queryClient.setQueryData(['Module-Selected'], { ...moduleUpdated, title: moduleName, description: moduleDescription });

        const courseSelected = await queryClient.getQueryData(['Course-Selected']);
        const moduleIndex = courseSelected.modules.findIndex(module => module.id === moduleSelected.id);
        const updatedCourseSelected = { ...courseSelected };
        updatedCourseSelected.modules = [...courseSelected.modules];
        updatedCourseSelected.modules[moduleIndex] = { ...moduleSelected, title: moduleName, description: moduleDescription };

        //Atualizar o  modulos em ["Modules-Cached"] com o novo modulo atualizado
        const modulesCached = await queryClient.getQueryData(["Modules-Cached"]);
        //procurar o modulo no cache
        const moduleIndexCached = modulesCached.findIndex(module => module.id === moduleSelected.id);
        //atualizar o modulo no cache
        const updatedModulesCached = [...modulesCached];
        updatedModulesCached[moduleIndexCached] = { ...moduleSelected, title: moduleName, description: moduleDescription };
        queryClient.setQueryData(["Modules-Cached"], updatedModulesCached);
        //

        setModuleName('');
        setModuleDescription('');
        setPanelUpdateModule(false);



    };
    return (
    
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ backgroundColor: '#fff', borderRadius: '5px', width: '90%', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ borderBottom: '1px solid #f2f2f2', padding: '10px 15px' }}>
                    <h5 style={{ margin: 0, fontWeight: '500', fontSize: '1.25rem', color: '#333' }}>Atualizar Título de Descrição</h5>
                </div>

                <div >
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <input style={{color: 'black', margin: '5px', padding:'10px', borderRadius:'5px', border:'1px solid black'}} type="text" placeholder="Nome do Módulo" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                        <textarea style={{color: 'black', margin: '5px' , height:'15rem', padding:'10px', borderRadius:'5px', border:'1px solid black'}} type="text" placeholder="Descrição do Módulo" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={()=> setPanelUpdateModule(false)}>Fechar</button>
                        <button type="button" style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleSubmit}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
           
    
    );
}

export default UpdateModuleModal;