import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

//import { ContextDataCache } from "@/app/contexts/ContextDataCache";

//função para criar um modulo dentro de um curso

export async function createModule(courseId, newModule) {
    try {

        
        //console.log('courseId', courseId);
        //console.log('newModule', newModule);

        //////Criar o modulo no database/////////////////////////////////////

        const docRef = await addDoc(collection(db, 'Modules'), newModule ,{merge: true})
        const moduleRef = doc(db, 'Modules', docRef.id);

        await updateDoc(moduleRef, {id: docRef.id});

        //adicionar no database em Courses.Modules que é um array de objetos com o id do modulo, o titulo e a descrição
        await updateDoc(doc(db, 'Courses', courseId), {
        //adicionar o id do modulo no array de modulos do curso
          modules: arrayUnion({ id: docRef.id, title: newModule.title, description: newModule.description })
        });

        return docRef.id;


        alert('Módulo criado com sucesso');

    } catch (error) {
        console.error('Erro ao criar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para buscar todos os modulos de um curso
export async function GetModules(courseId) {
    const modules = [];
    try {
        const docRef = doc(db, 'Courses', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            courseData.modules.forEach(module => {
                modules.push(module);
            });
            //salvar os modulos no sessionStorage
            sessionStorage.setItem('modules', JSON.stringify(modules));
            return modules;
        }
    } catch (error) {
        console.error('Erro ao buscar os módulos:', error);
        throw error;
    }
};

//função para buscar um modulo PELO ID
export async function GetModuleById(moduleId) {
    try {
        const docRef = doc(db, 'Modules', moduleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
    } catch (error) {
        console.error('Erro ao buscar o módulo:', error);
        throw error;
    }
};

//função para buscar os modulos do curso no cache local
export async function GetModulesLocal() {

    //const { setModules } = ContextDataCache();

    const modules = JSON.parse(sessionStorage.getItem('modules'));
    if (modules) {
       // setModules(modules);
        return modules;
    }
}

//função para atualizar um modulo dentro de um curso
export async function updateModule(courseId, moduleId, newnewModule) {
    try {



    } catch (error) {
        console.error('Erro ao atualizar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


//função para deletar um modulo de um curso com base no indice do array modules no curso
export const deleteModule = async (courseSelectedId, moduleId, moduleSelected) => {
    
    try {

        //deletar o modulo do curso no database
        await deleteDoc(doc(db, 'Modules', moduleId));

        //deletar o modulo do array de modulos do curso
        await updateDoc(doc(db, 'Courses', courseSelectedId), {
            modules: arrayRemove(moduleSelected)
        });

    } catch (error) {
        console.error('Erro ao deletar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};