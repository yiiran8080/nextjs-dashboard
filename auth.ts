import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres'; // 这里需要注意！！！
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

//这里导出的auth, signIn, signOut  用于和用户的登录，登出 逻辑相关联(在lib/action.ts中引入)
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    //   Credentials provider 允许用户使用用户名和密码登录。
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                console.log('compare user', user);
                if (!user) return null;

                //比对数据库中的密码
                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) return user;
            }
            return null;
        },
    })],
});