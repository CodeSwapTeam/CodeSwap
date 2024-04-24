import { useState } from "react";
import { createCategory } from "../../../../database/functions/Category/EXmanageCategorys";
import { useRouter } from "next/navigation";
import Controller from "@/Controller/controller";

function ModalCreateCategory() {
    const controller = Controller();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        controller.manageCategories.CreateCategory({ name: categoryName, description: categoryDescription });
        setCategoryName('');
        setCategoryDescription('');
        handleClose();
        //window.location.reload();
    };

    return (
        <>
            <button style={{ padding: '5px', backgroundColor: '#5150e1', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleShow}>Adicionar Categoria</button>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adicionar Categoria</h5>
                            
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Nome da Categoria" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        </div>
                        {/**Input para descrição da categoria */}
                        <div className="modal-body">
                            <input type="text" placeholder="Descrição da Categoria" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={handleClose}>Fechar</button>
                            <button type="button" style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Categoria</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalCreateCategory;