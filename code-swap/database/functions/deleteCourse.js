import {  deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const DeleteCourse = async (docId) => {
    try {
        
        await deleteDoc(doc(db, "Modulos", docId));
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
