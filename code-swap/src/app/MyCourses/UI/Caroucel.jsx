"use client";
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

    
`;


const DescriptionCourseCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;

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
`;



function Carousel(props){
    const { courses, handleCourseClick } = props;

    
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
            {courses.length > 0 && <ArrowButton onClick={() => handleControlClick(true)}>◀</ArrowButton>}
            <StyledCourses>
                {courses.map((course, index) => (
                    <StyledCourse
                        key={index}
                        ref={el => coursesRef.current[index] = el}
                        className={`course ${index === currentCourse ? "current-course" : ""}`}

                        onClick={()=> handleCourseClick(course)}
                    >
                        <img src={course.imgUrlThumbnail} alt="Course" style={{ borderRadius: "10px" }} />
                        
                        <DescriptionCourseCard>
                            <div>
                                {course.difficulty === 'iniciante' && (<div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}><MdOutlineSignalCellularAlt1Bar color="#00ffde" /> <span style={{ color: "#00ffde" }}>Iniciante</span></div>)}
                                {course.difficulty === 'intermediário' && (<div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}><MdOutlineSignalCellularAlt2Bar color="#00ffde" /> <span style={{ color: "#00ffde" }}>Intermediário</span></div>)}
                                {course.difficulty === 'avançado' && (<div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}><MdOutlineSignalCellularAlt color="#00ffde" /> <span style={{ color: "#00ffde" }}>Avançado</span></div>)}
                            </div>
                            <h3 >{course.title}</h3>
                            <p >Instrutor: {course.owner} </p>
                        </DescriptionCourseCard>
                    </StyledCourse>
                ))}
            </StyledCourses>
            {courses.length > 0 && <ArrowButtonRight onClick={() => handleControlClick(false)}>▶</ArrowButtonRight>}
        </CarouselContainer>
    );
};

export default Carousel;