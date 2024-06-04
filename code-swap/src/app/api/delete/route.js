import { db } from "../../../../database/firebase";
import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, doc, getDocs, query, updateDoc, where, deleteDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";


export async function DELETE(NextRequest){
    const { searchParams } =  new URL(NextRequest.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    let data;
    if (NextRequest.body) {
        data = NextRequest.body;
    } else {
        console.log('Sem dados no corpo da solicitação');
    }

    console.log('DELETE request Server..............:', id, type);

    switch (type) {
        case 'course': {//Deletar o curso pelo ID
            try {
                console.log('Deletando curso:', id);
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
        case 'deleteModule': {//Deletar o módulo pelo ID
            try {

                const { courseSelectedId, moduleSelected } = data;
                //deletar o modulo do curso no database
                await deleteDoc(doc(db, 'Modules', moduleSelected.id ));

                //deletar o modulo do array de modulos do curso
                await updateDoc(doc(db, 'Courses', courseSelectedId), {
                    modules: arrayRemove(moduleSelected)
                });


                return NextResponse.json({ message: 'Módulo deletado com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao deletar o módulo');
            }
        }
        case 'deleteLesson': {//Deletar a aula pelo ID

        const { moduleId, lessonId } = data;
            
        // Deletar a lesson no banco de dados com a LessonId
        await deleteDoc(doc(db, 'Lessons', lessonId));

        // Deletar a lesson no módulo que contenha o id o id da lesson
        const moduleRef = doc(db, 'Modules', moduleId);
        // pegar a lesson com o id da lesson
        const moduleSnap = await getDoc(moduleRef);

        const moduleData = moduleSnap.data();
        const lessons = moduleData.lessons;
        const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
        lessons.splice(lessonIndex, 1);

        await updateDoc(moduleRef, { lessons }); 

        return NextResponse.json({ message: 'Aula deletada com sucesso!' });

        }


        //Interação com a comunidade
        case 'deletePost': {//Deletar o post pelo ID
            try {
                await deleteDoc(doc(db, 'FeedPosts', id));
                return NextResponse.json({ message: 'Post deletado com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao deletar o post');
            }
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}


