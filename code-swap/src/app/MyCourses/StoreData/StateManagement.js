
import { create } from "zustand";



const useStateManagement = create((set) => ({
    states: {
        categories: [],
        courses: [],
        
    },
    actions: {
        setCategories: (categories) => set((state) => ({ states: { ...state.states, categories } })),
        setCourses: (courses) => set((state) => ({ states: { ...state.states, courses } })),   
    }
}));


export default useStateManagement;