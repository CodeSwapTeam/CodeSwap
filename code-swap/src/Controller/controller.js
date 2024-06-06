
import { getCookiesAcessToken, removeCookiesAcessToken, setCookiesAcessToken } from "@/app/services/cookies";
import { CreateUser, GetUserById, GetUserDataBase, GetUserLocalData, RemoveUser, UpdateUserData } from "../../database/functions/Users/manageUserData";


import { CreateCategory, DeleteCategory, GetAllCategories, SaveImgUrlThumbnail, UpdateCategoryData } from "../../database/functions/Category/manageCategories";
import { CreateCourse, DeleteCourse, GetCourseById, GetCoursesByCategory, UpdateConfigCourseData, UpdateCover, UpdateInfoCourse,  UpdateThumbnail } from "../../database/functions/Courses/manageCourses";
import { GetLessonsModule, GetModuleById, GetModules, GetModulesCourseID, UpdateModuleConfigs, createModule, deleteModule, updateInfoModule } from "../../database/functions/Modules/manageModules";
import { handleUpdateThumbnail } from "@/app/services/UpdateThumbnail";
import { handleUpdateCover } from "@/app/services/UpdateCover";
import { createLesson, deleteLesson } from "../../database/functions/Lessons/manageLessons";
import { GetPhrases } from "@/app/services/phrases";



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
            GetModulesCourseID: GetModulesCourseID,
            DeleteModule: deleteModule,
            updateInfoModule: updateInfoModule,
            GetModuleById: GetModuleById,
            GetLessonsModule: GetLessonsModule,
            UpdateModuleConfigs: UpdateModuleConfigs

        },
        /**
         * Gerenciador de lições,
         * Retorna um objeto com as funções de gerenciamento de lições
         */
        manageLessons: {
            CreateLesson: createLesson,
            DeleteLesson: deleteLesson
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
            CreateCategory: CreateCategory, //ACESSO A API PARA CRIAR CATEGORIA
            GetAllCategories: GetAllCategories, //ACESSO A API PARA BUSCAR TODAS AS CATEGORIAS

            UpdateCategoryData: UpdateCategoryData,
            DeleteCategory: DeleteCategory,

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
            /**
             * Gerenciador de imagens,
             */
            manageImages: {
                handleUpdateThumbnail: handleUpdateThumbnail,
                handleUpdateCover: handleUpdateCover,
            },
            phrases: {

    GetPhrases: GetPhrases,
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