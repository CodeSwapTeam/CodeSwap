import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getCookies } from "@/app/services/cookies";
import { decryptObjectData } from "@/app/services/encryptedAlgorithm";


//criar uma categoria para o curso

export async function createCategory(categoryName) {
    try {
        //criar collection de categorias com id auto gerado
        const collectionRef = collection(db, 'categories');
        
        //adicionar documento com nome da categoria
        await setDoc(doc(collectionRef), {
            name: categoryName,
            courses: []
        });


        alert(`Categoria ${categoryName} criada com sucesso!`);


    } catch (error) {
        console.error('Erro ao criar a categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//buscar todas as categorias
export async function getAllCategories() {
    try {

        //buscar todas as categorias
        const categories = [];
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        categoriesSnapshot.forEach((doc) => {
            categories.push(doc.data());
        });

        return categories;

    } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


//adicionar um curso a uma categoria

export async function addCourseToCategory(courseId, categoryName) {
    try {
        //buscar a categoria pelo nome
        const categoriesRef = collection(db, 'categories');
        const query = await getDocs(categoriesRef);
        
        query.forEach(async (doc) => {
            if (doc.data().name === categoryName) {
                //adicionar o id do curso na lista de cursos da categoria
                await updateDoc(doc.ref, {
                    courses: [...doc.data().courses, courseId]
                });
            }
        });

        

    } catch (error) {
        console.error('Erro ao adicionar o curso à categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//editar categoria

export async function updateCategory(categoryName, courseId) {
    
    try {
        //buscar o curso pelo id
        const cursoRef = collection(db, 'Modulos');
        const query = await getDocs(cursoRef);

        query.forEach(async (doc) => {
            if (doc.id === courseId) {
                //atualizar o nome da categoria
                await updateDoc(doc.ref, {
                    category: categoryName
                });
            }
        });

        alert(`Categoria ${categoryName} atualizada com sucesso!`);
        window.location.reload();

    } catch (error) {
        console.error('Erro ao atualizar a categoria:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}


// função que busca os cursos que tem a idCourse igual ao parametro da url

export async function getCoursesByCategory(idCourse) {
    try {
        const courses = [];
        const coursesRef = collection(db, 'Modulos');
        const query = await getDocs(coursesRef);

        query.forEach((doc) => {
            if (doc.data().idCourse === idCourse) {
                courses.push(doc.data());
            }
        });

        //verificar se o usuario esta logado checando se o token de acesso esta nos cookies
        const cookies = await getCookies();

        let userDecrypted = null;
        let user = null;

        //descriptografar o token de acesso se cookies não for undefined
        if (cookies) {
            userDecrypted = decryptObjectData(cookies.value);

            //verificar se o usuario esta logado
            if (!userDecrypted) {
                user = null;
            } else {
                user = userDecrypted.userId;
            }
        }

        let userLoggedData = null;

        //se usuario estiver logado dentro do curso, dentro de modules o aray registrationsModule será filtrado somente os objetos que tem o userId igual ao userId do usuario logado
        if (user) {
            userLoggedData = courses[0].modules.map((module) => {
                return {
                    ...module,
                    registrationsModule: module.registrationsModule.filter((registration) => registration.userId === user)
                }
            });

            let registrationsCourse = courses[0].registrations.filter((registration) => registration.userId === user);

            if (registrationsCourse.length === 0) {
                registrationsCourse = null;
            } else {
                registrationsCourse = registrationsCourse[0];
            }

            //adicionar no userLoggedData o objeto registrationsCourse
            userLoggedData = {
                ...courses[0],
                modules: userLoggedData,
                registrations: registrationsCourse
            }

        } else {
            userLoggedData = null;
        }

        //se usuario estiver logado, retornar o objeto userLoggedData, senão retornar o objeto courses
        if (user) {
            //adicionar dentro de um array o objeto userLoggedData e retornar o array
            //console.log('userLoggedData:', [userLoggedData]);
            return [userLoggedData];
        } else {
            //se nao estiver logado remover o item registrations de dentro do objeto courses
            delete courses[0].registrations;
            //dentro do curses[0].modules remover todos os objetos do array registrationsModule de cada objeto do array modules
            courses[0].modules.forEach((module) => {
                delete module.registrationsModule;
            });
            //adicionar dentro de um array o objeto courses e retornar o array
            //console.log('courses:', [courses[0]]);
            return [courses[0]];

        }

    } catch (error) {
        console.error('Erro ao buscar os cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}




// função para buscar os cursos pela id do curso 

export async function getModuleByCourseAndModuleId(idcourse, idmodule) {
    
    try {
        const courses = [];
        const coursesRef = collection(db, 'Modulos');
        const query = await getDocs(coursesRef);

        query.forEach((doc) => {
            if (doc.data().idCourse === idcourse) {
                courses.push(doc.data());
            }
        });

        //buscar o modulo pelo id dentro course.modules
        const module = courses[0].modules.filter((module) => module.idModule === idmodule);
        

        return module;

        

    } catch (error) {
        console.error('Erro ao buscar os cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
    
    
}


