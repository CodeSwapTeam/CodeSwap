
import { saveInteraction } from "../../database/functions/saveLogs";
import { CreateCourse } from "../../database/functions/createCourses";
import { getAllModulesAndCourses } from "../../database/functions/searchModules";

//Controlador geral
export default function Controller(){
    
    const courses = getAllModulesAndCourses();

    return{
        saveInteraction: saveInteraction,
        courses : courses,
        CreateCourse
        
    }
    
}