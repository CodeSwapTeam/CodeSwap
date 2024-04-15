import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getUserId = async () => {
    try {
        const userCollection = collection(db, 'Users'); 
        const userSnapshot = await getDocs(userCollection);

        // Mapeia os documentos e extrai os dados de cada um
        const userID = userSnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        //console.log(userID);
        
        return userID;
    } catch (error) {
        console.error('Erro ao buscar o usuario:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
