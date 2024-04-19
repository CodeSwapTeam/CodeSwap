import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export const SubscribeUserCourse = async (userId, courseId, permission) => {
    try {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, {
            CoursesPermissions: arrayUnion({
                courseId: courseId,
                permissionModule: permission
            })
        });
    } catch (error) {
        console.error('Erro ao inscrever o usuário no curso:', error);
    }
}