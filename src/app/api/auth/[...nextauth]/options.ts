import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import UserModel from '@/model/user'
import dbConnection from '@/lib/connectdb'
import { log } from 'console'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any): Promise<any> {
          await dbConnection();
          try {
            const user = await UserModel.findOne({
              $or: [
                {email: credentials.identifier},
                {username: credentials.identifier}
              ]
            })
            
            if (!user) {
              throw new Error('User not found with email or username')
            }

            if (!user.isVerified) {
              throw new Error('Please verify your account then login.')
            }

            const isPasswordMatched = await bcrypt.compare(credentials.password, user.password)
            if (isPasswordMatched) {
              return user
            } else {
              throw new Error('Invalid credentials.')
            }
          } catch (err) {
            throw new Error('Error in next auth')
          } 
      },
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username
        session.user._id = token._id
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.isVerified = token.isVerified
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token
    }
  }
}
