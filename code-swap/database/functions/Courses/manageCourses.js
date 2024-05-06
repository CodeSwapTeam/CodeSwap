import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Controller from "@/Controller/controller";




//>>>>ALTERADO PARA API ROUTER<<<<
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
        const response = await fetch('/api/posts?type=CreateCourse', {
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

//>>>>ALTERADO PARA API ROUTE<<<<  função para buscar um curso pelo id
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

//>>>>ALTERADO PARA API ROUTER<<<< função para deletar um curso
export async function DeleteCourse(docId) {

    console.log('relete course:', docId);

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
      /*   const categoriesDB = await controller.manageCategories.GetAllCategories();
        categoriesDB.forEach(category => {
            category.courses = category.courses.filter(course => course.id !== docId);
        });
        categoriesDB.forEach(async category => {
            await updateDoc(doc(db, 'Categories', category.id), {
                courses: category.courses
            });
        }); */

        ///////////////////////////////////////////////////////////////////////

  
    }
    catch (error) {
        console.error('Erro ao deletar o curso:', error);
        throw error;
    }
};



//função para atualizar apenas título e descrição do curso
export async function UpdateInfoCourse(courseId, courseCategoryId, courseData) {
    try {

        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para atualizar o titulo e descrição do curso no banco de dados
        const response = await fetch('/api/posts?type=UpdateInfoCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId, courseData, categoryId: courseCategoryId })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o curso');
        }

        const data = await response.json();
        alert(data.message);
    }
    catch (error) {
        console.error('Erro ao atualizar o curso:', error);
    }
};


export async function UpdateConfigCourseData(data) {
    const { courseId, courseData, categoryId } = data;
    try {     
        //////////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para atualizar as configurações do curso no banco de dados
        const response = await fetch('/api/posts?type=UpdateCourseConfigs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId, courseData, categoryId })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o curso');
        }

        const data = await response.json();
        alert(data.message);


    } catch (error) {
        console.error('Erro ao atualizar o curso:', error);
        throw error;
    }

}

//função para atualizar a thumbnail do curso >>>>>>>>> NA CRIAÇÃO DO CURSO<<<<<<<<<<
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









//--- NÃO IMPLEMENTADO --- função para buscar cursos pela categoria
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

//--- NÃO IMPLEMENTADO --- função para buscar todos os cursos
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
