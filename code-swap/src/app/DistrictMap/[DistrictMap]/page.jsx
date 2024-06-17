'use client';
import Controller from '@/Controller/controller';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
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

const Image = styled.img`
    width: 100%;
    height: 100%;
    
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }
`;



export function PointMapClick({ x, y, imageSrc, text, route, mapRef }) {
    const [showTooltip, setShowTooltip] = useState(false);
    //const [courses, setCourses] = useState([]);

    const router = useRouter();
    const { DistrictMap } = useParams();
    console.log(DistricMap);
    let pointRef = useRef(null);
    
    // Função para redirecionar para outra página
    const handlePointClick = () => {
        router.push(DistrictMap);
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
            <Image src={imageSrc} alt="Point on Map" />
            {showTooltip && <Tooltip>{text}</Tooltip>}
        </Point>
    )
}


export default function DistricMap() {
    const mapRef = useRef(null);

    const controller = Controller();

    const { DistrictMap } = useParams();

    


        const { data: coursesData } = useQuery({
            queryKey: ['DistrictMap-MyCourses'],
            queryFn: async () => {
                const courses = await controller.manageCourses.GetCoursesByCategory(DistrictMap);
                console.log(courses);
                return courses;
            },
            staleTime: 1000 * 60 * 5 // 5 minutos
        });

    return (
        <div style={{display:"flex", justifyContent:"center", marginTop:'70px'}}>
            <div style={{width:'70%', height:"60%", position: 'relative'}} ref={mapRef}>
                <img src="/assets/mapV1.jpg" alt="Map" style={{width: '100%', height: '100%'}} />
                
                { coursesData && (
                    <div>
                        <PointMapClick x={48} y={50} 
                            imageSrc='assets/mapclick2.png' 
                            text={'Este é o ponto no mapa'} 
                            route={`/worldmap/${categoriesData[0].id}`} 
                            mapRef={mapRef}/>
                        <PointMapClick x={75} y={45} imageSrc='assets/pointMap1.png' text={'Este é o ponto no mapa'} mapRef={mapRef} route={`/worldmap/${categoriesData[1].id}`} />
                    </div>
                )}
            </div>
        </div>
    );
    }