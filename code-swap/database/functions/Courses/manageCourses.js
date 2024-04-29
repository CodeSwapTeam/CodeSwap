import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Controller from "@/Controller/controller";
import { GetCategories } from "../Category/manageCategories";



export async function CreateCourse(formData) {
    let courseID;

    try {
        const courseData = {
            title: formData.title,
            status: 'pending', // pending, approved, reviewed, rejected
            description: formData.description,
            owner: formData.owner,
            experience: formData.experience,
            difficulty: formData.difficulty,
            codes: formData.codes,
            courseObservations: formData.courseObservations,
            id: '',
            imgUrlThumbnail: formData.thumbnail,
            imgUrlCover: formData.cover,
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
        courseID = docRef.id;
        
        //adicionar no database em'categories' dentro de courses que é um array de objetos com o id do curso, o titulo e a descrição
        await updateDoc(doc(db, 'Categories', courseData.category), {
            //adicionar o id do curso no array de cursos da categoria
            courses: arrayUnion({ id: docRef.id, title: courseData.title, description: courseData.description, imgUrlThumbnail: courseData.imgUrlThumbnail, status: courseData.status })
        });

        //pegar os dados das categorias no sessionStorage
        const categories = JSON.parse(sessionStorage.getItem('categories'));
        //atualizar os dados da categoria no sessionStorage
        categories.forEach(category => {
            if (category.id === formData.category) {
                category.courses.push({ id: docRef.id, title: courseData.title, description: courseData.description, imgUrlThumbnail: courseData.imgUrlThumbnail, status: courseData.status });
            }
        });
        //salvar os dados atualizados no sessionStorage
        sessionStorage.setItem('categories', JSON.stringify(categories));
        alert('Curso criado com sucesso');
    }
    catch (error) {

        alert('Erro ao criar o curso, tente novamente!');
        window.location.reload();

        //salvar no cache local o formData com dados da categoria para recuperação e o courseID em caso de erro
        //mesclar o formdata com o courseID
        const courseData = { ...formData, id: courseID };
        //salvar no cache local
        //salvar no cache local o formData com dados da categoria para recuperação e o courseID em caso de erro
        sessionStorage.setItem('erro_save', JSON.stringify(courseData));

        throw error;

    }


};

//função para deletar um curso
export async function DeleteCourse(docId) {

    const controller = Controller();
    try {

        ////////DELETE NO CACHE LOCAL /////////////////////////////////////////

        //deletar o curso da categoria no cache local
        const categoriesLocal = JSON.parse(sessionStorage.getItem('categories'));
        categoriesLocal.forEach(category => {
            category.courses = category.courses.filter(course => course.id !== docId)
        });
        sessionStorage.setItem('categories', JSON.stringify(categoriesLocal));

        //deletar o curso do cache local de cursos
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const course = coursesLocal.find(course => course.id === docId);
        coursesLocal.splice(coursesLocal.indexOf(course), 1);
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        ///////////////////////////////////////////////////////////////////////


        ////////DELETE NO BANCO DE DADOS /////////////////////////////////////////

        //deletar o curso do banco de dados
        await deleteDoc(doc(db, 'Courses', docId));

        //deletar o curso da categoria no banco de dados
        const categoriesDB = await controller.manageCategories.GetCategories();
        categoriesDB.forEach(category => {
            category.courses = category.courses.filter(course => course.id !== docId);
        });
        categoriesDB.forEach(async category => {
            await updateDoc(doc(db, 'Categories', category.id), {
                courses: category.courses
            });
        });

        ///////////////////////////////////////////////////////////////////////

        return true;
    }
    catch (error) {
        console.error('Erro ao deletar o curso:', error);
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

//função para atualizar apenas título e descrição do curso
export async function UpdateInfoCourse(courseId, courseCategoryId, courseData) {

    try {

        ////////ATUALIZAÇÃO DE CACHE LOCAL /////////////////////////////////////////

        //atualizar o curso no cache local de categorias
        const categoriesLocal = JSON.parse(sessionStorage.getItem('categories'));
        const categorie = categoriesLocal.find(category => category.id === courseCategoryId);

        let courseDataCache;

        if (categorie && categorie.courses) {
            courseDataCache = categorie.courses.find(course => course.id === courseId);

            if (courseDataCache) {
                courseDataCache.title = courseData.title;
                courseDataCache.description = courseData.description;
            }

        } else {
            console.log('Categoria não encontrada ou não possui cursos');
        }

        sessionStorage.setItem('categories', JSON.stringify(categoriesLocal));

        //atualizar o curso no cache local de cursos
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const courseLocal = coursesLocal.find(course => course.id === courseId);
        if (courseLocal) {
            courseLocal.title = courseData.title;
            courseLocal.description = courseData.description;
        }
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        /////////////////////////////////////////////////////////////////////////////


        ////////ATUALIZAÇÃO DE BANCO DE DADOS /////////////////////////////////////////

        //Atualização do titulo e descrição do curso no banco de dados
        await updateDoc(doc(db, 'Courses', courseId), {
            title: courseData.title,
            description: courseData.description
        });

        //Atualização do titulo e descrição do curso na categoria no banco de dados
        await updateDoc(doc(db, 'Categories', courseCategoryId), {
            //buscar o no array de cursos da categoria o curso com o id courseId e atualizar o title e a descrição
            courses: categorie.courses.map(course => course.id === courseId ? { id: courseId, title: courseData.title, description: courseData.description } : course)
        });

    }
    catch (error) {
        console.error('Erro ao atualizar o curso:', error);


    }

};

export async function UpdateConfigCourseData(data) {

    const { courseId, courseData, categoryId } = data;

    // Funções auxiliares para atualizar o cache local
    const updateLocalCategories = (categoryId, courseId, status) => {
        const categoriesLocal = JSON.parse(sessionStorage.getItem('categories'));
        const category = categoriesLocal.find(category => category.id === categoryId);
        const courseLocal = category.courses.find(course => course.id === courseId);
        courseLocal.status = status;
        sessionStorage.setItem('categories', JSON.stringify(categoriesLocal));
    }

    const updateLocalCourses = (courseId, courseData) => {
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const courseLocalUpdate = coursesLocal.find(course => course.id === courseId);
        Object.assign(courseLocalUpdate, courseData);
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));
    }

    // Funções auxiliares para atualizar o banco de dados
    const updateDatabaseCourse = async (courseId, courseData) => {
        await updateDoc(doc(db, 'Courses', courseId), courseData);
    }

    const updateDatabaseCategory = async (categoryId, courseId, courseData) => {
        const categoryDoc = doc(db, 'Categories', categoryId);
        const categorySnap = await getDoc(categoryDoc);
        const category = categorySnap.data();
        const course = category.courses.find(course => course.id === courseId);
        
        course.status = courseData.status;
        course.imgUrlThumbnail = courseData.imgUrlThumbnail;


        //atualizar a categoria no banco de dados
        await updateDoc(categoryDoc, {
            courses: category.courses
        });
    }


    try {
        //Atualização das configurações do curso no cache local
        updateLocalCategories(categoryId, courseId, courseData.status);
        updateLocalCourses(courseId, courseData);

        //Atualização das configurações do curso no banco de dados
        await updateDatabaseCourse(courseId, courseData);
        await updateDatabaseCategory(categoryId, courseId, courseData);
    } catch (error) {
        console.error('Erro ao atualizar o curso:', error);
        throw error;
    }

}




//função para buscar um curso pelo id
export async function GetCourseById(courseId) {
    try {

        //primeiro buscar o curso no cache local
        const categoriesLocal = JSON.parse(sessionStorage.getItem('courses'));
        if (categoriesLocal) {
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
export async function UpdateThumbnail(courseId, imgUrlThumbnail) {
    try {
        await updateDoc(doc(db, 'Courses', courseId), {
            imgUrlThumbnail: imgUrlThumbnail
        });
        //atualizar a thumbnail no cache local
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const course = coursesLocal.find(course => course.id === courseId);
        course.imgUrlThumbnail = imgUrlThumbnail;
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        alert('Thumbnail atualizada com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar a thumbnail:', error);
        throw error;
    }
};

//função para atualizar a capa do curso
export async function UpdateCover(courseId, imgUrlCover) {
    try {
        await updateDoc(doc(db, 'Courses', courseId), {
            imgUrlCover: imgUrlCover
        });
        //atualizar a capa no cache local
        const coursesLocal = JSON.parse(sessionStorage.getItem('courses'));
        const course = coursesLocal.find(course => course.id === courseId);
        course.imgUrlCover = imgUrlCover;
        sessionStorage.setItem('courses', JSON.stringify(coursesLocal));

        alert('Capa atualizada com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar a capa:', error);
        throw error;
    }
};