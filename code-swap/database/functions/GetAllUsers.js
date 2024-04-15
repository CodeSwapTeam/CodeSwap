import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function GetAllUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usuarios = [];
        querySnapshot.forEach((doc) => {
            usuarios.push({ id: doc.id, data: doc.data() });
        });
        return usuarios;
    } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}
