'use client';
import { revalidateTag } from 'next/cache';
import React from 'react';
import ButtonSubmit from './button-submit';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {

    const queryClient = useQueryClient();

    async function handlePostSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        
        const postContentData = {
            userId: '1',
            content: formData.get('content'),
            date: new Date(), // Armazenar a data como um objeto Date
            dateFormat: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
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

        //limpar o campo de texto
        event.target.content.value = '';

        // Atualizar a lista de posts
        queryClient.setQueryData(['endOfPosts'], {state: false ,lastPostId: null, newPost: true});
        queryClient.invalidateQueries(['All-Posts']);
        
    }

    return (
        <div style={ {marginTop:'20px', width:'100%', display:"flex", flexDirection:"column",  justifyContent:"center", alignItems:'center',}}>
            <h2>Criar publicação</h2>
            <form onSubmit={handlePostSubmit} 
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