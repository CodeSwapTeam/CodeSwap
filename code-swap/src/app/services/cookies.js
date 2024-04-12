"use server";
import { cookies } from 'next/headers'

export  async function setCookies(acessToken){
    cookies().set('user', acessToken);
}

export  async function getCookies(){
    const cookieStore = cookies();

   const user = cookieStore.get('user');

   return user
}