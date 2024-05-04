import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(request){

    console.log('GET request Server..............:', request);

    const querySnapshot = await getDocs(collection(db, 'Categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
        categories.push(doc.data());
    });
    if(!categories) throw new Error('Erro no servidor ao buscar as categorias');

    return NextResponse.json(categories);
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