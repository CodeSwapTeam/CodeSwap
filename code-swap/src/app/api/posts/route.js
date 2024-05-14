import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import {NextResponse, NextRequest} from 'next/server';

//api router POST para criar um curso no banco de dados
export async function POST(NextRequest) {
    const { searchParams } = new URL(NextRequest.url);
    const type = searchParams.get('type');
    const data = await NextRequest.json();
    
    //console.log('POST request Server..............:', data, type);
    

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
                    courses: arrayUnion({ id: docRef.id, title: courseData.title, description: courseData.description, imgUrlThumbnail: courseData.imgUrlThumbnail, status: courseData.status, owner: courseData.owner, difficulty: courseData.difficulty })
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
                console.log('data.courseData:', data.courseData);
                // Atualizar configurações do curso
                await updateDoc(doc(db, 'Courses', data.courseId), data.courseData);

                // Atualizar configurações do curso na categoria
                const categoryDoc = doc(db, 'Categories', data.categoryId);
                const categorySnap = await getDoc(categoryDoc);
                const category = categorySnap.data();
                const course = category.courses.find(course => course.id === data.courseId);
                
                course.status = data.courseData.status;
                course.imgUrlThumbnail = data.courseData.imgUrlThumbnail;
                course.difficulty = data.courseData.difficulty;
                course.owner = data.courseData.owner;


                //atualizar a categoria no banco de dados
                await updateDoc(categoryDoc, {
                    courses: category.courses
                });

                return NextResponse.json({ message: 'Configurações do curso atualizadas com sucesso!' });
               
            } catch (error) {
                return NextResponse.error('Erro ao atualizar configurações do curso:', error);
                
            }
        }
        case 'CreateModule': {//Criar um módulo
            try {
                const moduleData = {
                    title: data.title,
                    description: data.description,
                    courseId: data.courseId,
                    experience: 0,
                    codes: 0,
                    difficulty: '',
                    moduleObservations: '',
                    id: '',
                    permission: data.permission,
                    lessons: []
                };
                const docRef = await addDoc(collection(db, 'Modules'), moduleData, { merge: true });
                //setar o id do modulo com o id do documento
                await updateDoc(doc(db, 'Modules', docRef.id), {
                    id: docRef.id
                });
                //adicionar o modulo no array de modulos do curso
                await updateDoc(doc(db, 'Courses', data.courseId), {
                    modules: arrayUnion({ id: docRef.id, title: moduleData.title, description: moduleData.description })
                });
                return NextResponse.json({ message: 'Módulo criado com sucesso!', moduleId: docRef.id});
            } catch (error) {
                return NextResponse.error('Erro ao criar o módulo:', error);
            }

        }
        case 'updateInfoModule': {//Atualizar informações do módulo
            try {
                const moduleData = {
                    title: data.title,
                    description: data.description
                }
                await updateDoc(doc(db, 'Modules', data.moduleId), moduleData);

                // Atualizar informações do módulo no curso
                const courseDoc = doc(db, 'Courses', data.courseId);
                const courseSnapshot = await getDoc(courseDoc);
                if (courseSnapshot.exists()) {
                    const courseData = courseSnapshot.data();
                    const moduleIndex = courseData.modules.findIndex(module => module.id === data.moduleId);

                    // Faça uma cópia do módulo, atualize os campos necessários e substitua o módulo antigo
                    const updatedModule = { ...courseData.modules[moduleIndex], title: moduleData.title, description: moduleData.description};
                    courseData.modules[moduleIndex] = updatedModule;

                    // Atualize o documento com o novo array de módulos
                    await updateDoc(courseDoc, { modules: courseData.modules });
                }

                return NextResponse.json({ message: 'Informações do módulo atualizadas com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao atualizar informações do módulo:', error);
            }
        }
        case 'updateModuleConfigs': {//Atualizar configurações do módulo
            try { 
                await updateDoc(doc(db, 'Modules', data.moduleId), data.settings);
                return NextResponse.json({ message: 'Configurações do módulo atualizadas com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao atualizar configurações do módulo:', error);
            }
        }
        case 'CreateLesson': {//Criar uma lição
            try {
                const lessonData = {
                    nameLesson: data.lessonData.nameLesson,
                    description: data.lessonData.description,
                    id: '',
                    moduleId: data.lessonData.moduleId
                };
                const docRef = await addDoc(collection(db, 'Lessons'), lessonData, { merge: true });
                //setar o id da lição com o id do documento
                await updateDoc(doc(db, 'Lessons', docRef.id), {
                    id: docRef.id
                });
               
                //adicionar no database em Courses.Modules que é um array de objetos com o id do modulo, o titulo e a descrição
                
                await updateDoc(doc(db, 'Modules', data.moduleId), {
                    //adicionar o id do modulo no array de modulos do curso
                    lessons: arrayUnion({ id: docRef.id, nameLesson: lessonData.nameLesson, description: lessonData.description, moduleId: data.moduleId})
                });
                return NextResponse.json({ message: 'Lição criada com sucesso!', lessonId: docRef.id});
            } catch (error) {
                return NextResponse.error('Erro ao criar a lição:', error);
            }
        }
        

        //Interações do usuário/////

        //Inscrever um usuário em um curso
        case 'EnrollCourse': {
            try {
                //buscar usuario no banco de dados
                const userDoc = doc(db, 'Users', data.userId);
                const userSnapshot = await getDoc(userDoc);

                //adicionar dentro do usuario em 'CourseEnrolled' objeto data
                await updateDoc(userDoc, {
                    CoursesEnrolled: arrayUnion(data)
                });
                
                return NextResponse.json({ message: 'Usuário inscrito com sucesso!' });
            } catch (error) {
                return NextResponse.error('Erro ao inscrever o usuário:', error);
            }
        }

        default:
            return NextResponse.error('Tipo de busca inválido', 500);
    }
}
