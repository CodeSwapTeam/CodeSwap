import { NextResponse } from 'next/server'
import { deleteDoc, doc, setDoc, updateDoc, addDoc, collection, arrayUnion, getDoc, where, getDocs, query } from "firebase/firestore";
import { db } from '../../../../../../database/firebase';


export async function GET() {

  const querySnapshot = await getDocs(collection(db, 'Categories'));
  const categories = [];
  querySnapshot.forEach((doc) => {
      categories.push(doc.data());
  });
  if (!categories) throw new Error('Erro no servidor ao buscar as categorias');

  // Cria uma nova resposta com os dados das categorias
  let res = NextResponse.json(categories);

  return res;
}