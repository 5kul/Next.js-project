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
      
      // YEH SINGLE AUTHORIZE FUNCTION USE KAREIN
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Emily ke credentials ko priority dein (kyuki yeh reliable hain)
          const testCredentials = [
            { username: 'emilys', password: 'emilyspass' },
            { username: 'atuny0', password: '9uQFF1Lh' },
            { username: credentials.username, password: credentials.password }
          ];

          let response = null;
          let lastError = null;

          // Multiple credentials try karein
          for (const cred of testCredentials) {
            try {
              console.log(`Trying DummyJSON with: ${cred.username}`);
              
              const res = await axios.post(
                "https://dummyjson.com/auth/login",
                {
                  username: cred.username.trim(),
                  password: cred.password,
                },
                {
                  headers: { "Content-Type": "application/json" },
                  timeout: 5000,
                }
              );

              response = res;
              console.log(`✅ Success with: ${cred.username}`);
              break; // Success milte hi stop
            } catch (err) {
              lastError = err;
              console.log(`❌ Failed with: ${cred.username}`);
              continue; // Agla try karein
            }
          }

        if (!response) {
  console.error("All credentials failed:", 
    (lastError as any)?.response?.data || 
    (lastError as any)?.message || 
    "Unknown error"
  );
  return null;
}

          const data = response.data;

          // Response check karein
          if (!data.id) {
            console.log("No user ID in response");
            return null;
          }

          const user = {
            id: String(data.id),
            name: data.username || data.firstName + ' ' + data.lastName,
            email: data.email || `${data.username}@dummy.com`,
            accessToken: data.accessToken || data.token,
          };

          console.log("Created user object:", user);
          return user;

        } catch (error) {
          // Detailed error logging
          console.error("DummyJSON auth failed:");
            const err = error as any; // Type assertion
  
  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Response data:", err.response.data);
    console.error("Headers:", err.response.headers);
  } else if (err.request) {
    console.error("No response received:", err.request);
  } else {
    console.error("Error message:", err.message);
  }
  
  return null;
}
      }
      
    })
  ],
  
  session: { strategy: "jwt" },
  
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken || user.token;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      (session as any).accessToken = token.accessToken as string;
      return session;
    }
  },
  
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});