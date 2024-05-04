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
        
        alert(`Categoria ${data.name} criada com sucesso!`);

        return docRef.id;

        // Retornar o array de categorias
        //return categories;
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

        //Deletar a categoria do banco de dados
        await deleteDoc(doc(db, 'Categories', categoryId));

        //Deletar todos os cursos da categoria
        const coursesRef = query(collection(db, 'Courses'), where('category', '==', categoryId));
        const querySnapshot = await getDocs(coursesRef);

        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });




        alert('Categoria deletada com sucesso!');

    } catch (error) {
        console.error('Erro ao deletar a categoria:', error);
        throw error;
    }
};


// >>>>FUNÇÃO ALTERNADA PARA API<<<< Função para retornar todas as categorias do banco de dados
export const GetCategories = async () => {

    try {
        const response = await fetch('/api/gets?type=categories');
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error;
    }
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

    } catch (error) {
        console.error('Erro ao salvar a imagem da categoria:', error);
        throw error;
    }
};


