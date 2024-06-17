import styled from 'styled-components';
import { ContextDataCache } from "@/app/Providers/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useEffect, useState } from 'react';
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

// Subject
const Subject = () => {
  const observers = useRef([]);

  const subscribe = (observer) => {
    observers.current = [...observers.current, observer];
  };

  const unsubscribe = (observer) => {
    observers.current = observers.current.filter((obs) => obs !== observer);
  };

  const notify = (data) => {
    observers.current.forEach((observer) => observer(data));
  };

  return { subscribe, unsubscribe, notify };
};


export default function ModulesCourseList({ panelSubject }) {
  
  const controller = Controller();
  const queryClient = useQueryClient();
  const courseSelected = queryClient.getQueryData(["Course-Selected"]);
  const subject = Subject();

  useEffect(() => {
    // Observer
    const observer = (data) => {
      console.log('Notified with data:', data);
      // Atualizar o painel selecionado
      panelSubject.notify('ModuleDescription');
    };

    subject.subscribe(observer);

    return () => {
      subject.unsubscribe(observer);
    };
  }, [subject]);


  //Função para buscar os módulos de um curso
  const { data: modules } = useQuery({
    queryKey: ["Modules-Course", courseSelected.id],
    queryFn: async () => {
      try {
        console.log('Buscando módulos do curso:', courseSelected.id);
        const modules = await fetch(`/api/gets?id=${courseSelected.id}&type=courseId`);
        
        const data = await modules.json();
        console.log(data[0].modules);
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
      await controller.manageModules.DeleteModule(courseSelected.id, moduleToDelete.id);
      await controller.manageCourses.RemoveCourseModule(courseSelected.id, moduleToDelete.id);
      queryClient.invalidateQueries(["Modules-Course"]);
    }
  });


  const handleManageModule = async (module, controller) => {  
        module = await controller.manageModules.GetModuleById(module.id);
        queryClient.setQueryData(['Module-Selected'], module[0]);
        // Atualizar o painel selecionado
        panelSubject.notify('ModuleDescription');
    

};

  return (
    <Container >

      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button onClick={() => { panelSubject.notify('ModuleDescription')}} >Voltar </Button>
          <Title>{courseSelected?.title} </Title>
          <div></div>
        </div>
        <ModulesList>
          {modules && modules.length > 0 ? (
            modules.map((module, index) => (
              <ModuleContainer key={index}>
                <ModuleTitle>{module.title}</ModuleTitle>
                <p>{module.description}</p>
                <ManageButton onClick={() => { handleManageModule(module, controller) }}>Gerenciar Módulo</ManageButton>
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

