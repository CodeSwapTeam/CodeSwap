'use client';
import { useState } from "react";
import Controller from "@/Controller/controller";

import {useQueryClient, } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../database/firebase";

function ModalCreateCategory() {
    const controller = Controller();
    const queryClient = useQueryClient();

    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [imgUrlThumbnail, setImgUrlThumbnail] = useState('');
    const [progress, setProgress] = useState(0);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  const handleSubmit = async () => {
    await controller.manageCategories.CreateCategory({ 
      name: categoryName, 
      description: categoryDescription,
      thumbnail: imgUrlThumbnail 
    });
    queryClient.refetchQueries(['All-Categories']);

    setCategoryName('');
    setCategoryDescription('');
    handleClose();
  };

  // Função para lidar com o upload de uma imagem de thumbnail da categoria
  const handleUploadThumbnailCategory = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];

    
    if (!file) return;
    const fileName = `${categoryName}-thumbnail`;
    const storageRef = ref(storage, `Categories/Thumbnails/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
    }, (error) => {
        console.error(error);
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrlThumbnail(downloadURL);
        });
        //limpar o campo de upload
        e.target.file.value = '';
    });
};
        
    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#034C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight:'50px' }} onClick={handleShow}>Adicionar Categoria</button>

        {show && (
          <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
            <div  style={{ backgroundColor: '#fff', borderRadius: '5px', maxWidth: '500px', width: '90%', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #f2f2f2', padding: '10px 15px' }}>
                <h5 className="modal-title" style={{ margin: 0, fontWeight: '500', fontSize: '1.25rem', color: '#333' }}>Adicionar Categoria</h5>
              </div>
              <div className="modal-body" style={{ padding: '10px 15px' }}>
                <input type="text" placeholder="Nome da Categoria" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: categoryName ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
              </div>
              <div className="modal-body" style={{ padding: '10px 15px' }}>
                <input type="text" placeholder="Descrição da Categoria" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: categoryDescription ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
              </div>

              <div>
                
                <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', color: '#007bff', display: 'block', marginBottom: '10px' }}>Upload Thumbnail:</label>
                <form onSubmit={handleUploadThumbnailCategory} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="file" name="file" style={{ marginRight: '10px', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />
                    <button style={{ padding: '10px 20px', backgroundColor: '#034C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlThumbnail && <progress value={progress} max="100" style={{ width: '100%', height: '10px', borderRadius: '5px' }} />}
                {imgUrlThumbnail && <img src={imgUrlThumbnail} alt="Imagem do curso" style={{ width: '100px', height: '100px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />}
            </div>
              
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #f2f2f2', padding: '10px 15px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleClose} style={{ padding: '10px 20px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)', marginRight: '10px' }}>Fechar</button>
                <button type="button" onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }}>Salvar Categoria</button>
              </div>
            </div>
          </div>
            )}
        </>
    );
}

export default ModalCreateCategory;