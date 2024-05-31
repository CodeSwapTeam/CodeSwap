import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { NextResponse } from "next/server";

export async function GET(){
    console.log('GET request Server..............:');

    const querySnapshot = await getDocs(collection(db, 'FeedPosts'));
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            if (!posts) throw new Error('Erro no servidor ao buscar as categorias');

            return NextResponse.json(posts);


}