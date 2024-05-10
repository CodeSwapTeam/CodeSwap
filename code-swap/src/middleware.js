// Importando as classe necessária do pacote 'next/server'
import {NextResponse} from 'next/server'

import { TokenVerify } from './app/services/AuthService';


// Função middleware que será exportada como padrão
export default async function middleware( NextRequest ){

    const request = NextRequest.cookies.get('user');
    const token = request?.value;

    // verificando se o token é válido  
    const tokenVerify = 
        token && 
        (await TokenVerify(token).catch((error) => {
        //console.error(error); 
    }));

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
            return NextResponse.redirect(new URL('/MyCourses', NextRequest.url));
        }
    }
    
    // Se estiver na página inicial
    else if(isHomePage){
        // Se o usuário estiver autenticado, redirecione para a página do painel
        if(tokenVerify){
            return NextResponse.redirect(new URL('/MyCourses', NextRequest.url));
        }
    }
     
   
}

// Configuração de rotas que utilizarão este middleware
export const config = {
        matcher: ['/', '/ManageCourses','/Cursos/:id/modulo/:moduleId*', '/MyCourses/:id*']
}