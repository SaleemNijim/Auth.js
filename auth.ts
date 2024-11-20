//first Step  >> "Defining the NextAuth API Route"

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./lib/db";
import { User } from "./models/users";
import { compare } from "bcryptjs";
import GitHub from "next-auth/providers/github";



export const { handlers, signIn, auth, signOut } = NextAuth({
    providers: [

        GitHub({
            clientId: process.env.GITHUB_CLIIENT_ID,
            clientSecret: process.env.GITHUB_CLIIENT_SECRET
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'password', type: 'password' }
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = credentials;
                    if (!email || !password) {
                        throw new Error("Please provide both email and password");
                    }

                    await connectDB();

                    const user = await User.findOne({ email }).select("+password +role");

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    const isMatched = await compare(password, user.password);

                    if (!isMatched) {
                        throw new Error("Invalid email or password");
                    }

                    return {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw error;  // Re-throw the error to trigger NextAuth's error handling
                }
            },
        })
    ],

    pages: {
        signIn: '/login'
    },

    callbacks: {
        async session({ session, token }) {
            if (token?.sub && token?.role) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        signIn: async ({ user, account }) => {
            if (account?.provider === "github") {  // Change this line to check for GitHub provider
                try {
                    const { email, name, image, id } = user;
                    await connectDB();
                    const alreadyUser = await User.findOne({ email });

                    if (!alreadyUser) {
                        await User.create({ email, name, image, authProviderId: id });
                    } else {
                        return true;
                    }
                } catch (error) {
                    throw new Error("Error while creating user", error);
                }
            }

            if (account?.provider === "credentials") {
                return true;
            } else {
                return false;
            }
        },
    },
});