'use client';
import { useState, useEffect, useRef, useReducer } from 'react';
import CreatePost from "./Components/createPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const initialState = { posts: [], lastPostId: null, isEndOfPosts: false };

function reducer(state, action) {
    switch (action.type) {
        case 'addPosts':
            const newPosts = action.payload;
            const lastPostId = newPosts[newPosts.length - 1]?.docId;
            // Filtrar posts duplicados
            const uniquePosts = [...state.posts, ...newPosts].filter((post, index, self) =>
                index === self.findIndex((p) => p.docId === post.docId)
            );
            return { ...state, posts: uniquePosts, lastPostId };
        case 'setEndOfPosts':
            return { ...state, isEndOfPosts: true };
        default:
            throw new Error();
    }
}

export default function FeedCommunity() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { posts, lastPostId, isEndOfPosts } = state;
    const [currentPage, setCurrentPage] = useState(1);

    


    useEffect(() => {
        const loadPosts = async () => {
            if (isEndOfPosts) return;

            const response = await fetch(`http://localhost:3000/api/gets?type=GetPosts&lastPostId=${lastPostId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok && response.status !== 204) {
                const newPosts = await response.json();
                if (newPosts.length === 0) {
                    dispatch({ type: 'setEndOfPosts' });
                } else {
                    dispatch({ type: 'addPosts', payload: newPosts });
                }
            } else {
                console.log('Erro ao buscar posts:');
            }
        };

        loadPosts();
    }, [currentPage]);

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                setCurrentPage((currentPageInsideState) => currentPageInsideState + 1);
            }
        });
        intersectionObserver.observe(document.getElementById('EndPage'));
        return () => intersectionObserver.disconnect();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: 'column', marginTop: "60px", color: 'white', width: '100%', border: "1px solid white", justifyContent: "center", alignItems: 'center', }}>
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
            {isEndOfPosts && <p>Não existem mais posts</p>}
            <div id='EndPage' style={{ height: "50px", backgroundColor: 'red' }}></div>
        </div>
    );
}