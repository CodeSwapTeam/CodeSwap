'use client';
import Controller from "@/Controller/controller";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CoursesCategoryList from "@/app/Components/ListData-Component/ListData";
import styled from "styled-components";
import Image from "next/image";


const CategoryTitle = styled.h2`
    color: #45ff45;
    font-size: 2rem;
    margin-left: 40px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const Title = styled.h1`
    width: 100%;
    color: white;
    font-size: 2rem;
    margin: auto;
    text-align: center; // Centraliza o texto

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

 const Districts = () => {

    const { mapRoute } = useParams();
    const controller = Controller();

    const [categorySelected, setCategorySelected] = useState(null);
  const queryClient = useQueryClient();

    const { data: Courses, isLoading, isError } = useQuery({
        queryKey: ['courses-category-map'],
        queryFn: async () => {
          const courses = await controller.manageCourses.GetCoursesByCategory(mapRoute);

          //pegar nome da categoria selecionada no ["All-Categories-MyCourses"] que seja igual a o id da categoria selecionada
          const categoriesCached = queryClient.getQueryData(['All-Categories-MyCourses']);
          const categorySelected = categoriesCached.find(c => c.id === mapRoute);

          setCategorySelected(categorySelected);


          console.log('categorySelected', categorySelected);
          return courses;
        }

      });

      




   return (
    <div style={{ marginTop: '70px', color: 'white', overflowY: 'hidden', display:"flex", alignItems: 'flex-start' }}>

    <section style={{ width: "60%", overflowY: 'hidden', margin: 0, padding: 0 }}>
        <Title>{categorySelected?.name}</Title>
        <CoursesCategoryList courses={Courses} />
    </section>

    <section style={{width:'40%', display:'flex', justifyContent:'center'}}>
        <Image src={categorySelected?.thumbnail} alt="Mapa" width={300} height={300} />
    </section>

    {isLoading && <p>Carregando...</p>}
</div>
  );
}

export default Districts;