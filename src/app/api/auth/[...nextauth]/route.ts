import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone Number",
      credentials: {
        phone: { label: "Phone Number", type: "text", placeholder: "e.g. 9876543210" },
        otp: { label: "OTP (Use 1234)", type: "password" }
      },
      async authorize(credentials) {
        // Mock OTP validation for Hackathon
        if (credentials?.phone && credentials.otp === "1234") {
          return { id: credentials.phone, name: "Rural Entrepreneur", phone: credentials.phone };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-hackathon",
  pages: {
    signIn: '/',
  }
});

export { handler as GET, handler as POST };
