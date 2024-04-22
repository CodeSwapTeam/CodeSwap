import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";


//função para criar um modulo dentro de um curso

export async function createModule(courseId, moduleData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            courseData.modules.push(moduleData);
            await updateDoc(docRef, courseData);
            //alert(`Módulo ${moduleData.nameModule} criado com sucesso!`);
          //  window.location.reload();
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