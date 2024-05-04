import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import {NextResponse, NextRequest} from 'next/server';

//api router POST para criar um curso no banco de dados
export async function POST(NextRequest) {
    const { searchParams } = new URL(NextRequest.url);
    const type = searchParams.get('type');
    const data = await NextRequest.json();

    console.log('POST request Server..............:', data, type);

    switch (type) {
        case 'course': {
            try {
                const courseData = {
                    title: data.title,
                    status: data.status, // pending, approved, reviewed, rejected
                    description: data.description,
                    owner: data.owner,
                    experience: data.experience,
                    difficulty: '',
                    codes: data.codes,
                    courseObservations: '',
                    id: '',
                    imgUrlThumbnail: data.imgUrlThumbnail,
                    imgUrlCover: data.imgUrlCover,
                    coursePremium: data.coursePremium,
                    category: data.category,
                    SequentialModule: data.SequentialModule,
                    modules: [],
                };
                const docRef = await addDoc(collection(db, 'Courses'), courseData);
                
                //setar o id do curso com o id do documento
                await updateDoc(doc(db, 'Courses', docRef.id), {
                    id: docRef.id
                });
                //adicionar no database em'categories' dentro de courses que é um array de objetos com o id do curso, o titulo e a descrição
                await updateDoc(doc(db, 'Categories', courseData.category), {
                    //adicionar o id do curso no array de cursos da categoria
                    courses: arrayUnion({ id: docRef.id, title: courseData.title, description: courseData.description, imgUrlThumbnail: courseData.imgUrlThumbnail, status: courseData.status })
                });

                return NextResponse.json({ message: 'Curso criado com sucesso!' });
            }
            catch (error) {
                return NextResponse.error('Erro ao criar o curso, tente novamente!');
            }
        }
        case 'category': {
            try {
                const categoryData = {
                    name: data.name,
                    description: data.description,
                    courses: []
                }
                // Criar a categoria no banco de dados
                const docRef = await addDoc(collection(db, 'Categories'), categoryData, { merge: true });
                // Adicionar o id da categoria no documento
                await updateDoc(doc(db, 'Categories', docRef.id), { id: docRef.id });
                return NextResponse.json({ message: `Categoria ${data.name} criada com sucesso!` });
            } catch (error) {
                return NextResponse.error('Erro ao Criar categoria:', error);
            }



        }
        default:
            return NextResponse.error('Tipo de busca inválido', 500);
    }
}
