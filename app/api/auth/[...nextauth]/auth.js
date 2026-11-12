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

      async authorize(credentials) {
        try {
          await dbConnect();

          const { email, password } = credentials ?? {};

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
            _id: user._id.toString(),
            name: user.username,
            email: user.email,
            username: user.username,
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
        token._id = user._id?.toString() ?? user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user._id = token._id ?? token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
