import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    return NextResponse.next();
}
//中间件允许您在请求完成之前运行代码。然后，根据传入的请求，您可以通过重写、重定向、修改请求或响应标头来修改响应，或直接响应。
//由于比对用户输入密码和库中加密密码，需要用到的  bcrypt 在中间件中不可用，所以需要额外加auth.ts文件，用于校验用户密码
export default NextAuth(authConfig).auth;
//  使用中间件执行此任务的优势在于，受保护的路由在中间件验证身份之前甚至不会开始渲染，从而增强了应用程序的安全性和性能。
export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};