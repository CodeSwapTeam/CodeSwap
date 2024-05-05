import { doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";



//>>>>ALTERADO PARA API ROUTER<<<<função para criar uma lesson dentro de um modulo de um curso
export async function createLesson(moduleId, lessonData) {
    //console.log(moduleId, lessonData);

        ///////////////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        const response = await fetch('/api/posts?type=CreateLesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moduleId, lessonData }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar a lesson');
        }

        const data = await response.json();
        alert(data.message);
        return data.lessonId;

}

//função para atualizar uma lesson dentro de um modulo de um curso

export async function updateLesson(courseId, moduleId, lessonId, lessonData) {
    
    try {
        const docRef = doc(db, 'Modulos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const courseData = docSnap.data();
            const moduleData = courseData.modules;
            const moduleSelecionado = moduleData[moduleId];
           const aulas =  moduleSelecionado.lessons[lessonId] 
           //imprimir o curso selecionado, o modulo selecionado e a aula selecionada
            
            
            aulas.description = lessonData.description;
            aulas.nameLesson = lessonData.nameLesson;
            
            await updateDoc(docRef, courseData);
            alert(`Aula ${lessonData.nameLesson} atualizada com sucesso!`);
            window.location.reload();

        } else {
            console.error('Módulo não encontrado');
        }
    } catch (error) {
        console.error('Erro ao atualizar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}

//função para deletar lessons dentro de um modulo de um curso
export const deleteLesson = async (moduleId, lessonId) => {
    try {
        /////////////////////////////////////////////////
        //>>>>ALTERADO PARA API ROUTER<<<<
        const response = await fetch('/api/delete?type=deleteLesson', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moduleId, lessonId }),
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar a lesson');
        }

        const data = await response.json();
        alert(data.message);
        
    } catch (error) {
        console.error('Erro ao deletar a lesson:', error);
        throw error; // Lança o erro para tratamento em um nível superior
    }
}