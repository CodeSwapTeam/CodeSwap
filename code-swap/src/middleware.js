import {NextResponse} from 'next/server'
import {NextRequest} from 'next/server'

import { cookies } from 'next/headers'


export default function middleware( NextRequest){
    const cookieStore = cookies()
    const user = cookieStore.get('user')?.value;
    const isLoginPage = NextRequest.nextUrl.pathname === '/';

    if(!user){
        if(isLoginPage){
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/', NextRequest.url));
    }

    if(isLoginPage){
        return NextResponse.redirect(new URL('/Dashboard', NextRequest.url));
    }

  
}

export const config = {
        matcher: ['/', '/Dashboard:path*', '/ManageCourses']
}