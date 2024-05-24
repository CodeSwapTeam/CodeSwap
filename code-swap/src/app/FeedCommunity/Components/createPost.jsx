
import { revalidateTag } from 'next/cache';
import React from 'react';
import ButtonSubmit from './button-submit';

export default async function CreatePost() {

    async function handlePostSubmit(formData) {
        'use server'

        
        
        const postContentData = {
            userId: '1',
            content: formData.get('content'),
            date: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
            likes: 0,
            comments: []     
        }

        

        const response = await fetch('http://localhost:3000/api/posts?type=CreatePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postContentData)
        });

        if (!response.ok) {
            console.error(response);
        }

        formData.set('content', ' test');
        revalidateTag('feed-posts');

         
    }

    return (
        <div style={ {marginTop:'20px', width:'100%', display:"flex", flexDirection:"column",  justifyContent:"center", alignItems:'center',}}>
            <h2>Criar publicação</h2>
            <form action={handlePostSubmit} 
                style={{display:'flex', flexDirection:'column', width:"30%"}}>
                <textarea style={{color:'black', border:'1px solid green', borderRadius:'10px', margin:'10px', width:'100%', height:'100px'}}
                    name="content"
                    placeholder="Como você está se sentindo hoje?" 
                    type="text"
                />
                <ButtonSubmit />
            </form>
        </div>
    );
}