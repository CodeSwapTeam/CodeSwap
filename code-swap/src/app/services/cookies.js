"use server";
import { cookies } from 'next/headers'

export  async function setCookiesAcessToken(acessToken){
    cookies().set('user', acessToken);
}

export  async function getCookiesAcessToken(){
    const cookieStore = cookies();
    const user = cookieStore.get('user');
    return user;
}

export async function removeCookiesAcessToken(){
    cookies().delete('user');
}