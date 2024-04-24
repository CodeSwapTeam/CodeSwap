import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";


// Função para criar um usuário no banco de dados
export const CreateUser = async (data) => {

    const userData = {
        userName: data.userName,
        userCredential: data.userCredential,
        email: data.email,
        premium: false,
        phone: data.phone,
        whatsapp: data.whatsapp,
        permissionAcess: 1,
        codes: 100,
        xp: 100,
        lvl: 1
    }

    try {
        const docRef = await addDoc(collection(db, 'Users'), userData ,{merge: true})

        const userRef = doc(db, 'Users', docRef.id);

        await updateDoc(userRef, {id: docRef.id});

    } catch (error) {
        console.error('Erro ao Criar usuário:', error);
        throw error; 
    }
};

// Função para buscar um usuário no banco de dados
export const GetUserData = async (userCredential) => {
    try {
        //Buscar usuário no banco de dados pelo userCredential 
        const q = query(collection(db, 'Users'), where('userCredential', '==', userCredential));
        const querySnapshot = await getDocs(q);
        

        return querySnapshot.docs[0].data();
        
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};

