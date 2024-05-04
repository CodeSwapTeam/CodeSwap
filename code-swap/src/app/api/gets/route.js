import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    console.log('GET request Server..............:', id);

    switch (type) {
        case 'categories': {
            const querySnapshot = await getDocs(collection(db, 'Categories'));
            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push(doc.data());
            });
            if (!categories) throw new Error('Erro no servidor ao buscar as categorias');
    
            return NextResponse.json(categories);
        }
        case 'courseId': {
            const docRef = doc(db, 'Courses', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error('Curso não encontrado');
            
            const coursesLocal = [docSnap.data()];
            return NextResponse.json(coursesLocal);
        }

        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}

/* export async function GET(request){
    const { route } = request.params;
    const { controller } = request;
    let data = null;

    switch (route) {
        case 'categories':
            data = await controller.manageCategories.GetCategories();
            break;
        case 'courses':
            data = await controller.manageCourses.GetCourses();
            break;
        case 'modules':
            data = await controller.manageModules.GetModules();
            break;
        case 'lessons':
            data = await controller.manageLessons.GetLessons();
            break;
        case 'users':
            data = await controller.manageUsers.GetUsers();
            break;
        default:
            break;
    }

    return data;
} */