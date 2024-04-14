// CourseForm.jsx
"use client";
import React, { useState } from 'react';
import Controller from '@/Controller/controller';
import ListCourses from '../Components/ListCourses';
import CreateCourse from '../Components/CreateCourse';
import { useAuthContext } from '../contexts/Auth';

const CourseForm = () => {
    
    const {currentUser, setCurrentUser} = useAuthContext();
    console.log(currentUser);

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ border: '1px solid black', padding: '20px' }}>
                <CreateCourse />
            </div>
            <div style={{ border: '1px solid black', padding: '20px' }}>
                <ListCourses />
            </div>
        </div>
    );
};

export default CourseForm;
