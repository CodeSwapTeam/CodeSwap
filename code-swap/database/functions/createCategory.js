import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";


//criar uma categoria para o curso

export async function createCategory(categoryName) {
    try {
        //criar collection de categorias com id auto gerado
        const collectionRef = collection(db, 'categories');
        
        //adicionar documento com nome da categoria
        await setDoc(doc(collectionRef), {
            name: categoryName,
            courses: []
        });


        alert(`Categoria ${categoryName} criada com sucesso!`);


    } catch (error) {
        console.error('Erro ao criar a categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//buscar todas as categorias
export async function getAllCategories() {
    try {

        //buscar todas as categorias
        const categories = [];
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        categoriesSnapshot.forEach((doc) => {
            categories.push(doc.data());
        });

        return categories;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


//adicionar um curso a uma categoria

export async function addCourseToCategory(courseId, categoryName) {
    try {
        //buscar a categoria pelo nome
        const categoriesRef = collection(db, 'categories');
        const query = await getDocs(categoriesRef);
        
        query.forEach(async (doc) => {
            if (doc.data().name === categoryName) {
                //adicionar o id do curso na lista de cursos da categoria
                await updateDoc(doc.ref, {
                    courses: [...doc.data().courses, courseId]
                });
            }
        });

        

    } catch (error) {
        console.error('Erro ao adicionar o curso à categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//editar categoria

export async function updateCategory(categoryName, courseId) {
    console.log( courseId);
    try {
        //buscar o curso pelo id
        const cursoRef = collection(db, 'Modulos');
        const query = await getDocs(cursoRef);

        query.forEach(async (doc) => {
            if (doc.id === courseId) {
                //atualizar o nome da categoria
                await updateDoc(doc.ref, {
                    category: categoryName
                });
            }
        });

        alert(`Categoria ${categoryName} atualizada com sucesso!`);

    } catch (error) {
        console.error('Erro ao atualizar a categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}
