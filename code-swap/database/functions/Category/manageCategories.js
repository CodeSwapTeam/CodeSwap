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

        //recarregar a página
        //window.location.reload();

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
        const categoryRef = doc(db, 'Categories', categoryId);

        await deleteDoc(categoryRef);

    } catch (error) {
        console.error('Erro ao deletar a categoria:', error);
        throw error; 
    }
};


// Função para retornar todas as categorias do banco de dados
export const GetCategories = async () => {
    console.log('Buscando categorias...');
    const categories = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'Categories'));

        querySnapshot.forEach((doc) => {
            categories.push(doc.data());
        });

        //salvar as categorias no cache local
        localStorage.setItem('categories', JSON.stringify(categories));
        return categories;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error; 
    }
};