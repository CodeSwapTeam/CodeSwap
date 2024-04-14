import {NextResponse} from 'next/server'
import {NextRequest} from 'next/server'

import { cookies } from 'next/headers'


export default function middleware( NextRequest){

    const cookieStore = cookies()
    const user = cookieStore.get('user')?.value;
    const isHomePage = NextRequest.nextUrl.pathname === '/';
    const isDashboardPage = NextRequest.nextUrl.pathname === '/Dashboard';
    const isLoginPage = NextRequest.nextUrl.pathname === '/login';

    if(!user && !isLoginPage){
        if(isHomePage){
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/', NextRequest.url));
    }
    

    if(isLoginPage){
        if(user){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
        
    }
    
    else if(isHomePage){
        if(user){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }


}

export const config = {
        matcher: ['/', '/Dashboard:path*', '/ManageCourses']
}