import Controller from "@/Controller/controller";
import { storage } from "../../../database/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


//Função para atualizar a capa do curso
export const handleUpdateCover = async (e, courseID, ) => {
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