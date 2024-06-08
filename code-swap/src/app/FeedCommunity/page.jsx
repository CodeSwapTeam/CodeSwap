'use client';
import { useState, useEffect, useRef } from 'react';
import CreatePost from "./Components/createPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextDataCache } from '../Providers/ContextDataCache';

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

    //função para dar like
    async function likePost(postId) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);
        const postsUpdated = oldPosts.map(post => {
            if (post.docId === postId) {
                const postLikes = post.likes;
                postLikes.push({
                    userId: currentUser.id
                });
                post.likes = postLikes;
            }
            return post;
        });
        console.log(postsUpdated);
        queryClient.setQueryData(['All-Posts'], postsUpdated);
        //invalidar o cache
        queryClient.invalidateQueries(['All-Posts']);


        fetch(`http://localhost:3000/api/posts?type=likePost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, userId: currentUser.id })
            //ENVIAR NO BODY O ID DO POST


        });

    }

    //função para dislike
    async function dislikePost(postId) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);
        const postsUpdated = oldPosts.map(post => {
            if (post.docId === postId) {
                const postLikes = post.likes;
                postLikes.pop({
                    userId: currentUser.id
                });
                post.likes = postLikes;
            }
            return post;
        });

        queryClient.setQueryData(['All-Posts'], postsUpdated);
        //invalidar o cache
        queryClient.invalidateQueries(['All-Posts']);

        fetch(`http://localhost:3000/api/posts?type=dislikePost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, userId: currentUser.id })
            //ENVIAR NO BODY O ID DO POST
        });

    }

    //função para editar um post e renderizar componente de edição
    function handleEditPost(content) {
        //inverter status do editPostForm
        setFormPostEdit(content);
        setEditPostForm(!editPostForm);
    }

    //função para editar um post
    async function editPost(postId, content) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);
        const postsUpdated = oldPosts.map(post => {
            if (post.docId === postId) {
                post.content = content;
            }
            return post;
        });
        queryClient.setQueryData(['All-Posts'], postsUpdated);
        //invalidar o cache
        queryClient.invalidateQueries(['All-Posts']);

        fetch(`http://localhost:3000/api/posts?type=editPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, content: content })
            //ENVIAR NO BODY O ID DO POST
        });

        setEditPostForm(!editPostForm);

    }

    //função para deletar um post
    function deletePost(postId) {

        //pegar os posts antigos e remover o post deletado
        const oldPosts = queryClient.getQueryData(['All-Posts']);
        const postsUpdated = oldPosts.filter(post => post.docId !== postId);
        queryClient.setQueryData(['All-Posts'], postsUpdated);

        fetch(`http://localhost:3000/api/delete?type=deletePost&id=${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //queryClient.setQueryData(['endOfPosts'], {state: false ,lastPostId: null, newPost: true});
        //queryClient.invalidateQueries(['All-Posts']);






    }

    //função para comentar um post
    async function commentPost(postId, comment) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);

        const commentData = {

            userId: currentUser.id,
            userName: currentUser.userName,
            content: comment,
            date: new Date(), // Armazenar a data como um objeto Date
            dateFormat: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),

        }

        const postsUpdated = oldPosts.map(post => {
            if (post.docId === postId) {
                const postComments = post.comments;
                postComments.push(commentData);
                post.comments = postComments;
            }
            return post;

        });
         queryClient.setQueryData(['All-Posts'], postsUpdated);
        //invalidar o cache
        //queryClient.invalidateQueries(['All-Posts']);

        fetch(`http://localhost:3000/api/posts?type=commentPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, userId: currentUser.id, comment: commentData })

        });


        setCommentForm('');

    }

    //função para deletar um comentário
    function deleteComment(postId, commentId) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);
        const postsUpdated = oldPosts.map(post => {
            if (post.docId === postId) {
                const postComments = post.comments;
                const commentsUpdated = postComments.filter(comment => comment.id !== commentId);
                post.comments = commentsUpdated;
            }
            return post;
        });
        queryClient.setQueryData(['All-Posts'], postsUpdated);
        //invalidar o cache
        queryClient.invalidateQueries(['All-Posts']);

        fetch(`http://localhost:3000/api/delete?type=deleteComment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, commentId: commentId })
        });

    }

    return (
        <div style={{ display: "flex", flexDirection: 'column', marginTop: "60px", color: 'white', width: '100%', border: "1px solid white", justifyContent: "center", alignItems: 'center', }}>
            <h1>Feed Community</h1>

            <CreatePost />
            <>
                {posts && posts.map((post, index) => (
                    <div key={index} style={{ border: '1px solid green', borderRadius: '10px', margin: '10px', padding: '10px', width: '60%', backgroundColor:"#00000063" }}>

                        <div  >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: "flex", alignItems: "center", gap: '5px' }}>
                                    <span style={{ width: "30px", height: '30px', borderRadius: '50px', border: '1px solid white' }}>
                                        <img src="" alt="" />
                                    </span>
                                    <strong>{post.userName}</strong>
                                    <span>{post.dateFormat}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {currentUser?.id === post.userId && <button onClick={() => handleEditPost(post.content)}>Editar</button>}
                                    {currentUser?.id === post.userId && <button onClick={() => deletePost(post.docId)}>Deletar Post</button>}
                                </div>


                            </div>
                            {editPostForm ?
                                <div>
                                    <textarea style={{ color: 'black' }} name="content" value={formPostEdit} onChange={e => setFormPostEdit(e.target.value)} />
                                    <button onClick={() => editPost(post.docId, formPostEdit)}>Salvar</button>
                                </div> :
                                <div style={{ margin: '10px', padding: '10px' }} >{post.content}</div>
                            }


                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>{post.likes.length}
                                    {post.likes.find(like => like.userId === currentUser?.id) ?
                                        <span> <button onClick={() => dislikePost(post.docId)}> Curtiu</button></span>
                                        :
                                        <span> <button onClick={() => likePost(post.docId)}> Likes</button></span>
                                    }
                                </div>
                                <button onClick={() => setFormStateComment(!formStateComment)}>
                                    {post.comments.length} comentários
                                </button>
                            </div>
                            <div>

                                {formStateComment && (
                                    <>

                                        <div style={{ width: '100%' }}>
                                            <textarea style={{ color: "black", width: '100%', borderRadius: '10px', marginTop: '10px', height: '100px' }} name="comment" value={commentForm} onChange={e => setCommentForm(e.target.value)} />
                                            <button style={{ border: '1px solid green', borderRadius: '10px', margin: '10px', padding: '10px', width: '100px', backgroundColor: 'green', color: 'white' }}
                                                onClick={() => commentPost(post.docId, commentForm)}>Comentar</button>
                                        </div>

                                        <div>
                                            {post.comments.sort((a, b) => new Date(b.dateFormat) - new Date(a.dateFormat)).map((comment, index) => (
                                                
                                                <div key={index} style={{ border: '1px solid green', margin: "10px", padding: '5px', backgroundColor:"#00000063", borderRadius:' 10px', padding:'10px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', alignItems: "center", gap: '5px' }}>
                                                            <span style={{ width: "25px", height: '25px', borderRadius: '50px', border: '1px solid white' }}>
                                                                <img src="" alt="" />
                                                            </span>{comment.userName}
                                                            <span>{comment.dateFormat}</span>
                                                        </div>
                                                        {currentUser?.id === comment.userId && <button onClick={() => deleteComment(post.docId, comment.id)}>Deletar Comentário</button>}
                                                    </div>
                                                    <p>{comment.content}</p>
                                                </div>

                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>



                    </div>
                ))}
            </>
            {isFetching && <p>Carregando...</p>}
            <div id='endPage' ref={endPageRef}></div>
            {isEndOfPosts && <p>Não existem mais posts</p>}
        </div>
    );
}