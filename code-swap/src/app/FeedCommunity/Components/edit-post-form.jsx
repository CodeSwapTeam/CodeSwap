import { ContextDataCache } from "@/app/Providers/ContextDataCache";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function EditPostForm(postItem) {

    const { currentUser } = ContextDataCache();

    const { postItem: post } = postItem;

    const queryClient = useQueryClient();

    const [editPostForm, setEditPostForm] = useState(false);
    const [formPostEdit, setFormPostEdit] = useState('');

    const [formStateComment, setFormStateComment] = useState(false);
    const [commentForm, setCommentForm] = useState('');

    //função para editar um post e renderizar componente de edição
    function handleEditPost(content) {
        //inverter status do editPostForm
        setFormPostEdit(content);
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
        queryClient.invalidateQueries(['All-Posts']);

    }

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
        


        await fetch(`http://localhost:3000/api/posts?type=likePost`, {
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
        

       await fetch(`http://localhost:3000/api/posts?type=dislikePost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, userId: currentUser.id })
            //ENVIAR NO BODY O ID DO POST
        });

        queryClient.invalidateQueries(['All-Posts']);

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

    

    //função para comentar um post
    async function commentPost(postId, comment) {
        const oldPosts = queryClient.getQueryData(['All-Posts']);

        const commentData = {
            id: uuidv4(),
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
        <div  style={{ border: '1px solid green', borderRadius: '10px', margin: '10px', padding: '10px', width: '60%', backgroundColor:"#00000063" }}>

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
    );
}