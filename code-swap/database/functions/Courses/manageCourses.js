import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function CreateCourse(formData) {
    try {
        const courseData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            modules: [],
        }

        const docRef = await setDoc(doc(db, 'Courses', formData.title), courseData);

        return docRef.id;
    }
    catch (error) {
        console.error('Erro ao criar o curso:', error);
        throw error;
    }

    
};

//função para atualizar um curso
export async function updateCourse(courseId, courseData) {

};

export const DeleteCourse = async (docId) => {

};