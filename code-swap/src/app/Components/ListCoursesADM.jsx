import React, { useState } from 'react';
import styled from 'styled-components';
import Controller from '@/Controller/controller';
import { useQuery } from "@tanstack/react-query";
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



const ListCoursesADM = () => {
    const [selectedPainel, setSelectedPainel] = useState('CategoryList');
    const controller = Controller();

    // Função para buscar as categorias no cache local ou no banco de dados
    const { data: categoriesData } = useQuery({      
        queryKey: ['All-Categories'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetAllCategories();
              return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    //função para retornar os cursos selecionados de uma categoria
    const handleCategory = (category) => {
        console.log('Category selected:', category);
        return category;
    };

    return (
        <div  >
            <H1>
                {selectedPainel === 'CategoryList' ? `Lista de Cursos ` :
                    selectedPainel === 'ModuleDescription' ? 'Módulos e Aulas' :
                        'Cursos e Módulos'}
            </H1>

            <ContainerDiv>

                {selectedPainel === 'CategoryList' ? (
                    <CoursesCategoryList  categoriesData={categoriesData} setSelectedPainel={setSelectedPainel} />
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

export default ListCoursesADM;
