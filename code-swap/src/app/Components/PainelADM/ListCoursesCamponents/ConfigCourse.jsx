import Controller from "@/Controller/controller";
import { ContextDataCache } from "@/app/contexts/ContextDataCache";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { storage } from "../../../../../database/firebase";



export const ConfigCourse = ({ setPainelUpdateCourse, setSelectedPainel }) => {

  const controller = Controller();
  //const { setCourseSelected } = ContextDataCache();
  const queryClient = useQueryClient();


  const { data: courseSelected } = useQuery({
    queryKey: ["course-selected"],
    queryFn: async () => {

      const course = await controller.manageCourses.GetCourseById(courseSelected.id);
      handleSetCourseSelected(course);
      return course;

    }

  });

  const [isSequential, setIsSequential] = useState(false);
  const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
  const [imgUrlCover, setImgUrlCover] = useState('');
  const [difficulty, setDifficulty] = useState('iniciante');
  const [courseObservations, setCourseObservations] = useState('');
  const [statusCourse, setStatusCourse] = useState('pending');
  const [experienceCourse, setExperienceCourse] = useState(100);
  const [codesCourse, setCodesCourse] = useState(150);
  const [isPremium, setIsPremium] = useState(false);

  //função para setar todos os states com as informações do curso selecionado
  const handleSetCourseSelected = (course) => {
    setImgUrlThumbnail(course.imgUrlThumbnail);
    setImgUrlCover(course.imgUrlCover);
    setDifficulty(course.difficulty);
    setCourseObservations(course.courseObservations);
    setStatusCourse(course.status);
    setExperienceCourse(course.experience);
    setCodesCourse(course.codes);
    setIsPremium(course.coursePremium);
    setIsSequential(course.SequentialModule);
  };



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
  /////////////////////////////////////////////



  //Função para atualizar a thumbnail do curso//
  const UpdateThumbnail = async (e) => {
    e.preventDefault();
    const urlThumbnail = await controller.services.manageImages.handleUpdateThumbnail(e, courseSelected.id, courseSelected.category, courseSelected.imgUrlThumbnail);

    // Invalidate a query 'ListCourses' após a atualização da imagem
    const courseData = queryClient.getQueryData(["course-selected"]); 
    queryClient.setQueryData(["course-selected"], { ...courseData, imgUrlThumbnail: urlThumbnail });

    // Limpar o campo de upload
    e.target.file.value = '';
  };

  //Função para atualizar a capa do curso
  const handleUpdateCover = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;

    let filenameCover;

    // Se existir uma URL, deletar a imagem antiga
    if (courseSelected.imgUrlCover) {
      // Extrair o nome do arquivo da URL
      const url = new URL(decodeURIComponent(courseSelected.imgUrlCover));
      const pathname = url.pathname;
      const parts = pathname.split('/');
      const filename = parts[parts.length - 1];
      filenameCover = decodeURIComponent(filename); // Decodificar o nome do arquivo

      // Deletar a imagem antiga
      const oldImageRef = ref(storage, `Courses/Covers/${filenameCover}`);
      deleteObject(oldImageRef).catch((error) => {
        // Ignorar o erro  404 se o arquivo não existir
        if (error.code === 'storage/object-not-found') {
          return;
        }
      });
    }

    // Fazer o upload da nova imagem
    const storageRef = ref(storage, `Courses/Covers/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //setProgress(progress);
    }, (error) => {
      console.error(error);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImgUrlCover(downloadURL);
        // Atualizar a URL da imagem no banco de dados
        controller.manageCourses.UpdateCoverCourse(courseSelected.id, downloadURL);

        // Invalidate a query 'ListCourses' após a atualização da imagem
        client.invalidateQueries("ListCourses");

        // Atualizar a imagem no estado local
        setCourseSelected(courseSelected => ({ ...courseSelected, imgUrlCover: downloadURL }));
      });

      // Limpar o campo de upload
      e.target.file.value = '';
    });
  };
  /////////////////////////////////////////////





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

      await controller.manageCourses.UpdateConfigCourseData({ courseId: courseSelected.id, categoryId: courseSelected.category, courseData: courseData });
    },
    onSuccess: (data, variables) => {
      //atualizar o curso no cache local do queryClient
      queryClient.setQueryData(['course-selected'], data);
      queryClient.invalidateQueries(['course-selected']);

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
            <form onSubmit={handleUpdateCover} >
              <input type="file" name="file" />
              <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px' }} type="submit">Enviar</button>
            </form>
          </div>

          <div style={{ fontWeight: 'bold', color: '#007bff', marginTop: '30px', display: 'flex', flexDirection: 'column' }}>

            <div style={{ border: '1px solid white', height: '100px' }}>
              <h1>Registros do Curso</h1>

              <p>Alunos inscritos: 0 </p>
              <p>Módulos: 0</p>

            </div>


            <button style={{ backgroundColor: 'blue', padding: '5px', borderRadius: '5px', marginTop: '30px' }} onClick={() => { setSelectedPainel('Modules'), setCourseSelected(courseSelected) }} >Gerenciar Módulos</button>
          </div>


        </div>

      </div>



    </div>
  );
};