
import { saveInteraction } from "../app/services/saveLogs";
import { CreateCourse, DeleteCourse, updateCourse } from "../../database/functions/Courses/manageCourses";
import { getAllModulesAndCourses } from "../../database/functions/Courses/getAllModulesAndCourses";
import { ChangeStatusCourse } from "../../database/functions/Courses/ChangeStatusCourse";
import { createModule, deleteModule, updateModule } from "../../database/functions/Modules/manageModules";
import { createLesson, deleteLesson, updateLesson } from "../../database/functions/Lessons/manageLessons";
import { CreateUser } from "../../database/functions/Users/createUser";
import { RegisterUserCourse, SubscribeUserCourse, UpdateUserCourseStatus, finishUserModule, subscribeUserModule } from "../../database/functions/Users/manageUserCoursesAndModules";
import { getCookies, removeCookies, setCookies } from "@/app/services/cookies";
import { decryptObjectData, encryptObjectData } from "@/app/services/encryptedAlgorithm";
import { CreatePhrase, GetPhrases } from "@/app/services/phrases";
import { GetAllUsers } from "../../database/functions/Users/GetAllUsers";
import { addCourseToCategory, createCategory, getAllCategories, getCoursesByCategory, updateCategory } from "../../database/functions/Category/manageCategorys";
import { ChangePermissionUser } from "../../database/functions/Users/ChangePermissionUser";
import { getUserData } from "../../database/functions/Users/getUserId";
import { getModuleByCourseAndModuleId } from "../../database/functions/Modules/getModuleByCourseAndModuleId";

//Controlador geral
export default function Controller(){

    return{
        /**
         * Gerenciador de cursos,
         * Retorna um objeto com as funções de gerenciamento de cursos
         */
        manageCourses: {
            createCourse: CreateCourse,
            getAllModulesAndCourses: getAllModulesAndCourses,
            deleteCourse: DeleteCourse,
            changeStatusCourse: ChangeStatusCourse,
            updateCourse: updateCourse
        },
        /**
         * Gerenciador de módulos,
         * Retorna um objeto com as funções de gerenciamento de módulos
         */
        manageModules:{
            createModule: createModule,
            updateModule: updateModule,
            deleteModule: deleteModule,
            getModuleByCourseAndModuleId : getModuleByCourseAndModuleId,
            finishUserModule: finishUserModule
        },
        /**
         * Gerenciador de lições,
         * Retorna um objeto com as funções de gerenciamento de lições
         */
        manageLessons: {
            createLesson: createLesson,
            updateLesson: updateLesson,
            deleteLesson: deleteLesson
        },
        /**
         * Gerenciador de usuários,
         * Retorna um objeto com as funções de gerenciamento de usuários
         */
        manageUsers: {
            createUser: CreateUser,
            updateUser: UpdateUserCourseStatus,
            getAllUsers: GetAllUsers,
            changePermissionUser: ChangePermissionUser,
            getUserData: getUserData,
            subscribeUserModule: subscribeUserModule,
            subscribeUserCourse: SubscribeUserCourse,
            registerUserCourse: RegisterUserCourse
            //deleteUser: deleteUser
        },
        /**
         * Gerenciador de categorias,
         * Retorna um objeto com as funções de gerenciamento de categorias
         */
        manageCategories: {
            getAllCategories: getAllCategories,
            createCategory: createCategory,
            addCourseToCategory: addCourseToCategory,
            updateCategory: updateCategory,
            getCoursesByCategory: getCoursesByCategory

        },
        /**
         * Serviços de cookies,
         * Retorna um objeto com as funções de gerenciamento de cookies
         * Retorna um objeto com as funções de gerenciamento de frases
         */
        services: {
            /**
             * Gerenciador de cookies,
             */
            manageCookies: {
                setCookies: setCookies,
                getCookies: getCookies,
                removeCookies: removeCookies
            },
            phrases: {
                CreatePhrase: CreatePhrase,
                GetPhrases: GetPhrases
            
            }
        },
        /**
         * Algoritmo de criptografia,
         * Retorna um objeto com as funções de criptografia
         */
        encryptionAlgorithm:{
            encryptObjectData: encryptObjectData,
            decryptObjectData: decryptObjectData
        },
        /**
         * Logs e registros,
         * Retorna um objeto com as funções de logs e registros
         */
        logsRegister: {
            saveInteraction: saveInteraction
        }
        
        //saveInteraction: saveInteraction,
        //getAllModulesAndCourses,
        //CreateCourse
        
    }
    
}