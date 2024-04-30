import styled from 'styled-components';
import { ContextDataCache } from "@/app/contexts/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useState } from 'react';


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

export default function ManageModule() {
  const controller = Controller();

  const { courseSelected, setModuleSelected } = ContextDataCache();
  const client = useQueryClient();

  //Função para buscar os módulos de um curso
  const { data : modules } = useQuery({
    queryKey: ["GetModules"],
    queryFn: async () => {
      console.log('courseSelected: ', courseSelected);
      //pega os modulos do curso selecionado no cache local
      const modules = courseSelected.modules;
      if (modules) {
        setModuleSelected(modules);
      }

      return modules;
    }
  });

  if(modules){
    //console.log('data modules: ', modules);
  }

  //Função para deletar um módulo
  const handleDeleteModule = useMutation({
    mutationFn: async (data) => {
      await controller.manageModules.DeleteModule(data.courseID, data.moduleId );
    },
    onSuccess: (data, variables) => {
      
      // Invalidate a query 'ListCourses' após a deleção do curso
      client.invalidateQueries(["GetModules"]);

      // Remove o módulo deletado do estado local
      //setModules(modules => modules.filter(module => module.id !== variables.moduleId));
    }
  });

  return (
    <Container >
      <h1>Gerenciar Módulos</h1>
      <div style={{ display: 'flex' }}>
        {modules && modules.length > 0 ? (
          modules.map((module, index) => (
            <ModuleContainer key={index} >
              <h2 style={{ font: 'bold', color: '#07ff07'}}>{module.title}</h2>
              <p>{module.description}</p>
              <ManageButton >Gerenciar Módulo</ManageButton>
              <DeleteButton onClick={()=> handleDeleteModule.mutate({courseID:courseSelected.id, moduleId: module.id})}>Excluir Módulo</DeleteButton>
            </ModuleContainer>
          ))
        ) : (
          <h2>Nenhum módulo cadastrado</h2>
        )}
      </div>
      <AddModuleModal courseSelected={courseSelected} />
    </Container>
  );
}