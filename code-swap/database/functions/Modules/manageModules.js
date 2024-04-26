import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";


//função para criar um modulo dentro de um curso

export async function createModule(courseId, moduleData) {
    try {
        const docRef = await addDoc(collection(db, 'Modules'), moduleData ,{merge: true})
        const moduleRef = doc(db, 'Modules', docRef.id);

        await updateDoc(moduleRef, {id: docRef.id});

        //adicionar no database em Courses.Modules que é um array de objetos com o id do modulo, o titulo e a descrição
        await updateDoc(doc(db, 'Courses', courseId), {
            //adicionar o id do modulo no array de modulos do curso
            modules: arrayUnion({ id: docRef.id, title: moduleData.nameModule, description: moduleData.description })
        });

        //pegar os dados dos modulos no sessionStorage
        const modules = JSON.parse(sessionStorage.getItem('modules'));
        //atualizar os dados do modulo no sessionStorage
        modules.push({ id: docRef.id, title: moduleData.nameModule, description: moduleData.description });
        //salvar os dados atualizados no sessionStorage
        sessionStorage.setItem('modules', JSON.stringify(modules));

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

//função para buscar os modulos do curso no cache local
export async function GetModulesLocal(){
    const modules = JSON.parse(sessionStorage.getItem('modules'));
    if(modules){
        return modules;
    }
}

//função para atualizar um modulo dentro de um curso
export async function updateModule(courseId, moduleId, newModuleData) {
        try {
        
        

    } catch (error) {
        console.error('Erro ao atualizar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


//função para deletar um modulo de um curso com base no indice do array modules no curso
export const deleteModule = async (courseSelectedId, moduleId) => {
    try {
        //deletar o modulo do curso no cache local
        const modules = JSON.parse(sessionStorage.getItem('modules'));
        //pegar o modulo com o id passado
        const module = modules.find(module => module.id === moduleId);
        //remover o modulo do array de modulos
        modules.splice(modules.indexOf(module), 1);
        //salvar os modulos atualizados no sessionStorage
        sessionStorage.setItem('modules', JSON.stringify(modules));

        //deletar o modulo do curso no database
        await deleteDoc(doc(db, 'Modules', moduleId));

        //deletar o modulo do array de modulos do curso
        await updateDoc(doc(db, 'Courses', courseSelectedId.id), {
            modules: arrayRemove({ id: moduleId, title: module.title, description: module.description })
        });
        
    } catch (error) {
        console.error('Erro ao deletar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};