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
    background-color: #0f1425d6;
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

export default function ManageModule({ setSelectedPainel }) {

  const controller = Controller();
  const queryClient = useQueryClient();

  const [lessons, setLessons] = useState([]);

  const { data: moduleSelected, isLoading } = useQuery({
    queryKey: ['Module-Selected'],
    queryFn: async () => {
      const moduleSelected = await queryClient.getQueryData(['Module-Selected']);

      //pegar as aulas do módulo
      const lessons = moduleSelected.lessons;
      setLessons(lessons);

      return moduleSelected || {}; // retorna um objeto vazio se moduleSelected for undefined
    }
  });

  if (isLoading) {
    return <div>Carregando...</div>; // ou qualquer outro componente de carregamento
  }

  if(moduleSelected) console.log(moduleSelected);

  const [panelUpdateModule, setPanelUpdateModule] = useState(false);

  const [permissionModule, setPermissionModule] = useState(moduleSelected.permission);
  const [codesModule, setCodesModule] = useState(0);
  const [difficultyModule, setDifficultyModule] = useState('iniciante');
  const handleSelectChange = (event) => {
    setDifficultyModule(event.target.value);
  };

  const [moduleObservations, setModuleObservations] = useState('');



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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div style={{
              padding:'5px',
              margin: '5px',
              marginTop: '20px',
              border: '2px solid black',
              borderRadius: '5px',
              width: '40%',
              boxShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00'
            }}>
              <label style={{  display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Permissão do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={permissionModule} onChange={(e) => setPermissionModule(e.target.value)} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>XP do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={permissionModule} onChange={(e) => setPermissionModule(e.target.value)} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Codes do módulo:<input type="number" style={{ width: '100px', color: "black" }} value={codesModule} onChange={(e) => setCodesModule(e.target.value)} /></label>
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Nível de dificuldade do Módulo:</label>
                <select style={{ color: 'black', marginBottom: '10px' }} value={difficultyModule} onChange={handleSelectChange}>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediário">Intermediário</option>
                  <option value="avançado">Avançado</option>
                </select>
              </div>

              <textarea style={{padding:'5px',borderRadius: '5px',color: 'black', height: '10rem', width: '100%' }} type="text" placeholder="Observações do Curso" value={moduleObservations} onChange={(e) => setModuleObservations(e.target.value)} />

            </div>

            <div style={{margin: '5px', marginTop: '20px', border: '2px solid black' , width: '55%',borderRadius: '5px', boxShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00'}}>
                <h2>Aulas</h2>

            {lessons && lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <ModuleContainer key={index} >
                  <h2 style={{ font: 'bold', color: '#07ff07' }}>{lesson.title}</h2>
                  <p>{lesson.description}</p>
                  <ManageButton onClick={() => { console.log('Gerenciar Aula') }} >Gerenciar Aula</ManageButton>
                  <DeleteButton onClick={() => console.log('Excluir Aula')} >Excluir Aula</DeleteButton>
                </ModuleContainer>
              ))
            ) : (
              <h2>Nenhuma aula cadastrada</h2>
            )}
                
            </div>
            
          </div>


          <button style={{ marginTop: '20px', backgroundColor: 'blue', padding: '5px', borderRadius: '5px', alignSelf: 'flex-start' }} onClick={() => console.log('Atualizar informações do módulo')} >Salvar Módulo </button>

        </>
      ) : (<UpdateModuleModal moduleSelected={moduleSelected} setPanelUpdateModule={setPanelUpdateModule} />)}



    </Container>
  );
}