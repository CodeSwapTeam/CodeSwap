import CreatePost from "./Components/createPost";


export async function PostsComponent() {

    const response = await fetch('http://localhost:3000/api/feedPost', { cache: 'force-cache', next:{tags:['feed-posts']} }, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const posts = await response.json();




    return (
        <div style={{ marginTop: '20px', width: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', }}>
            <h2>Publicações</h2>
            {posts?.map((post, index) => (
                <div key={index} style={{ border: '1px solid green', borderRadius: '10px', margin: '10px', padding: '10px', width: '30%' }}>
                    <p>{post.content}</p>
                    <p>{post.date}</p>
                    <p>{post.likes} likes</p>
                </div>
            ))}
        </div>
    );
};





export default function FeedCommunity() {
    return (
        <div style={{ display:"flex", flexDirection:'column' ,marginTop:"60px", color:'white', width:'100%', border:"1px solid white" ,  justifyContent:"center", alignItems:'center',}}>
            <h1>Feed Community</h1>

            <CreatePost />

            <PostsComponent />
            
        </div>
    )
}