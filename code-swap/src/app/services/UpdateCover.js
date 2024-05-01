import Controller from "@/Controller/controller";
import { storage } from "../../../database/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

//Função para atualizar a capa do curso
export const handleUpdateCover = async (e, courseID, urlCourseCover) => {
    const controller = Controller();

    const file = e.target.file.files[0];
    if (!file) {
      console.log('não encontrado')
       return
      };

    let filenameCover;

    // Se existir uma URL, deletar a imagem antiga
    if (urlCourseCover) {
      // Extrair o nome do arquivo da URL
      const url = new URL(decodeURIComponent(urlCourseCover));
      const pathname = url.pathname;
      const parts = pathname.split('/');
      const filename = parts[parts.length - 1];
      filenameCover = decodeURIComponent(filename); // Decodificar o nome do arquivo
      console.log('filenameCover:', filenameCover)
      // Deletar a imagem antiga
      const oldImageRef = ref(storage, `Courses/Covers/${filenameCover}`);
      deleteObject(oldImageRef).catch((error) => {
        console.log('error::::', error);
      });
    }

    // Fazer o upload da nova imagem
    const storageRef = ref(storage, `Courses/Covers/${filenameCover}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //setProgress(progress);
      }, (error) => {
        console.log('error!!!!!', error);
        reject(error);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Atualizar a URL da imagem no banco de dados
          controller.services.manageImages.handleUpdateCover(courseID, downloadURL);


          resolve(downloadURL);
        });
      });
    });
};