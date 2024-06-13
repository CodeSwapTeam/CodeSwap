import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../database/firebase';
import { useState } from 'react';
import Controller from '@/Controller/controller';
import { useQueryClient } from '@tanstack/react-query';



function ModalUpdateCategory({categoriesData}){

    console.log('categoriesData', categoriesData);

    const [show, setShow] = useState(false);

    const controller = Controller();

    const [categorySelected, setCategorySelected] = useState(null);
    const [selectedCategoryID, setSelectedCategoryID] = useState('');
    const [categoryName, setCategoryName] = useState(categoriesData.name);
    const [categoryDescription, setCategoryDescription] = useState(categoriesData.description);
    const [imgUrlBadge, setImgUrlBadge] = useState('');
    const [progress, setProgress] = useState(0);
    const [positionBadgeMap, setPositionBadgeMap] = useState({ x: 0, y: 0 });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const queryClient = useQueryClient();


    const handleSubmit = async () => {
        /* await controller.manageCategories.CreateCategory({ 
          name: categoryName, 
          description: categoryDescription,
          Badge: imgUrlBadge,
          PositionBadgeMap: { x: 0, y: 0 }
        }); */

        await controller.manageCategories.UpdateCategoryData({
            id: selectedCategoryID,
            name: categoryName,
            description: categoryDescription,
            Badge: imgUrlBadge,
            PositionBadgeMap: positionBadgeMap
            });

            queryClient.refetchQueries(['All-Categories']);
    
        setCategoryName('');
        setCategoryDescription('');
        handleClose();
      }

    const handleUploadBadgeCategory = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
    
        
        if (!file) return;
        const fileName = `${categoryName}-Badge`;
        const storageRef = ref(storage, `Categories/Badge/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrlBadge(downloadURL);
            });
            //limpar o campo de upload
            e.target.file.value = '';
        });
    }

    const handleChangeCategory = (e) => {
        setSelectedCategoryID(e.target.value);
        console.log(e.target.value);
    }



    return (
        <>
            {categoriesData && (
                <button style={{ padding: '5px', backgroundColor: '#0ebf22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '50px' }} onClick={handleShow}>Atualizar Categoria</button>
            )}
            {show && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                    <div style={{zIndex: 3, backgroundColor: 'black', borderRadius: '5px', maxWidth: '500px', width: '90%', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>

                        <select value={selectedCategoryID} onChange={handleChangeCategory} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                            <option value="">Selecione uma categoria</option>
                            {categoriesData.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>
                ))}
                </select>



              <div className="modal-header" style={{ borderBottom: '1px solid #f2f2f2', padding: '10px 15px' }}>
                <h5 className="modal-title" style={{ margin: 0, fontWeight: '500', fontSize: '1.25rem', color: 'white' }}>Atualizar Categoria</h5>
              </div>

              <div className="modal-body" style={{ padding: '10px 15px' }}>
                <input type="text" placeholder="Nome da Categoria" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: categoryName ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
              </div>
              <div className="modal-body" style={{ padding: '10px 15px' }}>
                <input type="text" placeholder="Descrição da Categoria" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: categoryDescription ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
              </div>

              <div style={{ padding: '10px 15px' }}>
                <label style={{ fontWeight: 'bold', color: '#007bff', display: 'block', marginBottom: '10px' }}>Posição do Badge no Mapa:</label>
                <div style={{ display: 'flex', justifyContent: 'space-between' , alignItems:'center'}}>
                  X<input type="number" placeholder="X" value={positionBadgeMap.x} onChange={(e) => setPositionBadgeMap({ ...positionBadgeMap, x: e.target.value })} style={{ width: 'calc(50% - 10px)', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: positionBadgeMap.x ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
                  Y<input type="number" placeholder="Y" value={positionBadgeMap.y} onChange={(e) => setPositionBadgeMap({ ...positionBadgeMap, y: e.target.value })} style={{ width: 'calc(50% - 10px)', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', transition: 'box-shadow 0.3s ease', boxShadow: positionBadgeMap.y ? '0px 0px 5px rgba(0, 0, 0, 0.1)' : 'none' }} />
                </div>
              </div>

              <div>
                
                <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', color: '#007bff', display: 'block', marginBottom: '10px' }}>Upload Badge:</label>
                <form onSubmit={handleUploadBadgeCategory} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="file" name="file" style={{ marginRight: '10px', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />
                    <button style={{ padding: '10px 20px', backgroundColor: '#034C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' }} type="submit">Enviar</button>
                </form>
                <br />
                {!imgUrlBadge && <progress value={progress} max="100" style={{ width: '100%', height: '10px', borderRadius: '5px' }} />}
                {imgUrlBadge && <img src={imgUrlBadge} alt="Imagem do curso" style={{ width: '100px', height: '100px', borderRadius: '5px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }} />}
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
    )
}

export default ModalUpdateCategory;