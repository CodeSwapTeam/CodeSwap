import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function CreateCourse(formData, user) {

    //const {logInteraction} = useInteractionLogger();

    try {

        formData.owner = user;
        // Referência ao documento no Firestore
        const docRef = doc(db, 'Modulos', formData.title);

        // Salva os dados do módulo no Firestore
        await setDoc(docRef, formData);
        
    } catch (error) {
        console.error('Erro ao criar o módulo do curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para atualizar um curso
export async function updateCourse(courseId, courseData) {
    try {
        const docRef = doc(db, 'Modulos', courseId);
        await updateDoc(docRef, courseData);
        alert('Curso atualizado com sucesso!');
        window.location.reload();
    } catch (error) {
        console.error('Erro ao atualizar o curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

export const DeleteCourse = async (docId) => {
    try {
        
        await deleteDoc(doc(db, "Modulos", docId));
        alert('Curso deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao buscar os módulos e cursos:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};