import {   doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const ChangePermissionUser = async (docId, permission) => {
    try {
        const docRef = doc(db,'Users', docId);
        await updateDoc(docRef,{
            permissions: permission
        })
        alert(`Permissão do usuário alterada para ${permission} com sucesso!`);
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};
