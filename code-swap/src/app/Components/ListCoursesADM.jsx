import React, { useState } from 'react';
import styled from 'styled-components';
import Controller from '@/Controller/controller';
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { CoursesCategoryList } from './PainelADM/ListCoursesCamponents/CoursesCategoryList';
import { ConfigCourse } from './PainelADM/ListCoursesCamponents/ConfigCourse';
import ManageModule from './PainelADM/ManageModule/ManageModule';
import ModulesCourseList from './PainelADM/ListCoursesCamponents/ModulesCourseList';



export const H1 = styled.h1`
  border: 2px solid white;
  padding: 10px;
  color: white;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
  border-radius: 5px;
  background-color: #0f1425d6;
`;

export const ContainerDiv = styled.div`
display: flex;
margin-top: 10px;
border-radius: 5px;
box-shadow: 0px 0px 10px rgba(4, 255, 2, 0.2);

color: white;
text-align: center;
background-color: #0f1425d6;
`;



const ListCourses = () => {
    const controller = Controller();

    const [selectedPainel, setSelectedPainel] = useState('courses');
    const [category, setCategory] = useState(null);


    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({
        queryKey: ['All-Categories'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetCategories();
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });


    return (
        <div >
            <H1>
                {selectedPainel === 'courses' ? `Lista de Cursos ${category ? category.name : ''}` :
                    selectedPainel === 'ModuleDescription' ? 'Módulos e Aulas' :
                        'Cursos e Módulos'}
            </H1>

            <ContainerDiv>

                {selectedPainel === 'courses' ? (
                    <CoursesCategoryList categoriesData={categoriesData} category={category} setSelectedPainel={setSelectedPainel} />
                ) : selectedPainel === 'CourseDescription' ? (                  
                    <ConfigCourse setSelectedPainel={setSelectedPainel} />                
                ) : selectedPainel === 'Modules' ? (
                    <ModulesCourseList setSelectedPainel={setSelectedPainel} />
                ) : selectedPainel === 'ModuleDescription' ? (
                    <ManageModule setSelectedPainel={setSelectedPainel} />
                ) : (<div> </div>)}

            </ContainerDiv>
        </div>
    );
};

export default ListCourses;
