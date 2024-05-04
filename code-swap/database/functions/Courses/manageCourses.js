import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Controller from "@/Controller/controller";





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


        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para criar um curso no banco de dados
        const response = await fetch('/api/posts?type=course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar o curso');
        }

        const data = await response.json();
        alert(data.message);

/* 
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

        alert('Curso criado com sucesso'); */
        //return courseID;
    }
    catch (error) {
        alert('Erro ao criar o curso, tente novamente!');
        window.location.reload();

        //salvar no cache local o formData com dados da categoria para recuperação e o courseID em caso de erro
        const courseData = { ...formData, id: courseID };
        //salvar no cache local o formData com dados da categoria para recuperação e o courseID em caso de erro
        sessionStorage.setItem('erro_save', JSON.stringify(courseData));

        throw error;
    }


};

//>>>>ALTERADO PARA API ROUTER<<<<função para deletar um curso
export async function DeleteCourse(docId) {

    const controller = Controller();
    try {

        const response = await fetch(`/api/delete?id=${docId}&type=course`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Erro ao deletar o curso');
          }

          const data = await response.json();
            alert(data.message);

        ////////DELETE NO BANCO DE DADOS //////////////////////////////////////////

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
        //Atualização do titulo e descrição do curso no banco de dados     
        await updateDoc(doc(db, 'Courses', courseId), {
            title: courseData.title,
            description: courseData.description
        });

        //Atualização do titulo e descrição do curso na categoria no banco de dados
        const categoryDoc = doc(db, 'Categories', courseCategoryId);
        const categorySnapshot = await getDoc(categoryDoc);
        if (categorySnapshot.exists()) {
            const categoryData = categorySnapshot.data();
            const courses = categoryData.courses;
            const updatedCourses = courses.map(course => {
                if (course.id === courseId) {
                    return { ...course, title: courseData.title, description: courseData.description };
                } else {
                    return course;
                }
            });
            await updateDoc(categoryDoc, { courses: updatedCourses });
        }
        alert('Curso atualizado com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar o curso:', error);
    }
};

export async function UpdateConfigCourseData(data) {
    const { courseId, courseData, categoryId } = data;

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
       

        //Atualização das configurações do curso no banco de dados
        await updateDatabaseCourse(courseId, courseData);
        await updateDatabaseCategory(categoryId, courseId, courseData);
    } catch (error) {
        console.error('Erro ao atualizar o curso:', error);
        throw error;
    }

}




//>>>>ALTERADO PARA API ROUTE<<<< função para buscar um curso pelo id
export async function GetCourseById(Id) {
    try {

        let course = await fetch(`/api/gets?id=${Id}&type=courseId`);
        let data = await course.json();
        course = data[0];

        return course;
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

        alert('Capa atualizada com sucesso');
    }
    catch (error) {
        console.error('Erro ao atualizar a capa:', error);
        throw error;
    }
};


//função para buscar cursos pela categoria
export async function GetCoursesByCategory(categoryId) {
    const courses = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'Courses'), where('category', '==', categoryId));
        querySnapshot.forEach((doc) => {
            courses.push(doc.data());
        });
        return courses;
    }
    catch (error) {
        console.error('Erro ao buscar os cursos:', error);
        throw error;
    }
}
