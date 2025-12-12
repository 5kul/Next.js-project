import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "DummyJSON",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const res = await axios.post("https://dummyjson.com/auth/login", {
            username: credentials.username,
            password: credentials.password
          }, { headers: { "Content-Type": "application/json" }});
          return res.data;
        } catch (err) {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.user = {
          id: (user as any).id,
          username: (user as any).username,
          name: (user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName}` : undefined
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      (session as any).accessToken = token.accessToken;
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});
