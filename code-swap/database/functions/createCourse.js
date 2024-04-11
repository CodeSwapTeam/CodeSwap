import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function CreateCourse() {
    try {
        // Dados do módulo do curso
        const moduleData = {
            title: 'WebDesign',
            description: 'Módulo de curso de WebDesign',
            courses: ['HTML', 'CSS', 'JavaScript']
        };

        // Referência ao documento no Firestore
        const docRef = doc(db, 'Modulos', 'WebDesign');

        // Salva os dados do módulo no Firestore
        await setDoc(docRef, moduleData);

        console.log('Módulo do curso criado com sucesso no Firestore');
    } catch (error) {
        console.error('Erro ao criar o módulo do curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}
