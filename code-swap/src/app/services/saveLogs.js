import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../database/firebase";

export async function saveInteraction(newLogs) {
    try {
      const docRef = doc(db, 'interactions', 'logs');
      const docSnap = await getDoc(docRef);
  
      let mergedLogs = [];
      if (docSnap.exists()) {
        const existingLogs = docSnap.data().logs || [];
        mergedLogs = [...existingLogs, ...newLogs];
      } else {
        mergedLogs = newLogs;
      }
  
      await setDoc(docRef, { logs: mergedLogs });
      console.log("Logs salvos com sucesso no banco de dados.");
    } catch (error) {
      console.error("Erro ao salvar os logs no banco de dados:", error);
    }
  }