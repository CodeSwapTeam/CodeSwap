import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const getUserData = async (userId) => {
    try {
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        // Verificar se há algum documento retornado pela consulta
        if (querySnapshot.empty) {
            throw new Error("Nenhum usuário encontrado com o userId fornecido");
        }
        
        // Retornar os dados do primeiro documento encontrado (assumindo que userId é único)
        const userData = querySnapshot.docs[0].data();
        return userData;
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
