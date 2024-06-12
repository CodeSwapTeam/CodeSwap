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
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const Districts = () => {
    const { mapRoute } = useParams();
    const controller = Controller();

    const [imageURL, setImageURL] = useState(null);
    const [categorySelected, setCategorySelected] = useState(null);
    const queryClient = useQueryClient();

    const { data: Courses, isLoading } = useQuery({
        queryKey: ['courses', mapRoute],

        queryFn: async () => await controller.manageCourses.GetCoursesByCategory(mapRoute),
        enabled: !!mapRoute, // Só executa a query se mapRoute for diferente de null
        onSuccess: (data) => {
            setCategorySelected(data.category);
           // setImageURL(data.category.image);
        }
    });

    useEffect(() => {
        if (!mapRoute) {
            queryClient.invalidateQueries('courses');
        }
    }
    , [mapRoute, queryClient]);

    

    return (
        <div style={{ marginTop: '70px', color: 'white', overflowY: 'hidden', display:"flex", alignItems: 'flex-start' }}>
            <section style={{ width: "60%", overflowY: 'hidden', margin: 0, padding: 0 }}>
                <Title>{categorySelected?.name}</Title>
                <CoursesCategoryList courses={Courses}  />
            </section>
           
            {isLoading && <p>Carregando...</p>}
        </div>
    );
}

export default Districts;