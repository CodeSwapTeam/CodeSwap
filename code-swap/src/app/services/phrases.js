
import { addDoc, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../database/firebase";

//modelo frase 
/*
{
   frase: String,
    autor: String,
    referencia: String 
}
*/

// Função salvar frase no banco de dados 

export const CreatePhrase = async (data) => {
    
        const phraseData = {
            frase: data.frase,
            autor: data.autor,
            referencia: data.referencia
        }
    
        try {
            const docRef = await addDoc(collection(db, 'Frases'), phraseData ,{merge: true})
    
            const phraseRef = doc(db, 'Phrases', docRef.id);
    
            await updateDoc(phraseRef, {id: docRef.id})
    
        } catch (error) {
            console.error('Erro ao Criar frase:', error);
            throw error; 
        }
    }


//função para buscar frases no banco de dados
export const GetPhrases = async () => {
    const phrases = []
    const querySnapshot = await getDocs(collection(db, 'Phrases'));
    querySnapshot.forEach((doc) => {
        phrases.push(doc.data())
    });
    return phrases
}
