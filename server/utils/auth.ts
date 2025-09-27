import { betterAuth } from 'better-auth'
import { D1Dialect } from '@atinux/kysely-d1'
import { anonymous, admin, username, twoFactor } from 'better-auth/plugins'
import { z } from 'zod'

let _auth: ReturnType<typeof betterAuth>
export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: {
        dialect: new D1Dialect({
          database: hubDatabase() as any,
        }),
        type: 'sqlite',
      },
      baseURL: getBaseURL(),
      emailAndPassword: {
        enabled: true,
        password: {
          verify: async (data) => {

            const passwordSchema = z.string()
              .min(8, 'At least 8 characters')
              .regex(/\d/, 'At least 1 number')
              .regex(/[a-z]/, 'At least 1 lowercase letter')
              .regex(/[A-Z]/, 'At least 1 uppercase letter')

            const result = passwordSchema.safeParse(data.password)
            return result.success
          }
        },
        requireEmailVerification: true
      },
      socialProviders: {
        github: {
          clientId: process.env.GH_CLIENT_ID!,
          clientSecret: process.env.GH_CLIENT_SECRET!,
        },
      },
      account: {
        accountLinking: {
          enabled: true,
        },
      },
      plugins: [admin(), username({
        usernameNormalization: (username) => username.toLowerCase()
      }), twoFactor()],
    })
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    }
    catch (e) {}
  }
  return baseURL
}
