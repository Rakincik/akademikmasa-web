import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
  interface User {
    id: string
    role: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Giriş Yap",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        // Auto-create admin if logging in with admin credentials and it doesn't exist
        if (!user && credentials.email === "admin@akademikmasa.com" && credentials.password === "admin") {
          user = await prisma.user.create({
            data: {
              name: 'Yönetici',
              email: 'admin@akademikmasa.com',
              password: 'admin',
              role: 'ADMIN',
            }
          })
        }

        if (!user) return null

        // NO HASHING - Explicitly matching plaintext passwords
        if (user.password !== credentials.password) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: "jwt" }
})
