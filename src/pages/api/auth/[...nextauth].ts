import NextAuth from "next-auth"
import { query } from 'faunadb'
import GithubProvider from "next-auth/providers/github"

import { fauna } from "../../../services/fauna"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user

      try {
        await fauna.query(
          query.Create(
            query.Collection('users'),
            { data: { email } }
          )
        )

        return true
      } catch (error) {
        console.error(error)
        return false
      }

    }
  }
})