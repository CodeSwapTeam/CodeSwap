'use client';
import Controller from '@/Controller/controller';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import styled from 'styled-components';



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

const ImageMap = styled.img`
    width: 100%;
    height: 100%;

`;

const MapContainer = styled.div`
    width: 70%;
    height: 60%;
    position: relative;
    border: 1px solid red;
    cursor: grab; // Muda o cursor para um punho fechado quando arrastando
    
    `;

export function PointMapClick({ x, y, imageSrc, text, route, mapRef, category, handleCategoryClick }) {

    const [showTooltip, setShowTooltip] = useState(false);
    const queryClient = useQueryClient();

    const router = useRouter();
    let pointRef = useRef(null);

    const handlePointClick = () => {
        queryClient.setQueryData(['categorySelected', category.id], category);
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


export default function WorldMap() {
    const mapRef = useRef(null);

    const controller = Controller();
    const queryClient = useQueryClient();
    const position = { x: 0, y: 0 };
    const imageRef = useRef();

    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['All-Categories-MyCourses'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetAllCategories();
            console.log('categories', categories);
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    useEffect(() => {
        if (imageRef.current) {
            const { width, height } = imageRef.current.getBoundingClientRect();
            setBounds({ top: -height, right: width, bottom: height, left: -width });
        }
    }, [imageRef.current]);

    if (isLoading) return <h1>Carregando...</h1>;

    return (
        <>
            {categoriesData && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: '70px' }}>
                    <MapContainer>
                        <TransformWrapper
                            positionX={position.x}
                            positionY={position.y}
                            disablePadding={true}
                             
                            maxScale={10}
                        >

                            <TransformComponent>
                                <div ref={mapRef} style={{ width: "100%" }}>
                                    <img src="/assets/mapV1.jpg" alt="Map" style={{ width: '100%', height: '100%' }} />

                                    {categoriesData.map((category, index) => {
                                        const x = category.PositionBadgeMap?.x || 0;
                                        const y = category.PositionBadgeMap?.y || 0;

                                        return (
                                            <React.Fragment key={index}>
                                                <PointMapClick x={x} y={y} imageSrc={category.Badge} category={category} text={category.name} route={`/worldmap/${category.id}`} mapRef={mapRef} />
                                            </React.Fragment>
                                        );
                                    })}

                                </div>
                            </TransformComponent>

                        </TransformWrapper>
                    </MapContainer>
                </div>
            )}
        </>
    );
}