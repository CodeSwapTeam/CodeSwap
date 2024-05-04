import { useState } from "react";
import Controller from "@/Controller/controller";

import {useQueryClient, } from "@tanstack/react-query";

function ModalCreateCategory() {
    const controller = Controller();
    const queryClient = useQueryClient();

    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  const handleSubmit = async () => {
    await controller.manageCategories.CreateCategory({ 
      name: categoryName, 
      description: categoryDescription 
    });
    queryClient.refetchQueries(['All-Categories']);

    setCategoryName('');
    setCategoryDescription('');
    handleClose();
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