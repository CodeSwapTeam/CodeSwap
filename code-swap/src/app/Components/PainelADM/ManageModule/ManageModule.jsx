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

  const [panelUpdateModule, setPanelUpdateModule] = useState(false);

  const [permissionModule, setPermissionModule] = useState(0);
  //Codes do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 0
  const [codesModule, setCodesModule] = useState(0);
  //XP do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 0
  const [xpModule, setXpModule] = useState(0);
  //Dificuldade do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar 'iniciante'
  const [difficultyModule, setDifficultyModule] = useState('');
  //Observações do modulo quando carregar o modulo selecionado do cache, caso não tenha valor, setar ''
  const [moduleObservations, setModuleObservations] = useState('');


  const { data: moduleSelected, isLoading } = useQuery({
    queryKey: ['Module-Selected'],
    queryFn: async () => {
      const moduleSelected = await queryClient.getQueryData(['Module-Selected']);
      const module = moduleSelected || {}; // retorna um objeto vazio se moduleSelected for undefined
      
      setPermissionModule(module.permission);
      setXpModule(module.experience);
      setCodesModule(module.codes);
      setDifficultyModule(module.difficulty);
      setModuleObservations(module.moduleObservations);

      const Lessons = await controller.manageModules.GetLessonsModule(module.id);
      queryClient.setQueryData(['Lessons-Module'], Lessons);


      return module || {}; // retorna um objeto vazio se moduleSelected for undefined
    }
  });

  const {data : lessonsModule} = useQuery({
    queryKey: ['Lessons-Module'],
    queryFn: async () => {
      const lessons = queryClient.getQueryData(['Lessons-Module']);
      return lessons || [];

    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });


  const selectLesson = async (lesson) => {
    await queryClient.setQueryData(['Lesson-Selected'], lesson);
    setSelectedPainel('Lesson');
  };

  if (isLoading) {
    return <div>Carregando...</div>; // ou qualquer outro componente de carregamento
  }


  const handleSelectChange = (event) => {
    setDifficultyModule(event.target.value);
  };

  
  //Função para atualizar as informações do módulo
  const handleUpdateModule = async () => {
    const updatedModule = {
      permission: permissionModule,
      experience: xpModule,
      codes: codesModule,
      difficulty: difficultyModule,
      moduleObservations: moduleObservations
    };

    await controller.manageModules.UpdateModuleConfigs(moduleSelected.id, updatedModule);

    //atualizar a query ["Module-Selected"] com o novo modulo atualizado
    let moduleUpdated = await queryClient.getQueryData(['Module-Selected']);
    moduleUpdated = { ...moduleUpdated, ...updatedModule };
    queryClient.setQueryData(['Module-Selected'], moduleUpdated);

    //Atualizar o  modulos em ["Modules-Cached"] com o novo modulo atualizado
    let modulesCached = await queryClient.getQueryData(["Modules-Cached"]);

    //procurar dentro  do array o objeto do modulo no cache que contenha o id do modulo selecionado
    const moduleCache = modulesCached.find(module => module.id === moduleSelected.id);

    //se o modulo estiver no cache, atualizar o modulo no cache
    if (moduleCache) {
      const modulesUpdated = modulesCached.map(module => {
        if (module.id === moduleSelected.id) {
          return { ...module, ...updatedModule };
        }
        return module;
      });
      queryClient.setQueryData(["Modules-Cached"], modulesUpdated);
    }
  };

  //Função apra deletar a aula
  const handleDeleteLesson = async (lessonToDelete) => {
    await controller.manageLessons.DeleteLesson(moduleSelected.id, lessonToDelete.id);

    // Atualizar ["Lessons-Module"]
    const lessonsModule = [...queryClient.getQueryData(['Lessons-Module'])];
    const lessonIndex = lessonsModule.findIndex(lesson => lesson.id === lessonToDelete.id);

    if (lessonIndex !== -1) {
      lessonsModule.splice(lessonIndex, 1);
      queryClient.setQueryData(['Lessons-Module'], lessonsModule);
    }

    //Deletar do ["Module-Selected"]
    let moduleSelectedCached = await queryClient.getQueryData(['Module-Selected']);
    //copiar o objeto para não alterar o original
    const moduleSelectedObj = { ...moduleSelectedCached };
    const lessons = moduleSelectedObj.lessons;
    const lessonIndexModule = lessons.findIndex(lesson => lesson.id === lessonToDelete.id);
    if (lessonIndexModule !== -1) {
      lessons.splice(lessonIndexModule, 1);
      queryClient.setQueryData(['Module-Selected'], moduleSelected);
    }
    
    //deletar de ["Modules-Cached"]
    let modulesCached = await queryClient.getQueryData(["Modules-Cached"]);
    //copiar o objeto para não alterar o original
    modulesCached = [...modulesCached];
    const moduleCache = modulesCached.find(module => module.id === moduleSelected.id);
    if (moduleCache) {
      const lessonsCache = moduleCache.lessons;
      const lessonIndexCache = lessonsCache.findIndex(lesson => lesson.id === lessonToDelete.id);
      if (lessonIndexCache !== -1) {
        lessonsCache.splice(lessonIndexCache, 1);
        queryClient.setQueryData(["Modules-Cached"], modulesCached);
      }
    }


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
              <label style={{  display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Permissão do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={permissionModule} onChange={(e) => setPermissionModule(e.target.value)} /></label>
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


              {lessonsModule?.length > 0 ? (
                lessonsModule.map((lesson, index) => (
                  <LessonContainer key={index} >
                    <h2 style={{ font: 'bold', color: '#07ff07' }}>{lesson.nameLesson}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                      <ManageButton onClick={() => { () => selectLesson(lesson) }} >Gerenciar Aula</ManageButton>
                      <DeleteButton onClick={() => handleDeleteLesson(lesson)} >Excluir Aula</DeleteButton>
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