'use server';

export async function manageFeed(){

    async function createPost(){
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

        return response;
    }

    
}