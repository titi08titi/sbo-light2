import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize() {
        // Auto-authenticate with admin user
        return {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          roles: ['sambot-admin']
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      // Add admin role to session
      session.user.roles = ['sambot-admin']
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
})