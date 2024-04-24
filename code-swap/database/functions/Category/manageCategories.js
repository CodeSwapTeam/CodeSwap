import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

//Funcão para criar uma categoria
export const CreateCategory = async (data) => {

    console.log('Criando categoria...', data);

    const categoryData = {
        name: data.name,
        description: data.description,
        courses: []
    }

    try {
        const docRef = await addDoc(collection(db, 'Categories'), categoryData ,{merge: true})

        const categoryRef = doc(db, 'Categories', docRef.id);

        await updateDoc(categoryRef, {id: docRef.id});

        //buscar os novos dados
        const categories = await GetCategories();
        //salvar no cache local
        localStorage.setItem('categories', JSON.stringify(categories));

    } catch (error) {
        console.error('Erro ao Criar categoria:', error);
        throw error; 
    }
};

// Função para atualizar uma categoria no banco de dados
export const UpdateCategoryData = async (categoryId, data) => {
    try {
        const categoryRef = doc(db, 'Categories', categoryId);

        await updateDoc(categoryRef, data);

    } catch (error) {
        console.error('Erro ao atualizar a categoria:', error);
        throw error; 
    }
};

// Função para deletar uma categoria no banco de dados
export const DeleteCategory = async (categoryId) => {
    try {
        console.log('Deletando categoria...', categoryId);

        await deleteDoc(doc(db, 'Categories', categoryId));
        //buscar os novos dados
        const categories = await GetCategories();
        //salvar no cache local
        localStorage.setItem('categories', JSON.stringify(categories));

    } catch (error) {
        console.error('Erro ao deletar a categoria:', error);
        throw error; 
    }
};


// Função para retornar todas as categorias do banco de dados
export const GetCategories = async () => {
    const categories = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'Categories'));

        querySnapshot.forEach((doc) => {
            categories.push(doc.data());
        });

        return categories;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error; 
    }
};

//função para buscar as categorias no local storage
export const GetCategoriesLocal = () => {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : null;
};


//função para salvar as categorias no local storage
export const SaveCategoriesLocal = (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
};