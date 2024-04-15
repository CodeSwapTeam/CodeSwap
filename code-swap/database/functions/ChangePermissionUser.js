import {   doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const ChangePermissionUser = async (docId, permission) => {
    try {
        const docRef = doc(db,'Users', docId);
        await updateDoc(docRef,{
            permissions: permission
        })
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
