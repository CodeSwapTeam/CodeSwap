import Controller from "@/Controller/controller";
import { storage } from "../../../database/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

//Função para atualizar a thumbnail do curso//
export const handleUpdateThumbnail = async (e, courseID, categoryId, urlCourseThumbnail) => {

    const controller = Controller();

    
    const file = e.target.file.files[0];
    if (!file) return;

    let filenameThumbnail;

    // Se existir uma URL, deletar a imagem antiga
    if (urlCourseThumbnail) {
      // Extrair o nome do arquivo da URL
      const url = new URL(decodeURIComponent(urlCourseThumbnail));
      const pathname = url.pathname;
      const parts = pathname.split('/');
      const filename = parts[parts.length - 1];
      filenameThumbnail = decodeURIComponent(filename); // Decodificar o nome do arquivo

      // Deletar a imagem antiga
      const oldImageRef = ref(storage, `Courses/Thumbnails/${filenameThumbnail}`);
      deleteObject(oldImageRef).catch((error) => {
        console.error(error);
      });
    }

   // Fazer o upload da nova imagem
   const storageRef = ref(storage, `Courses/Thumbnails/${filenameThumbnail}`);
   const uploadTask = uploadBytesResumable(storageRef, file);

   return new Promise((resolve, reject) => {
       uploadTask.on('state_changed', (snapshot) => {
           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           //setProgress(progress);
       }, (error) => {
           console.error(error);
           reject(error);
       }, () => {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               // Atualizar a URL da imagem no banco de dados
               controller.manageCourses.UpdateThumbnailCourse(courseID, downloadURL);

               //atualizar a imagem no cache local da categoria
               controller.manageCategories.SaveImgUrlThumbnail(categoryId, courseID, downloadURL);
               resolve(downloadURL);
           });
       });
   });
};