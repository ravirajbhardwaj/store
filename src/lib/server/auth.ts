import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import * as schema from './db/schema';
import { db } from './db';
import { magicLink } from 'better-auth/plugins';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private'; // define in your .env file

const resend = new Resend(RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	baseURL: 'http://localhost:5173/',
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string
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
