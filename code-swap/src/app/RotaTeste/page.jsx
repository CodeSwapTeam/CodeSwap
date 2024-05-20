'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
`;

const SliderContainer = styled.div`
  height: 300px;
  width: 85vw;
  max-width: 1400px;
  position: relative;
  overflow: hidden;
  padding: 20px;
`;

const Button = styled.span`
  position: absolute;
  top: calc(50% - 30px);
  height: 15px;
  width: 15px;
  border-left: 8px solid #696969;
  border-top: 8px solid #696969;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
  &.inactive {
    border-color: #282828;
  }
  &:first-of-type {
    transform: rotate(-45deg);
    left: 10px;
  }
  &:last-of-type {
    transform: rotate(135deg);
    right: 10px;
  }
`;

const Slider = styled.div`
  display: flex;
  width: 1000%;
  height: 100%;
  transition: all .5s;
`;

const Slide = styled.div`
  height: 90%;
  margin: auto 10px;
  background-color: #b5b5b5;
  border-radius: 5px;
  box-shadow: 2px 2px 4px 2px white, -2px -2px 4px 2px white;
  display: grid;
  place-items: center;
`;

const Carousel = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentMargin, setCurrentMargin] = useState(0);
  const [slidesPerPage, setSlidesPerPage] = useState(0);
  const slides = 5; // número de slides

  useEffect(() => {
    const setParams = () => {
      let w = window.innerWidth;
      if (w < 551) {
        setSlidesPerPage(1);
      } else if (w < 901) {
        setSlidesPerPage(2);
      } else if (w < 1101) {
        setSlidesPerPage(3);
      } else {
        setSlidesPerPage(4);
      }
    };
    setParams();
    window.addEventListener("resize", setParams);
    return () => window.removeEventListener("resize", setParams);
  }, []);

  const slideRight = () => {
    if (currentPosition !== 0) {
      setCurrentMargin(currentMargin + 100 / slidesPerPage);
      setCurrentPosition(currentPosition - 1);
    }
  };

  const slideLeft = () => {
    if (currentPosition !== slides - slidesPerPage) {
      setCurrentMargin(currentMargin - 100 / slidesPerPage);
      setCurrentPosition(currentPosition + 1);
    }
  };

  return (
    <Container>
      <SliderContainer>
        <Button onClick={slideRight} className={currentPosition === 0 ? 'inactive' : ''}></Button>
        <Slider style={{ marginLeft: `${currentMargin}%` }}>
          {Array(slides).fill().map((_, i) => (
            <Slide key={i}><span>150x150</span></Slide>
          ))}
        </Slider>
        <Button onClick={slideLeft} className={currentPosition === slides - slidesPerPage ? 'inactive' : ''}></Button>
      </SliderContainer>
    </Container>
  );
};

export default Carousel;