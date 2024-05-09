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


    // Verificando se a página atual é a página inicial
    const isHomePage = NextRequest.nextUrl.pathname === '/';

    // Verificando se a página atual é a página de login
    const isLoginPage = NextRequest.nextUrl.pathname === '/login';

    
    // Se o usuário não estiver autenticado e não estiver na página de login
    if(!tokenVerify && !isLoginPage){
        // Se estiver na página inicial, continue com a próxima resposta
        if(isHomePage){
            return NextResponse.next();
        }
        // Caso contrário, redirecione para a página inicial
        return NextResponse.redirect(new URL('/', NextRequest.url));
    }

    
    // Se estiver na página de login
    if(isLoginPage){
        // Se o usuário estiver autenticado, redirecione para a página do painel
        if(tokenVerify){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }
    
    // Se estiver na página inicial
    else if(isHomePage){
        // Se o usuário estiver autenticado, redirecione para a página do painel
        if(tokenVerify){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }
     



   
}

// Configuração de rotas que utilizarão este middleware
export const config = {
        matcher: ['/','/Dashboard:path*', '/ManageCourses','/Cursos/:id/modulo/:moduleId*', '/MyCourses']
}