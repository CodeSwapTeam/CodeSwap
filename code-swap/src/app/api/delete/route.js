import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";
import { getDocs, collection,deleteDoc, doc } from "firebase/firestore";


export async function DELETE(request){
    const { searchParams } =  new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    console.log('DELETE request Server..............:', id, type);

    switch (type) {
        case 'course': {
            try {
                await deleteDoc(doc(db, 'Courses', id));
                return NextResponse.json({message: 'Curso deletado com sucesso!'});
            } catch (error) {
                return NextResponse.error('Erro ao deletar o curso');
            }
        }
        case 'category': {
            try {
                await deleteDoc(doc(db, 'Categories', id));
                return NextResponse.json({message: 'Categoria deletada com sucesso!'});
            } catch (error) {
                return NextResponse.error('Erro ao deletar a categoria');
            }
        }
        default:
            return NextResponse.error('Tipo de busca inválido', 400);
    }   
}


