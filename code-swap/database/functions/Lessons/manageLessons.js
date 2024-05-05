import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";



//função para criar uma lesson dentro de um modulo de um curso

export async function createLesson(moduleId, lessonData) {
    console.log('lessonData:', lessonData);
    console.log('moduleId:', moduleId);
    try {

        const docRef = await addDoc(collection(db, 'Lessons'), lessonData ,{merge: true})
        const lessonRef = doc(db, 'Lessons', docRef.id);

        await updateDoc(lessonRef, {id: docRef.id});

        //adicionar no database em Courses.Modules que é um array de objetos com o id do modulo, o titulo e a descrição
        await updateDoc(doc(db, 'Modules', moduleId), {
        //adicionar o id do modulo no array de modulos do curso
          lessons: arrayUnion({ id: docRef.id, nameLesson: lessonData.nameLesson, description: lessonData.description })
        });

        return docRef.id;

    } catch (error) {
        console.error('Erro ao criar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para atualizar uma lesson dentro de um modulo de um curso

export async function updateLesson(courseId, moduleId, lessonId, lessonData) {
    
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules;
            const moduleSelecionado = moduleData[moduleId];
           const aulas =  moduleSelecionado.lessons[lessonId] 
           //imprimir o curso selecionado, o modulo selecionado e a aula selecionada
            
            
            aulas.description = lessonData.description;
            aulas.nameLesson = lessonData.nameLesson;
            
            await updateDoc(docRef, courseData);
            alert(`Aula ${lessonData.nameLesson} atualizada com sucesso!`);
            window.location.reload();

        } else {
            console.error('Módulo não encontrado');
        }
    } catch (error) {
        console.error('Erro ao atualizar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para deletar lessons dentro de um modulo de um curso

export const deleteLesson = async (moduleId, lessonId) => {
    try {
        // Deletar a lesson no banco de dados com a LessonId
        await deleteDoc(doc(db, 'Lessons', lessonId));

        // Deletar a lesson no módulo que contenha o id o id da lesson
        const moduleRef = doc(db, 'Modules', moduleId);
        // pegar a lesson com o id da lesson
        const moduleSnap = await getDoc(moduleRef);
        const moduleData = moduleSnap.data();
        const lessons = moduleData.lessons;
        const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
        lessons.splice(lessonIndex, 1);
        await updateDoc(moduleRef, { lessons });


        
        
    } catch (error) {
        console.error('Erro ao deletar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}