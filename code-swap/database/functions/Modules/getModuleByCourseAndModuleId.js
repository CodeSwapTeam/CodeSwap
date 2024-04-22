import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

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