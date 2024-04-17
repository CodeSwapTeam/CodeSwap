import {  deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const DeleteCourse = async (docId) => {
    try {
        
        await deleteDoc(doc(db, "Modulos", docId));
        alert('Curso deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};

//função para deletar um modulo de um curso com base no indice do array modules no curso
export const deleteModule = async (courseId, moduleindexArray) => {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            //remover o modulo do array modules
            courseData.modules.splice(moduleindexArray, 1);
            //atualizar o documento no firestore
            await updateDoc(docRef, courseData);
            alert(`Módulo deletado com sucesso!`);
            window.location.reload();
            
        } 
    } catch (error) {
        console.error('Erro ao deletar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};


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


//função para buscar um curso pelo id
/*
export async function getModuleById(courseId, moduleId) {
    console.log(courseId);
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules.find(module => module.id === moduleId);
            if (moduleData) {
                return moduleData;
            } else {
                console.error('Módulo não encontrado');
                return null;
            }
        } else {
            console.error('Curso não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}
*/