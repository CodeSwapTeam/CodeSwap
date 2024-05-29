'use client';
import { useState, useEffect, useRef } from 'react';
import CreatePost from "./Components/createPost";

export default function FeedCommunity() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPostIdRef = useRef(null); // Adicionado useRef para armazenar o ID do último post
    const isEndOfPosts = useRef(false); // Adicionado useRef para verificar se todos os posts foram carregados

    useEffect(() => {
        const loadPosts = async () => {
            if (isEndOfPosts.current) return; // Se todos os posts foram carregados, não faça a chamada de API

            const lastPostId = lastPostIdRef.current; // Usado a referência para obter o ID do último post
            console.log('lastPostId:', lastPostId);
            const response = await fetch(`http://localhost:3000/api/gets?type=GetPosts&page=${currentPage}&lastPostId=${lastPostId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const newPosts = await response.json();
            if(!response.ok) {
                console.log('Erro ao buscar posts:');
            }

            if (newPosts.length === 0) {
                isEndOfPosts.current = true; // Se a API retornar 0 posts, marque que todos os posts foram carregados
            } else {
                const updatedPosts = [...posts, ...newPosts];
                lastPostIdRef.current = updatedPosts[updatedPosts.length - 1]?.id; // Atualizado a referência com o ID do último post
                setPosts(updatedPosts);
            }
        };

        loadPosts();
    }, [currentPage]); // Removido posts como dependência

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(entries => {
            if(entries.some(entry => entry.isIntersecting)) {
                setCurrentPage((currentPageInsideState) => currentPageInsideState + 1);
            }
        });
        intersectionObserver.observe(document.getElementById('EndPage'));
        return () => intersectionObserver.disconnect();
    }, []);


    return (
        <div style={{ display:"flex", flexDirection:'column' ,marginTop:"60px", color:'white', width:'100%', border:"1px solid white" ,  justifyContent:"center", alignItems:'center',}}>
            <h1>Feed Community</h1>

            <CreatePost />
            <>
            {posts?.map((post, index) => (
                <ul key={index} style={{ border: '1px solid green', borderRadius: '10px', margin: '10px', padding: '10px', width: '30%' }}>
                    <li>{post.content}</li>
                    <li>{post.dateFormat}</li>
                    <li>{post.likes} likes</li>
                </ul>
            ))}
            </>

            <div id='EndPage' style={{height:"50px", backgroundColor:'red'}}></div>
        </div>
    );
}