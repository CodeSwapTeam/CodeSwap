import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs, query } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id') || null;
    const type = searchParams.get('type');

    if(id && type) console.log('GET request Server..............:', id, type);
   // if(type && id === null) console.log('GET request Server..............:', type);

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
        case 'getLessonsModuleId': { //Buscar todas as lições de um módulo pelo id
            const lessons = [];
            const docRef = doc(db, 'Modules', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const moduleData = docSnap.data();
                moduleData.lessons.forEach(lesson => {
                    lessons.push(lesson);
                });

                return NextResponse.json(lessons);
            }
        }
        case 'modulesID': { //Buscar todos os módulos de um curso pelo id
            try {
                const modules = [];
                const querySnapshot = await getDocs(query(collection(db, "Modules"), where("courseId", "==", id)));
                querySnapshot.forEach((doc) => {
                    modules.push(doc.data());
                });

                return NextResponse.json(modules);
            } catch (error) {
                throw new Error('Erro no servidor ao buscar os módulos');
            }
        }


        case 'GetPosts': { //Buscar todas as publicações
            const querySnapshot = await getDocs(collection(db, 'FeedPosts'));
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            if (!posts) throw new Error('Erro no servidor ao buscar as publicações');
            return NextResponse.json(posts);
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}
