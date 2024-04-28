import { useState } from "react";
import { useRouter } from "next/navigation";
import Controller from "@/Controller/controller";

import { useQuery,useMutation,useQueryClient, } from "@tanstack/react-query";

function ModalCreateCategory() {
    const controller = Controller();
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');


    const client = useQueryClient();

    const createCategory = useMutation({
        mutationFn: async (data) => {
            controller.manageCategories.CreateCategory(data)
            
             
            //buscar os dados no local storage mesclar com os novos dados
            const localData = controller.manageCategories.GetCategoriesLocal();

            const updatedData = [...localData, data];
            //salvar os novos dados
            controller.manageCategories.SaveCategoriesLocal(updatedData);
            


            client.invalidateQueries(["categories"]);
        }
    });
    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        createCategory.mutate({ name: categoryName, description: categoryDescription });
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