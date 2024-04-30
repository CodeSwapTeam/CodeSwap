import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

//Funcão para criar uma categoria
export const CreateCategory = async (data) => {

    const categoryData = {
        name: data.name,
        description: data.description,
        courses: []
    }

    try {
        // Criar a categoria no banco de dados
        const docRef = await addDoc(collection(db, 'Categories'), categoryData, { merge: true });
    
        // Adicionar o id da categoria no documento
        await updateDoc(doc(db, 'Categories', docRef.id), { id: docRef.id });
    
        // Obter as categorias do cache local ou inicializar com um array vazio
        const categories = JSON.parse(sessionStorage.getItem('categories')) || [];
    
        // Adicionar a nova categoria
        categories.push({ ...categoryData, id: docRef.id });
    
        // Atualizar o cache local
        sessionStorage.setItem('categories', JSON.stringify(categories));
        
        alert(`Categoria ${data.name} criada com sucesso!`);

        // Retornar o array de categorias
        return categories;
    } catch (error) {
        console.error('Erro ao Criar categoria:', error);
        throw error;
    }
};

// >>>>NÃO IMPLEMENTADO<<<< Função para atualizar uma categoria no banco de dados 
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
        //Remover a categoria do cache local
        const categoriesLocal = sessionStorage.getItem('categories');
        if(categoriesLocal){
            const categories = JSON.parse(categoriesLocal);
            const newCategories = categories.filter(category => category.id !== categoryId);
            sessionStorage.setItem('categories', JSON.stringify(newCategories));
        }

        //Deletar a categoria do banco de dados
        await deleteDoc(doc(db, 'Categories', categoryId));

        alert('Categoria deletada com sucesso!');

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

        //salvar no cache local
        SaveCategoriesLocal(categories);

        return categories;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error;
    }
};

//função para buscar as categorias no sessionStorage
export const GetCategoriesLocal = () => {
    const categories = JSON.parse(sessionStorage.getItem('categories'));
    return categories ? categories : null;
};


//função para salvar as categorias no sessionStorage
export const SaveCategoriesLocal = (categories) => {
    sessionStorage.setItem('categories', JSON.stringify(categories));
};


//fução para salvar a imgUrlThumbnail no banco de dados e no cache local
export const SaveImgUrlThumbnail = async (categoryId, courseId, imgUrlThumbnail) => {
    try {
        const categoryRef = doc(db, 'Categories', categoryId);

        //pegar a categoria
        const categorySnap = await getDoc(categoryRef);
        if (!categorySnap.exists()) {
            // O documento não existe.
            console.log('No such document!');
        } else {
            // O documento existe, você pode chamar o método data().
            const category = categorySnap.data();
            //verificar se o curso existe
            const course = category.courses.find(course => course.id === courseId);
            
            if(course){
                course.imgUrlThumbnail = imgUrlThumbnail;
                await updateDoc(categoryRef, { courses: category.courses });
            }
        } 

        //atualizar o cache local
        const categoriesLocal  = sessionStorage.getItem('categories');
        if(categoriesLocal){
            const categories = JSON.parse(categoriesLocal);
            const category = categories.find(category => category.id === categoryId);
            if(category){
                const course = category.courses.find(course => course.id === courseId);
                if(course){
                    course.imgUrlThumbnail = imgUrlThumbnail;
                    sessionStorage.setItem('categories', JSON.stringify(categories));
                }
            }
        }

        } catch (error) {
            console.error('Erro ao salvar a imagem da categoria:', error);
            throw error;
        }
    };