import styled from 'styled-components';
import { ContextDataCache } from "@/app/contexts/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useState } from 'react';
import ManageModule from '../ManageModule/ManageModule';


const Container = styled.div`
    flex: 80%;
    border: 2px solid white;
    padding: 10px;
    color: white;
    text-align: center;
    background-color: #0034f35c;
`;

const ModuleContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
 
    background-color: #020a29;
    border-radius: 5px;
`;

const DeleteButton = styled.button`

    top: 5px;
    right: 5px;

    &:hover {
        color: red;
    }
`;

const ManageButton = styled.button`
    border: 1px solid white;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;

    &:hover {
        background-color: #00ff375c;
    }
`;

export default function ModulesCourseList({ setSelectedPainel }) {

  const controller = Controller();
  const queryClient = useQueryClient();

  const courseSelected = queryClient.getQueryData(["Course-Selected"]);

  //Função para buscar os módulos de um curso
const { data: modules } = useQuery({
  queryKey: ["Modules-Course"],
  queryFn: async () => {
    try {  
      const modules = await controller.manageModules.GetModules(courseSelected.id); 

      return modules  // Retornar um array vazio se modules for undefined
    } catch (error) {
      console.error('Error fetching modules:', error);
      // Retornar um array vazio em caso de erro
      return [];
    }
  },
  staleTime: 1000 * 60 * 5 // 5 minutos
});

  //Função para deletar um módulo
  const handleDeleteModule = useMutation({
    mutationFn: async (module) => {
      await controller.manageModules.DeleteModule(courseSelected.id, module);

      queryClient.invalidateQueries(["Modules-Course"]);

      const courseSelectedUpdated = courseSelected;
      courseSelectedUpdated.modules = courseSelected.modules.filter(module => module.id !== module.id);
      queryClient.setQueryData(["Course-Selected"], courseSelectedUpdated);
    }
  });


  const handleManageModule = async (moduleId) => {
    // Obter o array de módulos cacheados
    let modulesCached = queryClient.getQueryData(['Modules-Cached']) || [];

    // Tentar encontrar o módulo no cache
    let module = modulesCached.find(module => module.id === moduleId);

    // Se o módulo não estiver no cache, buscar o módulo na API
    if (!module) {
        module = await controller.manageModules.GetModuleById(moduleId);

        // Adicionar o novo módulo ao array de módulos cacheados
        modulesCached = [...modulesCached, module];

        // Atualizar o cache com o novo array de módulos
        queryClient.setQueryData(['Modules-Cached'], modulesCached);
    }

    // Setar o módulo selecionado no estado local
    queryClient.setQueryData(['Module-Selected'], module);

    // Atualizar o painel selecionado
    setSelectedPainel('ModuleDescription');
};

  return (
    <Container >
      
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px', alignSelf: 'flex-start' }} onClick={() => { setSelectedPainel('CourseDescription') }} >Voltar </button>
            <h1>{courseSelected.title} </h1>
            <div></div>
          </div>
          <div style={{ display: 'flex' }}>
            {modules && modules.length > 0 ? (
              modules.map((module, index) => (
                <ModuleContainer key={index} >
                  <h2 style={{ font: 'bold', color: '#07ff07' }}>{module.title}</h2>
                  <p>{module.description}</p>
                  <ManageButton onClick={()=>{ handleManageModule(module.id)}}>Gerenciar Módulo</ManageButton>
                  <DeleteButton onClick={() => handleDeleteModule.mutate(module)}>Excluir Módulo</DeleteButton>
                </ModuleContainer>
              ))
            ) : (
              <h2>Nenhum módulo cadastrado</h2>
            )}
          </div>
        </>

      <AddModuleModal />
    </Container>
  );
}

