import styled from 'styled-components';
import { ContextDataCache } from "@/app/contexts/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useState } from 'react';
import UpdateModuleModal from '../../Modals/modalUpdateModule';
import AddLessonModal from '../../Modals/modalAddLesson';


const Container = styled.div`
    flex: 80%;
    border: 2px solid white;
    padding: 10px;
    color: white;
    text-align: center;
    background-color: #0f1425d6;
`;

const LessonContainer = styled.div`
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


  const { data: moduleSelected, isLoading } = useQuery({
    queryKey: ['Module-Selected'],
    queryFn: async () => {
      const moduleSelected = await queryClient.getQueryData(['Module-Selected']);
      console.log(moduleSelected);
      return moduleSelected || {}; // retorna um objeto vazio se moduleSelected for undefined
    }
  });

  const {data : lessonsModule} = useQuery({
    queryKey: ['Lessons-Module'],
    queryFn: async () => {
      const Lessons = await controller.manageModules.GetLessonsModule(moduleSelected.id);

      return Lessons || {}; // retorna um objeto vazio se moduleSelected for undefined
    }
  });

  //if(lessonsModule) console.log(lessonsModule)



  const selectLesson = async (lesson) => {
    //console.log('Lesson Selected: ', lesson);
    await queryClient.setQueryData(['Lesson-Selected'], lesson);
    setSelectedPainel('Lesson');
  };

  if (isLoading) {
    return <div>Carregando...</div>; // ou qualquer outro componente de carregamento
  }

  //if(moduleSelected) console.log(moduleSelected);

  const [panelUpdateModule, setPanelUpdateModule] = useState(false);

  const [permissionModule, setPermissionModule] = useState(moduleSelected.permission);
  //Codes do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 0
  const [codesModule, setCodesModule] = useState(moduleSelected.codes || 0);
  //XP do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 0
  const [xpModule, setXpModule] = useState(moduleSelected.xp || 0);
  //Dificuldade do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 'iniciante'
  const [difficultyModule, setDifficultyModule] = useState(moduleSelected.difficulty || 'iniciante');
  //Observações do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar ''
  const [moduleObservations, setModuleObservations] = useState(moduleSelected.observations || '');


  const handleSelectChange = (event) => {
    setDifficultyModule(event.target.value);
  };

  
  //Função para atualizar as informações do módulo
  const handleUpdateModule = async () => {
    const updatedModule = {
      permission: permissionModule,
      xp: xpModule,
      codes: codesModule,
      difficulty: difficultyModule,
      observations: moduleObservations
    };

    await controller.manageModules.UpdateModuleSettings(moduleSelected.courseId, moduleSelected.id, updatedModule);

    //ATUALIZAR ["Modules-Course"]
    const modulesCourseSelected = await queryClient.getQueryData(["Modules-Course"]);
    const moduleIndexCourse = modulesCourseSelected.findIndex(module => module.id === moduleSelected.id);
    modulesCourseSelected[moduleIndexCourse] = { ...moduleSelected, permission: permissionModule, xp: xpModule, codes: codesModule, difficulty: difficultyModule, observations: moduleObservations };
    queryClient.setQueryData(["Modules-Course"], modulesCourseSelected);

    //atualizar a query ["Module-Selected"] com o novo modulo atualizado
    const moduleUpdated = await queryClient.getQueryData(['Module-Selected']);
    queryClient.setQueryData(['Module-Selected'], { ...moduleUpdated, permission: permissionModule, xp: xpModule, codes: codesModule, difficulty: difficultyModule, observations: moduleObservations });

    const courseSelected = await queryClient.getQueryData(['Course-Selected']);
    const moduleIndex = courseSelected.modules.findIndex(module => module.id === moduleSelected.id);
    courseSelected.modules[moduleIndex] = { ...moduleSelected, permission: permissionModule, xp: xpModule, codes: codesModule, difficulty: difficultyModule, observations: moduleObservations };

    //Atualizar o  modulos em ["Modules-Cached"] com o novo modulo atualizado
    const modulesCached = await queryClient.getQueryData(["Modules-Cached"]);
    //procurar o modulo no cache
    const moduleIndexCached = modulesCached.findIndex(module => module.id === moduleSelected.id);
    //atualizar o modulo no cache
    modulesCached[moduleIndexCached] = { ...moduleSelected, permission: permissionModule, xp: xpModule, codes: codesModule, difficulty: difficultyModule, observations: moduleObservations };
    queryClient.setQueryData(["Modules-Cached"], modulesCached);
    //
  };



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
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>XP do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={xpModule} onChange={(e) => setXpModule(e.target.value)} /></label>
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

            <div style={{ margin: '5px', marginTop: '20px', border: '2px solid black', width: '55%', borderRadius: '5px', boxShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00' }}>
              <h2>Aulas</h2>


              {lessonsModule && lessonsModule.length > 0 ? (
                lessonsModule.map((lesson, index) => (
                  <LessonContainer key={index} >
                    <h2 style={{ font: 'bold', color: '#07ff07' }}>{lesson.nameLesson}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                      <ManageButton onClick={() => { () => selectLesson(lesson) }} >Gerenciar Aula</ManageButton>
                      <DeleteButton onClick={() => console.log('Excluir Aula')} >Excluir Aula</DeleteButton>
                    </div>
                  </LessonContainer>

                ))
              ) : (<h2>Nenhuma aula cadastrada</h2>)}
                <AddLessonModal courseId={moduleSelected.courseId} moduleId={moduleSelected.id} />
            </div>
          </div>


          <button style={{ marginTop: '20px', backgroundColor: 'blue', padding: '5px', borderRadius: '5px', alignSelf: 'flex-start' }} onClick={() => handleUpdateModule()} >Salvar Módulo </button>

        </>
      ) : (<UpdateModuleModal moduleSelected={moduleSelected} setPanelUpdateModule={setPanelUpdateModule} />)}



    </Container>
  );
}