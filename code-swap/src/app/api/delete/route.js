import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";
import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc, arrayUnion, getDoc } from "firebase/firestore";


export async function DELETE(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    console.log('DELETE request Server..............:', id, type);
    

    switch (type) {
        case 'course': {//Deletar o curso pelo ID
            try {
                await deleteDoc(doc(db, 'Courses', id));

                //Deletar todos os modulos do curso
                const modulesRef = query(collection(db, 'Modules'), where('courseId', '==', id));
                const querySnapshot = await getDocs(modulesRef);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                //Deletar o curso de dentro da categoria
                //buscar as categorias que contém o curso
                const querySnapshotCategory = await getDocs(collection(db, 'Categories'));
                const categories = [];
                querySnapshotCategory.forEach((doc) => {
                    categories.push(doc.data());
                });

                categories.forEach(category => {
                    category.courses = category.courses.filter(course => course.id !== id);
                });
                categories.forEach(async category => {
                    await updateDoc(doc(db, 'Categories', category.id), {
                        courses: category.courses
                    });
                });





                return NextResponse.json({message: 'Curso deletado com sucesso!'});
            } catch (error) {
                return NextResponse.error('Erro ao deletar o curso');
            }
        }
        case 'category': {//Deletar a categoria e todos os cursos da categoria
            try {
                await deleteDoc(doc(db, 'Categories', id));

                 //Deletar todos os cursos da categoria
                const coursesRef = query(collection(db, 'Courses'), where('category', '==', id));
                const querySnapshot = await getDocs(coursesRef);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                return NextResponse.json({ message: 'Categoria deletada com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao deletar a categoria');
            }
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}


