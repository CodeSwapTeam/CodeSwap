'use client'
import React, {useRef} from "react";
import styled from "styled-components";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';
import Curriculum from "./curriculum";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Title = styled.h1`
font-size: 2rem;
color: white;
`

const Curriculo = styled.div`
display: flex;
flex-direction: column;
justify-content: justify;
width: 80%;
height: 80%;
background-color: white;
font-family: 'Roboto', sans-serif;
color: black;
padding: 1rem;
`

export default function ProfileCurriculum() {

    const curriculumRef = useRef();

  const handleDownloadPdf = () => {
    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const content = curriculumRef.current;

    pdf.html(content, {
      callback: (doc) => {
        doc.save('curriculum.pdf');
      },
      x: 10,
      y: 10,
      width: 780,  // Adjust width to fit within the page
      windowWidth: 1000
    });
  };

    return (
        <>
            <Title>Seu Curriculo em PDF</Title>
            <div style={{width:'100%', height:'100%'}}>
                <div ref={curriculumRef}>
                    <Curriculum size="A4" />
                </div>
            </div>
            <button onClick={handleDownloadPdf}>Download as PDF</button>
        </>
    );
}
