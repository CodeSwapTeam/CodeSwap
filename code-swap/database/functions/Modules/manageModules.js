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
    console.log('buscando modulo pelo ID')
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
export async function updateInfoModule(courseId, moduleId, newInfoModule) {
    console.log('atualizando modulo')
    console.log('newInfoModule', newInfoModule)

    try {
        // atualizar o title e a descrição do modulo no database
        await updateDoc(doc(db, 'Modules', moduleId), newInfoModule);

        // Recupere o documento atual
        const courseDoc = doc(db, 'Courses', courseId);
        const courseSnapshot = await getDoc(courseDoc);
        const courseData = courseSnapshot.data();

        const moduleIndex = courseData.modules.findIndex(module => module.id === moduleId);

        // Faça uma cópia do módulo, atualize os campos necessários e substitua o módulo antigo
        const updatedModule = { ...courseData.modules[moduleIndex], title: newInfoModule.title, description: newInfoModule.description };
        courseData.modules[moduleIndex] = updatedModule;

        // Atualize o documento com o novo array de módulos
        await updateDoc(courseDoc, { modules: courseData.modules });



    } catch (error) {
        console.error('Erro ao atualizar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//Função para atualizar as configuracoes do modulo
export async function updateModuleSettings(courseId, moduleId, settings) {
    try {
        // atualizar as configurações do modulo no database
        await updateDoc(doc(db, 'Modules', moduleId), settings);

        /* // Recupere o documento atual
        const courseDoc = doc(db, 'Courses', courseId);
        const courseSnapshot = await getDoc(courseDoc);
        const courseData = courseSnapshot.data();

        const moduleIndex = courseData.modules.findIndex(module => module.id === moduleId);

        // Faça uma cópia do módulo, atualize os campos necessários e substitua o módulo antigo
        const updatedModule = { ...courseData.modules[moduleIndex], settings };
        courseData.modules[moduleIndex] = updatedModule;

        // Atualize o documento com o novo array de módulos
        await updateDoc(courseDoc, { modules: courseData.modules }); */

    } catch (error) {
        console.error('Erro ao atualizar as configurações do módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


//função para deletar um modulo de um curso com base no indice do array modules no curso
export const deleteModule = async (courseSelectedId, moduleSelected) => {
    
    try {

        //deletar o modulo do curso no database
        await deleteDoc(doc(db, 'Modules', moduleSelected.id));

        //deletar o modulo do array de modulos do curso
        await updateDoc(doc(db, 'Courses', courseSelectedId), {
            modules: arrayRemove(moduleSelected)
        });

    } catch (error) {
        console.error('Erro ao deletar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};

//função para buscar as aulas do modulo
export async function GetLessonsModule(moduleId) {
    const lessons = [];
    try {
        const docRef = doc(db, 'Modules', moduleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const moduleData = docSnap.data();
            moduleData.lessons.forEach(lesson => {
                lessons.push(lesson);
            });
            return lessons;
        }
    } catch (error) {
        console.error('Erro ao buscar as aulas:', error);
        throw error;
    }
};