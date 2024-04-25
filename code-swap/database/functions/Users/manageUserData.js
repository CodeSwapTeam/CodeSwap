import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";


//função para buscar os dados do usuário
export async function GetUserLocalData(){
    const userData = JSON.parse(sessionStorage.getItem('currentUserData'));
    if(userData){
        return userData;
    }       
}

// Função para buscar um usuário no banco de dados
export const GetUserDataBase = async (userCredential) => {
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

// Função para atualizar um usuário no banco de dados
export const UpdateUserData = async (userId, data) => {
    try {
        const userRef = doc(db, 'Users', userId);

        await updateDoc(userRef, data);

    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};

//função para remover um usuário do banco de dados 
export const RemoveUser = async (userId) => {
    try {
        const userRef = doc(db, 'Users', userId);

        await deleteDoc(userRef);

    } catch (error) {
        console.error('Erro ao remover o usuário:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
};



 //função para buscar um usuario pelo id
export  const GetUserById = async (userId) => {
    //buscar no banco de dados
   
}





