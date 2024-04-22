import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const getAllModulesAndCourses = async () => {
    try {
        const modulesCollection = collection(db, 'Modulos'); // Referência à coleção 'modulos' no Firestore
        const modulesSnapshot = await getDocs(modulesCollection); // Consulta todos os documentos na coleção 'modulos'

        // Mapeia os documentos e extrai os dados de cada um
        const modulesData = modulesSnapshot.docs.map(doc => {
            // Retorna um objeto contendo o ID do documento e os dados do módulo
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        //console.log(modulesData);
        // Retorna os dados dos módulos
        return modulesData;
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
