import styled from 'styled-components';
import { ContextDataCache } from "@/app/contexts/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useState } from 'react';
import UpdateModuleModal from '../../Modals/modalUpdateModule';


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

export default function ManageModule({setSelectedPainel}) {

  const controller = Controller();
  const queryClient = useQueryClient();

  const { data : moduleSelected, isLoading } = useQuery({
    queryKey: ['Module-Selected'],
    queryFn: async () => {
      const moduleSelected = await queryClient.getQueryData(['Module-Selected']);
      return moduleSelected || {}; // retorna um objeto vazio se moduleSelected for undefined
    }
  });

  if(isLoading) {
    return <div>Carregando...</div>; // ou qualquer outro componente de carregamento
  }

  //if(moduleSelected) console.log(moduleSelected);

  const [panelUpdateModule, setPanelUpdateModule] = useState(false);

  return (
    <Container >
      {!panelUpdateModule ? (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px', alignSelf: 'flex-start' }} onClick={() => setSelectedPainel('Modules')} >Voltar </button>
          <h4 style={{ textAlign: 'center', width: '100%' }}>{moduleSelected?.title}</h4>
          <div style={{ width: 'same-as-button' }}></div>
        </div>

        <p>{moduleSelected.description}</p>
        <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px', alignSelf: 'flex-start' }} onClick={() => setPanelUpdateModule(true)} >Atualizar Informações </button>

      </>
    ) : ( <UpdateModuleModal moduleSelected={moduleSelected} setPanelUpdateModule={setPanelUpdateModule} /> )}
      
     

    </Container>
  );
}