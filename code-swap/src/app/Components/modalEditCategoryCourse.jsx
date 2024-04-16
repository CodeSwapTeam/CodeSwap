import React, { useState } from 'react';
import { getAllCategories } from '../../../database/functions/createCategory';
import { updateCategory } from '../../../database/functions/createCategory';
import { useRouter } from 'next/navigation';



function EditCourseCategoryModal(props) {
    const router = useRouter();
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
        const categories = await getAllCategories();
        setCategories(categories);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        updateCategory( newCategoryName, props.courseId);

        closeModal();
        router.push('/')

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
                                    {categories.map((category) => (
                                        <option value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal}>Fechar</button>
                            <button onClick={handleSubmit}>Salvar Categoria</button>
                        </div>
                    </div>
                </div>
            )}
            
                
            
            
        </div>
    );
}

export default EditCourseCategoryModal;