import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc } from "firebase/firestore";
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
            cover: formData.cover,
            coursePremium: formData.coursePremium,
            category: formData.category,
            SequentialModule: formData.SequentialModule,
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
        //console.error('Erro ao criar o curso:', error);
        //throw error;
        alert('Por favor selecione a categoria novamente!');
        //recarregar a página
        window.location.reload();

        //salvar no cache local os dados da categoria para recuperação em caso de erro
        sessionStorage.setItem('erro_save', JSON.stringify(formData));

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
export async function updateCourse(courseId, courseCategoryId, courseData) {

    const controller = Controller();

    try {

        //atualizar o curso no cache local
        const categoriesLocal = JSON.parse(sessionStorage.getItem('categories'));
        const categorie = categoriesLocal.find(category => category.id === courseCategoryId);

        console.log('categorie', categorie);

        let courseDataCache;

        if (categorie && categorie.courses) {
            courseDataCache = categorie.courses.find(course => course.id === courseId);
            console.log('curso', courseDataCache);
            if (courseDataCache) {
                courseDataCache.title = courseData.title;
                courseDataCache.description = courseData.description;
            }
            
        } else {
            console.log('Categoria não encontrada ou não possui cursos');
        }
        
       
        //salvar no cache local   
        sessionStorage.setItem('categories', JSON.stringify(categoriesLocal));
        

        //atualizar o title e a descrição do curso no banco de dados
        await updateDoc(doc(db, 'Courses', courseId), {
            title: courseData.title,
            description: courseData.description
        });
        


        //atualizar o curso na categoria no banco de dados com a categoria courseCategoryId
        await updateDoc(doc(db, 'Categories', courseCategoryId), {
            //buscar o no array de cursos da categoria o curso com o id courseId e atualizar o title e a descrição
            courses: categorie.courses.map(course => course.id === courseId ? { id: courseId, title: courseData.title, description: courseData.description } : course)
        });


        
        //salvar no banco de dados
        
        //alert('Curso atualizado com sucesso');
    }
    catch (error) {
        //console.error('Erro ao atualizar o curso:', error);
        alert('Por favor selecione a categoria novamente!');
 
    }


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


//função para buscar um curso pelo id
export async function GetCourseById(courseId) {
    try {

        //primeiro buscar o curso no cache local
        const categoriesLocal = JSON.parse(sessionStorage.getItem('courses'));
        if(categoriesLocal){
            const course = categoriesLocal.find(course => course.id === courseId);
            if (course) {
                return course;
            }
        }
        //se não encontrar buscar no banco de dados
        const docRef = doc(db, 'Courses', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            //salvar no cache local em 'courses', se não existir criar o array
            const coursesLocal = JSON.parse(sessionStorage.getItem('courses')) || [];
            coursesLocal.push(docSnap.data());
            sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

            

            return docSnap.data();
            

        }
    } catch (error) {
        console.error('Erro ao buscar o curso:', error);
        throw error;
    }
};

//função para atualizar a thumbnail do curso
export async function UpdateThumbnail(courseId, thumbnail) {
    try {
        await updateDoc(doc(db, 'Courses', courseId), {
            thumbnail: thumbnail
        });
        //atualizar a thumbnail no cache local
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const course = coursesLocal.find(course => course.id === courseId);
        course.thumbnail = thumbnail;
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        alert('Thumbnail atualizada com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar a thumbnail:', error);
        throw error;
    }
};

//função para atualizar a capa do curso
export async function UpdateCover(courseId, cover) {
    try {
        await updateDoc(doc(db, 'Courses', courseId), {
            cover: cover
        });
        //atualizar a capa no cache local
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const course = coursesLocal.find(course => course.id === courseId);
        course.cover = cover;
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        alert('Capa atualizada com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar a capa:', error);
        throw error;
    }
};