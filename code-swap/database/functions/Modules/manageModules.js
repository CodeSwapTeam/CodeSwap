import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

//import { ContextDataCache } from "@/app/contexts/ContextDataCache";

////>>>>ALTERADO PARA API ROUTER<<<<função para criar um modulo dentro de um curso
export async function createModule(courseId, newModule) {
    try {
        ///////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para criar um modulo no banco de dados
        const moduleData = {
            title: newModule.title,
            description: newModule.description,
            courseId: courseId,
            id: '',
            permission: newModule.permission,
            lessons: []
        };

        const response = await fetch('/api/posts?type=CreateModule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moduleData)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar o módulo');
        }

        const data = await response.json();

        alert(data.message);

        return data.moduleId;

    } catch (error) {
        console.error('Erro ao criar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}



////>>>>ALTERADO PARA API ROUTER<<<<função para buscar um modulo PELO ID
export async function GetModuleById(moduleId) {
    try {
        ///////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router GET para buscar um modulo pelo id
        const response = await fetch(`/api/gets?type=moduleID&id=${moduleId}`);
        const data = await response.json();
        return data;


        /* const docRef = doc(db, 'Modules', moduleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } */
    } catch (error) {
        console.error('Erro ao buscar o módulo:', error);
        throw error;
    }
};


//>>>>ALTERADO PARA API ROUTER<<<<função para atualizar um modulo dentro de um curso
export async function updateInfoModule(courseId, moduleId, newInfoModule) {

    try {
        //////////////////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        //api router POST para atualizar um modulo no banco de dados
        const moduleData = {
            courseId: courseId,
            moduleId: moduleId,
            title: newInfoModule.title,
            description: newInfoModule.description
        };

        const response = await fetch(`/api/posts?type=updateInfoModule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moduleData)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o módulo');
        }

        const data = await response.json();

        alert(data.message);

    } catch (error) {
        console.error('Erro ao atualizar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//Função para atualizar as configuracoes do modulo
export async function UpdateModuleConfigs(moduleId, settings) {
    try {
        // atualizar as configurações do modulo no database
        await updateDoc(doc(db, 'Modules', moduleId), settings);

        alert('Configurações do módulo atualizadas com sucesso');

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








//>>>NÃO UTILIZADO AINDA<<<<<função para buscar todos os modulos de um curso
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