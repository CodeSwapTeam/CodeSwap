import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import Controller from "@/Controller/controller";
import { GetCategories } from "../Category/manageCategories";



export async function CreateCourse(formData) {

   
    try {
        const courseData = {
            title: formData.title,
            status: 'pending', // pending, approved, reviewed, rejected
            description: formData.description,
            owner: formData.owner,
            id: '',
            thumbnail: formData.thumbnail,
            coursePremium: false,
            category: formData.category,
            modules: [],
        };
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
        alert('Curso criado com sucesso');
    }
    catch (error) {
        console.error('Erro ao criar o curso:', error);
        throw error;
    }

    
};

//função para buscar todos os cursos
export async function GetCourses() {
    const courses = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'Courses'));

        querySnapshot.forEach((doc) => {
            courses.push(doc.data());
        });
        return courses;
    }
    catch (error) {
        console.error('Erro ao buscar os cursos:', error);
        throw error;
    }
};

//função para atualizar um curso
export async function updateCourse(courseId, courseData) {


    

};

export async function DeleteCourse(docId){

    const controller = Controller();
    try {      
       //deletar o curso da categoria no cache local
        const categoriesLocal = JSON.parse(sessionStorage.getItem('categories'));
        categoriesLocal.forEach(category => {
            category.courses = category.courses.filter(course => course.id !== docId);
        }
        );
        //salvar no cache local
        sessionStorage.setItem('categories', JSON.stringify(categoriesLocal));
    
        //deletar o curso do banco de dados
        await deleteDoc(doc(db, 'Courses', docId));

        //deletar o curso da categoria no banco de dados
        const categoriesDB = await controller.manageCategories.GetCategories();
        categoriesDB.forEach(category => {
            category.courses = category.courses.filter(course => course.id !== docId);
        });
        //salvar no banco de dados
        categoriesDB.forEach(async category => {
            await updateDoc(doc(db, 'Categories', category.id), {
                courses: category.courses
            });
        });
        alert('Curso deletado com sucesso');
        return true;
    }
    catch (error) {
        console.error('Erro ao deletar o curso:', error);
        throw error;
    }
};