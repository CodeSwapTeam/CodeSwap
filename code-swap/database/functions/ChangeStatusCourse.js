import {  deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const ChangeStatusCourse = async (docId) => {
    try {
        const docRef = doc(db,'Modulos', docId);
        await updateDoc(docRef,{
            status: 'approved'
        })
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
