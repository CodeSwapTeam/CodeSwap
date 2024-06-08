'use client';
import { useState, useEffect, useRef } from 'react';
import CreatePost from "./Components/createPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextDataCache } from '../Providers/ContextDataCache';
import { v4 as uuidv4 } from 'uuid';
import EditPostForm from './Components/edit-post-form';

export default function FeedCommunity() {
    const [lastPostId, setLastPostId] = useState(null);
    const [isEndOfPosts, setIsEndOfPosts] = useState(false);
    const endPageRef = useRef(null);

    const queryClient = useQueryClient();
    const { currentUser } = ContextDataCache();

    const [editPostForm, setEditPostForm] = useState(false);
    const [formPostEdit, setFormPostEdit] = useState('');

    const [formStateComment, setFormStateComment] = useState(false);
    const [commentForm, setCommentForm] = useState('');


    //console.log(currentUser);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const lastPostIdQuery = queryClient.getQueryData(['endOfPosts'])
            queryClient.setQueryData(['endOfPosts'], { state: false, lastPostId: lastPostIdQuery?.lastPostId });


            setIsEndOfPosts(false);
            refetch();
        }, 1000 * 60 * 5); // 5 minutos

        // Limpar intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, []);

    const { data: posts, isFetching, refetch } = useQuery({
        queryKey: ['All-Posts'],
        queryFn: async () => {
            const EndOfPosts = queryClient.getQueryData(['endOfPosts']);

            if (EndOfPosts && EndOfPosts.newPost === true) {
                queryClient.setQueryData(['endOfPosts'], { state: false, lastPostId: null, newPost: false })
                //limpar os posts 
                queryClient.setQueryData(['All-Posts'], null);
            }

            if (!EndOfPosts) {

                queryClient.setQueryData(['endOfPosts'], { state: false, lastPostId: null })
            }

            if (EndOfPosts.state === false) {

                const response = await fetch(`http://localhost:3000/api/gets?type=GetPosts&lastPostId=${EndOfPosts.lastPostId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });


                if (response.ok) {
                    const newPosts = await response.json();
                    if (newPosts.length === 0) {
                        setIsEndOfPosts(true);

                        //salvar no ['endOfPosts'] o status de fim de posts
                        queryClient.setQueryData(['endOfPosts'], { state: true, lastPostId: lastPostId });
                    } else {
                        setIsEndOfPosts(false);
                        //salvar no ['endOfPosts'] o status de fim de posts
                        queryClient.setQueryData(['endOfPosts'], { state: false, lastPostId: newPosts[newPosts.length - 1].docId });
                        setLastPostId(newPosts[newPosts.length - 1].docId);
                    }
                    //pegar os posts antigos e adicionar os novos
                    const oldPosts = queryClient.getQueryData(['All-Posts']);
                    const postsUpdated = oldPosts ? [...oldPosts, ...newPosts] : newPosts;
                    queryClient.setQueryData(['All-Posts'], postsUpdated);

                    //FILTAR POSTS DUPLICADOS
                    const postsFiltered = postsUpdated.filter((post, index, self) => self.findIndex(t => t.docId === post.docId) === index);
                    console.log(postsFiltered);

                    return postsFiltered;
                } else {
                    console.log('Erro ao buscar posts:');
                    return [];
                }
            }
            return queryClient.getQueryData(['All-Posts']);
        },



    });

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(entries => {
            if (!isEndOfPosts && entries.some(entry => entry.isIntersecting)) {
                refetch();
            }
        });

        if (endPageRef.current) {
            intersectionObserver.observe(endPageRef.current);
        }

        return () => intersectionObserver.disconnect();
    }, [endPageRef.current, isEndOfPosts]);

    

    return (
        <div style={{ display: "flex", flexDirection: 'column', marginTop: "60px", color: 'white', width: '100%', justifyContent: "center", alignItems: 'center', }}>
            <h1>Feed Community</h1>

            <CreatePost />
            <>
                {posts && posts.map((post) => (
                        <div key={post.docId} style={{ display: "flex", flexDirection: 'column', marginTop: "60px", color: 'white', width: '100%', justifyContent: "center", alignItems: 'center', }}>

                            <EditPostForm   postItem={post} />
                        </div>
                    
                ))}
            </>
            {isFetching && <p>Carregando...</p>}
            <div id='endPage' ref={endPageRef}></div>
            {isEndOfPosts && <p>Não existem mais posts</p>}
        </div>
    );
}