import React from "react";
import { ContextDataCache } from '@/app/Providers/ContextDataCache';

export default function ProfileProjects(props) {
    
    const { currentUser } = ContextDataCache();

    return (
        <div style={{width:'100%'}}>
        <h1>Profile Projects</h1>
        <>
        {currentUser && currentUser.Projects.map((Projects, index) => (
            <div key={index} style={{fontWeight:'bold', margin:'0.5rem', border:'solid 1px white', width:'100%'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', marginBottom:'1rem'}}>
                    <p>{Projects.projectTitle}</p>
                    <p>{Projects.projectDescription}</p>
                    <p>{Projects.projectLink}</p>
                </div>
            </div>
                ))}
        </>
        </div>

    );
    }