import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

//>>>>FUNÇÃO ALTERNADA PARA API<<<< Funcão para criar uma categoria
export const CreateCategory = async (data) => {

    const categoryData = {
        name: data.name,
        description: data.description,
        thumbnail: data.thumbnail,
        courses: [],
        PositionBadgeMap: data.PositionBadgeMap
    }

    try {
        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para criar uma categoria no banco de dados
        const response = await fetch('/api/posts?type=CreateCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar a categoria');
        }

        const data = await response.json();
        alert(data.message);

    } catch (error) {
        console.error('Erro ao Criar categoria:', error);
        throw error;
    }
};

// >>>>FUNÇÃO ALTERNADA PARA API<<<< Função para retornar todas as categorias do banco de dados
export const GetAllCategories = async () => {
    console.log('GetAllCategories');

    try {
        const response = await fetch('/api/gets?type=categories');
        const data = await response.json();//retorna um array de objetos com as categorias
        return data;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error;
    }
};


// Função para deletar uma categoria no banco de dados
export const DeleteCategory = async (categoryId) => {
    try {
        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router DELETE para deletar uma categoria no banco de dados
        const response = await fetch(`/api/delete?type=category&id=${categoryId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar a categoria');
        }

        alert('Categoria deletada com sucesso!');

    } catch (error) {
        console.error('Erro ao deletar a categoria:', error);
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

            if (course) {
                course.imgUrlThumbnail = imgUrlThumbnail;
                await updateDoc(categoryRef, { courses: category.courses });
            }
        }

    } catch (error) {
        console.error('Erro ao salvar a imagem da categoria:', error);
        throw error;
    }
};



//Função para atualizar uma categoria no banco de dados 
export const UpdateCategoryData = async (data) => {
    //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
    try {
        //api router PUT para atualizar uma categoria no banco de dados
        const response = await fetch(`/api/posts?type=UpdateCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a categoria');
        }

        alert('Categoria atualizada com sucesso!');

        
    } catch (error) {
        
    }
};