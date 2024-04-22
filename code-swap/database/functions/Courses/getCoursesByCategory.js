import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

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

        return courses;

    } catch (error) {
        console.error('Erro ao buscar os cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}