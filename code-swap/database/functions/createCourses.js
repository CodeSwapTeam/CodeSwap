import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useInteractionLogger } from "@/app/contexts/InteractionContext";
import interactionsType from "@/app/contexts/interactionsType";

export async function CreateCourse(formData, user) {

    //const {logInteraction} = useInteractionLogger();

    try {

        formData.owner = user;
        
        //console.log(formData);
        // Referência ao documento no Firestore
        const docRef = doc(db, 'Modulos', formData.title);

        // Salva os dados do módulo no Firestore
        await setDoc(docRef, formData);

        alert('Módulo do curso criado com sucesso no Firestore');
        
    } catch (error) {
        console.error('Erro ao criar o módulo do curso:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}