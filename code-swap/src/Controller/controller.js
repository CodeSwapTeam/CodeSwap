
import { getCookiesAcessToken, setCookiesAcessToken } from "@/app/services/cookies";
import { CreateUser, GetUserData } from "../../database/functions/Users/manageUserData";
//import { QueryRequests } from "@/app/services/QueryRequests";
import { useQueryRequests } from "@/app/services/QueryRequests";



//Controlador geral
export default function Controller(){

    const queryRequests = useQueryRequests();

    return{
        QueryRequests: {
            GetUserData: queryRequests.GetUserData,
        },
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
            CreateUser: CreateUser,
            GetUserData: GetUserData

        },
        /**
         * Gerenciador de categorias,
         * Retorna um objeto com as funções de gerenciamento de categorias
         */
        manageCategories: {


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
                setCookiesAcessToken: setCookiesAcessToken
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