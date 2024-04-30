import { useState } from "react";
import { useRouter } from "next/navigation";
import Controller from "@/Controller/controller";

import { useQuery,useMutation,useQueryClient, } from "@tanstack/react-query";
import { ContextDataCache } from "@/app/contexts/ContextDataCache";

function ModalCreateCategory() {
    const controller = Controller();
    const queryClient = useQueryClient();

    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const createNewCategory = async (data) => {
        const categoryId = await controller.manageCategories.CreateCategory(data);

        const categoriesCached = queryClient.getQueryData(['All-Categories']);
        if(categoriesCached){
            //Adicionar a nova categoria ao cache com o id retornado
            queryClient.setQueryData(['All-Categories'], [...categoriesCached, {id: categoryId, courses: [], ...data}]);
        }else{
            //adicionar a nova categoria ao cache
            queryClient.setQueryData(['All-Categories'], [{id: categoryId,courses: [], ...data}]);
        }

        
    }


    const handleSubmit = async () => {
       await createNewCategory({ name: categoryName, description: categoryDescription });
        setCategoryName('');
        setCategoryDescription('');
        handleClose();
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