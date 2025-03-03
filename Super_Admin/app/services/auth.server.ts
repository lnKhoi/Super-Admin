import { Authenticator } from 'remix-auth';
import { GoogleStrategy } from 'remix-auth-google';
import {
  DOMAIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_TOKEN,
} from '~/constants/env.constant';
import { sessionStorage } from '~/services/sessions.server';

export const authenticator = new Authenticator(sessionStorage)
// Login with Google
let googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_TOKEN,
    callbackURL: `${DOMAIN}/auth/google/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    return profile
  },
)
authenticator.use(googleStrategy)
