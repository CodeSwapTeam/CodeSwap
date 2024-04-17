import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useInteractionLogger } from "@/app/contexts/InteractionContext";
import interactionsType from "@/app/contexts/interactionsType";
import { v4 as uuidv4 } from 'uuid';

export async function CreateCourse(formData, user) {

    //const {logInteraction} = useInteractionLogger();

    try {

        formData.owner = user;

        

        
        //console.log(formData);
        // Referência ao documento no Firestore
        const docRef = doc(db, 'Modulos', formData.title);

        // Salva os dados do módulo no Firestore
        await setDoc(docRef, formData);
        
    } catch (error) {
        console.error('Erro ao criar o módulo do curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para atualizar um curso
export async function updateCourse(courseId, courseData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        await updateDoc(docRef, courseData);
        alert('Curso atualizado com sucesso!');
        window.location.reload();
    } catch (error) {
        console.error('Erro ao atualizar o curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para criar um modulo dentro de um curso

export async function createModule(courseId, moduleData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            courseData.modules.push(moduleData);
            await updateDoc(docRef, courseData);
            alert(`Módulo ${moduleData.nameModule} criado com sucesso!`);
            window.location.reload();
        } else {
            console.error('Curso não encontrado');
        }
    } catch (error) {
        console.error('Erro ao criar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para atualizar um modulo dentro de um curso

export async function updateModule(courseId, moduleId, newModuleData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules;
            //atualizar o description e o nameModule do modulo com os dados passados no moduleData
            moduleData[moduleId].description = newModuleData.description;
            moduleData[moduleId].nameModule = newModuleData.nameModule;

            await updateDoc(docRef, courseData);
            alert(`Módulo ${newModuleData.nameModule} atualizado com sucesso!`);
            
            window.location.reload();

            
            
        }
        

    } catch (error) {
        console.error('Erro ao atualizar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

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



