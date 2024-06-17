'use client';
import Controller from '@/Controller/controller';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';



const Point = styled.div`
    width: 15%; // 5% da largura do elemento pai
    height: 25%; // 5% da altura do elemento pai
    position: absolute;
    cursor: pointer;
    background-color: transparent;
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

const ImageMap = styled.img`
    width: 100%;
    height: 100%;
    
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }
`;

export function PointMapClick({ x, y, imageSrc, text, route, mapRef, category, handleCategoryClick }) {
    const [showTooltip, setShowTooltip] = useState(false);
    
    //const [courses, setCourses] = useState([]);
    const queryClient = useQueryClient();

    const router = useRouter();
    let pointRef = useRef(null);
    // Função para redirecionar para outra página
    const handlePointClick = () => {

        //salvar categoria selecionada no cache com o id da categoria e os dados da categoria
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

    



    const [categorySelected, setCategorySelected] = useState(null);

     function handleCategoryClick(category){
        console.log('category', category);

        //salvar categoria selecionada no cache com o id da categoria e os dados da categoria
        queryClient.setQueryData(['categorySelected', category.id], category);
    }



    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['All-Categories-MyCourses'],
        queryFn: async () => {
            const categories = await controller.manageCategories.GetAllCategories();
            console.log('categories', categories);
            return categories;
        },
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    if (isLoading) return <h1>Carregando...</h1>;

    return (// 48 50
        <>

            {categoriesData && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: '70px' }}>
                    <div style={{ width: '70%', height: "60%", position: 'relative' }} ref={mapRef}>
                        <img src="/assets/mapV1.jpg" alt="Map" style={{ width: '100%', height: '100%' }} />

                        {categoriesData.map((category, index) => {
                            const x = category.PositionBadgeMap?.x || 0;
                            const y = category.PositionBadgeMap?.y || 0;

                            return (
                                <PointMapClick key={index} x={x} y={y} imageSrc={category.Badge} category={category} text={category.name} route={`/worldmap/${category.id}`} mapRef={mapRef} />
                            );
                        })}

                    </div>
                </div>
            )}
        </>
    );
}