import {NextResponse} from 'next/server'
import {NextRequest} from 'next/server'

import { cookies } from 'next/headers'
import { decryptObjectData } from './app/services/encryptedAlgorithm';


export default function middleware( NextRequest){

    const cookieStore = cookies()
    const user = cookieStore.get('user')?.value;

    const userDecrypted = user ? decryptObjectData(user) : null;
    console.log(userDecrypted);
    
    const isHomePage = NextRequest.nextUrl.pathname === '/';
    const isDashboardPage = NextRequest.nextUrl.pathname === '/Dashboard';
    const isLoginPage = NextRequest.nextUrl.pathname === '/login';

    if(!userDecrypted && !isLoginPage){
        if(isHomePage){
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/', NextRequest.url));
    }
    

    if(isLoginPage){
        if(userDecrypted){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
        
    }
    
    else if(isHomePage){
        if(userDecrypted){
            return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
        }
    }


}

export const config = {
        matcher: ['/', '/Dashboard:path*', '/ManageCourses']
}