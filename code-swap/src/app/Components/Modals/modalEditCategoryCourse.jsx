import React, { useState } from 'react';
import Controller from '@/Controller/controller';



function EditCourseCategoryModal(props) {

    const controller = Controller();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState();
    const [categories, setCategories] = useState([]);

    const openModal = () => {
        setModalIsOpen(true);
        fetchCategories();
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const fetchCategories = async () => {
        const categories = await controller.manageCategories.getAllCategories();
        setCategories(categories);
        setNewCategoryName(categories[0].name);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        controller.manageCategories.updateCategory(newCategoryName, props.courseId);

        closeModal();
        

    };

    return (
        <div>
            <button style={{ padding: '5px', backgroundColor: '#5d7d7c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={openModal}>Editar Categoria</button>

            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <select name="category" id="category" onChange={(e) => setNewCategoryName(e.target.value)}>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button style={{ padding: '5px', backgroundColor: '#232323', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'  }} onClick={closeModal}>Fechar</button>
                            <button style={{ padding: '5px', backgroundColor: '#16ff66', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleSubmit}>Salvar Categoria</button>
                        </div>
                    </div>
                </div>
            )}
            
                
            
            
        </div>
    );
}

export default EditCourseCategoryModal;