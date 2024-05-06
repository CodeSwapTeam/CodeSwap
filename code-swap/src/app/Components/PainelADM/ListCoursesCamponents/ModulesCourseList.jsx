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
    background-color: #0f1425d6;
`;

const Button = styled.button`

  margin: 10px;
  align-self: flex-start;
  font-size: calc(1em + 1vw); // Ajusta o tamanho da fonte com base na largura da viewport
  @media (max-width: 600px) {
    align-self: center;
  }

  border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        color: #04ff02;
        
        transform: scale(1.05);
        box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;

const DeleteButton = styled.button`

    top: 5px;
    right: 5px;

    &:hover {
        color: red;
    }
`;

const ManageButton = styled.button`
margin: 10px;
align-self: center;
font-size: calc(0,5em + 1vw); // Ajusta o tamanho da fonte com base na largura da viewport
@media (max-width: 600px) {
  align-self: center;
}

border: 1px solid white;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #020a29;
  color: #04ff02;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
      color: #04ff02;
      
      transform: scale(1.05);
      box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
  }

  @media (max-width: 600px) {
      font-size: 0.8rem;
  }
`;



const ModulesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  background-color: #00000063;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid green;
    transform: scale(1.01);
    box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ModuleTitle = styled.h2`
  font-weight: bold;
  color: #07ff07;
`;

const Title = styled.h4`
  text-align: center;
  width: 100%;
  font-size: calc(1.2em + 1.2vw); // Ajusta o tamanho da fonte com base na largura da viewport
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

        const modules = await fetch(`/api/gets?id=${courseSelected.id}&type=courseId`);
        const data = await modules.json();
        return data[0].modules;

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
    mutationFn: async (moduleToDelete) => {
      await controller.manageModules.DeleteModule(courseSelected.id, moduleToDelete);
  
      // Criar uma cópia do array de módulos
      const modulesCourse = [...courseSelected.modules];
      // Remover o módulo do array de módulos
      const updatedModules = modulesCourse.filter(module => module.id !== moduleToDelete.id);
  
      // Atualizar os módulos dentro do curso selecionado
      const updatedCourse = { ...courseSelected, modules: updatedModules };
      queryClient.setQueryData(["Course-Selected"], updatedCourse);
      queryClient.invalidateQueries(["Course-Selected"]);
  
      //Atualizar o cache ["Courses-Cached"] dentro do curso selecionado com os modulos
      const coursesCached = queryClient.getQueryData(["Courses-Cached"]) || [];
      const updatedCoursesCached = coursesCached.map(course => 
        course.id === courseSelected.id ? { ...course, modules: updatedModules } : course
      );
      queryClient.setQueryData(["Courses-Cached"], updatedCoursesCached);
      queryClient.invalidateQueries(["Courses-Cached"]);
    }
  });


  const handleManageModule = async (moduleId) => {
    // Obter o array de módulos cacheados
    let modulesCached = queryClient.getQueryData(['Modules-Cached']) || [];

    // Tentar encontrar o módulo no cache
    let module = modulesCached.find(module => module.id === moduleId);
    if(module){
      // Setar o módulo selecionado no estado local
      queryClient.setQueryData(['Module-Selected'], module);
  
      // Atualizar o painel selecionado
      setSelectedPainel('ModuleDescription');
    }
    // Se o módulo não estiver no cache, buscar o módulo na API
    if (!module) {
        module = await controller.manageModules.GetModuleById(moduleId);
        // Adicionar o novo módulo ao array de módulos cacheados
        modulesCached = [...modulesCached, module[0]];

        // Atualizar o cache com o novo array de módulos
        queryClient.setQueryData(['Modules-Cached'], modulesCached);
        queryClient.setQueryData(['Module-Selected'], module[0]);
        // Atualizar o painel selecionado
      setSelectedPainel('ModuleDescription');
    }

};

  return (
    <Container >

      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button onClick={() => { setSelectedPainel('CourseDescription') }} >Voltar </Button>
          <Title>{courseSelected?.title} </Title>
          <div></div>
        </div>
        <ModulesList>
          {modules && modules.length > 0 ? (
            modules.map((module, index) => (
              <ModuleContainer key={index}>
                <ModuleTitle>{module.title}</ModuleTitle>
                <p>{module.description}</p>
                <ManageButton onClick={() => { handleManageModule(module.id) }}>Gerenciar Módulo</ManageButton>
                <DeleteButton onClick={() => handleDeleteModule.mutate(module)}>Excluir Módulo</DeleteButton>
              </ModuleContainer>
            ))
          ) : (
            <h2>Nenhum módulo cadastrado</h2>
          )}
        </ModulesList>
      </>

      <AddModuleModal />
    </Container>
  );
}

