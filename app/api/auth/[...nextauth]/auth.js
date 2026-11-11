import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import UserModel from "../../../../models/userModel";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentails) {
        try {
          await dbConnect();

          const { email, password } = credentails;

          if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email ||
            !password
          ) {
            return null;
          }

          //find user
          const user = await UserModel.findOne({
            email: email.toLowerCase(),
          });
          if (!user) {
            return null;
          }

          //compare password
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password,
          );

          if (!isPasswordCorrect) {
            return null;
          }

          // return authenticated user

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.log("Authentication error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
