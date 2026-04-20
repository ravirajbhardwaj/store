import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import * as schema from './db/schema';
import { db } from './db';
import { magicLink } from 'better-auth/plugins';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { RESEND_API_KEY, BASE_URL } from '$env/static/private';

if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
	throw new Error('Missing Google OAuth credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

if (!RESEND_API_KEY) {
	throw new Error('Missing RESEND_API_KEY in .env');
}

const resend = new Resend(RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	baseURL: BASE_URL,
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		}
	},
	plugins: [
		magicLink({
			expiresIn: 60 * 15,
			sendMagicLink: async ({ email, url, metadata }, ctx) => {
				// send email to user
				await resend.emails.send({
					from: 'Acme <onboarding@resend.dev>',
					to: email,
					subject: 'Magic Link - Login to your account',
					html: `
          <div style="font-family:sans-serif">
            <h2>Login to your account</h2>
            <p>Click the button below:</p>
            <a href="${url}" 
              style="background:black;color:white;padding:10px 20px;text-decoration:none;">
              Login
            </a>
            <p>This link expires in 5 minutes.</p>
          </div>
        `
				});
			}
		}),
		sveltekitCookies(getRequestEvent)
	]
});
