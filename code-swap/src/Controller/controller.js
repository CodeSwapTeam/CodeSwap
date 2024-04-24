
import { getCookiesAcessToken, removeCookiesAcessToken, setCookiesAcessToken } from "@/app/services/cookies";
import { CreateUser, GetUserById, GetUserData, GetUserDataBase, GetUserLocalData, RemoveUser, UpdateUserData } from "../../database/functions/Users/manageUserData";
//import { QueryRequests } from "@/app/services/QueryRequests";

import { getUserCache, removeUserCache, saveUserCache } from "@/app/services/saveUserCache";
import { CreateCategory, DeleteCategory, GetCategories, UpdateCategoryData } from "../../database/functions/Category/manageCategories";



//Controlador geral
export default function Controller(){



    return{
        /**
         * Gerenciador de cursos,
         * Retorna um objeto com as funções de gerenciamento de cursos
         */
        manageCourses: {

        },
        /**
         * Gerenciador de módulos,
         * Retorna um objeto com as funções de gerenciamento de módulos
         */
        manageModules:{

        },
        /**
         * Gerenciador de lições,
         * Retorna um objeto com as funções de gerenciamento de lições
         */
        manageLessons: {

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

            GetCategories: GetCategories
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