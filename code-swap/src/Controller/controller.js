
import { getCookiesAcessToken, removeCookiesAcessToken, setCookiesAcessToken } from "@/app/services/cookies";
import { CreateUser, GetUserById, GetUserDataBase, GetUserLocalData, RemoveUser, UpdateUserData } from "../../database/functions/Users/manageUserData";
//import { QueryRequests } from "@/app/services/QueryRequests";

import { getUserCache, removeUserCache, saveUserCache } from "@/app/services/saveUserCache";
import { CreateCategory, DeleteCategory, GetCategories, GetCategoriesLocal, SaveCategoriesLocal, SaveImgUrlThumbnail, UpdateCategoryData } from "../../database/functions/Category/manageCategories";
import { CreateCourse, DeleteCourse, GetCourseById, GetCoursesByCategory, UpdateConfigCourseData, UpdateCover, UpdateInfoCourse,  UpdateThumbnail } from "../../database/functions/Courses/manageCourses";
import { GetLessonsModule, GetModuleById, GetModules, GetModulesLocal, createModule, deleteModule, updateInfoModule } from "../../database/functions/Modules/manageModules";
import { handleUpdateThumbnail } from "@/app/services/UpdateThumbnail";
import { handleUpdateCover } from "@/app/services/UpdateCover";
import { createLesson } from "../../database/functions/Lessons/manageLessons";



//Controlador geral
export default function Controller(){



    return{
        /**
         * Gerenciador de cursos,
         * Retorna um objeto com as funções de gerenciamento de cursos
         */
        manageCourses: {
            CreateCourse: CreateCourse,
            DeleteCourse: DeleteCourse,
            UpdateInfoCourse: UpdateInfoCourse,
            GetCourseById: GetCourseById,
            GetCoursesByCategory: GetCoursesByCategory,
            UpdateThumbnailCourse: UpdateThumbnail,
            UpdateCover: UpdateCover,
            UpdateConfigCourseData: UpdateConfigCourseData
            
        },
        /**
         * Gerenciador de módulos,
         * Retorna um objeto com as funções de gerenciamento de módulos
         */
        manageModules:{
            CreateModule: createModule,
            GetModules: GetModules,
            DeleteModule: deleteModule,
            updateInfoModule: updateInfoModule,

            GetModulesLocal: GetModulesLocal,
            GetModuleById: GetModuleById,
            GetLessonsModule: GetLessonsModule

        },
        /**
         * Gerenciador de lições,
         * Retorna um objeto com as funções de gerenciamento de lições
         */
        manageLessons: {
            CreateLesson: createLesson
        },
        /**
         * Gerenciador de usuários,
         * Retorna um objeto com as funções de gerenciamento de usuários
         */
        manageUsers: {
            GetUserLocalData: GetUserLocalData,
            GetUserDataBase: GetUserDataBase,

            CreateUser: CreateUser,
            UpdateUserData: UpdateUserData,
            RemoveUser: RemoveUser,

            GetUserById: GetUserById,

        },
        /**
         * Gerenciador de categorias,
         * Retorna um objeto com as funções de gerenciamento de categorias
         */
        manageCategories: {
            CreateCategory: CreateCategory,
            UpdateCategoryData: UpdateCategoryData,
            DeleteCategory: DeleteCategory,

            GetCategories: GetCategories, //Retorna as categorias do banco de dados
            GetCategoriesLocal: GetCategoriesLocal, //Retorna as categorias do cache local
            SaveCategoriesLocal: SaveCategoriesLocal,
            SaveImgUrlThumbnail: SaveImgUrlThumbnail
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
                getCookiesAcessToken: getCookiesAcessToken,
                setCookiesAcessToken: setCookiesAcessToken,
                removeCookiesAcessToken: removeCookiesAcessToken
            },
            manageLocalCache: {
                saveUserCache: saveUserCache,
                getUserCache: getUserCache,
                removeUserCache: removeUserCache
            },
            manageImages: {
                handleUpdateThumbnail: handleUpdateThumbnail,
                handleUpdateCover: handleUpdateCover,
            },
            phrases: {

            
            }
        },
        /**
         * Algoritmo de criptografia,
         * Retorna um objeto com as funções de criptografia
         */
        encryptionAlgorithm:{

        },
        /**
         * Logs e registros,
         * Retorna um objeto com as funções de logs e registros
         */
        logsRegister: {

        }
        
        //saveInteraction: saveInteraction,
        //getAllModulesAndCourses,
        //CreateCourse
        
    }
    
}