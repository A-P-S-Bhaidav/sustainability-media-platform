import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // Failsafe for legacy tokens that didn't get user.id injected
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email }});
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
      }
      return session;
    }
  },
  ...authConfig,
})
