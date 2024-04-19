import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const CreateUser = async (data) => {

    

    const userData = {
        userName: data.userName,
        idDataBase: '',
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        CoursesPermissions: [], // Array de objetos com courseId: curso e permissionModule:
        permissions: 1,
        codes: 100,
        xp: 100,
        lvl: 1
    }

    try {
        const docRef = await addDoc(collection(db, 'Users'), userData ,{merge: true})

        const userRef = doc(db, 'Users', docRef.id);

        await updateDoc(userRef, {id: docRef.id})

       // return userId; // Retorne o ID do usuário criado

    } catch (error) {
        console.error('Erro ao Criar usuário:', error);
        throw error; 
    }
};
