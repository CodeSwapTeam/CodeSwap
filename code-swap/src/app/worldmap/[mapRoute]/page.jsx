'use client';
import Controller from "@/Controller/controller";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CoursesCategoryList from "@/app/Components/ListData-Component/ListData";
import styled from "styled-components";
//importar imagem 
import mapclick2 from "../../../../public/assets/mapclick2.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";



const Point = styled.div`
    width: 10%; // 5% da largura do elemento pai
    height: 15%; // 5% da altura do elemento pai
    position: absolute;
    cursor: pointer;
    background-color: transparent;
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }
`;

const ImagePointBadge = styled.img`
    width: 100%;
    height: 100%;
`;

const Tooltip = styled.div`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
    //background-color: quase transparente
   // background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    padding: 10px;
    width: 200px;
    text-align: center;
    z-index: 1;
    //text-shddow azul
    text-shadow: 0 0 10px rgba(0, 0, 255, 5);
    font-size: 1.5rem;
`;

const GridCell = styled.div`
    width: 5%;
    height: 10%; 
    position: absolute;
    background-color: transparent;
    transform: rotate(-60deg) skewY(30deg) rotateY(30deg);

    &:hover {
        box-shadow: 0 0 10px rgba(0, 200, 0, 5);

    }
;
`;

const MapContainer = styled.div`
    position: relative;
    width: 70%; 
    height: 60%; 
    box-shadow: 0 0 10px rgba(0, 200, 0, 5);
`;

const MapImage = styled.img`
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
`;

const Grid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const GridComponent = ({ onCellClick, gridSize }) => {
    const cells = [];

    for (let y = 0; y < gridSize.height; y++) {
        for (let x = 0; x < gridSize.width; x++) {
            cells.push(
                <GridCell
                    key={`${x}-${y}`}
                    style={{ left: `${x * 5}%`, top: `${y * 5}%` }}
                    onClick={() => onCellClick(x, y)}
                />
            );
        }
    }

    return <Grid>{cells}</Grid>;
};


export function PointMapClick({ x, y, imageSrc, text, route, mapRef }) {
    const [showTooltip, setShowTooltip] = useState(false);
    //const [courses, setCourses] = useState([]);

    const router = useRouter();
    let pointEventRef = useRef(null);

    // Função para redirecionar para outra página
    const handlePointClick = () => {
        router.push(route);
    }

    useEffect(() => {
        const point = pointEventRef.current;

        if (point) {
            point.style.left = `${x}%`;
            point.style.top = `${y}%`;
        }
    }, [x, y]);


    return (
        <Point ref={pointEventRef} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={handlePointClick}>
            <ImagePointBadge src={imageSrc} alt="Point on Map" />
            {showTooltip && <Tooltip>{text}</Tooltip>}
        </Point>
    )
}

const Districts = () => {
    const { mapRoute } = useParams();
    const controller = Controller();
    const queryClient = useQueryClient();
    const gridSize = { width: 20, height: 20 };

    const { data: Courses, isLoading } = useQuery({
        queryKey: ['courses', mapRoute],

        queryFn: async () => await controller.manageCourses.GetCoursesByCategory(mapRoute),
        enabled: !!mapRoute, // Só executa a query se mapRoute for diferente de null      
    });

    const { data: categorySelect } = useQuery({
        queryKey: ['categorySelected', mapRoute],
        queryFn: async () => {
            const category = queryClient.getQueryData(['categorySelected', mapRoute])
            //console.log('category', category);
            setImageURL(category.mapImage);
            return category;
        }
    });

    useEffect(() => {
        if (!mapRoute) {
            queryClient.invalidateQueries('courses');
        }
    }
        , [mapRoute, queryClient]);

    const handleCellClick = async  (x, y) => {
        console.log(`Cell clicked at position: (${x}, ${y})`);
        const data = await controller.manageCategories.GetCategoryPositionMap(categorySelect.id, x, y);
        console.log('data', data);
        
        
        
            
    };

    return (
        <div>
            {Courses && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: '70px' }}>
                    <MapContainer>
                        <MapImage src={categorySelect?.mapImage} alt="Map" />
                        <GridComponent onCellClick={handleCellClick} gridSize={gridSize} />
                        {Courses.map((course, index) => (
                        <PointMapClick key={index} x={course.PositionBadgeMap.x} y={course.PositionBadgeMap.y} imageSrc={course.Badge} text={course.title} route={`/MyCourses/${course.id}`} />
                    ))}
                    </MapContainer>
                    
                </div>
            )}
        </div>


    );
}

export default Districts;