import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";


//função para criar um modulo dentro de um curso

export async function createModule(courseId, newModule) {
    try {

        


        //////Criar o modulo no database/////////////////////////////////////

        const docRef = await addDoc(collection(db, 'Modules'), newModule ,{merge: true})
        const moduleRef = doc(db, 'Modules', docRef.id);

        await updateDoc(moduleRef, {id: docRef.id});

        //adicionar no database em Courses.Modules que é um array de objetos com o id do modulo, o titulo e a descrição
        await updateDoc(doc(db, 'Courses', courseId), {
        //adicionar o id do modulo no array de modulos do curso
          modules: arrayUnion({ id: docRef.id, title: newModule.nameModule, description: newModule.description })
        });


        //////Atualizar o modulo no cache local/////////////////////////////////////

        // Pegar os dados dos módulos no sessionStorage ou inicializar com um array vazio se não existir
        let modules = sessionStorage.getItem('modules');
        modules = modules ? JSON.parse(modules) : [];

        // Atualizar os dados do módulo no sessionStorage
        modules.push({ id: docRef.id, title: newModule.nameModule, description: newModule.description , lessons: []});

        // Salvar os dados atualizados no sessionStorage
        sessionStorage.setItem('modules', JSON.stringify(modules));

        //Atualizar os cursos no cache local com os novos modulos
        let courses = sessionStorage.getItem('courses');
        courses = courses ? JSON.parse(courses) : [];

        // Atualizar os dados do módulo no sessionStorage
        courses.forEach(course => {
            if (course.id === courseId) {
                course.modules.push({ id: docRef.id, title: newModule.nameModule, description: newModule.description });
            }
        });

        // Salvar os dados atualizados no sessionStorage
        sessionStorage.setItem('courses', JSON.stringify(courses));


        /////////////////////////////////////////////////////////////////////////




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
    const modules = JSON.parse(sessionStorage.getItem('modules'));
    if (modules) {
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
export const deleteModule = async (courseSelectedId, moduleId) => {
    
    try {
        //console.log('courseSelectedId', courseSelectedId);
        //console.log('moduleId', moduleId);
        //deletar o modulo do curso no cache local
        const modules = JSON.parse(sessionStorage.getItem('modules'));
        //pegar o modulo com o id passado
        const module = modules.find(module => module.id === moduleId);
        //remover o modulo do array de modulos
        modules.splice(modules.indexOf(module), 1);
        //salvar os modulos atualizados no sessionStorage
        sessionStorage.setItem('modules', JSON.stringify(modules));



        //deletar o modulo do array de modulos do curso no
        const courses = JSON.parse(sessionStorage.getItem('courses'));

        //pegar o curso com o id passado
        const course = courses.find(course => course.id === courseSelectedId);
        //remover o modulo do array de modulos
        course.modules.splice(course.modules.indexOf(module), 1);
        //salvar os modulos atualizados no sessionStorage
        sessionStorage.setItem('courses', JSON.stringify(courses));

        //deletar o modulo do curso no database
        await deleteDoc(doc(db, 'Modules', moduleId));

        //deletar o modulo do array de modulos do curso
        await updateDoc(doc(db, 'Courses', courseSelectedId), {
            modules: arrayRemove({ id: moduleId, title: module.title, description: module.description })
        });

    } catch (error) {
        console.error('Erro ao deletar o módulo:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};