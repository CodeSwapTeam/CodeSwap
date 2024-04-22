import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";



//função para criar uma lesson dentro de um modulo de um curso

export async function createLesson(courseId, moduleId, lessonData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules;
            const moduleSelecionado = moduleData[moduleId];
            moduleSelecionado.lessons.push(lessonData);
            await updateDoc(docRef, courseData);
            alert(`Aula ${lessonData.nameLesson} criada com sucesso!`);
            window.location.reload();
        } else {
            console.error('Módulo não encontrado');
        }
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