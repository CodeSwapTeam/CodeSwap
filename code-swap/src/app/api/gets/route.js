import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id') || null;
    const type = searchParams.get('type');

    if(id && type) console.log('GET request Server..............:', id, type);
    if(type && id === null) console.log('GET request Server..............:', type);

    switch (type) {
        case 'categories': {//Buscar todas as categorias
            const querySnapshot = await getDocs(collection(db, 'Categories'));
            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push(doc.data());
            });
            if (!categories) throw new Error('Erro no servidor ao buscar as categorias');
    
            return NextResponse.json(categories);
        }
        case 'courseId': {//Buscar um curso pelo id
            const docRef = doc(db, 'Courses', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error('Curso não encontrado');
            
            const coursesLocal = [docSnap.data()];
            return NextResponse.json(coursesLocal);
        }
        case 'moduleID': { //Buscar um módulo pelo id
            const docRef = doc(db, 'Modules', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error('Módulo não encontrado');
            
            const modulesLocal = [docSnap.data()];
            return NextResponse.json(modulesLocal);
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}
