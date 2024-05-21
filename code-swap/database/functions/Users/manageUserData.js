import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Controller from "@/Controller/controller";


const jose = require('jose')

//função para buscar os dados do usuário
export async function GetUserLocalData(){
    const userData = JSON.parse(sessionStorage.getItem('currentUserData'));
    if(userData){
        return userData;
    }       
}

// Função para buscar um usuário no banco de dados
export const GetUserDataBase = async (userCredential) => {
    
    const controller = Controller();
    try {
        //Buscar usuário no banco de dados pelo userCredential 
        const q = query(collection(db, 'Users'), where('userCredential', '==', userCredential));
        const querySnapshot = await getDocs(q);

        const userData = querySnapshot.docs[0].data();

        //Cripitografar o token de acesso do usuário
        const secret = new TextEncoder().encode(
            'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
          );

        const jwt = await new jose.SignJWT({ userId : userData.userCredential})
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret)
        

          //salvar nos cookies o token de acesso
            controller.services.manageCookies.setCookiesAcessToken(jwt);


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
        xp: 20,
        lvl: 1,
        xpToNextLvl: 100,
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





