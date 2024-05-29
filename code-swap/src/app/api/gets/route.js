import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs, query, orderBy, limit, startAfter, startAt } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id') || null;
    const type = searchParams.get('type');
    const page = searchParams.get('page') || 1;
    const lastPostId = searchParams.get('lastPostId') || null;

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
            //pegar o body da requisição
            console.log('page:', page);
            const postsPerPage = 3;
        
            const posts = [];
            let querySnapshot;
            if(lastPostId !== undefined && lastPostId !== null){
                querySnapshot = await getDocs(query(collection(db, "FeedPosts"), orderBy('date', 'desc'), startAfter(lastPostId), limit(postsPerPage)));
            } else {
                querySnapshot = await getDocs(query(collection(db, "FeedPosts"), orderBy('date', 'desc'), limit(postsPerPage)));
            }
            querySnapshot.forEach((doc) => {
                const postData = doc.data();
                postData.id = doc.id; // Adiciona o ID do documento ao objeto do post
                posts.push(postData);
            });
        
            return NextResponse.json(posts);
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }
}
