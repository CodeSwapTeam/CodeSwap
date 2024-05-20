"use client";

import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt1Bar, MdOutlineSignalCellularAlt2Bar } from 'react-icons/md';


import styled from 'styled-components';

const CarouselContainer = styled.div`

    position: relative;
    padding-left: 70px;
    padding-right: 70px;
    max-width: 90%;
    margin: 0 auto;
`;

const ArrowButton = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    right: auto;
    bottom: 0;
    font-size: 70px;
    line-height: 250px;
    width: 70px;
    color: green;
    transition: all 600ms ease-in-out;
    border-radius: 20%;
    opacity: 0.5;
    cursor: pointer;
    border: none;

    &:hover {
        opacity: 2;
    }
`;

const ArrowButtonRight = styled(ArrowButton)`
    right: 0;
    left: auto;
    text-align: right;
    
`;

const StyledCourses = styled.div`
    padding: 10px;
    display: flex;
    flex-flow: row nowrap;
    gap: 15px;
    overflow-x: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const StyledCourse = styled.div`
    border-radius: 10px;
    border: 1px solid green;
    margin: 10px;
    width: 250px;
    height: 250px;
    flex-shrink: 0;
    transition: all 300ms ease-in-out;
    
    box-sizing: border-box;
    cursor: pointer;
    background-color: #00000063;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 0 2px rgba(4, 255, 2, 1), 
                    0 0 5px rgba(4, 255, 2, 1), 
                    0 0 8px rgba(4, 255, 2, 1), 
                    0 0 10px rgba(4, 255, 2, 1);
    }


    @media (max-width: 600px) {
        width: 170px;
        height: 170px;
    }

    
`;


const DescriptionCourseCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;

  margin-top: 20px;


    h3 {
        color: #45ff45;
        font-size: 0.8rem;
 
        overflow: hidden;
        text-overflow: ellipsis;
    }

    p {
        color: #00ffde;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    //ajustar tamanho do texto em telas menores
    @media (max-width: 600px) {
        h3 {
            font-size: 0.6rem;
        }

        p {
            font-size: 0.5rem;
        }
    }
`;



function CarouselCoursesEnrolled(props){
    const { handleCourseRolledClick } = props;

    const { currentUser, setCurrentUser } = ContextDataCache();

    const [currentCourse, setCurrentCourse] = useState(0);
    const [hasScrolled, setHasScrolled] = useState(false); // New state
    const coursesRef = useRef([]);

    const handleControlClick = (isLeft) => {
        setCurrentCourse(prevCourse => {
            let newCourse = isLeft ? prevCourse - 1 : prevCourse + 1;
            if (newCourse >= courses.length) newCourse = 0;
            if (newCourse < 0) newCourse = courses.length - 1;
            return newCourse;
        });
    };

    useEffect(() => {
        if (coursesRef.current[currentCourse] && hasScrolled) { // Check hasScrolled
            coursesRef.current[currentCourse].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }
    }, [currentCourse, hasScrolled]); // Add hasScrolled to dependencies

    useEffect(() => {
        if (currentCourse !== 0) {
            setHasScrolled(true); // Set hasScrolled to true when currentCourse changes
        }
    }, [currentCourse]);



    return (
        <CarouselContainer>
            <h1 style={{ color: 'white', fontSize: '2rem', marginLeft: '40px' }}>Cursos Matriculados</h1>
            {currentUser && currentUser.CoursesEnrolled.length > 0 && <ArrowButton onClick={() => handleControlClick(true)}>◀</ArrowButton>}
            <StyledCourses>
                { currentUser && currentUser.CoursesEnrolled.map((course, index) => (
                    <StyledCourse
                        key={index}
                        ref={el => coursesRef.current[index] = el}
                        className={`course ${index === currentCourse ? "current-course" : ""}`}

                        onClick={() => handleCourseRolledClick(course)} 
                    >
                        <img src={course.imgUrlThumbnail} alt="Course" style={{ borderRadius: "10px" }} />

                        <DescriptionCourseCard>
                            <h3>{course.title}</h3>
                            <p>{course.status}</p>
                        </DescriptionCourseCard>
                    </StyledCourse>
                ))}
            </StyledCourses>
            {currentUser &&  currentUser.CoursesEnrolled.length > 0 && <ArrowButtonRight onClick={() => handleControlClick(false)}>▶</ArrowButtonRight>}
        </CarouselContainer>
    );
};

export default CarouselCoursesEnrolled;