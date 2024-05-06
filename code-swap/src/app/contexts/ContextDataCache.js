"use client";
import React, {  createContext, useContext, useState } from 'react';

// Criando o contexto de autenticação
export const cacheContext = createContext();

export const ContextDataCache = () => useContext(cacheContext);

// Componente de provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null); // Estado com dados do usuário autenticado

  const [categories, setCategories] = useState([]); // Estado com dados das categorias
  const [courses, setCourses] = useState([]); // Estado com dados dos cursos
  const [modules, setModules] = useState([]); // Estado com dados dos módulos
  const [lessons, setLessons] = useState([]); // Estado com dados das lições

  //Estados para os dados do curso, módulo e lição selecionados
  const [categorieSelected, setCategorieSelected] = useState(null);
  const [courseSelected, setCourseSelected] = useState(null);
  const [moduleSelected, setModuleSelected] = useState(null);
  const [lessonSelected, setLessonSelected] = useState(null);

  


  return (
    <cacheContext.Provider value={
        { 
          currentUser,
          setCurrentUser,

          categories,
          setCategories,
          courses,
          setCourses,
          modules,
          setModules,
          lessons,
          setLessons,

          categorieSelected,
          setCategorieSelected,
          courseSelected,
          setCourseSelected,
          moduleSelected,
          setModuleSelected, 
          lessonSelected, 
          setLessonSelected 
        }}>
      { children}
    </cacheContext.Provider>
  );
};