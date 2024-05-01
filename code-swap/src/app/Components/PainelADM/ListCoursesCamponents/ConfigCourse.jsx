import Controller from "@/Controller/controller";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useState } from "react";



export const ConfigCourse = ({ setPainelUpdateCourse, setSelectedPainel }) => {

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
    const urlThumbnail = await controller.services.manageImages.handleUpdateThumbnail(e, courseSelected.id, courseSelected.category, courseSelected.imgUrlThumbnail);

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
    const urlCover = await controller.services.manageImages.handleUpdateCover(e, courseSelected.id,  courseSelected.imgUrlCover);

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

      await controller.manageCourses.UpdateConfigCourseData({ courseId: courseId, categoryId: courseSelected.category, courseData: courseData });
      //atualizar a query 'Course-Selected' alterando somente os dados alterados 
      queryClient.setQueryData(['Course-Selected'], { ...courseSelected, ...courseData });

      //atualizar a query ['Course-Selected'] para refletir as alterações
      queryClient.invalidateQueries(['Course-Selected']);

      alert('Curso atualizado com sucesso');
    }
  });

  return (
    <div style={{ width: '100%' }}>
      <h4>Descrição: </h4>

      <p style={{ padding: '5px', marginBottom: '10px' }}>{courseSelected.description}</p>

      <button style={{ backgroundColor: '#16ff66', padding: '5px', borderRadius: '5px' }} onClick={() => setPainelUpdateCourse(true)}>Atualizar informações</button>


      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between', padding: '5px', margin: '5px', marginTop: '20px' }}>

        <div style={{ width: '35%' }}>

          <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Criador:<span type="text" >{courseSelected.owner}</span></label>

          <div style={{ display: 'flex' }}>
            <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto' }}>Status:<span type="text" >{courseSelected.status}</span></label>
            <select style={{ color: 'black', marginLeft: '10px' }} onChange={handleSetStatusCourse} value={statusCourse}>
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
            <label style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'flex-start', marginTop: '5px', width: 'auto', border: '1px solid black' }}>Nível de dificuldade do curso:</label>
            <select style={{ color: 'black', marginBottom: '10px' }} value={difficulty} onChange={handleSelectChange}>
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
              <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px' }} type="submit">Enviar</button>
            </form>
            <br />
          </div>

          <div>
            <textarea style={{ color: 'black', margin: '5px', height: '10rem', width: '100%' }} type="text" placeholder="Observações do Curso" value={courseObservations} onChange={(e) => setCourseObservations(e.target.value)} />
            <button style={{ backgroundColor: '#16ff66', padding: '5px', borderRadius: '5px' }} onClick={() => handleConfigCourse.mutate()}>Salvar Curso</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px', width: '60%' }}>

          <label >Capa do Curso<img src={courseSelected.imgUrlCover} alt="imagem" /></label>

          <div>
            <label style={{ fontWeight: 'bold', color: '#007bff' }}>Atualizar capa do curso:</label>
            <form onSubmit={UpdateCover} >
              <input type="file" name="file" />
              <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px' }} type="submit">Enviar</button>
            </form>
          </div>

          <div style={{ fontWeight: 'bold', color: '#007bff', marginTop: '30px', display: 'flex', flexDirection: 'column' }}>

            <div style={{ border: '1px solid white', height: '100px' }}>
              <h1>Registros do Curso</h1>

              <p>Alunos inscritos: 0 </p>
              <p>Módulos: {courseSelected.modules.length} </p>

            </div>


            <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px', marginTop: '30px' }} onClick={() => { setSelectedPainel('Modules') }} >Gerenciar Módulos</button>
          </div>


        </div>

      </div>



    </div>
  );
};