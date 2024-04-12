import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getUserId = async () => {
    try {
        const userCollection = collection(db, 'Users'); // Referência à coleção 'modulos' no Firestore
        const userSnapshot = await getDocs(userCollection); // Consulta todos os documentos na coleção 'modulos'

        // Mapeia os documentos e extrai os dados de cada um
        const userID = userSnapshot.docs.map(doc => {
            // Retorna um objeto contendo o ID do documento e os dados do módulo
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        //console.log(userID);
        // Retorna os dados dos módulos
        return userID;
    } catch (error) {
        console.error('Erro ao buscar o usuario:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
