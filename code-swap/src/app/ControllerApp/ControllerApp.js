import { useQueryClient } from "@tanstack/react-query";


export const queryClient = useQueryClient();


    //função para dar like
   export function likePost(postId) {
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
    export async function dislikePost(postId) {
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
    export function handleEditPost(content) {
        //inverter status do editPostForm
        setFormPostEdit(content);
        setEditPostForm(!editPostForm);
    }

    //função para editar um post
    export async function editPost(postId, content) {
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
    export  function deletePost(postId) {

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
    export  async function commentPost(postId, comment) {
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
        queryClient.invalidateQueries(['All-Posts']);

        fetch(`http://localhost:3000/api/posts?type=commentPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId: postId, userId: currentUser.id, comment: commentData })
            //ENVIAR NO BODY O ID DO POST
        });

        setFormStateComment(!formStateComment);
        setCommentForm('');

    }

    //função para deletar um comentário
    export  function deleteComment(postId, commentId) {
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

