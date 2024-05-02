import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";



//função para criar uma lesson dentro de um modulo de um curso

export async function createLesson(courseId, moduleId, lessonData) {
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

export const deleteLesson = async (courseId, moduleId, lessonId) => {
    console.log(courseId, moduleId, lessonId);
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules;
            //pegar o modulo pelo id
            const moduleSelecionado = moduleData[moduleId];
            const aulas = moduleSelecionado.lessons

            alert(`Aula deletada com sucesso`);
            //remover a aula do array lessons com base no id da aula lessonId
            aulas.splice(lessonId, 1);
            //atualizar o documento no firestore
            await updateDoc(docRef, courseData);
            
            window.location.reload();

            } 
        
        
    } catch (error) {
        console.error('Erro ao deletar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}