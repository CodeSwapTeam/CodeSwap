import Controller from "@/Controller/controller";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useState } from "react";
import UpdateCourseModal from "../../Modals/modalUpdateCourse";
import styled from "styled-components";


const UpdateInfoCourse = styled.button`
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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
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

const Title = styled.h4`
  text-align: center;
  width: 100%;
  font-size: calc(1.2em + 1.2vw); // Ajusta o tamanho da fonte com base na largura da viewport
`;

const Spacer = styled.div`
  width: same-as-button;
`;

const Description = styled.p`
  padding: 1em; // Use unidades relativas para o padding
  margin-bottom: 1em; // Use unidades relativas para a margin
  font-size: calc(0,5em + 1vw); // Ajusta o tamanho da fonte com base na largura da viewport
`;

const StyledButtonSaveModule = styled.button`
  
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

const StyledButtonUploadImg = styled.button`
  
margin: 10px;
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

const ResponsiveDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
  padding: 5px;
  margin: 5px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ConfigCourseDiv = styled.div`
  width: 35%;
  background-color: #00000063;
  margin: 10px;
  padding: 5px;
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CoverCourseDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  width: 60%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;



export const ConfigCourse = ({ setSelectedPainel }) => {

  const controller = Controller();
  const queryClient = useQueryClient();

  const [courseId, setCourseId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSequential, setIsSequential] = useState(false);
  const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
  const [imgUrlCover, setImgUrlCover] = useState('');
  const [difficulty, setDifficulty] = useState('iniciante');
  const [courseObservations, setCourseObservations] = useState('');
  const [statusCourse, setStatusCourse] = useState('pending');
  const [experienceCourse, setExperienceCourse] = useState(100);
  const [codesCourse, setCodesCourse] = useState(150);
  const [isPremium, setIsPremium] = useState(false);


  const { data: courseSelected } = useQuery({
    queryKey: ['Course-Selected'],
    queryFn: async () => {
      const course = queryClient.getQueryData(['Course-Selected']);

      setImgUrlThumbnail(course.imgUrlThumbnail);
      setImgUrlCover(course.imgUrlCover);
      setDifficulty(course.difficulty);
      setCourseObservations(course.courseObservations);
      setStatusCourse(course.status);
      setExperienceCourse(course.experience);
      setCodesCourse(course.codes);
      setIsPremium(course.coursePremium);
      setIsSequential(course.SequentialModule);
      setCourseId(course.id);
      setCategoryId(course.categoryId);

      return course;

    },
    refetchOnWindowFocus: false,

  })


  //Funções para atualizar um curso////////////
  const handleCheckboxChange = (event) => {
    setIsPremium(event.target.checked);
  };

  const handleCheckboxChangeSequential = (event) => {
    setIsSequential(event.target.checked);
  }

  const handleSelectChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSetStatusCourse = (event) => {
    setStatusCourse(event.target.value);
  };




  //Função para atualizar a thumbnail do curso//
  const UpdateThumbnail = async (e) => {
    e.preventDefault();

    ////////////ATUALIZAR A IMAGEM NO BANCO DE DADOS////////////////
    const urlThumbnail = await controller.services.manageImages.handleUpdateThumbnail(e, courseSelected.id, courseSelected.category, courseSelected.imgUrlThumbnail);

    ////////////ATUALIZAR A IMAGEM NO CACHE////////////////
    // Invalidate a query ['Course-Selected'] após a atualização da imagem
    const courseData = queryClient.getQueryData(['Course-Selected']);
    queryClient.setQueryData(['Course-Selected'], { ...courseData, imgUrlThumbnail: urlThumbnail });
    queryClient.invalidateQueries(['Course-Selected']);
    // Limpar o campo de upload
    e.target.file.value = '';
  };

  //Função para atualizar a capa do curso
  const UpdateCover = async (e) => {
    e.preventDefault();
    const urlCover = await controller.services.manageImages.handleUpdateCover(e, courseSelected.id, courseSelected.imgUrlCover);

    // Invalidate a query ['Course-Selected'] após a atualização da imagem
    const courseData = queryClient.getQueryData(['Course-Selected']);
    queryClient.setQueryData(['Course-Selected'], { ...courseData, imgUrlCover: urlCover });
    queryClient.invalidateQueries(['Course-Selected']);

    // Limpar o campo de upload
    e.target.file.value = '';

  };




  //Função para atualizar as informações do curso e status
  const handleConfigCourse = useMutation({
    mutationFn: async () => {
      const courseData = {
        status: statusCourse,
        coursePremium: isPremium,
        SequentialModule: isSequential,
        difficulty: difficulty,
        experience: experienceCourse,
        codes: codesCourse,
        courseObservations: courseObservations,
        imgUrlThumbnail: imgUrlThumbnail,
        imgUrlCover: imgUrlCover
      };

      ////////////ATUALIZAR AS INFORMAÇÕES DO CURSO NO BANCO DE DADOS////////////////
      await controller.manageCourses.UpdateConfigCourseData({ courseId: courseId, categoryId: courseSelected.category, courseData: courseData });
      
      ////////////ATUALIZAR AS INFORMAÇÕES DO CURSO NO CACHE////////////////
      //atualizar a query 'Course-Selected' alterando somente os dados alterados 
      queryClient.setQueryData(['Course-Selected'], { ...courseSelected, ...courseData });

      //atualizar a query ['Course-Selected'] para refletir as alterações
      queryClient.invalidateQueries(['Course-Selected']);

      //Atualizar o ["Courses-Cached"]
      const coursesCached = queryClient.getQueryData(['Courses-Cached']);
      const courseIndex = coursesCached.findIndex(course => course.id === courseId);
      coursesCached[courseIndex] = { ...coursesCached[courseIndex], ...courseData };
      queryClient.setQueryData(['Courses-Cached'], coursesCached);

      //Atualizar a query ["Category-Selected"]
      const categorySelected = queryClient.getQueryData(["Category-Selected"]);
      const categoryIndex = categorySelected.courses.findIndex(course => course.id === courseId);
      categorySelected.courses[categoryIndex] = { ...categorySelected.courses[categoryIndex], ...courseData };
      queryClient.setQueryData(["Category-Selected"], categorySelected);
    }
  });

  const [painelUpdateCourse, setPainelUpdateCourse] = useState(false);

  

  return (

    <>
      {!painelUpdateCourse ? (
        <div >

          <Container>
            <Button onClick={() => { setSelectedPainel('courses') }}>Voltar</Button>
            <Title>{courseSelected?.title}</Title>
            <Spacer></Spacer>
          </Container>


          <div style={{ backgroundColor: '#00000063', margin: '10px', padding: '5px', borderRadius: '5px' }}>
            <Description style={{ padding: '5px', marginBottom: '10px' }}>{courseSelected.description}</Description>
            <UpdateInfoCourse onClick={() => setPainelUpdateCourse(true)}>Atualizar informações</UpdateInfoCourse>
          </div>

          <ResponsiveDiv >
           
            {/**Configurações do curso */}
            <ConfigCourseDiv >
            <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'center', marginTop: '5px', width: 'auto', fontSize: '1.5rem' }}>Configurações do Curso</label>

              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Criador:<span type="text" >{courseSelected.owner}</span></label>
              
              <div style={{ display: 'flex' , flexDirection: 'column'}}>
                <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Status:<span type="text" >{courseSelected.status}</span></label>
                <select style={{color:'black', width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} onChange={handleSetStatusCourse} value={statusCourse}>
                  <option value="approved">Aprovado</option>
                  <option value="pending">Pendente</option>
                  <option value="revision">Revisão</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>

              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Curso premium?<input type="checkbox" checked={isPremium} onChange={handleCheckboxChange} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Módulos sequenciais?<input type="checkbox" checked={isSequential} onChange={handleCheckboxChangeSequential} /></label>
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>XP do curso:<input type="number" style={{ width: '100px', color: "black" }} value={experienceCourse} onChange={(e) => setExperienceCourse(e.target.value)} /></label>  
              <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', }}>Codes do curso:<input type="number" style={{ width: '100px', color: "black" }} value={codesCourse} onChange={(e) => setCodesCourse(e.target.value)} /></label>
              
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Nível de dificuldade do curso:</label>
                <select style={{color:'black', width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} value={difficulty} onChange={handleSelectChange}>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediário">Intermediário</option>
                  <option value="avançado">Avançado</option>
                </select>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', marginRight: '10px', border: '1px solid white', marginBottom: '10px' }}>
                Thumbnail<img src={courseSelected.imgUrlThumbnail} alt="imagem" />
              </label>
              <div>
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar Thumbnail:</label>
                <form onSubmit={UpdateThumbnail} style={{ display: 'flex', flexDirection: 'column' }}>
                  <input type="file" name="file" />
                  <StyledButtonUploadImg type="submit">Enviar</StyledButtonUploadImg>
                </form>
                <br />
              </div>
              <div>
                <textarea style={{padding:'5px', borderRadius:'5px', color: 'black', height: '10rem', width: '100%' }} type="text" placeholder="Observações do Curso" value={courseObservations} onChange={(e) => setCourseObservations(e.target.value)} />
                <StyledButtonSaveModule  onClick={() => handleConfigCourse.mutate()}>Salvar Curso</StyledButtonSaveModule>
              </div>
            </ConfigCourseDiv>

            {/** Capa do Curso */}
            <CoverCourseDiv>
              <label style={{ fontSize: '1.5rem'}}>Capa do Curso</label>
              <img src={courseSelected.imgUrlCover} alt="imagem" />
              <div>
                <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar capa do curso:</label>
                <form onSubmit={UpdateCover} >
                  <input type="file" name="file" />
                  <StyledButtonUploadImg  type="submit">Enviar</StyledButtonUploadImg>
                </form>
              </div>
              <div style={{ fontWeight: 'bold', color: '#007bff', marginTop: '30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderRadius:'5px', height: '100px', backgroundColor: '#00000063' }}>
                  <h1>Registros do Curso</h1>
                  <p>Alunos inscritos: 0 </p>
                  <p>Módulos: {courseSelected.modules.length} </p>
                </div>

                <StyledButtonSaveModule onClick={() => { setSelectedPainel('Modules') }} >
                  Gerenciar Módulos
                </StyledButtonSaveModule>
                
              </div>
            </CoverCourseDiv>

          </ResponsiveDiv>
        </div>
      ) : (
        <UpdateCourseModal setPainelUpdateCourse={setPainelUpdateCourse} courseSelected={courseSelected} />
      )}
    </>

  )
};
