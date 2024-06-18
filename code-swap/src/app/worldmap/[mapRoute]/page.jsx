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
    width: 10%; 
    height: 15%;
    position: absolute;
    cursor: pointer;
    background-color: transparent;
`;

const ImagePointBadge = styled.img`
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
    width: 5%; // Ajuste para o tamanho desejado da célula do grid
    height: 10%; // Ajuste para o tamanho desejado da célula do grid
    position: absolute;
    background-color: transparent;
    transform: rotateX(45deg) rotateZ(45deg);

    &:hover {
        // boxshadow neon verde bem leve e suave
        box-shadow: 0 0 10px rgba(0, 200, 0, 5);

    }
`;

// Adicione estes estilos para a div pai
const MapContainer = styled.div`
    width: 70%;
    height: 60%;
    position: relative;
    border: 1px solid red;
    cursor: grab; // Muda o cursor para um punho fechado quando arrastando
`;

// Adicione estes estilos para a imagem do mapa
const MapImage = styled.img`
    box-shadow: 0 0 10px rgba(0, 200, 0, 5); //
    
    width: 70%;
    height: 60%;
`;

export function Grid({ onCellClick }) {
    const cells = [];

    for (let y = 0; y < 20; y++) { // Ajuste para o número desejado de células do grid
        for (let x = 0; x < 20; x++) { // Ajuste para o número desejado de células do grid
            cells.push(
                <GridCell
                    key={`${x}-${y}`}
                    style={{ left: `${x * 5}%`, top: `${y * 5}%` }} // Ajuste para o tamanho desejado da célula do grid
                    onClick={() => onCellClick(x, y)}
                />
            );
        }
    }

    return <>{cells}</>;
}

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
            <ImagePointBadge src={imageSrc} alt="Point on Map" />
            {showTooltip && <Tooltip>{text}</Tooltip>}
        </Point>
    )
}

const Districts = () => {
    const { mapRoute } = useParams();
    const controller = Controller();
    const queryClient = useQueryClient();

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


    const handleCellClick = (x, y) => {
        console.log(`Cell clicked at position: (${x}, ${y})`);
    };

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef();
    const [bounds, setBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

    useEffect(() => {
        if (imageRef.current) {
            const { width, height } = imageRef.current.getBoundingClientRect();
            setBounds({ top: -height, right: width, bottom: height, left: -width });
        }
    }, [imageRef.current]);


    return (
        <div >
            {Courses && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: '70px' }}>
                    <MapImage src={categorySelect?.mapImage} alt="Map" />
                        <Grid onCellClick={handleCellClick} />
                        {Courses.map((course, index) => (
                            <PointMapClick key={index} x={course.PositionBadgeMap.x} y={course.PositionBadgeMap.y} imageSrc={course.Badge} text={course.title} route={`/MyCourses/${course.id}`} />
                        ))}
                  
                </div>
            )}
        </div>


    );
}

export default Districts;