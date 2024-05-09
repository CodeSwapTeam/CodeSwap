// Importando as classe necessária do pacote 'next/server'
import {NextResponse} from 'next/server'

// Importando a função 'cookies' do pacote 'next/headers'
import { cookies } from 'next/headers'

// Importando a classe 'Controller' do arquivo 'controller.js'
import Controller from './Controller/controller';

import { TokenVerify } from './app/services/AuthService';

// Função middleware que será exportada como padrão
export default async function middleware( NextRequest){

    const request = NextRequest.cookies.get('user');
    const token = request?.value;

    // verificando se o token é válido  
    const tokenVerify = 
        token && 
        (await TokenVerify(token).catch((error) => {
        console.error('Erro ao verificar o token:', error); 
    }));

    if(tokenVerify){
        console.log('Token válido')
        //imprimir a rotas que o usuário está
        console.log(NextRequest.url)
    }

    
    if(NextRequest.nextUrl.pathname.startsWith('/login') && !tokenVerify){
        return
    }

    if(NextRequest.url.includes('/login') && tokenVerify){
        return NextResponse.redirect( new URL('/Dashboard', NextRequest.url))
    }

    if(!tokenVerify){
        return NextResponse.redirect( new URL('/login', NextRequest.url))
    }

   
}

// Configuração de rotas que utilizarão este middleware
export const config = {
        matcher: ['/Dashboard:path*', '/ManageCourses','/Cursos/:id/modulo/:moduleId*', '/MyCourses']
}