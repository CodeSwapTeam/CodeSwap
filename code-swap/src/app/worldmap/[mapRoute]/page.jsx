'use client';
import Controller from "@/Controller/controller";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CoursesCategoryList from "@/app/Components/ListData-Component/ListData";
import styled from "styled-components";
//importar imagem 
import mapclick2 from "../../../../public/assets/mapclick2.png";


const Point = styled.div`
    width: 15%; // 5% da largura do elemento pai
    height: 25%; // 5% da altura do elemento pai
    position: absolute;
    cursor: pointer;
    background-color: transparent;
`;

const ImageMap = styled.img`
    width: 100%;
    height: 100%;
    
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }
`;

const Tooltip = styled.div`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    width: 200px;
    text-align: center;
    z-index: 1;
`;

export function PointMapClick({ x, y, imageSrc, text, route, mapRef }) {
    const [showTooltip, setShowTooltip] = useState(false);
    //const [courses, setCourses] = useState([]);

    const router = useRouter();
    let pointRef = useRef(null);
    
    // Função para redirecionar para outra página
    const handlePointClick = () => {
        router.push(route);
    }

    useEffect(() => {
        const point = pointRef.current;

        if (point) {
            point.style.left = `${x}%`;
            point.style.top = `${y}%`;
        }
    }, [x, y]);



    return (
        <Point ref={pointRef} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={handlePointClick}>
            <ImageMap src={imageSrc} alt="Point on Map" />
            {showTooltip && <Tooltip>{text}</Tooltip>}
        </Point>
    )
}

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
        <>
        { Courses && (
        <div style={{display:"flex", justifyContent:"center", marginTop:'70px'}}>
            <div style={{width:'70%', height:"60%", position: 'relative'}} >
                <img src="/assets/mapV2.jpg" alt="Map" style={{width: '100%', height: '100%'}} />
                
                {Courses.map((course, index) => (
                    <PointMapClick key={index} x={course.PositionBadgeMap.x} y={course.PositionBadgeMap.y} imageSrc={course.Badge} text={course.name} route={`/MyCourses/${course.id}`} />
                ))}
                   
            </div>
        </div>
        )}
        </>


    );
}

export default Districts;