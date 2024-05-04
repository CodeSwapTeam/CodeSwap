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
        case 'CreateCourse': { //Criar um curso
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
        case 'CreateCategory': {//Criar uma categoria
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
        case 'UpdateInfoCourse': {//Atualizar informações do curso
            try {
                const courseData = {
                    title: data.courseData.title,
                    description: data.courseData.description,
                }
                await updateDoc(doc(db, 'Courses', data.courseId), courseData);

                // Atualizar informações do curso na categoria
                const categoryDoc = doc(db, 'Categories', data.categoryId);
                const categorySnapshot = await getDoc(categoryDoc);
                if (categorySnapshot.exists()) {
                    const categoryData = categorySnapshot.data();
                    const courses = categoryData.courses;
                    const updatedCourses = courses.map(course => {
                        if (course.id === data.courseId) {
                            return { ...course, title: courseData.title, description: courseData.description };
                        } else {
                            return course;
                        }
                    });
                    await updateDoc(categoryDoc, { courses: updatedCourses });
                }

                    return NextResponse.json({ message: 'Informações do curso atualizadas com sucesso!' });
                } catch (error) {
                return NextResponse.error('Erro ao atualizar informações do curso:', error);
            }
        }
        case 'UpdateCourseConfigs': {//Atualizar configurações do curso
            try {
                // Atualizar configurações do curso
                await updateDoc(doc(db, 'Courses', data.courseId), data.courseData);

                // Atualizar configurações do curso na categoria
                const categoryDoc = doc(db, 'Categories', data.categoryId);
                const categorySnap = await getDoc(categoryDoc);
                const category = categorySnap.data();
                const course = category.courses.find(course => course.id === data.courseId);

                course.status = data.courseData.status;
                course.imgUrlThumbnail = data.courseData.imgUrlThumbnail;


                //atualizar a categoria no banco de dados
                await updateDoc(categoryDoc, {
                    courses: category.courses
                });

                return NextResponse.json({ message: 'Configurações do curso atualizadas com sucesso!' });
               
            } catch (error) {
                return NextResponse.error('Erro ao atualizar configurações do curso:', error);
                
            }
        }
        
        default:
            return NextResponse.error('Tipo de busca inválido', 500);
    }
}
