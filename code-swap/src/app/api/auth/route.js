import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import {NextResponse, NextRequest} from 'next/server';
import { cookies } from 'next/headers';
import { auth } from "../../../../database/firebase";

export default async function POST(NextRequest){

    const data = await NextRequest.json();

    const {email, password} = data;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, 'Users', user.uid);
    const userDoc = await getDoc(userRef);

    const userData = userDoc.data();

    const cookieStore = cookies();

    cookieStore.set('user', user.uid);

    return NextResponse.json(userData);
}