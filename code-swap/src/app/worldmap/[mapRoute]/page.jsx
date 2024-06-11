'use client';
import Controller from "@/Controller/controller";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";




 const Districts = () => {

    const { mapRoute } = useParams();
    const controller = Controller();

    const [courses, setCourses] = useState([]);

    

    useEffect(() => {
        async function fetchData() {
      const courses = await  controller.manageCourses.GetCoursesByCategory(mapRoute);
        console.log(mapRoute);
        console.log(courses);
        setCourses(courses);
        }
        fetchData();
    }, [mapRoute]);
  return (
    <div style={ { marginTop:'70px', color:'white'}}>
      <h1>Distritos</h1>
      <p>Esta é a página dos distritos {mapRoute} </p>


    </div>
  );
}

export default Districts;