import styled from 'styled-components';
import { ContextDataCache } from "@/app/Providers/ContextDataCache";
import AddModuleModal from "../../Modals/modalAddModule";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import Controller from '@/Controller/controller';
import { useState } from 'react';
import UpdateModuleModal from '../../Modals/modalUpdateModule';
import AddLessonModal from '../../Modals/modalAddLesson';
import { set } from 'firebase/database';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../../../database/firebase';


const Container = styled.div`
    width: 100%;
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
    border-radius: 5px;
    transition: all 0.3s ease;
    background-color: #00000063;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 10px 20px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        flex-direction: column;
        height: auto;
    }
`;

const DeleteButton = styled.button`

    top: 5px;
    right: 5px;

    &:hover {
        color: red;
    }
`;

const Title = styled.h4`
  text-align: center;
  width: 100%;
  font-size: calc(1.2em + 1.2vw); // Ajusta o tamanho da fonte com base na largura da viewport
`;

const ManageButton = styled.button`
border: 1px solid white;
padding: 5px;
border-radius: 5px;
margin: 5px;
cursor: pointer;
background-color: #020a29;
color: #04ff02;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
transition: all 0.3s ease;
font-size: 1rem;

&:hover {
    color: #04ff02;
    font-weight: bold;
    transform: scale(1.05);
    box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
}

@media (max-width: 600px) {
    font-size: 0.8rem;
}
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

const UpdateInfo = styled.button`
    border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
        color: #04ff02;
        font-weight: bold;
        transform: scale(1.05);
        box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;

const FlexDiv = styled.div`
    
    
    display: flex;
    justify-content: space-between;

    @media (max-width: 600px) {
        flex-direction: column;
        //centraliza o conteúdo 
        align-items: center;
    }
`;


const ConfigModule = styled.div`
    padding: 5px;
    margin: 5px;
    margin-top: 20px;
    border: 2px solid black;
    border-radius: 5px;
    width: 40%;
    box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00;

    @media (max-width: 600px) {
        width: 100%;
    }
`;


const LessionsList = styled.div`
    margin: 5px;
    padding: 5px;
    margin-top: 20px;
    border: 2px solid black;
    width: 55%;
    border-radius: 5px;
    box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 5px #00ff00, 0 0 5px #00ff00;

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const StyledLessonDiv = styled.div`
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 150px;
    margin: 10px 20px 10px 10px;
    transition: all 0.3s ease;
    background-color: #00000063;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2); // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        flex-direction: column;
        height: auto;
    }
`;


const SaveModule = styled.button`
    border: 1px solid white;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    margin-top: 20px;
    cursor: pointer;
    background-color: #020a29;
    color: #04ff02;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-size: 1.2rem;

    &:hover {
        color: #04ff02;
        font-weight: bold;
        transform: scale(1.05);
        box-shadow: 0px 0px 10px #04ff02; // Adicionado box-shadow verde suave
    }

    @media (max-width: 600px) {
        font-size: 0.8rem;
    }
`;

export default function ManageModule({ setSelectedPainel }) {

  const controller = Controller();
  const queryClient = useQueryClient();

  const [panelUpdateModule, setPanelUpdateModule] = useState(false);

  const [permissionModule, setPermissionModule] = useState(0);
  const [codesModule, setCodesModule] = useState(0);
  const [xpModule, setXpModule] = useState(0);
  const [difficultyModule, setDifficultyModule] = useState('');
  const [moduleObservations, setModuleObservations] = useState('');
  const [thumbnailModule, setThumbnailModule] = useState('');
  const [progress, setProgress] = useState(0);


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
      setThumbnailModule(module.thumbnail);

      const Lessons = await controller.manageModules.GetLessonsModule(module.id);
      queryClient.setQueryData(['Lessons-Module'], Lessons);
      console.log(module);

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
      moduleObservations: moduleObservations,
      thumbnailModule: thumbnailModule
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

  //Função para atualizar a thumbnail do curso//
  const UpdateThumbnailModule = async (e) => {
    e.preventDefault();
    ////////////ATUALIZAR A IMAGEM NO BANCO DE DADOS////////////////
    
    e.preventDefault();
    const file = e.target.file.files[0];

    
    if (!file) return;
    const fileName = `${moduleSelected.title}-Badge`;
    const storageRef = ref(storage, `Courses/Badge/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
    }, (error) => {
        console.error(error);
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setThumbnailModule(downloadURL);
           controller.manageModules.AddThumbnailModule(moduleSelected.id, downloadURL);
        });
        //limpar o campo de upload
        e.target.file.value = '';
    });

    
    
    
    //atualizar a query ["Module-Selected"] com a nova thumbnail
    let moduleUpdated = await queryClient.getQueryData(['Module-Selected']);
    moduleUpdated = { ...moduleUpdated, thumbnail: thumbnailModule };
    queryClient.setQueryData(['Module-Selected'], moduleUpdated);


    

    
    e.target.file.value = '';
  };



  return (
    <Container >
      {!panelUpdateModule ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button  onClick={() => setSelectedPainel('Modules')} >Voltar </Button>
            <Title>{moduleSelected?.title}</Title>
            <div style={{ width: 'same-as-button' }}></div>
          </div>

          <p>{moduleSelected.description}</p>
          <UpdateInfo onClick={() => setPanelUpdateModule(true)} >Atualizar Informações </UpdateInfo>
          
          <FlexDiv>

            <ConfigModule>
              <label style={{  display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Permissão do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={permissionModule} onChange={(e) => setPermissionModule(e.target.value)} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>XP do Módulo:<input type="number" style={{ width: '100px', color: "black" }} value={xpModule} onChange={(e) => setXpModule(e.target.value)} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Codes do módulo:<input type="number" style={{ width: '100px', color: "black" }} value={codesModule} onChange={(e) => setCodesModule(e.target.value)} /></label>
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Nível de dificuldade do Módulo:</label>
                <select style={{ color:'black', width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'}} value={difficultyModule} onChange={handleSelectChange}>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediário">Intermediário</option>
                  <option value="avançado">Avançado</option>
                </select>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' }}>
                Thumbnail<img src={thumbnailModule} alt="imagem" />
              </label>
              <form onSubmit={UpdateThumbnailModule}>
                <input type="file" name="file" />
                <ManageButton type="submit">Atualizar Thumbnail</ManageButton>
              </form>

              <textarea style={{padding:'5px',borderRadius: '5px',color: 'black', height: '10rem', width: '100%' }} type="text" placeholder="Observações do Curso" value={moduleObservations} onChange={(e) => setModuleObservations(e.target.value)} />

            </ConfigModule>

            <LessionsList>
              <h2>Aulas</h2>


              {lessonsModule?.length > 0 ? (
                lessonsModule.map((lesson, index) => (
                  <LessonContainer key={index} >
                    <h2 style={{ font: 'bold', color: 'White' }}>{lesson.nameLesson}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                      <ManageButton onClick={() => { () => selectLesson(lesson) }} >Gerenciar Aula</ManageButton>
                      <DeleteButton onClick={() => handleDeleteLesson(lesson)} >Excluir Aula</DeleteButton>
                    </div>
                  </LessonContainer>

                ))
              ) : (<h2>Nenhuma aula cadastrada</h2>)}
                <AddLessonModal courseId={moduleSelected.courseId} moduleId={moduleSelected.id} />
            </LessionsList>
          </FlexDiv>


          <SaveModule  onClick={() => handleUpdateModule()} >Salvar Módulo </SaveModule>

        </>
      ) : (<UpdateModuleModal moduleSelected={moduleSelected} setPanelUpdateModule={setPanelUpdateModule} />)}



    </Container>
  );
}