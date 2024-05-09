import { doc, updateDoc, arrayUnion, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getCookies, setCookies } from "@/app/services/cookies";
import { decryptObjectData, encryptObjectData } from "@/app/services/persistenceData";
import { getUserData } from "./getUserId";

export const SubscribeUserCourse = async (userId, courseId, permission, setCurrentUser) => {
    try {
        // Cria uma referência para o documento do usuário no banco de dados
        const userRef = doc(db, "Users", userId);

        // Atualiza o documento do usuário para incluir a nova permissão do curso
        await updateDoc(userRef, {
            CoursesPermissions: arrayUnion({
                courseId: courseId,
                permissionModule: permission
            })
        });

        // Obtém o documento do usuário atualizado
        const userSnap = await getDoc(userRef);

        // Extrai os dados do usuário do documento
        const userData = userSnap.data();

        // Atualiza o usuário atual com os novos dados
        setCurrentUser(userData);
    } catch (error) {
        // Registra o erro se houver falha ao inscrever o usuário no curso
        console.error('Erro ao inscrever o usuário no curso:', error);
    }
}

//função que vai registrar o id e status do curso no curso.registrations

export const RegisterUserCourse = async (courseTitle, userId, status) => {
    
    try {
        const courseRef = doc(db, "Modulos", courseTitle);
        await updateDoc(courseRef, {
            registrations: arrayUnion({
                userId: userId,
                status: status
            })
        });
    } catch (error) {
        console.error('Erro ao registrar o usuário no curso:', error);
    }
}

//função para atualizar o status do curso no curso.registrations para 'concluido'

export const UpdateUserCourseStatus = async (idCourse, status) => {
    console.log('Atualizando status do curso:', idCourse);

    const courseRef = doc(db, "Modulos", idCourse);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
        console.log('No such document!');
        return;
    }

    const courseData = courseSnap.data();
    const registrations = courseData.registrations || [];

    const cookies = await getCookies();
    const userDecrypted = decryptObjectData(cookies.value);
    const user = userDecrypted.userId;

    const userRegistration = registrations.find(reg => reg.userId === user);

    if (userRegistration) {
        userRegistration.status = status;
    } else {
        registrations.push({
            userId: user,
            status: status
        });
    }

    await updateDoc(courseRef, { registrations: registrations });
}


//função para inscrever o usuário no modulo

export const subscribeUserModule = async (categoria, idModule) => {
   

    const querySnapshot = await getDocs(collection(db, "Modulos"));

    const cursos = [];
    querySnapshot.forEach((doc) => {
        cursos.push(doc.data());
    });

    const curso = cursos.find((curso) => curso.idCourse === categoria);
    const identificardorCurso = curso.title;

    const courseRef = doc(db, "Modulos", identificardorCurso);

    const cookies = await getCookies();
    const userDecrypted = decryptObjectData(cookies.value);
    const user = userDecrypted.userId;

    const modules = curso.modules;
    const moduleIndex = modules.findIndex((module) => module.idModule === idModule);
    //console.log('moduleIndex', moduleIndex);
    if (moduleIndex === -1) {
       // console.log('Module not found');
        return;
    }

    const registrationsModule = modules[moduleIndex].registrationsModule;
    const userRegistrationIndex =  registrationsModule.findIndex(reg => reg.userId === user);

    if (userRegistrationIndex !== -1) {
        if (registrationsModule[userRegistrationIndex].status !== 'concluido') {
            registrationsModule[userRegistrationIndex].status = 'cursando';
        }
        registrationsModule[userRegistrationIndex].lastAccess = new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        registrationsModule.push({
            userId: user,
            status: 'cursando',
            lastAccess: new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
    }

    modules[moduleIndex].registrationsModule = registrationsModule;

    await updateDoc(courseRef, {
        modules: modules
    });
}

//função para concluír o modulo

export const finishUserModule = async (categoria, idModule, setCurrentUser) => {
    

    const querySnapshot = await getDocs(collection(db, "Modulos"));

    const cursos = [];
    querySnapshot.forEach((doc) => {
        cursos.push(doc.data());
    });

    const curso = cursos.find((curso) => curso.idCourse === categoria);
    const identificardorCurso = curso.title;

    const courseRef = doc(db, "Modulos", identificardorCurso);

    const cookies = await getCookies();
    const userDecrypted = decryptObjectData(cookies.value);
    const user = userDecrypted.userId;

    const modules = curso.modules;
    const moduleIndex = modules.findIndex((module) => module.idModule === idModule);

    

    if (moduleIndex === -1) {
        
        return;
    }

    const registrationsModule = modules[moduleIndex].registrationsModule;

    const userRegistrationIndex = registrationsModule.findIndex(reg => reg.userId === user);

    if (userRegistrationIndex !== -1) {
        registrationsModule[userRegistrationIndex].status = 'concluido';
        registrationsModule[userRegistrationIndex].lastAccess = new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        registrationsModule.push({
            userId: user,
            status: 'concluido',
            lastAccess: new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
    }

    modules[moduleIndex].registrationsModule = registrationsModule;

    await updateDoc(courseRef, {
        modules: modules
    });

    //pegar o moduleIndex do curso e incrementar +1 na permissão do usuario
    
    const userRef = doc(db, "Users", userDecrypted.id);

    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        //console.log('No such document!');
        return;
    }

    const userData = userSnap.data();
    const permissions = userData.CoursesPermissions 

    const userPermissionIndex = permissions.findIndex(perm => perm.courseId === categoria);
    
    if (userPermissionIndex !== -1) {
        if (moduleIndex + 1 > permissions[userPermissionIndex].permissionModule) {
            permissions[userPermissionIndex].permissionModule = moduleIndex + 1;
        }
    } else {
        permissions.push({
            courseId: categoria,
            permissionModule: moduleIndex + 1
        });
    }

    await updateDoc(userRef, {
        CoursesPermissions: permissions
    });

    await updateDoc(userRef, {
        CoursesPermissions: permissions
    });

    //atualizar os dados do usuario nos cookies

    const novosDados = await getUserData(userDecrypted.userId).then((userData) => {
        
        return userData;
    });
    setCurrentUser(novosDados);

    //criptografar os dados do usuario
    const userEncrypted = encryptObjectData(novosDados);
    //salvar os dados do usuario nos cookies
    setCookies(userEncrypted);

    //console.log('Modulo concluido com sucesso e cookies atualizados');

}