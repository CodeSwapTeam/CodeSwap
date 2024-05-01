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
      //pega os modulos do curso selecionado no cache local
      const modules = courseSelected.modules;

      return modules;
    }
  });

  if (modules) {
    //console.log('data modules: ', modules);
  }

  //Função para deletar um módulo
  const handleDeleteModule = useMutation({
    mutationFn: async (moduleId) => {


      //pegar no ["Modules-Course"] o array de modulos com o id do modulo deletado
      const moduleSelected = queryClient.getQueryData(["Modules-Course"]).find(module => module.id == moduleId);
      await controller.manageModules.DeleteModule(courseSelected.id, moduleId, moduleSelected);

      //pegar no ["Modules-Course"] o array de modulos com o id do modulo deletado
      const modulosFiltrados = queryClient.getQueryData(["Modules-Course"]).filter(module => module.id !== moduleId);
      //atualizar o cache local com os modulos atualizados
      queryClient.setQueryData(["Modules-Course"], modulosFiltrados);

      //remover de dentro de ["Course-Selected"] o modulo deletado
      const courseSelectedUpdated = courseSelected;
      courseSelectedUpdated.modules = courseSelected.modules.filter(module => module.id !== moduleId);
      queryClient.setQueryData(["Course-Selected"], courseSelectedUpdated);


    },
    onSuccess: (data, variables) => {



    }
  });

  const [panelManageModule, setPanelManageModule] = useState('modulesList');

  const handleManageModule = async (module) => {

    const moduleSelected = await controller.manageModules.GetModuleById(module.id);

    queryClient.setQueryData(['Module-Selected'], moduleSelected);

    setPanelManageModule('manageModule');
  }

  return (
    <Container >
      {panelManageModule === 'modulesList' ? (
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
                  <ManageButton onClick={()=>{setPanelManageModule('manageModule'); handleManageModule(module)}}>Gerenciar Módulo</ManageButton>
                  <DeleteButton onClick={() => handleDeleteModule.mutate(module.id)}>Excluir Módulo</DeleteButton>
                </ModuleContainer>
              ))
            ) : (
              <h2>Nenhum módulo cadastrado</h2>
            )}
          </div>
        </>) : (<ManageModule setPanelManageModule={setPanelManageModule} />)}

      <AddModuleModal />
    </Container>
  );
}

