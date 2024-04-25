import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

export async function CreateCourse(formData) {

   
    try {
        const courseData = {
            title: formData.title,
            status: 'pending', // pending, approved, reviewed, rejected
            description: formData.description,
            owner: '',
            id: '',
            thumbnail: formData.thumbnail,
            coursePremium: false,
            category: formData.category,
            modules: [],
        }
        console.log(courseData);
        const docRef = await addDoc(collection(db, 'Courses'), courseData);
        //setar o id do curso com o id do documento
        await updateDoc(doc(db, 'Courses', docRef.id), {
            id: docRef.id
        });
        
        //adicionar no database em'categories' dentro de courses que é um array de objetos com o id do curso, o titulo e a descrição
        await updateDoc(doc(db, 'Categories', courseData.category), {
            //adicionar o id do curso no array de cursos da categoria
            courses: arrayUnion({ id: docRef.id, title: courseData.title, description: courseData.description })
        });

        //pegar os dados das categorias no sessionStorage
        const categories = JSON.parse(sessionStorage.getItem('categories'));
        //atualizar os dados da categoria no sessionStorage
        categories.forEach(category => {
            if (category.id === courseData.category) {
                category.courses.push({ id: docRef.id, title: courseData.title, description: courseData.description });
            }
        });
        //salvar os dados atualizados no sessionStorage
        sessionStorage.setItem('categories', JSON.stringify(categories));
        
    }
    catch (error) {
        console.error('Erro ao criar o curso:', error);
        throw error;
    }

    
};

//função para atualizar um curso
export async function updateCourse(courseId, courseData) {

};

export const DeleteCourse = async (docId) => {

};