// Importando as classe necessária do pacote 'next/server'
import {NextResponse} from 'next/server'

// Importando a função 'cookies' do pacote 'next/headers'
import { cookies } from 'next/headers'

// Importando a classe 'Controller' do arquivo 'controller.js'
import Controller from './Controller/controller';

// Função middleware que será exportada como padrão
export default function middleware( NextRequest){

    const controller = Controller();

    // Criando um armazenamento para os cookies
    const cookieStore = cookies()

    // Obtendo o cookie 'user' e seu valor
    const userCookie = cookieStore.get('user')?.value;
    
    let userDecrypted = userCookie;

  
    // Verificando se a página atual é a página inicial
    const isHomePage = NextRequest.nextUrl.pathname === '/';

    // Verificando se a página atual é a página de login
    const isLoginPage = NextRequest.nextUrl.pathname === '/login';

    // Se a URL começa com '/Cursos/' e contém '/modulo/'
    if (NextRequest.nextUrl.pathname.startsWith('/Cursos/') && NextRequest.nextUrl.pathname.includes('/modulo/')) {
        // Se o usuário não estiver autenticado, redirecione para a página de login
      
        if (!userDecrypted) {
            return NextResponse.redirect(new URL('/login', NextRequest.url));
        }
    }

    // Se o usuário não estiver autenticado e não estiver na página de login
    if(!userDecrypted && !isLoginPage){
        // Se estiver na página inicial, continue com a próxima resposta
        if(isHomePage){
            return NextResponse.next();
        }
        // Caso contrário, redirecione para a página inicial
        return NextResponse.redirect(new URL('/', NextRequest.url));
    }


    // Se o usuário não estiver autenticado e não estiver na página de login
    if(!userDecrypted && !isLoginPage){
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
        if(userDecrypted){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }
    
    // Se estiver na página inicial
    else if(isHomePage){
        // Se o usuário estiver autenticado, redirecione para a página do painel
        if(userDecrypted){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }
}

// Configuração de rotas que utilizarão este middleware
export const config = {
        matcher: ['/', '/Dashboard:path*', '/ManageCourses','/Cursos/:id/modulo/:moduleId*', '/MyCourses']
}